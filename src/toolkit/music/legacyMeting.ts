import type { Song } from "nyx-player-solid";
/** 本站旧 Meting 返回 title/author，新播放器消费 name/artist。 */
export function normalizeLegacyPlaylist(data: unknown): Song[] {
  if (!Array.isArray(data)) throw new TypeError("歌单返回格式异常");
  return data.map((entry) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry))
      throw new TypeError("歌曲信息格式异常");
    const record: Record<string, unknown> = Object.fromEntries(Object.entries(entry));
    const text = (key: string) => (typeof record[key] === "string" ? record[key] : "");
    const name = text("name") || text("title"),
      url = text("url");
    if (!name || !/^https?:\/\//.test(url)) throw new TypeError("歌曲名称或地址缺失");
    return {
      name,
      artist: text("artist") || text("author"),
      url,
      pic: text("pic"),
      lrc: text("lrc"),
    };
  });
}
