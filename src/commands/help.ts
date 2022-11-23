import { EmbedBuilder } from "discord.js";
import type { Client, CommandInteraction, Message } from "discord.js";

import { createHelpMessages } from "../data";
import { db } from "../index";

const helpMessages = createHelpMessages("/");

const embed = (client: Client, t: keyof typeof helpMessages, lang: keyof typeof helpMessages.help) => {
  const helpMessage = helpMessages[t][lang];

  const res = new EmbedBuilder()
    .setTitle(helpMessage.title)
    .setDescription(helpMessage.description)
    .setAuthor({ name: "VC Notice", iconURL: client.user?.displayAvatarURL() })
    .setColor("#FAA61A")
    .addFields(helpMessage.details);
  return res;
};

export const helpSlash = async (client: Client, interaction: CommandInteraction) => {
  try {
    const guildData = await db.getGuildData(interaction.guild?.id ?? "");
    await interaction.reply({ embeds: [embed(client, "help", guildData?.lang ?? "en")], ephemeral: true });
  } catch (e) {
    console.error(e);
  }
};

export const helpMention = async (client: Client, message: Message) => {
  try {
    const guildData = await db.getGuildData(message.guildId ?? "");
    await message.reply({ embeds: [embed(client, "help", guildData?.lang ?? "en")] });
  } catch (e) {
    console.error(e);
  }
};

export const overview = async (client: Client, interaction: CommandInteraction) => {
  try {
    const guildData = await db.getGuildData(interaction.guild?.id ?? "");
    await interaction.reply({ embeds: [embed(client, "overview", guildData?.lang ?? "en")], ephemeral: true });
  } catch (e) {
    console.error(e);
  }
};

export const setHelp = async (client: Client, interaction: CommandInteraction) => {
  try {
    const guildData = await db.getGuildData(interaction.guild?.id ?? "");
    await interaction.reply({ embeds: [embed(client, "settings", guildData?.lang ?? "en")], ephemeral: true });
  } catch (e) {
    console.error(e);
  }
};
