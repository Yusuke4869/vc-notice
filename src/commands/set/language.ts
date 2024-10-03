import { ChannelType } from "discord.js";

import {
  setCompletedEmbed,
  setNotFoundInteractionChannelErrorEmbed,
  noManageWebhooksPermissionErrorEmbed,
} from "../../embed";
import { getGuildData, upsertGuildData } from "../../repositories/guild";
import { getWebhookChannel, updateWebhook } from "../../services";
import { buildEmbed, locale2language } from "../../utils";

import type { TLanguage } from "../../types";
import type { Client, CommandInteraction } from "discord.js";

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

  if (client.user && !channel.permissionsFor(client.user)?.has("ManageWebhooks")) {
    await interaction.reply({
      embeds: [buildEmbed(noManageWebhooksPermissionErrorEmbed(), interaction.locale)],
      ephemeral: false,
    });

    return;
  }

  try {
    const guildData = await getGuildData(guild.id);
    const lang =
      (interaction.options.data[0].options?.at(0)?.value as TLanguage | undefined) ??
      locale2language(interaction.locale);
    const webhookUrl = guildData?.webhookUrl ?? (await updateWebhook(client, channel));

    await upsertGuildData({
      name: guild.name,
      id: guild.id,
      lang: lang,
      webhookUrl: webhookUrl ?? undefined,
      botDisabled: guildData?.botDisabled ?? false,
      joinMention: guildData?.joinMention,
      members: guildData?.members ?? [],
    });

    await interaction.reply({
      embeds: [
        buildEmbed(
          setCompletedEmbed(webhookUrl ? await getWebhookChannel(guild, webhookUrl) : null, lang),
          interaction.locale
        ),
      ],
      ephemeral: false,
    });
  } catch (e) {
    console.error(e);
  }
};
