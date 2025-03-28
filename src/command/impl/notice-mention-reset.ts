import { buildEmbed } from "../../util/embed";
import { generalError, notFoundGuildError } from "../error";

import type { Subcommand } from "../../type/command";
import type { EmbedContent } from "../../type/embed";
import type { GuildUseCaseInterface } from "../../usecase/guild/interface";
import type { CommandInteractionInterface } from "../interface";
import type { CommandInteraction, Guild } from "discord.js";

export class NoticeMentionResetCommand implements CommandInteractionInterface<Subcommand> {
  public readonly hasSubcommands = false;
  public readonly schema: Subcommand = {
    name: "reset",
    description: {
      en: "Reset the role mention when join VC",
      ja: "入室通知時のロールメンションを解除します",
    },
  };

  constructor(private readonly guildUseCase: GuildUseCaseInterface) {}

  public embed(): EmbedContent {
    return {
      en: {
        title: "Reset role mention when join VC",
        description: `To set again, run \`/notice mention join\``,
      },
      ja: {
        title: "入室通知時のメンションを解除しました",
        description: `再度設定する場合は \`/notice mention join\` を実行してください`,
      },
    };
  }

  private async createGuild(guild: Guild) {
    const res = await this.guildUseCase.upsertGuild({
      name: guild.name,
      id: guild.id,
      language: undefined,
      webhookUrl: undefined,
      botDisabled: undefined,
      joinMention: undefined,
      noticeMode: undefined,
      members: [],
    });

    return res;
  }

  public async on(interaction: CommandInteraction) {
    try {
      if (!interaction.guild) {
        await notFoundGuildError(interaction);
        return;
      }

      const guild = await this.guildUseCase.findGuild(interaction.guild.id);
      if (guild) await this.guildUseCase.updateGuild(guild, { joinMention: undefined });
      else await this.createGuild(interaction.guild);

      await interaction.reply({
        embeds: [buildEmbed(this.embed(), interaction.locale)],
      });
    } catch (e) {
      console.error(e);
      await generalError(interaction);
    }
  }
}
