import type { EmbedContents } from "../../../types";

export const toggleBotNotificationsEmbed = (disabled: boolean): EmbedContents => ({
  en: {
    title: "Changed bot user's notification settings",
    fields: [
      {
        name: "Bot user's notification",
        value: disabled ? "Disabled" : "Enabled",
      },
    ],
  },
  ja: {
    title: "Botユーザーの通知設定を変更しました",
    fields: [
      {
        name: "Botユーザーの通知",
        value: disabled ? "無効" : "有効",
      },
    ],
  },
});
