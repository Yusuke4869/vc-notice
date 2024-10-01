import { ChannelType } from "discord.js";

import { setCompletedEmbed, setNotFoundInteractionChannelErrorEmbed } from "../../embed";
import { getGuildData, upsertGuildData } from "../../repositories/guild";
import { updateWebhook } from "../../services";
import { buildEmbed, locale2language } from "../../utils";

import type { Client, CommandInteraction } from "discord.js";

export const setChannel = async (client: Client, interaction: CommandInteraction) => {
  const guild = interaction.guild;
  const channel = interaction.channel;

  if (!guild || !channel || channel.type !== ChannelType.GuildText) {
    await interaction.reply({
      embeds: [buildEmbed(setNotFoundInteractionChannelErrorEmbed(), interaction.locale)],
      ephemeral: false,
    });

    return;
  }

  try {
    const guildData = await getGuildData(guild.id);
    const lang = guildData?.lang ?? locale2language(interaction.locale);
    const webhookUrl = await updateWebhook(client, channel, guildData?.webhookUrl);

    await upsertGuildData({
      name: guild.name,
      id: guild.id,
      lang: lang,
      webhookUrl: webhookUrl ?? undefined,
      botDisabled: guildData?.botDisabled ?? false,
      members: guildData?.members ?? [],
    });

    await interaction.reply({
      embeds: [buildEmbed(setCompletedEmbed(channel, lang), interaction.locale)],
      ephemeral: false,
    });
  } catch (e) {
    console.error(e);
  }
};
