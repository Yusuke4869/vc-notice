import { ChannelType } from "discord.js";
import type { Client, CommandInteraction } from "discord.js";

import { setCompletedEmbed, setNotFoundInteractionChannelErrorEmbed } from "../../embed";
import { db } from "../../main";
import { getWebhookChannel, updateWebhook } from "../../services";
import type { TLanguage } from "../../types";
import { buildEmbed, locale2language } from "../../utils";

export const setLangage = async (client: Client, interaction: CommandInteraction) => {
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
    const lang =
      (interaction.options.data[0].options?.at(0)?.value as TLanguage | undefined) ??
      locale2language(interaction.locale);
    const webhookUrl = guildData?.webhookUrl ?? (await updateWebhook(client, channel, null));

    await db.updateGuildData(guild.id, {
      name: guild.name,
      id: guild.id,
      lang: lang,
      webhookUrl: webhookUrl,
      members: guildData?.members ?? [],
    });

    const webhookChannel = await getWebhookChannel(client, guild, webhookUrl);
    await interaction.reply({
      embeds: [buildEmbed(setCompletedEmbed(webhookChannel, lang), interaction.locale)],
      ephemeral: false,
    });
  } catch (e) {
    console.error(e);
  }
};
