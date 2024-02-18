import type { EmbedContents } from "../../types";

export const pingEmbed = (ping: number): EmbedContents => ({
  en: {
    title: "🏓 Pong!",
    fields: [
      {
        name: "Latency",
        value: `${ping}ms`,
      },
    ],
  },
  ja: {
    title: "🏓 Pong!",
    fields: [
      {
        name: "Latency",
        value: `${ping}ms`,
      },
    ],
  },
});
