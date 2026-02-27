import { pingEmbed } from "../embed";
import { buildEmbed } from "../utils";

import type { Client, ChatInputCommandInteraction } from "discord.js";

export const ping = async (client: Client, interaction: ChatInputCommandInteraction) => {
  try {
    await interaction.reply({
      embeds: [buildEmbed(pingEmbed(client.ws.ping), interaction.locale)],
      ephemeral: true,
    });
  } catch (e) {
    console.error(e);
  }
};
