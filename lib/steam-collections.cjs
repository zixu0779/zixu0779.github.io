const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
function collectionIds(rows,mode='classified') {
  if(!Array.isArray(rows)) throw Error('Invalid Steam collection data');
  const ids=new Set(),hidden=new Set();
  for(const [key,entry] of rows){
    if(!key.startsWith('user-collections.') || entry.is_deleted)continue;
    const data=JSON.parse(entry.value || '{}');
    if(key==='user-collections.hidden') {for(const id of data.added || [])hidden.add(id);continue;}
    if(mode==='favorite' && key!=='user-collections.favorite')continue;
    if(data.filterSpec) throw Error('Dynamic collections need their resolved membership; refusing incomplete export');
    const removed=new Set(data.removed || []);
    for(const id of data.added || []) {
      if(!Number.isSafeInteger(id)||id<=0)throw Error('Invalid collection app ID');
      if(!removed.has(id))ids.add(id);
    }
  }
  return [...ids].filter(id=>!hidden.has(id)).sort((a,b)=>a-b);
}
function main(){
  const mode=process.argv[2] || 'classified';
  if(!['classified','favorite'].includes(mode))throw Error('Mode must be classified or favorite');
  const dir=path.join(os.homedir(),'Library/Application Support/Steam/userdata/1407790792/config/cloudstorage');
  const rows=new Map(JSON.parse(fs.readFileSync(path.join(dir,'cloud-storage-namespace-1.json'),'utf8')));
  const pending=path.join(dir,'cloud-storage-namespace-1.modified.json');
  if(fs.existsSync(pending))for(const [key,value] of JSON.parse(fs.readFileSync(pending,'utf8')))rows.set(key,value);
  const appids=collectionIds([...rows],mode);
  const displayFile='source/_data/steam-display.json';
  const existing=fs.existsSync(displayFile)?JSON.parse(fs.readFileSync(displayFile,'utf8')):{};
  fs.writeFileSync(displayFile,JSON.stringify({...existing,collectionFilter:{mode,appids,exportedAt:new Date().toISOString()}},null,2)+'\n');
  console.log(`Exported ${appids.length} collection IDs; Steam files were read only`);
}
module.exports={collectionIds};
if(require.main===module)main();
