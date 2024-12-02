import { PermissionFlagsBits } from "discord.js";

import type { SlashCommandConfig } from "./type";

export const slashCommands: SlashCommandConfig[] = [
  {
    name: "help",
    description: {
      en: "Show help",
      ja: "Helpを表示します",
    },
    allowDM: true,
  },
  {
    name: "about",
    description: {
      en: "Show about me",
      ja: "このBotについて",
    },
    allowDM: true,
  },
  {
    name: "ping",
    description: {
      en: "Replies with pong!",
      ja: "pong! と返します",
    },
    allowDM: true,
  },
  {
    name: "set",
    description: {
      en: "Settings",
      ja: "設定",
    },
    allowDM: false,
    permissions: PermissionFlagsBits.ManageGuild,
    subCommands: [
      {
        name: "help",
        description: {
          en: "Show help of settings",
          ja: "設定のHelpを表示します",
        },
      },
      {
        name: "channel",
        description: {
          en: "Set this channel to send notifications",
          ja: "このチャンネルに通知を送るように設定します",
        },
      },
      {
        name: "language",
        description: {
          en: "Set language in this server",
          ja: "表示言語を設定します",
        },
        stringOptions: [
          {
            name: "language",
            description: {
              en: "shown language",
              ja: "表示する言語",
            },
            required: true,
            choices: [
              {
                name: {
                  en: "English",
                  ja: "英語",
                },
                value: "en",
              },
              {
                name: {
                  en: "Japanese",
                  ja: "日本語",
                },
                value: "ja",
              },
            ],
          },
        ],
      },
      {
        name: "bot",
        description: {
          en: "Toggle bot user notifications",
          ja: "Botユーザーの通知を切り替えます",
        },
        booleanOptions: [
          {
            name: "disabled",
            description: {
              en: "True to disable, False to enable",
              ja: "True で無効、False で有効",
            },
            required: true,
          },
        ],
      },
      {
        name: "mention",
        description: {
          en: "Set mention for joined notification",
          ja: "入室通知のメンションを設定します",
        },
        roleMentionOptions: [
          {
            name: "role",
            description: {
              en: "Role to mention",
              ja: "メンションするロール",
            },
            required: false,
          },
        ],
      },
    ],
  },
  {
    name: "check",
    description: {
      en: "Check settings",
      ja: "設定を確認します",
    },
    allowDM: false,
    permissions: PermissionFlagsBits.ManageGuild,
    subCommands: [
      {
        name: "channel",
        description: {
          en: "Check notification settings",
          ja: "チャンネルの通知設定を確認します",
        },
        voiceChannelOptions: [
          {
            name: "channel",
            description: {
              en: "Channel to check",
              ja: "確認するチャンネル",
            },
            required: true,
          },
        ],
      },
    ],
  },
];
