import { isLanguage, language } from "../../type/language";
import { buildEmbed } from "../../util/embed";
import { getLanguageText } from "../../util/language";
import { argumentTypeError, generalError, notFoundGuildError } from "../error";
import { getOption } from "../option";

import type { Subcommand } from "../../type/command";
import type { EmbedContent } from "../../type/embed";
import type { Language } from "../../type/language";
import type { GuildUseCaseInterface } from "../../usecase/guild/interface";
import type { CommandInteractionInterface } from "../interface";
import type { CommandInteraction, Guild } from "discord.js";

export class NoticeLanguageCommand implements CommandInteractionInterface<Subcommand> {
  public readonly hasSubcommands = false;
  public readonly schema: Subcommand = {
    name: "language",
    description: {
      en: "Set the notification language",
      ja: "通知言語を設定します",
    },
    options: {
      stringOptions: [
        {
          name: {
            en: "language",
            ja: "言語",
          },
          description: {
            en: "Select the notification message language",
            ja: "通知メッセージの言語を選択してください",
          },
          required: true,
          choices: [
            {
              name: {
                en: "English",
                ja: "英語",
              },
              value: language.English,
            },
            {
              name: {
                en: "Japanese",
                ja: "日本語",
              },
              value: language.Japanese,
            },
          ],
        },
      ],
    },
  };

  constructor(private readonly guildUseCase: GuildUseCaseInterface) {}

  public embed(language: Language): EmbedContent {
    const languageText = getLanguageText(language);

    return {
      en: {
        title: "Set the notification language",
        fields: [
          {
            name: "Language",
            value: languageText,
          },
        ],
      },
      ja: {
        title: "通知言語を設定しました",
        fields: [
          {
            name: "通知言語",
            value: languageText,
          },
        ],
      },
    };
  }

  private async createGuild(guild: Guild, language: Language) {
    const res = await this.guildUseCase.upsertGuild({
      name: guild.name,
      id: guild.id,
      language,
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

      const language = getOption(interaction, "language")?.value;
      if (typeof language !== "string" || !isLanguage(language)) {
        await argumentTypeError(interaction, { en: "language", ja: "言語" });
        return;
      }

      const guild = await this.guildUseCase.findGuild(interaction.guild.id);
      if (guild) await this.guildUseCase.updateGuild(guild, { language });
      else await this.createGuild(interaction.guild, language);

      await interaction.reply({
        embeds: [buildEmbed(this.embed(language), interaction.locale)],
      });
    } catch (e) {
      console.error(e);
      await generalError(interaction);
    }
  }
}
