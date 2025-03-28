import { PermissionFlagsBits, roleMention } from "discord.js";

import { checkChannelPermissionsEmbed, setNotFoundInteractionChannelErrorEmbed } from "../../old-embed";
import { buildEmbed } from "../../utils";

import type { Client, CommandInteraction, VoiceBasedChannel } from "discord.js";

export const checkChannel = async (client: Client, interaction: CommandInteraction) => {
  const guild = interaction.guild;
  const botUser = client.user;
  if (!guild || !botUser) {
    await interaction.reply({
      embeds: [buildEmbed(setNotFoundInteractionChannelErrorEmbed(), interaction.locale)],
      ephemeral: false,
    });

    return;
  }

  try {
    const channel = interaction.options.data[0].options?.at(0)?.channel as VoiceBasedChannel;
    await interaction.reply({
      embeds: [
        buildEmbed(
          checkChannelPermissionsEmbed(
            channel,
            channel.permissionsFor(botUser)?.has(PermissionFlagsBits.Connect) ?? true,
            guild.members.me?.roles
              .valueOf()
              .sort((a, b) => b.position - a.position)
              .map((role) => ({
                role: role.name === "@everyone" ? "@everyone" : roleMention(role.id),
                isAdmin: role.permissions.has(PermissionFlagsBits.Administrator),
                allowed: channel.permissionsFor(role).has(PermissionFlagsBits.Connect),
              })) ?? []
          ),
          interaction.locale
        ),
      ],
      ephemeral: true,
    });
  } catch (e) {
    console.error(e);
  }
};
