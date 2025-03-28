import { roleMention } from "discord.js";

import { setMentionEmbed, setNotFoundInteractionChannelErrorEmbed } from "../../old-embed";
import { getGuildData, upsertGuildData } from "../../repositories/guild";
import { buildEmbed, locale2language } from "../../utils";

import type { Client, CommandInteraction } from "discord.js";

export const setMention = async (client: Client, interaction: CommandInteraction) => {
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
    const role = interaction.options.data[0].options?.at(0)?.role;
    const mention = role ? (role.name === "@everyone" ? "@everyone" : roleMention(role.id)) : undefined;

    await upsertGuildData({
      name: guild.name,
      id: guild.id,
      lang: guildData?.lang ?? locale2language(interaction.locale),
      webhookUrl: guildData?.webhookUrl,
      botDisabled: guildData?.botDisabled ?? false,
      joinMention: mention,
      noticeMode: guildData?.noticeMode,
      members: guildData?.members ?? [],
    });

    await interaction.reply({
      embeds: [buildEmbed(setMentionEmbed(mention), interaction.locale)],
      ephemeral: false,
    });
  } catch (e) {
    console.error(e);
  }
};
