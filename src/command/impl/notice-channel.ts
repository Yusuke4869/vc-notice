import { ChannelType, PermissionFlagsBits, TextChannel, channelMention } from "discord.js";

import { buildEmbed } from "../../util/embed";
import { generalError, notFoundChannelError, notFoundGuildError, onNotGuildTextChannelError } from "../error";
import { getOption } from "../option";

import type { Subcommand } from "../../type/command";
import type { EmbedContent } from "../../type/embed";
import type { GuildUseCaseInterface } from "../../usecase/guild/interface";
import type { WebhookUseCaseInterface } from "../../usecase/webhook/interface";
import type { CommandInteractionInterface } from "../interface";
import type { CommandInteraction, Guild } from "discord.js";

export class NoticeChannelCommand implements CommandInteractionInterface<Subcommand> {
  public readonly hasSubcommands = false;
  public readonly schema: Subcommand = {
    name: "channel",
    description: {
      en: "Set the channel to notify",
      ja: "通知するチャンネルを設定します",
    },
    botPermissions: [PermissionFlagsBits.ManageWebhooks],
    options: {
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

  public embed(channel: TextChannel): EmbedContent {
    const mention = channelMention(channel.id);

    return {
      en: {
        title: "Set notification channel",
        fields: [
          {
            name: "Notification channel",
            value: mention,
          },
        ],
      },
      ja: {
        title: "通知チャンネルを設定しました",
        fields: [
          {
            name: "通知チャンネル",
            value: mention,
          },
        ],
      },
    };
  }

  private async createGuild(guild: Guild, webhookUrl: string) {
    const res = await this.guildUseCase.upsertGuild({
      name: guild.name,
      id: guild.id,
      language: undefined,
      webhookUrl,
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

      if (!interaction.channel) {
        await notFoundChannelError(interaction);
        return;
      }

      const guild = await this.guildUseCase.findGuild(interaction.guild.id);

      // チャンネルを指定した場合
      const channel = getOption(interaction, "channel")?.channel;
      if (channel && channel.type === ChannelType.GuildText && channel instanceof TextChannel) {
        const webhook = await this.webhookUseCase.updateWebhook(channel, guild?.webhookUrl);

        if (guild) await this.guildUseCase.updateGuild(guild, { webhookUrl: webhook.url });
        else await this.createGuild(interaction.guild, webhook.url);

        await interaction.reply({
          embeds: [buildEmbed(this.embed(channel), interaction.locale)],
        });
        return;
      }

      if (interaction.channel.type !== ChannelType.GuildText) {
        await onNotGuildTextChannelError(interaction);
        return;
      }

      const webhook = await this.webhookUseCase.updateWebhook(interaction.channel, guild?.webhookUrl);
      if (guild) await this.guildUseCase.updateGuild(guild, { webhookUrl: webhook.url });
      else await this.createGuild(interaction.guild, webhook.url);

      await interaction.reply({
        embeds: [buildEmbed(this.embed(interaction.channel), interaction.locale)],
      });
    } catch (e) {
      console.error(e);
      await generalError(interaction);
    }
  }
}
