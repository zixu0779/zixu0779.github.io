import { defineConfig } from "@hyacine/plugin-core";
import mouseFirework from "@hyacine/plugin-mouse-firework";
import analytics from "@hyacine/plugin-analytics";
import aiContent from "@hyacine/plugin-ai-content";
import visibilityTitle from "@hyacine/plugin-visibility-title";
import articleStatistics from "@hyacine/plugin-article-statistics";

export default defineConfig({
  injectPoints: {
    "footer-status": {
      selector: "#footer .status",
      position: "append",
    },
    "post-header": {
      selector: "article.post header",
      position: "after",
    },
    "post-footer": {
      selector: "article.post .body",
      position: "after",
    },
  },
  plugins: [
    mouseFirework({
      count: 16,
      radius: 80,
    }),

    analytics({
      googleAnalytics: {
        measurementId: "",
      },
      umami: {
        websiteId: "",
        scriptUrl: "",
      },
    }),
    aiContent({
      enable: false,
      aiSummary: {
        enable: true,
        title: "AI 摘要",
        showModel: true,
      },
      aiRecommend: {
        enable: true,
        limit: 3,
        minSimilarity: 0.4,
      },
    }),
    visibilityTitle({
      enable: false,
      leaveTitle: "👀 你先忙，我等你回来~",
      returnTitle: "🎉 欢迎回来！",
      restoreDelay: 3000,
    }),
    articleStatistics(),
  ],
});
