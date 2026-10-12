import { describe, it, expect } from "vitest";
import { normalizeLegacyPlaylist } from "./legacyMeting";
describe("Hexo 歌单兼容", () => {
  it("保留旧服务的歌名、歌手和播放地址", () => {
    expect(
      normalizeLegacyPlaylist([
        {
          title: "Halo",
          author: "Beyoncé",
          url: "https://example.com/song.mp3",
          pic: "https://example.com/pic.jpg",
          lrc: "https://example.com/lyric",
        },
      ])[0],
    ).toEqual({
      name: "Halo",
      artist: "Beyoncé",
      url: "https://example.com/song.mp3",
      pic: "https://example.com/pic.jpg",
      lrc: "https://example.com/lyric",
    });
  });
  it("保留标准接口的字段", () => {
    expect(
      normalizeLegacyPlaylist([
        { name: "Song", artist: "Singer", url: "https://example.com/song" },
      ])[0].name,
    ).toBe("Song");
  });
  it("拒绝异常响应", () => {
    expect(() => normalizeLegacyPlaylist({ error: "bad" })).toThrow();
    expect(() => normalizeLegacyPlaylist([{ title: "Song", url: "javascript:bad" }])).toThrow();
  });
});
