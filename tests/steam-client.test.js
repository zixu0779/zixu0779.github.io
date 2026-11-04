const assert=require('node:assert/strict');
const {download,schema}=require('../lib/steam-auth/client.cjs');
(async()=>{
 const reply={data:[{enamespace:1,version:3,entries:[{key:'user-collections.test',value:JSON.stringify({added:[10,20],removed:[20]})},{key:'user-collections.hidden',value:JSON.stringify({added:[]})}]}]};
 const client={_send(header,body,callback){assert.equal(header.proto.target_job_name,'CloudConfigStore.Download#1');assert.equal(schema.lookupType('Request').decode(body).versions[0].enamespace,1);callback(Buffer.from(schema.lookupType('Response').encode(reply).finish()),{proto:{eresult:1}})}};
 assert.deepEqual(await download(client),[10]);
 assert.deepEqual(await download({_send(_,__,cb){cb({toBuffer:()=>Buffer.from(schema.lookupType('Response').encode(reply).finish())},{proto:{eresult:1}})}}),[10]);
 await assert.rejects(download({_send(_,__,cb){cb(Buffer.alloc(0),{proto:{eresult:15}})}}));
 await assert.rejects(download({_send(_,__,cb){cb(Buffer.from(schema.lookupType('Response').encode({data:[]}).finish()),{proto:{eresult:1}})}}));
 console.log('Cloud protocol encoding, collection parsing and failure preservation passed');
})().catch(e=>{console.error(e);process.exitCode=1});
