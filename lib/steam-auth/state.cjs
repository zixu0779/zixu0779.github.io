const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const steamid = '76561199368056520';
const statePath = path.resolve(__dirname,'../../.github/steam-session.enc.json');
function checkRefresh(token) {
  let claims;
  try { claims=JSON.parse(Buffer.from(token.split('.')[1],'base64url').toString()); } catch { throw Error('Invalid refresh credential'); }
  if (claims.sub !== steamid || !claims.aud?.includes('derive') || !(claims.aud?.includes('mobile') || claims.aud?.includes('client')) || !(claims.exp > Date.now()/1000)) throw Error('Refresh credential has wrong account, platform or expiry; authorize again');
}
function keyBytes(key) {
  const bytes=Buffer.from(key || '', 'base64');
  if(bytes.length!==32) throw Error('STEAM_TOKEN_KEY must contain a 32-byte base64 key');
  return bytes;
}
function seal(token,key) {
  checkRefresh(token);
  const iv=crypto.randomBytes(12), cipher=crypto.createCipheriv('aes-256-gcm',keyBytes(key),iv);
  cipher.setAAD(Buffer.from('blog-steam-refresh-v1'));
  const data=Buffer.concat([cipher.update(token,'utf8'),cipher.final()]);
  return JSON.stringify({v:1,iv:iv.toString('base64'),tag:cipher.getAuthTag().toString('base64'),data:data.toString('base64')})+'\n';
}
function unseal(text,key) {
  try {
    const state=JSON.parse(text);
    if(state.v!==1) throw Error();
    const decipher=crypto.createDecipheriv('aes-256-gcm',keyBytes(key),Buffer.from(state.iv,'base64'));
    decipher.setAAD(Buffer.from('blog-steam-refresh-v1'));
    decipher.setAuthTag(Buffer.from(state.tag,'base64'));
    const token=Buffer.concat([decipher.update(Buffer.from(state.data,'base64')),decipher.final()]).toString('utf8');
    checkRefresh(token);return token;
  } catch { throw Error('Cannot decrypt valid Steam credential; check STEAM_TOKEN_KEY or authorize again'); }
}
function save(token,key) {
  fs.writeFileSync(statePath+'.tmp',seal(token,key),{mode:0o600});
  fs.renameSync(statePath+'.tmp',statePath);
}
async function refresh(session,key,store=save) {
  const previous=session.refreshToken;
  const renewed=await session.renewRefreshToken();
  checkRefresh(session.refreshToken);
  // Persist a rotated credential before exposing the access token to the collector.
  if(renewed || session.refreshToken!==previous) await store(session.refreshToken,key);
  return session.accessToken;
}
module.exports={steamid,statePath,checkRefresh,seal,unseal,save,refresh};
