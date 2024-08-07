import { addJoinedAt, addTotalTime } from "./time";
import { vcEmbed } from "../../embed/vc";
import { getGuildData } from "../../repositories/guild";
import { buildEmbed } from "../../utils";
import { sendWebhook } from "../webhook";

import type { Client, VoiceState } from "discord.js";

export const voiceActivity = async (client: Client, oldVoiceState: VoiceState, newVoiceState: VoiceState) => {
  const guildData = await getGuildData(newVoiceState.guild.id);
  if (!guildData) {
    console.log(`Not Found GuildData: ${newVoiceState.guild.id}`);
    return;
  }

  const { webhookUrl } = guildData;
  const unixtime = Math.floor(new Date().getTime() / 1000);
  const memberData = guildData.members.find((v) => v.id === newVoiceState.member?.id);
  const joinedAt = memberData?.joinedAt;
  const passedTime = joinedAt ? unixtime - joinedAt : 0;

  // 参加
  if (!oldVoiceState.channel && newVoiceState.channel) {
    await sendWebhook(
      client,
      webhookUrl,
      buildEmbed(
        vcEmbed(newVoiceState.member, newVoiceState.channel, "joined", passedTime),
        newVoiceState.guild.preferredLocale,
        guildData.lang
      )
    );

    if (newVoiceState.member) await addJoinedAt(guildData, newVoiceState.member, unixtime);
  }
  // 退出
  else if (oldVoiceState.channel && !newVoiceState.channel) {
    await sendWebhook(
      client,
      webhookUrl,
      buildEmbed(
        vcEmbed(newVoiceState.member, oldVoiceState.channel, "leaved", passedTime),
        newVoiceState.guild.preferredLocale,
        guildData.lang
      )
    );

    if (newVoiceState.member) await addTotalTime(guildData, newVoiceState.member, passedTime);
  }
  // 前後のチャンネルが同じ
  else if (oldVoiceState.channelId === newVoiceState.channelId && newVoiceState.channel) {
    // 配信ステータスが異なるとき
    if (oldVoiceState.streaming !== newVoiceState.streaming) {
      // 配信開始
      if (!oldVoiceState.streaming && newVoiceState.streaming) {
        await sendWebhook(
          client,
          webhookUrl,
          buildEmbed(
            vcEmbed(newVoiceState.member, newVoiceState.channel, "startedStreaming", passedTime),
            newVoiceState.guild.preferredLocale,
            guildData.lang
          )
        );
      }
      // 配信終了
      else if (oldVoiceState.streaming && !newVoiceState.streaming) {
        await sendWebhook(
          client,
          webhookUrl,
          buildEmbed(
            vcEmbed(newVoiceState.member, newVoiceState.channel, "endedStreaming", passedTime),
            newVoiceState.guild.preferredLocale,
            guildData.lang
          )
        );
      }
    }
    // ビデオステータスが異なるとき
    if (oldVoiceState.selfVideo !== newVoiceState.selfVideo) {
      // ビデオ開始
      if (!oldVoiceState.selfVideo && newVoiceState.selfVideo)
        await sendWebhook(
          client,
          webhookUrl,
          buildEmbed(
            vcEmbed(newVoiceState.member, newVoiceState.channel, "startedVideo", passedTime),
            newVoiceState.guild.preferredLocale,
            guildData.lang
          )
        );
      // ビデオ終了
      else if (oldVoiceState.selfVideo && !newVoiceState.selfVideo)
        await sendWebhook(
          client,
          webhookUrl,
          buildEmbed(
            vcEmbed(newVoiceState.member, newVoiceState.channel, "endedVideo", passedTime),
            newVoiceState.guild.preferredLocale,
            guildData.lang
          )
        );
    }
  }
  // 前後のチャンネルが異なるとき
  else if (oldVoiceState.channelId !== newVoiceState.channelId && newVoiceState.channel) {
    // AFKチャンネル参加
    if (newVoiceState.channelId === newVoiceState.guild.afkChannelId) {
      await sendWebhook(
        client,
        webhookUrl,
        buildEmbed(
          vcEmbed(newVoiceState.member, newVoiceState.channel, "joinedAFK", passedTime),
          newVoiceState.guild.preferredLocale,
          guildData.lang
        )
      );

      if (newVoiceState.member) await addTotalTime(guildData, newVoiceState.member, passedTime);
    }
    // チャンネル移動
    else {
      await sendWebhook(
        client,
        webhookUrl,
        buildEmbed(
          vcEmbed(newVoiceState.member, newVoiceState.channel, "joined", passedTime),
          newVoiceState.guild.preferredLocale,
          guildData.lang
        )
      );
    }
  }
};
