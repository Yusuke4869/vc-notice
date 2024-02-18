import type { Client, CommandInteraction } from "discord.js";

import { dmErrorEmbed, noPermissionErrorEmbed } from "../../embed";
import { buildEmbed } from "../../utils";
import { setChannel } from "./channel";
import { setHelp } from "./help";
import { setLangage } from "./language";

export const set = async (client: Client, interaction: CommandInteraction) => {
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

  if (subCommand === "channel") await setChannel(client, interaction);
  else if (subCommand === "language") await setLangage(client, interaction);
  else await setHelp(interaction);
};
