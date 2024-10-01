import { setNotFoundInteractionChannelErrorEmbed, toggleBotNotificationsEmbed } from "../../embed";
import { getGuildData, upsertGuildData } from "../../repositories/guild";
import { buildEmbed, locale2language } from "../../utils";

import type { Client, CommandInteraction } from "discord.js";

export const toggleBotNotifications = async (client: Client, interaction: CommandInteraction) => {
  const guild = interaction.guild;
  if (!guild) {
    await interaction.reply({
      embeds: [buildEmbed(setNotFoundInteractionChannelErrorEmbed(), interaction.locale)],
      ephemeral: false,
    });

    return;
  }

  try {
    const guildData = await getGuildData(guild.id);
    const disabled = interaction.options.data[0].options?.at(0)?.value as boolean;

    await upsertGuildData({
      name: guild.name,
      id: guild.id,
      lang: guildData?.lang ?? locale2language(interaction.locale),
      webhookUrl: guildData?.webhookUrl,
      botDisabled: disabled,
      members: guildData?.members ?? [],
    });

    await interaction.reply({
      embeds: [buildEmbed(toggleBotNotificationsEmbed(disabled), interaction.locale)],
      ephemeral: false,
    });
  } catch (e) {
    console.error(e);
  }
};
