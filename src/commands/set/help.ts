import { setHelpEmbed } from "../../embed";
import { buildEmbed } from "../../utils";

import type { ChatInputCommandInteraction } from "discord.js";

export const setHelp = async (interaction: ChatInputCommandInteraction) => {
  try {
    await interaction.reply({
      embeds: [buildEmbed(setHelpEmbed(), interaction.locale)],
      ephemeral: true,
    });
  } catch (e) {
    console.error(e);
  }
};
