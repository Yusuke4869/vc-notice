import { helpEmbed } from "../embed";
import { buildEmbed } from "../utils";

import type { CommandInteraction } from "discord.js";

export const help = async (interaction: CommandInteraction) => {
  try {
    await interaction.reply({
      embeds: [buildEmbed(helpEmbed(interaction.memberPermissions?.has("ManageGuild") ?? false), interaction.locale)],
      ephemeral: true,
    });
  } catch (e) {
    console.error(e);
  }
};
