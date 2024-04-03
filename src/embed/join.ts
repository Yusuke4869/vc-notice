import type { EmbedContents } from "../types";

export const joinEmbed = (): EmbedContents => ({
  en: {
    title: "Hi, there👋",
    description: "Thank you for inviting me",
    fields: [
      {
        name: "How to use",
        value: "Type /help",
      },
    ],
    footer: {
      text: "VC Notice",
    },
  },
  ja: {
    title: "こんにちは👋",
    description: "招待してくれてありがとう！",
    fields: [
      {
        name: "使い方",
        value: "/help と入力してみてね",
      },
    ],
    footer: {
      text: "VC Notice",
    },
  },
});
