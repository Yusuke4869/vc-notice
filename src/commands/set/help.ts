import { setHelpEmbed } from "../../old-embed";
import { buildEmbed } from "../../utils";

import type { CommandInteraction } from "discord.js";

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
