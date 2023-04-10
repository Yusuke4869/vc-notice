import { ChannelType, EmbedBuilder } from "discord.js";
import type { APIEmbedField, Client, CommandInteraction, TextChannel } from "discord.js";

import { createNoticeMessages } from "../data";
import { db } from "../index";
import { getWebhookChannel, updateWebhook } from "../service";
import { languages } from "../util";
import { setHelp } from "./help";

const msg = createNoticeMessages("");

const errEmbed = () => {
  const res = new EmbedBuilder()
    .setTitle("Error!")
    .setColor("#FF0000")
    .addFields([
      {
        name: "Channel Not Found!",
        value: "cannot get this channel",
      },
    ]);
  return res;
};

const embed = (channel: TextChannel | undefined, lang: keyof typeof msg) => {
  const fields: APIEmbedField[] = [
    {
      name: "Notification Channel",
      value: `<#${channel?.id}>`,
      inline: true,
    },
    {
      name: "Language",
      value: languages[lang].at(1)?.toUpperCase() ?? lang,
      inline: true,
    },
  ];
  if (!channel) fields.shift();

  const res = new EmbedBuilder()
    .setTitle("Setup Completed!")
    .setColor("#FAA61A")
    .setDescription("Set up the following in this server")
    .addFields(fields);
  return res;
};

export const set = async (client: Client, interaction: CommandInteraction) => {
  const subCommand = interaction.options.data[0].name;

  if (subCommand === "channel") await setChannel(client, interaction);
  else if (subCommand === "language") await setLangage(client, interaction);
  else await setHelp(client, interaction);
};

const setChannel = async (client: Client, interaction: CommandInteraction) => {
  const guild = interaction.guild;
  const channel = interaction.channel;
  if (!guild || !channel || channel.type !== ChannelType.GuildText) {
    await interaction.reply({ embeds: [errEmbed()], ephemeral: false });
    return;
  }

  try {
    const guildData = await db.getGuildData(guild.id);
    const lang = guildData?.lang ?? "en";
    const url = await updateWebhook(client, channel, guildData?.webhookUrl ?? null);

    await db.updateGuildData(guild.id, {
      name: guild.name,
      id: guild.id,
      lang: lang,
      webhookUrl: url,
      members: guildData?.members ?? [],
    });
    await interaction.reply({ embeds: [embed(channel, lang)], ephemeral: false });
  } catch (e) {
    console.error(e);
  }
};

const setLangage = async (client: Client, interaction: CommandInteraction) => {
  const guild = interaction.guild;
  const channel = interaction.channel;
  if (!guild || !channel || channel.type !== ChannelType.GuildText) {
    await interaction.reply({ embeds: [errEmbed()], ephemeral: false });
    return;
  }

  try {
    const guildData = await db.getGuildData(guild.id);
    const lang = (interaction.options.data[0].options?.at(0)?.value as keyof typeof msg) ?? "en";
    const url = guildData?.webhookUrl ?? (await updateWebhook(client, channel, null));

    await db.updateGuildData(guild.id, {
      name: guild.name,
      id: guild.id,
      lang: lang,
      webhookUrl: url,
      members: guildData?.members ?? [],
    });

    const webhookChannel = await getWebhookChannel(client, guild, url);
    await interaction.reply({ embeds: [embed(webhookChannel, lang)], ephemeral: false });
  } catch (e) {
    console.error(e);
  }
};
