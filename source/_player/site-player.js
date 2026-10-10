import { createComponent } from 'solid-js';
import { render } from 'solid-js/web';
import { NyxPlayer, createMetingProvider } from 'nyx-player-solid';
import 'nyx-player-solid/style';

const provider = createMetingProvider({
  baseURL: 'https://meting.sycamore.top/meting/',
  fetchImpl: async (input, init) => {
    const response = await fetch(input, init);
    if (!response.ok) return response;
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error('Invalid playlist');
    const songs = data.map(song => {
      if (!song || typeof song !== 'object' || typeof song.url !== 'string' || !/^https?:\/\//.test(song.url)) throw new Error('Invalid song');
      return { ...song, name: song.name || song.title, artist: song.artist || song.author };
    });
    return new Response(JSON.stringify(songs), { status: response.status, headers: { 'Content-Type': 'application/json' } });
  }
});
function start() {
  if (!document.getElementById('nyx-show-btn')) return false;
  const root = document.createElement('div');
  root.id = 'nyx-player';
  document.body.append(root);
  render(() => createComponent(NyxPlayer, {
    urls: [{ name: '铃芽之旅', url: 'https://music.163.com/#/playlist?id=13178747200' }],
    provider, preset: 'shokax', darkModeTarget: ':root[data-theme="dark"]',
    showBtn: '#nyx-show-btn', playBtn: '#nyx-play-btn'
  }), root);
  return true;
}
if (!start()) {
  const observer = new MutationObserver(() => { if (start()) observer.disconnect(); });
  observer.observe(document.body, { childList: true, subtree: true });
}
