import { EmbedBuilder } from "discord.js";
import type { Client, Guild } from "discord.js";

const embed = (client: Client) => {
  const res = new EmbedBuilder()
    .setAuthor({ name: client.user?.username ?? "VC Notice", iconURL: client.user?.displayAvatarURL() })
    .setTitle("Hi, there👋")
    .setDescription("Thanks for inviting me")
    .setColor("#FAA61A")
    .addFields([
      {
        name: "How to use",
        value: "Type /help",
      },
    ])
    .setFooter({ text: "VC Notice" });
  return res;
};

export const join = async (client: Client, guild: Guild) => {
  try {
    await guild.systemChannel?.send({ embeds: [embed(client)] });
  } catch (e) {
    console.error(e);
  }
};
