import { EmbedBuilder } from "discord.js";
import type { Client, CommandInteraction } from "discord.js";

const embed = (client: Client) => {
  const res = new EmbedBuilder()
    .setTitle("Pong!")
    .setColor("#FAA61A")
    .addFields([
      {
        name: "Latency",
        value: `${client.ws.ping}ms`,
      },
    ]);
  return res;
};

export const ping = async (client: Client, interaction: CommandInteraction) => {
  try {
    await interaction.reply({ embeds: [embed(client)], ephemeral: true });
  } catch (e) {
    console.error(e);
  }
};
