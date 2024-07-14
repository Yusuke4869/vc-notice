import { aboutEmbed } from "../embed";
import { buildEmbed } from "../utils";

import type { CommandInteraction } from "discord.js";

export const about = async (interaction: CommandInteraction) => {
  try {
    await interaction.reply({
      embeds: [buildEmbed(aboutEmbed(), interaction.locale)],
      ephemeral: true,
    });
  } catch (e) {
    console.error(e);
  }
};
