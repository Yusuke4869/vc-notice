import type { EmbedContents } from "../../../types";

export const setHelpEmbed = (): EmbedContents => ({
  en: {
    title: "Settings Help",
    description: "List of settings commands",
    fields: [
      {
        name: "`/set channel`",
        value: "Set the channel to send notifications\nPlease enter the channel you want to notify",
      },
      {
        name: "`/set language [language]`",
        value: "Set the language for notifications (English or Japanese only)",
      },
    ],
  },
  ja: {
    title: "設定ヘルプ",
    description: "設定コマンド一覧",
    fields: [
      {
        name: "`/set channel`",
        value: "チャンネルに通知を送るように設定します\n入力は通知を行いたいチャンネルで行ってください",
      },
      {
        name: "`/set language [language]`",
        value: "通知の際の言語を設定します（英語 または 日本語 のみ）",
      },
    ],
  },
});
