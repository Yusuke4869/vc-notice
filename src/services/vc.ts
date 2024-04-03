import type { Client, GuildMember, VoiceState } from "discord.js";

import { vcEmbed } from "../embed/vc";
import { getGuildData, upsertGuildData } from "../repositories/guild";
import type { Guild, Member } from "../types";
import { buildEmbed } from "../utils";
import { sendWebhook } from "./webhook";

const addJoinedAt = async (guildData: Guild, member: GuildMember, joinedAt: number): Promise<boolean> => {
  try {
    const memberData = guildData.members.find((v) => v.id === member.id);
    const otherMembersData = guildData.members.filter((v) => v.id !== member.id);
    const newMemberData: Member = {
      name: member.displayName,
      id: member.id,
      joinedAt: joinedAt,
      totalTime: memberData?.totalTime ?? 0,
    };

    const res = await upsertGuildData({
      name: member.guild.name,
      id: member.guild.id,
      lang: guildData.lang,
      webhookUrl: guildData.webhookUrl,
      members: [...otherMembersData, newMemberData],
    });
    return res;
  } catch (e) {
    console.error(e);
    return false;
  }
};

const addTotalTime = async (guildData: Guild, member: GuildMember, passedTime: number): Promise<boolean> => {
  try {
    const memberData = guildData.members.find((v) => v.id === member.id);
    const otherMembersData = guildData.members.filter((v) => v.id !== member.id);
    const newMemberData: Member = {
      name: member.displayName,
      id: member.id,
      joinedAt: null,
      totalTime: (memberData?.totalTime ?? 0) + passedTime,
    };

    const res = await upsertGuildData({
      name: member.guild.name,
      id: member.guild.id,
      lang: guildData.lang,
      webhookUrl: guildData.webhookUrl,
      members: [...otherMembersData, newMemberData],
    });
    return res;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const voiceActivity = async (client: Client, oldVoiceState: VoiceState, newVoiceState: VoiceState) => {
  const guildData = await getGuildData(newVoiceState.guild.id);
  if (!guildData) {
    console.log(`Not Found GuildData: ${newVoiceState.guild.id}`);
    return;
  }

  const webhookurl = guildData.webhookUrl;
  const unixtime = Math.floor(new Date().getTime() / 1000);
  let isLeaved = false;

  const memberData = guildData?.members.find((v) => v.id === newVoiceState.member?.id);
  const joinedAt = memberData?.joinedAt;
  const passedTime = joinedAt ? unixtime - joinedAt : 0;

  // 参加
  if (!oldVoiceState.channel && newVoiceState.channel) {
    await sendWebhook(
      client,
      webhookurl,
      buildEmbed(
        vcEmbed(newVoiceState.member, newVoiceState.channel, "joined", passedTime),
        newVoiceState.guild.preferredLocale,
        guildData.lang,
      ),
    );
    newVoiceState.member && (await addJoinedAt(guildData, newVoiceState.member, unixtime));
  }
  // 退出
  else if (oldVoiceState.channel && !newVoiceState.channel) {
    await sendWebhook(
      client,
      webhookurl,
      buildEmbed(
        vcEmbed(newVoiceState.member, oldVoiceState.channel, "leaved", passedTime),
        newVoiceState.guild.preferredLocale,
        guildData.lang,
      ),
    );
    isLeaved = true;
  }
  // 前後のチャンネルが同じ
  else if (oldVoiceState.channelId === newVoiceState.channelId && newVoiceState.channel) {
    // 配信ステータスが異なるとき
    if (oldVoiceState.streaming !== newVoiceState.streaming) {
      // 配信開始
      if (!oldVoiceState.streaming && newVoiceState.streaming) {
        await sendWebhook(
          client,
          webhookurl,
          buildEmbed(
            vcEmbed(newVoiceState.member, newVoiceState.channel, "startedStreaming", passedTime),
            newVoiceState.guild.preferredLocale,
            guildData.lang,
          ),
        );
      }
      // 配信終了
      else if (oldVoiceState.streaming && !newVoiceState.streaming) {
        await sendWebhook(
          client,
          webhookurl,
          buildEmbed(
            vcEmbed(newVoiceState.member, newVoiceState.channel, "endedStreaming", passedTime),
            newVoiceState.guild.preferredLocale,
            guildData.lang,
          ),
        );
      }
    }
    // ビデオステータスが異なるとき
    if (oldVoiceState.selfVideo !== newVoiceState.selfVideo) {
      // ビデオ開始
      if (!oldVoiceState.selfVideo && newVoiceState.selfVideo)
        await sendWebhook(
          client,
          webhookurl,
          buildEmbed(
            vcEmbed(newVoiceState.member, newVoiceState.channel, "startedVideo", passedTime),
            newVoiceState.guild.preferredLocale,
            guildData.lang,
          ),
        );
      // ビデオ終了
      else if (oldVoiceState.selfVideo && !newVoiceState.selfVideo)
        await sendWebhook(
          client,
          webhookurl,
          buildEmbed(
            vcEmbed(newVoiceState.member, newVoiceState.channel, "endedVideo", passedTime),
            newVoiceState.guild.preferredLocale,
            guildData.lang,
          ),
        );
    }
  }
  // 前後のチャンネルが異なるとき
  else if (oldVoiceState.channelId !== newVoiceState.channelId && newVoiceState.channel) {
    // AFKチャンネル参加
    if (newVoiceState.channelId === newVoiceState.guild.afkChannelId) {
      await sendWebhook(
        client,
        webhookurl,
        buildEmbed(
          vcEmbed(newVoiceState.member, newVoiceState.channel, "joinedAFK", passedTime),
          newVoiceState.guild.preferredLocale,
          guildData.lang,
        ),
      );
      isLeaved = true;
    }
    // チャンネル移動
    else {
      await sendWebhook(
        client,
        webhookurl,
        buildEmbed(
          vcEmbed(newVoiceState.member, newVoiceState.channel, "joined", passedTime),
          newVoiceState.guild.preferredLocale,
          guildData.lang,
        ),
      );
    }
  }

  if (isLeaved && newVoiceState.member) await addTotalTime(guildData, newVoiceState.member, passedTime);
};
