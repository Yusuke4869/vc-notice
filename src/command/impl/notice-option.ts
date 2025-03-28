import { noticeOption, isNoticeOption } from "../../type/notice-option";
import { buildEmbed } from "../../util/embed";
import { argumentTypeError, generalError, notFoundGuildError } from "../error";
import { getOption } from "../option";

import type { Subcommand } from "../../type/command";
import type { EmbedContent } from "../../type/embed";
import type { NoticeOption } from "../../type/notice-option";
import type { GuildUseCaseInterface } from "../../usecase/guild/interface";
import type { CommandInteractionInterface } from "../interface";
import type { CommandInteraction, Guild } from "discord.js";

export class NoticeOptionCommand implements CommandInteractionInterface<Subcommand> {
  public readonly hasSubcommands = false;
  public readonly schema: Subcommand = {
    name: "option",
    description: {
      en: "Set the notice option",
      ja: "通知オプションを設定します",
    },
    options: {
      stringOptions: [
        {
          name: {
            en: "option",
            ja: "オプション",
          },
          description: {
            en: "Select the notice option",
            ja: "通知オプションを選択してください",
          },
          required: true,
          choices: [
            {
              name: {
                en: "All",
                ja: "すべて",
              },
              value: noticeOption.All,
            },
            {
              name: {
                en: "Join only",
                ja: "入室のみ",
              },
              value: noticeOption.JoinOnly,
            },
            {
              name: {
                en: "Join/Leave",
                ja: "入室・退室",
              },
              value: noticeOption.JoinLeave,
            },
          ],
        },
      ],
    },
  };

  constructor(private readonly guildUseCase: GuildUseCaseInterface) {}

  public embed(option: NoticeOption): EmbedContent {
    const { en, ja } = (() => {
      switch (option) {
        case "join-only":
          return {
            en: "Join only",
            ja: "入室のみ",
          };
        case "join-leave":
          return {
            en: "Join/Leave",
            ja: "入室・退室",
          };
        default:
          return {
            en: "All",
            ja: "すべて",
          };
      }
    })() satisfies { en: string; ja: string };

    return {
      en: {
        title: "Set the notice option",
        description: en,
      },
      ja: {
        title: "通知オプションを設定しました",
        description: ja,
      },
    };
  }

  private async createGuild(guild: Guild, noticeOption: NoticeOption) {
    const res = await this.guildUseCase.upsertGuild({
      name: guild.name,
      id: guild.id,
      language: undefined,
      webhookUrl: undefined,
      botDisabled: undefined,
      joinMention: undefined,
      noticeMode: noticeOption,
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

      const option = getOption(interaction, "option")?.value;
      if (typeof option !== "string" || !isNoticeOption(option)) {
        await argumentTypeError(interaction, { en: "option", ja: "オプション" });
        return;
      }

      const guild = await this.guildUseCase.findGuild(interaction.guild.id);
      if (guild) await this.guildUseCase.updateGuild(guild, { noticeMode: option });
      else await this.createGuild(interaction.guild, option);

      await interaction.reply({
        embeds: [buildEmbed(this.embed(option), interaction.locale)],
      });
    } catch (e) {
      console.error(e);
      await generalError(interaction);
    }
  }
}
