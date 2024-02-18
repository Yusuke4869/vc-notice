import type { EmbedContents } from "../../types";

export const mentionHelpEmbed = (): EmbedContents => ({
  en: {
    title: "Help",
    description: "List of major commands",
    fields: [
      {
        name: "/ping",
        value: "replies with pong!",
      },
      {
        name: "/about",
        value: "show about this bot",
      },
      {
        name: "/set",
        value: "show about the settings commands",
      },
    ],
    footer: {
      text: "Some commands require server management permissions",
    },
  },
  ja: {
    title: "ヘルプ",
    description: "主要コマンド一覧",
    fields: [
      {
        name: "/ping",
        value: "pong! と返します",
      },
      {
        name: "/about",
        value: "このBotについて表示します",
      },
      {
        name: "/set",
        value: "設定コマンドについて表示します",
      },
    ],
    footer: {
      text: "一部のコマンドはサーバー管理権限が必要です",
    },
  },
});
