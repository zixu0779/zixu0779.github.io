const assert = require('node:assert/strict');
const {validateToken, mergeFamilyGames, fetchFamilyGames} = require('../lib/steam-family.cjs');
const id='76561199368056520';
const token=claims=>'test.'+Buffer.from(JSON.stringify(claims)).toString('base64url')+'.test';
const valid=token({sub:id,exp:Math.floor(Date.now()/1000)+3600});
validateToken(valid,id);
assert.throws(()=>validateToken('',id));
assert.throws(()=>validateToken(token({sub:'another',exp:9999999999}),id));
assert.throws(()=>validateToken(token({sub:id,exp:1}),id));
const own=[{appid:1,name:'Own',playtime_forever:42}];
const response={owner_steamid:id,apps:[
 {appid:1,rt_playtime:999,owner_steamids:['private']},
 {appid:2,name:'Shared',app_type:1,rt_playtime:120,rt_last_played:500,owner_steamids:['private']},
 {appid:3,app_type:2}, {appid:4,exclude_reason:1}, {appid:5,rt_playtime:0}
]};
const merged=mergeFamilyGames(own,response,id);
assert.deepEqual(merged.map(g=>g.appid),[1,2,5]);
assert.equal(merged[0].playtime_forever,42);
assert.equal(merged[1].playtime_forever,120);
assert.equal(merged[1].librarySource,'family');
assert(!JSON.stringify(merged).includes('private'));
assert.throws(()=>mergeFamilyGames(own,{...response,owner_steamid:'other'},id));
assert.throws(()=>mergeFamilyGames(own,{owner_steamid:id,apps:[{appid:2,rt_playtime:-1}]},id));
(async()=>{
 let calls=0;
 const result=await fetchFamilyGames(own,id,valid,async url=>{
   const params=JSON.parse(new URL(url).searchParams.get('input_json'));
   assert.equal(params.steamid,id);
   calls++;
   return JSON.stringify({response:calls===1?{family_groupid:'test-group'}:response});
 });
 assert.equal(calls,2);assert.equal(result.length,3);
 await assert.rejects(fetchFamilyGames(own,id,valid,async()=>{throw Error(valid)}),e=>!e.message.includes(valid));
 console.log('Family merge, own playtime, account boundary, exclusions and token redaction passed');
})().catch(e=>{console.error(e);process.exitCode=1});
