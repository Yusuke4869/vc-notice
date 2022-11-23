import { EmbedBuilder } from "discord.js";
import type { Client, VoiceState } from "discord.js";

import { createNoticeMessages } from "../data";
import { db } from "../index";
import { send } from "./webhook";

const activityType = createNoticeMessages("");

const embed = (
  state: VoiceState,
  channelName: string,
  t: keyof typeof activityType.en.title,
  lang: keyof typeof activityType,
) => {
  const noticeMessages = createNoticeMessages(channelName)[lang];

  const res = new EmbedBuilder()
    .setTitle(noticeMessages.title[t])
    .addFields([
      {
        name: state.member?.displayName ?? "member",
        value: `${noticeMessages.description[t]}\n\n<t:${Math.floor(new Date().getTime() / 1000)}:F>`,
      },
    ])
    .setThumbnail(state.member?.displayAvatarURL() ?? "")
    .setColor(`#${noticeMessages.color[t]}`);
  return res;
};

export const voiceActivity = async (client: Client, oldVoiceState: VoiceState, newVoiceState: VoiceState) => {
  const guildData = await db.getGuildData(newVoiceState.guild.id);
  const webhookurl = guildData?.webhookurl;

  // 参加
  if (!oldVoiceState.channel && newVoiceState.channel)
    await send(client, webhookurl, embed(newVoiceState, newVoiceState.channel.name, "joined", guildData?.lang ?? "en"));
  // 退出
  else if (oldVoiceState.channel && !newVoiceState.channel)
    await send(client, webhookurl, embed(newVoiceState, oldVoiceState.channel.name, "leaved", guildData?.lang ?? "en"));
  // 前後のチャンネルが同じ
  else if (oldVoiceState.channelId === newVoiceState.channelId) {
    // 配信ステータスが異なるとき
    if (oldVoiceState.streaming !== newVoiceState.streaming) {
      // 配信開始
      if (!oldVoiceState.streaming && newVoiceState.streaming)
        await send(
          client,
          webhookurl,
          embed(newVoiceState, newVoiceState.channel?.name ?? "", "startedStreaming", guildData?.lang ?? "en"),
        );
      // 配信終了
      else if (oldVoiceState.streaming && !newVoiceState.streaming)
        await send(
          client,
          webhookurl,
          embed(newVoiceState, newVoiceState.channel?.name ?? "", "endedStreaming", guildData?.lang ?? "en"),
        );
    }
    // ビデオステータスが異なるとき
    if (oldVoiceState.selfVideo !== newVoiceState.selfVideo) {
      // ビデオ開始
      if (!oldVoiceState.selfVideo && newVoiceState.selfVideo)
        await send(
          client,
          webhookurl,
          embed(newVoiceState, newVoiceState.channel?.name ?? "", "startedVideo", guildData?.lang ?? "en"),
        );
      // ビデオ終了
      else if (oldVoiceState.selfVideo && !newVoiceState.selfVideo)
        await send(
          client,
          webhookurl,
          embed(newVoiceState, newVoiceState.channel?.name ?? "", "endedVideo", guildData?.lang ?? "en"),
        );
    }
  }
  // 前後のチャンネルが異なるとき
  else if (oldVoiceState.channelId !== newVoiceState.channelId && newVoiceState.channel) {
    // AFKチャンネル参加
    if (newVoiceState.channelId === newVoiceState.guild.afkChannelId)
      await send(
        client,
        webhookurl,
        embed(newVoiceState, newVoiceState.channel.name, "joinedAFK", guildData?.lang ?? "en"),
      );
    // チャンネル移動
    else
      await send(
        client,
        webhookurl,
        embed(newVoiceState, newVoiceState.channel.name, "joined", guildData?.lang ?? "en"),
      );
  }
};
