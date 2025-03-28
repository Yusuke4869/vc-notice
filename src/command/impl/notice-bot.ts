import { buildEmbed } from "../../util/embed";
import { argumentTypeError, generalError, notFoundGuildError } from "../error";
import { getOption } from "../option";

import type { Subcommand } from "../../type/command";
import type { EmbedContent } from "../../type/embed";
import type { GuildUseCaseInterface } from "../../usecase/guild/interface";
import type { CommandInteractionInterface } from "../interface";
import type { CommandInteraction, Guild } from "discord.js";

export class NoticeBotCommand implements CommandInteractionInterface<Subcommand> {
  public readonly hasSubcommands = false;
  public readonly schema: Subcommand = {
    name: "bot",
    description: {
      en: "Set whether to notify bot user activities",
      ja: "Botユーザーのアクティビティを通知するかどうかを設定します",
    },
    options: {
      booleanOptions: [
        {
          name: {
            en: "notification",
            ja: "通知",
          },
          description: {
            en: "True to notify, false to not notify",
            ja: "True で通知する、False で通知しない",
          },
          required: true,
        },
      ],
    },
  };

  constructor(private readonly guildUseCase: GuildUseCaseInterface) {}

  public embed(enabled: boolean): EmbedContent {
    return {
      en: {
        title: "Set bot user notifications",
        fields: [
          {
            name: "Bot user activity",
            value: enabled ? "Notify" : "Do not notify",
          },
        ],
      },
      ja: {
        title: "Botユーザーの通知を設定しました",
        fields: [
          {
            name: "Botユーザーのアクティビティ",
            value: enabled ? "通知する" : "通知しない",
          },
        ],
      },
    };
  }

  private async createGuild(guild: Guild, botDisabled: boolean) {
    const res = await this.guildUseCase.upsertGuild({
      name: guild.name,
      id: guild.id,
      language: undefined,
      webhookUrl: undefined,
      botDisabled,
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

      const enabled = getOption(interaction, "notification")?.value;
      if (typeof enabled !== "boolean") {
        await argumentTypeError(interaction, { en: "notification", ja: "通知" });
        return;
      }

      const guild = await this.guildUseCase.findGuild(interaction.guild.id);
      if (guild) await this.guildUseCase.updateGuild(guild, { botDisabled: !enabled });
      else await this.createGuild(interaction.guild, !enabled);

      await interaction.reply({
        embeds: [buildEmbed(this.embed(enabled), interaction.locale)],
      });
    } catch (e) {
      console.error(e);
      await generalError(interaction);
    }
  }
}
