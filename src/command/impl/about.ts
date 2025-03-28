import { MessageFlags } from "discord.js";

import { buildEmbed } from "../../util/embed";
import { generalError } from "../error";

import type { Command } from "../../type/command";
import type { EmbedContent } from "../../type/embed";
import type { CommandInteractionInterface } from "../interface";
import type { CommandInteraction } from "discord.js";

export class AboutCommand implements CommandInteractionInterface<Command> {
  public readonly hasSubcommands = false;
  public readonly schema: Command = {
    name: "about",
    description: {
      en: "About this bot",
      ja: "このボットについて",
    },
    allowDM: true,
    permission: null,
  };

  public embed(): EmbedContent {
    return {
      en: {
        title: "About me",
        description: "Notify activities such as joining and leaving VC",
        fields: [
          {
            name: "Let's get started!",
            value: "Set up notifications with `/notice set` and get started!",
          },
          {
            name: "Command list",
            value: "`/help` to show the command list",
          },
        ],
      },
      ja: {
        title: "このBotについて",
        description: "VCの入室や退室といったアクティビティをお知らせします",
        fields: [
          {
            name: "使い始めよう！",
            value: "`/notice set` で通知設定を行って、使い始めましょう！",
          },
          {
            name: "コマンド一覧",
            value: "`/help` でコマンド一覧を表示できます",
          },
        ],
      },
    };
  }

  public async on(interaction: CommandInteraction) {
    try {
      await interaction.reply({
        embeds: [buildEmbed(this.embed(), interaction.locale)],
        flags: MessageFlags.Ephemeral,
      });
    } catch (e) {
      console.error(e);
      await generalError(interaction);
    }
  }
}
