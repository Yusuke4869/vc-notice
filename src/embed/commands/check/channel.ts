import { channelMention } from "discord.js";

import type { EmbedContents } from "../../../types";
import type { VoiceBasedChannel, RoleMention } from "discord.js";

export const checkChannelPermissionsEmbed = (
  channel: VoiceBasedChannel,
  allowed: boolean,
  rolePermissions: {
    role: RoleMention;
    isAdmin: boolean;
    allowed: boolean;
  }[]
): EmbedContents => ({
  en: {
    title: "Connection permission to channel for VC Notice",
    fields: [
      {
        name: "Channel",
        value: `${channelMention(channel.id)}: ${allowed ? "⭕" : "❌"}`,
      },
      ...rolePermissions.map(({ role, allowed, isAdmin }) => ({
        name: "Role",
        value: `${role}: ${allowed ? "⭕" : "❌"} ${isAdmin ? "（Admin）" : ""}`,
      })),
    ],
    footer: {
      text: "If ⭕ is attached, a notification will be sent",
    },
  },
  ja: {
    title: "VC Notice のチャンネルへの接続権限",
    fields: [
      {
        name: "チャンネル",
        value: `${channelMention(channel.id)}: ${allowed ? "⭕" : "❌"}`,
      },
      ...rolePermissions.map(({ role, allowed, isAdmin }) => ({
        name: "ロール",
        value: `${role}: ${allowed ? "⭕" : "❌"} ${isAdmin ? "（管理者）" : ""}`,
      })),
    ],
    footer: {
      text: "⭕ が付いている場合、通知が送信されます",
    },
  },
});
