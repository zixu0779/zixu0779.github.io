import { NyxPlayer, createMetingProvider } from "nyx-player-solid";
import "nyx-player-solid/style";
import { normalizeLegacyPlaylist } from "@/toolkit/music/legacyMeting";
const provider = createMetingProvider({
  baseURL: "https://meting.sycamore.top/meting/",
  fetchImpl: async (input, init) => {
    const response = await fetch(input, init);
    if (!response.ok) return response;
    const data: unknown = await response.json();
    return new Response(JSON.stringify(normalizeLegacyPlaylist(data)), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  },
});
export default function MusicPlayer() {
  return (
    <div id="nyx-player">
      <NyxPlayer
        urls={[{ name: "铃芽之旅", url: "https://music.163.com/#/playlist?id=13178747200" }]}
        provider={provider}
        preset="shokax"
        darkModeTarget=':root[data-theme="dark"]'
        showBtn="#nyx-show-btn"
        playBtn="#nyx-play-btn"
      />
    </div>
  );
}
