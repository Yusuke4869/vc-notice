import { buildEmbed } from "../util/embed";

import type { EmbedContent } from "../type/embed";
import type { Guild } from "discord.js";

const joinEmbed = (): EmbedContent => ({
  en: {
    title: "Hi, there👋",
    description: "Thank you for inviting me!",
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

export class GuildCreate {
  public async on(guild: Guild): Promise<void> {
    try {
      // TODO: 通知チャンネルの選定
      await guild.systemChannel?.send({ embeds: [buildEmbed(joinEmbed(), guild.preferredLocale)] });
    } catch (e) {
      console.error(e);
    }
  }
}
