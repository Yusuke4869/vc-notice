import { ChannelType, TextChannel, channelMention, PermissionFlagsBits } from "discord.js";

import { language, isLanguage } from "../../type/language";
import { noticeOption, isNoticeOption } from "../../type/notice-option";
import { buildEmbed } from "../../util/embed";
import { getLanguageText } from "../../util/language";
import {
  argumentTypeError,
  generalError,
  notFoundGuildError,
  notFoundChannelError,
  onNotGuildTextChannelError,
} from "../error";
import { getOption } from "../option";

import type { Subcommand } from "../../type/command";
import type { EmbedContent } from "../../type/embed";
import type { Language } from "../../type/language";
import type { NoticeOption } from "../../type/notice-option";
import type { GuildUseCaseInterface } from "../../usecase/guild/interface";
import type { WebhookUseCaseInterface } from "../../usecase/webhook/interface";
import type { CommandInteractionInterface } from "../interface";
import type { CommandInteraction, Guild } from "discord.js";

export class NoticeSetCommand implements CommandInteractionInterface<Subcommand> {
  public readonly hasSubcommands = false;
  public readonly schema: Subcommand = {
    name: "set",
    description: {
      en: "Collectively set up notifications",
      ja: "通知設定をまとめて行います",
    },
    botPermissions: [PermissionFlagsBits.ManageWebhooks],
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
        {
          name: {
            en: "option",
            ja: "オプション",
          },
          description: {
            en: "Select the notice option",
            ja: "通知オプションを選択してください",
          },
          required: false,
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
      booleanOptions: [
        {
          name: {
            en: "bot",
            ja: "ボット",
          },
          description: {
            en: "Set whether to notify bot users (True to notify, False to not notify)",
            ja: "Botユーザーの通知を行うか設定します（True で通知する、False で通知しない）",
          },
          required: false,
        },
      ],
      channelOptions: [
        {
          name: {
            en: "channel",
            ja: "チャンネル",
          },
          description: {
            en: "Select the channel to notify, if not selected, it will be this channel",
            ja: "通知するチャンネルを選択してください、選択しない場合はこのチャンネルになります",
          },
          required: false,
          channelTypes: [ChannelType.GuildText],
        },
      ],
    },
  };

  constructor(
    private readonly guildUseCase: GuildUseCaseInterface,
    private readonly webhookUseCase: WebhookUseCaseInterface
  ) {}

  public embed(language: Language, channel: TextChannel, bot?: boolean, option?: NoticeOption): EmbedContent {
    const { en: optionEn, ja: optionJa } = (() => {
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
        title: "Set notification settings",
        fields: [
          {
            name: "Notification language",
            value: getLanguageText(language),
          },
          {
            name: "Notification channel",
            value: channelMention(channel.id),
          },
          {
            name: "Bot user activity",
            value: bot ? "Notify" : "Do not notify",
          },
          {
            name: "Notification option",
            value: optionEn,
          },
        ],
      },
      ja: {
        title: "通知設定を行いました",
        fields: [
          {
            name: "通知言語",
            value: getLanguageText(language),
          },
          {
            name: "通知チャンネル",
            value: channelMention(channel.id),
          },
          {
            name: "Botユーザーのアクティビティ",
            value: bot ? "通知する" : "通知しない",
          },
          {
            name: "通知オプション",
            value: optionJa,
          },
        ],
      },
    };
  }

  private async createGuild(
    guild: Guild,
    language: Language,
    webhookUrl: string,
    botDisabled?: boolean,
    noticeOption?: NoticeOption
  ) {
    const res = await this.guildUseCase.upsertGuild({
      name: guild.name,
      id: guild.id,
      language,
      webhookUrl,
      botDisabled,
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

      if (!interaction.channel) {
        await notFoundChannelError(interaction);
        return;
      }

      const language = getOption(interaction, "language")?.value;
      if (typeof language !== "string" || !isLanguage(language)) {
        await argumentTypeError(interaction, { en: "language", ja: "言語" });
        return;
      }

      const bot = getOption(interaction, "bot")?.value;
      if (bot !== undefined && typeof bot !== "boolean") {
        await argumentTypeError(interaction, { en: "bot", ja: "ボット" });
        return;
      }

      const option = getOption(interaction, "option")?.value;
      if (option !== undefined && (typeof option !== "string" || !isNoticeOption(option))) {
        await argumentTypeError(interaction, { en: "option", ja: "オプション" });
        return;
      }

      const guild = await this.guildUseCase.findGuild(interaction.guild.id);

      // チャンネルを指定した場合
      const channel = getOption(interaction, "channel")?.channel;
      if (channel && channel.type === ChannelType.GuildText && channel instanceof TextChannel) {
        const webhook = await this.webhookUseCase.updateWebhook(channel, guild?.webhookUrl);

        if (guild)
          await this.guildUseCase.updateGuild(guild, {
            language,
            webhookUrl: webhook.url,
            botDisabled: !bot,
            noticeMode: option,
          });
        else await this.createGuild(interaction.guild, language, webhook.url, !bot, option);

        await interaction.reply({
          embeds: [buildEmbed(this.embed(language, channel, bot, option), interaction.locale)],
        });
        return;
      }

      if (interaction.channel.type !== ChannelType.GuildText) {
        await onNotGuildTextChannelError(interaction);
        return;
      }

      const webhook = await this.webhookUseCase.updateWebhook(interaction.channel, guild?.webhookUrl);
      if (guild)
        await this.guildUseCase.updateGuild(guild, {
          language,
          webhookUrl: webhook.url,
          botDisabled: !bot,
          noticeMode: option,
        });
      else await this.createGuild(interaction.guild, language, webhook.url, !bot, option);

      await interaction.reply({
        embeds: [buildEmbed(this.embed(language, interaction.channel, bot, option), interaction.locale)],
      });
    } catch (e) {
      console.error(e);
      await generalError(interaction);
    }
  }
}
