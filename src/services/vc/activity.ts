import { addJoinedAt, addTotalTime } from "./time";
import { vcComponents } from "../../embed/vc";
import { getGuildData } from "../../repositories/guild";
import { sendWebhook } from "../webhook";

import type { Client, VoiceState } from "discord.js";

export const voiceActivity = async (client: Client, oldVoiceState: VoiceState, newVoiceState: VoiceState) => {
  const guildData = await getGuildData(newVoiceState.guild.id);
  if (!guildData) {
    console.log(`Not Found GuildData: ${newVoiceState.guild.id}`);
    return;
  }

  if (!client.user) {
    console.error("client.user is undefined");
    return;
  }

  if (newVoiceState.member?.user.bot && guildData.botDisabled) return;

  const { webhookUrl } = guildData;
  const unixtime = Math.floor(new Date().getTime() / 1000);
  const memberData = guildData.members.find((v) => v.id === newVoiceState.member?.id);
  const joinedAt = memberData?.joinedAt;
  const passedTime = joinedAt ? unixtime - joinedAt : 0;

  // 参加
  if (
    !oldVoiceState.channel &&
    newVoiceState.channel?.permissionsFor(client.user)?.has("Connect") &&
    guildData.noticeMode !== "stream-video"
  ) {
    await sendWebhook(
      client,
      newVoiceState.guild,
      webhookUrl,
      vcComponents(newVoiceState.member, newVoiceState.channel, "joined", guildData.lang, passedTime),
      guildData.joinMention
    );

    if (newVoiceState.member) await addJoinedAt(guildData, newVoiceState.member, unixtime);
  }
  // 退出
  else if (
    oldVoiceState.channel?.permissionsFor(client.user)?.has("Connect") &&
    !newVoiceState.channel &&
    guildData.noticeMode !== "join-only" &&
    guildData.noticeMode !== "stream-video"
  ) {
    await sendWebhook(
      client,
      oldVoiceState.guild,
      webhookUrl,
      vcComponents(newVoiceState.member, oldVoiceState.channel, "left", guildData.lang, passedTime)
    );

    if (newVoiceState.member) await addTotalTime(guildData, newVoiceState.member, passedTime);
  }
  // 前後のチャンネルが同じ
  else if (
    oldVoiceState.channelId === newVoiceState.channelId &&
    newVoiceState.channel?.permissionsFor(client.user)?.has("Connect") &&
    guildData.noticeMode !== "join-only" &&
    guildData.noticeMode !== "join-leave"
  ) {
    // 配信ステータスが異なるとき
    if (oldVoiceState.streaming !== newVoiceState.streaming) {
      // 配信開始
      if (!oldVoiceState.streaming && newVoiceState.streaming) {
        await sendWebhook(
          client,
          newVoiceState.guild,
          webhookUrl,
          vcComponents(newVoiceState.member, newVoiceState.channel, "startedStreaming", guildData.lang, passedTime)
        );
      }
      // 配信終了
      else if (oldVoiceState.streaming && !newVoiceState.streaming) {
        await sendWebhook(
          client,
          newVoiceState.guild,
          webhookUrl,
          vcComponents(newVoiceState.member, newVoiceState.channel, "stoppedStreaming", guildData.lang, passedTime)
        );
      }
    }
    // ビデオステータスが異なるとき
    if (oldVoiceState.selfVideo !== newVoiceState.selfVideo) {
      // ビデオ開始
      if (!oldVoiceState.selfVideo && newVoiceState.selfVideo)
        await sendWebhook(
          client,
          newVoiceState.guild,
          webhookUrl,
          vcComponents(newVoiceState.member, newVoiceState.channel, "turnedOnVideo", guildData.lang, passedTime)
        );
      // ビデオ終了
      else if (oldVoiceState.selfVideo && !newVoiceState.selfVideo)
        await sendWebhook(
          client,
          newVoiceState.guild,
          webhookUrl,
          vcComponents(newVoiceState.member, newVoiceState.channel, "turnedOffVideo", guildData.lang, passedTime)
        );
    }
  }
  // 前後のチャンネルが異なるとき
  else if (
    oldVoiceState.channelId !== newVoiceState.channelId &&
    newVoiceState.channel?.permissionsFor(client.user)?.has("Connect") &&
    guildData.noticeMode !== "stream-video"
  ) {
    // AFKチャンネル参加
    if (newVoiceState.channelId === newVoiceState.guild.afkChannelId) {
      await sendWebhook(
        client,
        newVoiceState.guild,
        webhookUrl,
        vcComponents(newVoiceState.member, newVoiceState.channel, "joinedAFK", guildData.lang, passedTime)
      );

      if (newVoiceState.member) await addTotalTime(guildData, newVoiceState.member, passedTime);
    }
    // チャンネル移動
    else {
      await sendWebhook(
        client,
        newVoiceState.guild,
        webhookUrl,
        vcComponents(newVoiceState.member, newVoiceState.channel, "joined", guildData.lang, passedTime)
      );
    }
  }
};
