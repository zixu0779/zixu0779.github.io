delete process.env.DEBUG; // Keep authentication payloads out of Actions logs.
const fs=require('node:fs');
const {LoginSession,EAuthTokenPlatformType}=require('steam-session');
const {statePath,unseal,refresh}=require('./state.cjs');
const {validateToken}=require('../steam-family.cjs');
const {steamid}=require('./state.cjs');
async function main(){
  if(!process.env.GITHUB_ENV) throw Error('Run refresh inside GitHub Actions');
  const key=process.env.STEAM_TOKEN_KEY;
  const session=new LoginSession(EAuthTokenPlatformType.MobileApp);
  session.refreshToken=unseal(fs.readFileSync(statePath,'utf8'),key);
  const access=await refresh(session,key);
  validateToken(access,steamid);
  if(/[\r\n]/.test(access)) throw Error('Invalid access credential');
  console.log(`::add-mask::${access}`);
  console.log(`::add-mask::${session.refreshToken}`);
  fs.appendFileSync(process.env.GITHUB_ENV,`STEAM_ACCESS_TOKEN=${access}\n`);
  console.log('Steam access renewed; rotated refresh credential saved encrypted');
}
if(require.main===module) main().catch(()=>{console.error('Steam renewal failed. Previous data retained; check encrypted state/key or repeat local QR authorization.');process.exitCode=1});
