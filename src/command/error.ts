import { MessageFlags } from "discord.js";

import { buildEmbed } from "../util/embed";

import type { EmbedContent } from "../type/embed";
import type { LanguageRecord } from "../type/language";
import type { CommandInteraction } from "discord.js";

const errorEmbed = (title: LanguageRecord<string>, description: LanguageRecord<string>): EmbedContent => ({
  en: {
    title: title.en,
    description: description.en,
    color: "#FF0000",
  },
  ja: {
    title: title.ja,
    description: description.ja,
    color: "#FF0000",
  },
});

const replyError = async (interaction: CommandInteraction, embed: EmbedContent) => {
  try {
    await interaction.reply({
      embeds: [buildEmbed(embed, interaction.locale)],
      flags: MessageFlags.Ephemeral,
    });
  } catch (e) {
    console.error(e);
  }
};

export const generalError = async (interaction: CommandInteraction) => {
  const embed = errorEmbed(
    {
      en: "An error occurred",
      ja: "エラーが発生しました",
    },
    {
      en: "Please try again later",
      ja: "後でもう一度お試しください",
    }
  );

  await replyError(interaction, embed);
};

export const commandNotFoundError = async (interaction: CommandInteraction) => {
  const embed = errorEmbed(
    {
      en: "Command not found",
      ja: "コマンドが見つかりません",
    },
    {
      en: "Please check the command name",
      ja: "コマンド名を確認してください",
    }
  );

  await replyError(interaction, embed);
};

export const notAllowedDMError = async (interaction: CommandInteraction) => {
  const embed = errorEmbed(
    {
      en: "The command cannot be executed in DM",
      ja: "DMでコマンド実行はできません",
    },
    {
      en: "Please run the command in the server",
      ja: "サーバーでコマンドを実行してください",
    }
  );

  await replyError(interaction, embed);
};

export const noServerManagePermissionError = async (interaction: CommandInteraction) => {
  const embed = errorEmbed(
    {
      en: "You do not have permission to manage the server",
      ja: "サーバーの管理権限がありません",
    },
    {
      en: 'The "Manage Server" permission is required',
      ja: "「サーバー管理」権限が必要です",
    }
  );

  await replyError(interaction, embed);
};

export const onNotGuildTextChannelError = async (interaction: CommandInteraction) => {
  const embed = errorEmbed(
    {
      en: "The command cannot be executed",
      ja: "コマンドを実行できません",
    },
    {
      en: "Please run the command in the server text channel",
      ja: "サーバーのテキストチャンネルでコマンドを実行してください",
    }
  );

  await replyError(interaction, embed);
};

export const notFoundGuildError = async (interaction: CommandInteraction) => {
  const embed = errorEmbed(
    {
      en: "The server could not be obtained",
      ja: "サーバーを取得できませんでした",
    },
    {
      en: "Please run the command on the server",
      ja: "サーバーでコマンドを実行してください",
    }
  );

  await replyError(interaction, embed);
};

export const notFoundChannelError = async (interaction: CommandInteraction) => {
  const embed = errorEmbed(
    {
      en: "The channel could not be obtained",
      ja: "チャンネルを取得できませんでした",
    },
    {
      en: "Please run the command in the server channel",
      ja: "サーバーのチャンネルでコマンドを実行してください",
    }
  );

  await replyError(interaction, embed);
};

export const argumentTypeError = async (interaction: CommandInteraction, argName: LanguageRecord<string>) => {
  const embed = errorEmbed(
    {
      en: "The option value is invalid",
      ja: "オプションの値が不正です",
    },
    {
      en: `${argName.en} is invalid`,
      ja: `${argName.ja} が不正です`,
    }
  );

  await replyError(interaction, embed);
};
