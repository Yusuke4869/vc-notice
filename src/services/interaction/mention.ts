import { Locale } from "discord.js";

import { mentionHelpEmbed } from "../../old-embed";
import { buildEmbed } from "../../utils";

import type { Message } from "discord.js";

export const mention = async (message: Message) => {
  try {
    await message.reply({
      embeds: [buildEmbed(mentionHelpEmbed(), message.guild?.preferredLocale ?? Locale.EnglishUS)],
    });
  } catch (e) {
    console.error(e);
  }
};
