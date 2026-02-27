import { aboutEmbed } from "../embed";
import { buildEmbed } from "../utils";

import type { ChatInputCommandInteraction } from "discord.js";

export const about = async (interaction: ChatInputCommandInteraction) => {
  try {
    await interaction.reply({
      embeds: [buildEmbed(aboutEmbed(), interaction.locale)],
      ephemeral: true,
    });
  } catch (e) {
    console.error(e);
  }
};
