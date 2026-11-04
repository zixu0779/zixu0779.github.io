const { hours, isGame } = require('./steam-sync.cjs');
function steamView(snapshot, display = {}) {
  if (!snapshot?.updatedAt || !Array.isArray(snapshot.games)) return null;
  const allowed = display?.collectionFilter ? new Set(display.collectionFilter.appids) : null;
  const allGames = snapshot.games.filter(isGame).sort((a,b)=>b.lastPlayed-a.lastPlayed || b.minutes-a.minutes || a.appid-b.appid);
  const games = allGames.filter(g=>!allowed || allowed.has(g.appid)).map(g => {
    const custom=display.titles?.[g.appid];
    const editions=[[/\s*[-:：—]?\s*Game of the Year(?: Edition)?$/i,'年度版'],[/\s*[-:：—]?\s*Definitive Edition$/i,'决定版'],[/\s*[-:：—]?\s*Special Edition$/i,'特别版'],[/\s*[-:：—]?\s*Remastered$/i,'重制版'],[/\s*[-:：—]?\s*2026 Edition$/i,'2026版'],[/\s*[-:：—]?\s*INTERGRADE$/i,'尤菲篇增强版'],[/\s*[-:：—]?\s*(高清重制版|重制版|终极版|增强版|传奇版)$/,'']];
    let baseName=(g.name || `Steam ${g.appid}`).replace(/[™®]/g,''), edition='';
    for (const [pattern,label] of editions) {
      const match=baseName.match(pattern);
      if(match){edition=label || match[1];baseName=baseName.replace(pattern,'');break;}
    }
    return {...g, baseName, displayName:custom?.name || baseName, edition};
  });
  const featured = allGames.find(g=>g.lastPlayed > 0 || g.minutes > 0);
  const stamp = new Date(snapshot.updatedAt);
  const date = new Intl.DateTimeFormat('zh-CN', { timeZone:'Asia/Shanghai', year:'numeric', month:'2-digit', day:'2-digit' }).format(stamp);
  const format = n => hours(n).toLocaleString('zh-CN');
  const lastDay = new Date(stamp.toLocaleDateString('en-CA',{ timeZone:'Asia/Shanghai' })+'T00:00:00+08:00');
  const history = Array.from({length:14},(_,i)=>{
    const date = new Date(lastDay.getTime()-(13-i)*86400000).toLocaleDateString('en-CA',{timeZone:'Asia/Shanghai'});
    const item = snapshot.history.find(d=>d.date===date);
    return {date,minutes:item?.minutes ?? null};
  });
  const maxMinutes = Math.max(60,...history.map(d=>d.minutes || 0));
  return {...snapshot, format, date, history, maxMinutes, games, gameCount:allGames.length, totalMinutes:allGames.reduce((n,g)=>n+g.minutes,0), recentMinutes:allGames.reduce((n,g)=>n+g.recentMinutes,0), featured, hero:featured?.appid === snapshot.featuredAppid ? snapshot.hero : featured?.image, recentCount:games.filter(g=>g.recentMinutes>0).length};
}
module.exports = steamView;
