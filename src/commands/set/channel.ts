import { ChannelType } from "discord.js";
import type { Client, CommandInteraction } from "discord.js";

import { setCompletedEmbed, setNotFoundInteractionChannelErrorEmbed } from "../../embed";
import { db } from "../../main";
import { updateWebhook } from "../../services";
import { buildEmbed, locale2language } from "../../utils";

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
    const guildData = await db.getGuildData(guild.id);
    const lang = guildData?.lang ?? locale2language(interaction.locale);
    const webhookUrl = await updateWebhook(client, channel, guildData?.webhookUrl ?? null);

    await db.updateGuildData(guild.id, {
      name: guild.name,
      id: guild.id,
      lang: lang,
      webhookUrl: webhookUrl,
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
