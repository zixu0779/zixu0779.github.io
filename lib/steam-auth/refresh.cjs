delete process.env.DEBUG; // Keep authentication payloads out of Actions logs.
const fs=require('node:fs');
const {LoginSession,EAuthTokenPlatformType}=require('steam-session');
const {statePath,unseal,refresh,save}=require('./state.cjs');
const {collectClient}=require('./client.cjs');
const {validateToken}=require('../steam-family.cjs');
const {steamid}=require('./state.cjs');
async function main(){
  if(!process.env.GITHUB_ENV) throw Error('Run refresh inside GitHub Actions');
  const key=process.env.STEAM_TOKEN_KEY;
  const token=unseal(fs.readFileSync(statePath,'utf8'),key);
  console.log(`::add-mask::${token}`);
  const claims=JSON.parse(Buffer.from(token.split('.')[1],'base64url'));
  let access;
  if(claims.aud.includes('client')) {
    const result=await collectClient(token,{onRotate:value=>{console.log(`::add-mask::${value}`);save(value,key)}});
    access=result.access;
    const file='source/_data/steam-display.json';
    const display=JSON.parse(fs.readFileSync(file,'utf8'));
    display.collectionFilter={mode:'classified',appids:result.appids,syncedAt:new Date().toISOString(),source:'steam-cloud'};
    fs.writeFileSync(file,JSON.stringify(display,null,2)+'\n');
    console.log(`Cloud collections downloaded: ${result.appids.length} classified app IDs`);
  } else {
    const session=new LoginSession(EAuthTokenPlatformType.MobileApp);
    session.refreshToken=token;
    access=await refresh(session,key);
    console.log(`::add-mask::${session.refreshToken}`);
  }
  validateToken(access,steamid);
  if(/[\r\n]/.test(access)) throw Error('Invalid access credential');
  console.log(`::add-mask::${access}`);
  fs.appendFileSync(process.env.GITHUB_ENV,`STEAM_ACCESS_TOKEN=${access}\n`);
  console.log('Steam access renewed; rotated refresh credential saved encrypted');
}
if(require.main===module) main().catch(()=>{console.error('Steam renewal failed. Previous data retained; check encrypted state/key or repeat local QR authorization.');process.exitCode=1});
