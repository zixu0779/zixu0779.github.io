const fs = require('node:fs/promises');
const path = require('node:path');
const steamid = '76561199368056520';
const snapshotPath = 'source/_data/steam.json';
const assetDir = 'source/images/steam';
const hours = n => Math.round(n / 6) / 10;
const day = date => new Date(date).toLocaleDateString('en-CA', { timeZone: 'Asia/Shanghai' });
const safeURL = value => {
  try { const u = new URL(value); return u.protocol === 'https:' && /(^|\.)(steamstatic\.com|steamcommunity\.com|steampowered\.com)$/.test(u.hostname) ? u.href : null; } catch { return null; }
};
function activityHistory(previous, games, now) {
  const baseline = Object.fromEntries(games.map(g => [g.appid, g.minutes]));
  const history = [...(previous?.history || [])];
  if (previous?.updatedAt && day(previous.updatedAt) !== day(now)) {
    const elapsed = Date.parse(now) - Date.parse(previous.updatedAt);
    // Daily snapshots measure observed increments, not exact play sessions; gaps stay unknown.
    const minutes = elapsed <= 36 * 3600000 ? games.reduce((sum, g) => sum + (Number.isFinite(previous.baseline?.[g.appid]) ? Math.max(0, g.minutes - previous.baseline[g.appid]) : 0), 0) : null;
    history.push({ date: day(now), minutes });
  }
  return { baseline, history: [...new Map(history.map(h => [h.date, h])).values()].slice(-90) };
}
async function main() {
  if (!process.env.STEAM_API_KEY) throw new Error('STEAM_API_KEY is missing');
  let previous = null;
  try { previous = JSON.parse(await fs.readFile(snapshotPath, 'utf8')); } catch (e) { if (e.code !== 'ENOENT') throw e; }
  const now = new Date().toISOString();
  const warnings = [];
  async function request(url, api = false, binary = false) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const r = await fetch(url, { signal: AbortSignal.timeout(20000), headers: api ? { 'x-webapi-key': process.env.STEAM_API_KEY } : {} });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return binary ? Buffer.from(await r.arrayBuffer()) : await r.text();
      } catch (e) { if (attempt === 2) throw new Error(`Request failed: ${new URL(url).hostname}${new URL(url).pathname} (${e.message})`); }
    }
  }
  async function api(method, params = {}) {
    const url = new URL('https://api.steampowered.com/' + method);
    for (const [k,v] of Object.entries({ steamid, ...params })) url.searchParams.set(k, String(v));
    return JSON.parse(await request(url.href, true));
  }
  const [summary, owned, recent] = await Promise.all([
    api('ISteamUser/GetPlayerSummaries/v2/', { steamids: steamid }),
    api('IPlayerService/GetOwnedGames/v1/', { include_appinfo: 1, include_played_free_games: 1 }),
    api('IPlayerService/GetRecentlyPlayedGames/v1/', { count: 0 })
  ]);
  const player = summary.response?.players?.find(p => p.steamid === steamid);
  if (!player || player.communityvisibilitystate !== 3) throw new Error('Public profile unavailable; previous snapshot preserved');
  if (!Array.isArray(owned.response?.games) || !owned.response.games.length) throw new Error('Owned games unavailable or empty; previous snapshot preserved');
  if (!recent.response || !Number.isInteger(recent.response.total_count)) throw new Error('Recent games response invalid; previous snapshot preserved');
  console.log(`Steam API authenticated; ${owned.response.games.length} owned games, ${recent.response.total_count} recent games`);
  const recentMap = new Map((recent.response.games || []).map(g => [g.appid, g.playtime_2weeks || 0]));
  const assetURLs = { ...(previous?.assetURLs || {}) };
  const pendingAssets = new Map();
  await fs.mkdir(assetDir, { recursive:true });
  async function asset(url, filename) {
    if (!safeURL(url)) return null;
    const target = path.join(assetDir, filename);
    if (assetURLs[filename] === url) { try { await fs.access(target); return '/images/steam/' + filename; } catch {} }
    try {
      const bytes = await request(url, false, true);
      if (bytes.length < 100 || bytes.length > 8000000 || bytes.subarray(0,100).toString().includes('<html')) throw new Error('Invalid image');
      pendingAssets.set(target, bytes); assetURLs[filename] = url;
      return '/images/steam/' + filename;
    } catch { warnings.push(`Image unavailable: ${filename}`); return null; }
  }
  let profileBackground = previous?.profileBackground || null;
  try {
    const html = await request(`https://steamcommunity.com/profiles/${steamid}/?l=english`);
    const poster = html.match(/<video[^>]*poster="([^"]+)"/)?.[1] || html.match(/background-image:\s*url\(['"]?([^'"\)]+)/)?.[1];
    if (poster) profileBackground = await asset(poster, 'profile-background.jpg') || profileBackground;
  } catch { warnings.push('Profile background refresh unavailable'); }
  const avatar = await asset(player.avatarfull, 'avatar.jpg') || previous?.avatar || null;
  const games = [];
  const ownedGames = owned.response.games;
  for (let start = 0; start < ownedGames.length; start += 4) {
    const batch = await Promise.all(ownedGames.slice(start, start + 4).map(async raw => {
      const old = previous?.games?.find(g => g.appid === raw.appid);
      let metadata = old?.metadata || null;
      if (!metadata || Date.parse(now) - Date.parse(metadata.checkedAt) > 7 * 86400000) {
        try {
          const details = JSON.parse(await request(`https://store.steampowered.com/api/appdetails?appids=${raw.appid}&l=schinese`))[raw.appid];
          if (details?.success) {
            const d = details.data;
            let tags = [];
            if (raw.playtime_forever > 0 && d.type === 'game') {
              const html = await request(`https://store.steampowered.com/app/${raw.appid}/?l=schinese`);
              tags = [...html.matchAll(/<a[^>]*class="app_tag"[^>]*>(.*?)<\/a>/gs)].map(m => m[1].replace(/<[^>]+>/g,'').trim()).filter(Boolean).slice(0,5);
            }
            metadata = { checkedAt:now, name:d.name, type:d.type, image:safeURL(d.header_image), tags:tags.length ? tags : (d.genres || []).map(g => g.description).slice(0,5) };
          }
        } catch { warnings.push(`Store metadata unavailable: ${raw.appid}`); }
      }
      const imageURL = metadata?.image || `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${raw.appid}/header.jpg`;
      const image = await asset(imageURL, `${raw.appid}.jpg`) || old?.image || null;
      let achievements = old?.achievements || null;
      if (raw.playtime_forever > 0 && (!old || old.minutes !== raw.playtime_forever)) {
        try {
          const result = (await api('ISteamUserStats/GetPlayerAchievements/v1/', { appid:raw.appid, l:'schinese' })).playerstats;
          if (result?.success && Array.isArray(result.achievements) && result.achievements.length) achievements = { unlocked:result.achievements.filter(a=>a.achieved === 1).length, total:result.achievements.length };
        } catch { /* Games without public achievements remain unknown, never a fabricated zero. */ }
      }
      return { appid:raw.appid, name:metadata?.name || raw.name, minutes:raw.playtime_forever || 0, recentMinutes:recentMap.get(raw.appid) || 0, lastPlayed:raw.rtime_last_played || 0, image, metadata, achievements };
    }));
    games.push(...batch);
  }
  games.sort((a,b) => b.lastPlayed - a.lastPlayed || b.minutes - a.minutes || a.appid - b.appid);
  const featured = games.find(g=>g.lastPlayed > 0) || games.find(g=>g.minutes > 0) || games[0];
  const hero = await asset(`https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${featured.appid}/library_hero.jpg`, `${featured.appid}-hero.jpg`) || featured.image;
  const scores = new Map();
  for (const g of games.filter(g => g.minutes > 0 && g.metadata?.type === 'game')) {
    const tags = g.metadata.tags;
    for (const tag of tags) scores.set(tag, (scores.get(tag) || 0) + g.minutes / Math.max(1,tags.length));
  }
  const snapshot = {
    steamid, updatedAt:now, profileURL:`https://steamcommunity.com/profiles/${steamid}/`, name:player.personaname,
    avatar, profileBackground, featuredAppid:featured.appid, hero,
    gameCount:games.length, totalMinutes:games.reduce((n,g)=>n+g.minutes,0), recentMinutes:games.reduce((n,g)=>n+g.recentMinutes,0),
    preferences:[...scores].sort((a,b)=>b[1]-a[1]).slice(0,5).map(([tag])=>tag),
    ...activityHistory(previous, games, now), games, assetURLs, warnings
  };
  for (const [file,bytes] of pendingAssets) await fs.writeFile(file,bytes);
  await fs.mkdir(path.dirname(snapshotPath),{recursive:true});
  await fs.writeFile(snapshotPath+'.tmp', JSON.stringify(snapshot,null,2)+'\n');
  await fs.rename(snapshotPath+'.tmp', snapshotPath);
  console.log(`Snapshot saved: ${games.length} games, ${hours(snapshot.totalMinutes)} hours, ${snapshot.preferences.length} preference tags. Optional fetch warnings: ${warnings.length}`);
}
module.exports = { activityHistory, safeURL, hours };
if (require.main === module) main().catch(e => { console.error(e.message); process.exitCode=1; });
