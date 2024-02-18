import type { CommandInteraction } from "discord.js";

import { setHelpEmbed } from "../../embed";
import { buildEmbed } from "../../utils";

export const setHelp = async (interaction: CommandInteraction) => {
  try {
    await interaction.reply({
      embeds: [buildEmbed(setHelpEmbed(), interaction.locale)],
      ephemeral: true,
    });
  } catch (e) {
    console.error(e);
  }
};
