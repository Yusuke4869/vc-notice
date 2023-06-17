import type { GuildMember } from "discord.js";

import { db } from "../index";
import type { Guild, Member } from "../types";

export const addJoinedAt = async (member: GuildMember, joinedAt: number, guildData: Guild) => {
  try {
    const memberData = guildData.members.find((v) => v.id === member.id);
    const newMemberData: Member = {
      name: member.displayName,
      id: member.id,
      joinedAt: joinedAt,
      totalTime: memberData?.totalTime ?? 0,
    };

    const otherMembersData = guildData.members.filter((v) => v.id !== member.id);
    const newGuildData: Guild = {
      name: member.guild.name,
      id: member.guild.id,
      lang: guildData.lang,
      webhookUrl: guildData.webhookUrl,
      members: [...otherMembersData, newMemberData],
    };

    const res = await db.updateGuildData(member.guild.id, newGuildData);
    return res;
  } catch (e) {
    console.error(e);
  }
};

export const addTotalTime = async (member: GuildMember, passedTime: number, guildData: Guild) => {
  try {
    const memberData = guildData.members.find((v) => v.id === member.id);
    const newMemberData: Member = {
      name: member.displayName,
      id: member.id,
      joinedAt: null,
      totalTime: (memberData?.totalTime ?? 0) + passedTime,
    };

    const otherMembersData = guildData.members.filter((v) => v.id !== member.id);
    const newGuildData: Guild = {
      name: member.guild.name,
      id: member.guild.id,
      lang: guildData.lang,
      webhookUrl: guildData.webhookUrl,
      members: [...otherMembersData, newMemberData],
    };

    const res = await db.updateGuildData(member.guild.id, newGuildData);
    return res;
  } catch (e) {
    console.error(e);
  }
};
