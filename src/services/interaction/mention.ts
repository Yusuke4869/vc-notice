import type { Message } from "discord.js";
import { Locale } from "discord.js";

import { mentionHelpEmbed } from "../../embed";
import { buildEmbed } from "../../utils";

export const mention = async (message: Message) => {
  try {
    await message.reply({
      embeds: [buildEmbed(mentionHelpEmbed(), message.guild?.preferredLocale ?? Locale.EnglishUS)],
    });
  } catch (e) {
    console.error(e);
  }
};
