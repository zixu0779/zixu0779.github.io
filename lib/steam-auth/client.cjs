// Steam's CloudConfigStore.Download#1 uses the authenticated CM transport.
// Protocol source: SteamTracking/Protobufs webui/service_cloudconfigstore.proto.
delete process.env.DEBUG;
const SteamUser=require('steam-user');
const protobuf=require('protobufjs');
const EMsg=require('steam-user/enums/EMsg');
const {steamid,checkRefresh}=require('./state.cjs');
const {validateToken,fetchFamilyGames}=require('../steam-family.cjs');
const {collectionIds}=require('../steam-collections.cjs');
const schema=protobuf.parse(`syntax="proto2";
message Version { optional uint32 enamespace=1; optional uint64 version=2; }
message Request { repeated Version versions=1; }
message Entry { optional string key=1; optional bool is_deleted=2; optional string value=3; optional fixed32 timestamp=4; optional uint64 version=5; }
message Namespace { optional uint32 enamespace=1; optional uint64 version=2; repeated Entry entries=3; optional uint64 horizon=4; }
message Response { repeated Namespace data=1; }`,{keepCase:true}).root;
function download(client) {
 return new Promise((resolve,reject)=>{
  const timer=setTimeout(()=>reject(Error('Cloud collections request timed out')),30000);
  client._send({msg:EMsg.ServiceMethodCallFromClient,proto:{target_job_name:'CloudConfigStore.Download#1'}},Buffer.from(schema.lookupType('Request').encode({versions:[{enamespace:1,version:0}]}).finish()),(body,header)=>{
   clearTimeout(timer);
   try {
    if(header.proto?.eresult!==1) throw Error(`Cloud collections failed (${header.proto?.eresult})`);
    const response=schema.lookupType('Response').decode(typeof body.toBuffer === 'function' ? body.toBuffer() : body);
    const ns=response.data.find(n=>n.enamespace===1);
    if(!ns || !ns.entries.some(e=>e.key.startsWith('user-collections.')))throw Error('Cloud collections response contains no collection namespace');
    resolve(collectionIds(ns.entries.map(e=>[e.key,e])));
   }catch(error){reject(error)}
  });
 });
}
async function collectClient(token,{onRotate=()=>{},renew=true,verifyFamily=false}={}) {
 checkRefresh(token);
 const claims=JSON.parse(Buffer.from(token.split('.')[1],'base64url'));
 if(!claims.aud.includes('client'))throw Error('Client authorization required');
 const client=new SteamUser({dataDirectory:null,autoRelogin:false,renewRefreshTokens:renew,httpProxy:process.env.HTTPS_PROXY || undefined});
 let latest=token;
 return new Promise((resolve,reject)=>{
  const timer=setTimeout(()=>finish(Error('Steam client login timed out')),90000);
  let finished=false;
  function finish(error,result){if(finished)return;finished=true;clearTimeout(timer);client.logOff();error?reject(error):resolve(result);}
  client.on('error',error=>finish(Error(`Steam client connection failed (${error.eresult || 'network'})`)));
  client.on('refreshToken',value=>{try{checkRefresh(value);onRotate(value);latest=value;}catch{finish(Error('Could not persist rotated client credential'))}});
  client.once('webSession',async(_,cookies)=>{
   try {
    const cookie=cookies.find(c=>c.startsWith('steamLoginSecure='));
    const access=decodeURIComponent(cookie?.split(';')[0].slice('steamLoginSecure='.length)||'').split('||')[1];
    validateToken(access,steamid);
    const appids=await download(client);
    if(verifyFamily)await fetchFamilyGames([],steamid,access,async url=>{const r=await fetch(url,{signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error('Family verification failed');return r.text()});
    finish(null,{access,appids,refreshToken:latest});
   }catch(error){finish(error)}
  });
  client.logOn({refreshToken:token,steamID:steamid,logonID:7794001,machineName:'Sycamore Blog Daily Sync'});
 });
}
module.exports={collectClient,download,schema};
