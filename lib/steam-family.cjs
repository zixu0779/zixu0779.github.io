// Steam Families needs a logged-in user token, not the public Web API key.
// Protocol: https://github.com/SteamTracking/Protobufs/blob/master/steam/steammessages_familygroups.steamclient.proto
function validateToken(token, steamid) {
  let claims;
  try { claims = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString()); } catch { throw new Error('STEAM_ACCESS_TOKEN is missing or malformed'); }
  // This is a local account/expiry check; Steam validates the token signature.
  if (String(claims.sub) !== steamid) throw new Error('STEAM_ACCESS_TOKEN belongs to a different Steam account');
  if (!Number.isFinite(claims.exp) || claims.exp * 1000 <= Date.now()) throw new Error('STEAM_ACCESS_TOKEN expired; renew it before syncing');
}
function mergeFamilyGames(owned, family, steamid) {
  if (String(family?.owner_steamid) !== steamid || !Array.isArray(family.apps)) throw new Error('Family library response invalid or for a different account');
  const merged = new Map(owned.map(g => [g.appid, {...g, librarySource:'own'}]));
  for (const app of family.apps) {
    if (!Number.isSafeInteger(app.appid) || app.appid <= 0) throw new Error('Invalid family app ID');
    if (merged.has(app.appid) || (app.app_type ?? 1) !== 1 || (app.exclude_reason ?? 0) !== 0) continue;
    const minutes = app.rt_playtime ?? 0, lastPlayed = app.rt_last_played ?? 0;
    if (![minutes,lastPlayed].every(n=>Number.isSafeInteger(n) && n >= 0)) throw new Error('Invalid family playtime');
    merged.set(app.appid, {appid:app.appid, name:app.name || `Steam ${app.appid}`, playtime_forever:minutes, rtime_last_played:lastPlayed, app_type:1, librarySource:'family'});
  }
  // Never retain owner Steam IDs, family IDs or other members' information.
  return [...merged.values()];
}
async function fetchFamilyGames(owned, steamid, token, request) {
  validateToken(token, steamid);
  async function call(method, params) {
    const url = new URL(`https://api.steampowered.com/IFamilyGroupsService/${method}/v1/`);
    url.searchParams.set('access_token', token);
    url.searchParams.set('input_json', JSON.stringify(params));
    let data;
    try { data = JSON.parse(await request(url.href)); }
    catch { throw new Error(`Steam Families ${method} failed; check login token and retry. Previous snapshot preserved`); }
    if (!data.response) throw new Error(`Steam Families ${method} returned no response`);
    return data.response;
  }
  const family = await call('GetFamilyGroupForUser', {steamid,include_family_group_response:false});
  if (family.is_not_member_of_any_group === true) return owned.map(g=>({...g,librarySource:'own'}));
  if (!family.family_groupid || family.family_groupid === '0') throw new Error('Steam family membership unavailable');
  const library = await call('GetSharedLibraryApps', {family_groupid:family.family_groupid,steamid,include_own:true,include_excluded:false,include_non_games:false,language:'schinese'});
  return mergeFamilyGames(owned, library, steamid);
}
module.exports = {validateToken, mergeFamilyGames, fetchFamilyGames};
