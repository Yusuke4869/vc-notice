import { setNotFoundInteractionChannelErrorEmbed, setNoticeEmbed } from "../../old-embed";
import { getGuildData, upsertGuildData } from "../../repositories/guild";
import { buildEmbed, locale2language } from "../../utils";

import type { Client, CommandInteraction } from "discord.js";

export const setNotice = async (client: Client, interaction: CommandInteraction) => {
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
    const mode = interaction.options.data[0].options?.at(0)?.value as "all" | "join-only" | "join-leave" | undefined;

    await upsertGuildData({
      name: guild.name,
      id: guild.id,
      lang: guildData?.lang ?? locale2language(interaction.locale),
      webhookUrl: guildData?.webhookUrl,
      botDisabled: guildData?.botDisabled ?? false,
      joinMention: guildData?.joinMention,
      noticeMode: mode,
      members: guildData?.members ?? [],
    });

    await interaction.reply({
      embeds: [buildEmbed(setNoticeEmbed(mode), interaction.locale)],
      ephemeral: false,
    });
  } catch (e) {
    console.error(e);
  }
};
