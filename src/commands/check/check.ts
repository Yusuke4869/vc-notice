import { checkChannel } from "./channel";
import { dmErrorEmbed, noPermissionErrorEmbed } from "../../embed";
import { buildEmbed } from "../../utils";

import type { Client, CommandInteraction } from "discord.js";

export const check = async (client: Client, interaction: CommandInteraction) => {
  // DMで送信された場合
  if (!interaction.guild) {
    await interaction.reply({
      embeds: [buildEmbed(dmErrorEmbed(), interaction.locale)],
      ephemeral: true,
    });
    return;
  }

  // サーバー管理権限（管理者権限）がない場合
  const permissions = interaction.memberPermissions;
  if (!permissions?.has("ManageGuild")) {
    await interaction.reply({
      embeds: [buildEmbed(noPermissionErrorEmbed(), interaction.locale)],
      ephemeral: true,
    });
    return;
  }

  const subCommand = interaction.options.data[0].name;
  if (subCommand === "channel") await checkChannel(client, interaction);
};
