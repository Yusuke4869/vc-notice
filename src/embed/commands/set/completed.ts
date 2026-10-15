import { channelMention } from "discord.js";

import { defaultColor, getLanguageText } from "../../../utils";

import type { EmbedContents, TLanguage } from "../../../types";
import type { GuildBasedChannel } from "discord.js";

export const setCompletedEmbed = (
  notificationChannel: GuildBasedChannel | null,
  language: TLanguage
): EmbedContents => ({
  en: {
    title: notificationChannel ? "Setup complete!" : "Setup not complete yet",
    color: notificationChannel ? defaultColor : "#ff0000",
    fields: [
      {
        name: "Notification channel",
        value: notificationChannel ? channelMention(notificationChannel.id) : "Setup failed. Please try again.",
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
          ? channelMention(notificationChannel.id)
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
