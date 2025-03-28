import { pingEmbed } from "../old-embed";
import { buildEmbed } from "../utils";

import type { Client, CommandInteraction } from "discord.js";

export const ping = async (client: Client, interaction: CommandInteraction) => {
  try {
    await interaction.reply({
      embeds: [buildEmbed(pingEmbed(client.ws.ping), interaction.locale)],
      ephemeral: true,
    });
  } catch (e) {
    console.error(e);
  }
};
