import { defaultColor, getLanguageText } from "../../../utils";

import type { EmbedContents, TLanguage } from "../../../types";
import type { TextChannel } from "discord.js";

export const setCompletedEmbed = (
  notificationChannel: TextChannel | undefined,
  language: TLanguage
): EmbedContents => ({
  en: {
    title: notificationChannel ? "Set up completed!" : "Set up not completed yet",
    color: notificationChannel ? defaultColor : "#ff0000",
    fields: [
      {
        name: "Notification channel",
        value: notificationChannel ? `<#${notificationChannel.id}>` : "Failed to set up, please try again",
        inline: true,
      },
      {
        name: "Notification language",
        value: getLanguageText(language),
        inline: true,
      },
    ],
  },
  ja: {
    title: notificationChannel ? "設定が完了しました！" : "設定はまだ完了していません",
    color: notificationChannel ? defaultColor : "#ff0000",
    fields: [
      {
        name: "通知チャンネル",
        value: notificationChannel
          ? `<#${notificationChannel.id}>`
          : "設定に失敗した可能性があります、もう一度お試しください",
        inline: true,
      },
      {
        name: "通知言語",
        value: getLanguageText(language),
        inline: true,
      },
    ],
  },
});
