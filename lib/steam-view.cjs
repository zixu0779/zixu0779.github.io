const { hours } = require('./steam-sync.cjs');
function steamView(snapshot) {
  if (!snapshot?.updatedAt || !Array.isArray(snapshot.games)) return null;
  const stamp = new Date(snapshot.updatedAt);
  const date = new Intl.DateTimeFormat('zh-CN', { timeZone:'Asia/Shanghai', year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', hour12:false }).format(stamp);
  const format = n => hours(n).toLocaleString('zh-CN');
  const lastDay = new Date(stamp.toLocaleDateString('en-CA',{ timeZone:'Asia/Shanghai' })+'T00:00:00+08:00');
  const history = Array.from({length:14},(_,i)=>{
    const date = new Date(lastDay.getTime()-(13-i)*86400000).toLocaleDateString('en-CA',{timeZone:'Asia/Shanghai'});
    const item = snapshot.history.find(d=>d.date===date);
    return {date,minutes:item?.minutes ?? null};
  });
  const maxMinutes = Math.max(60,...history.map(d=>d.minutes || 0));
  return {...snapshot, format, date, history, maxMinutes, featured:snapshot.games.find(g=>g.appid===snapshot.featuredAppid), recentCount:snapshot.games.filter(g=>g.recentMinutes>0).length};
}
module.exports = steamView;
