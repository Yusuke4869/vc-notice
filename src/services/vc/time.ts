import { updateGuildMembers } from "../../repositories/guild";

import type { Guild, Member } from "../../types";
import type { GuildMember } from "discord.js";

export const addJoinedAt = async (guildData: Guild, member: GuildMember, joinedAt: number): Promise<boolean> => {
  try {
    const memberData = guildData.members.find((v) => v.id === member.id);
    const otherMembersData = guildData.members.filter((v) => v.id !== member.id);
    const newMemberData: Member = {
      name: member.displayName,
      id: member.id,
      joinedAt: joinedAt,
      totalTime: memberData?.totalTime ?? 0,
    };

    const res = await updateGuildMembers(member.guild.id, member.guild.name, [...otherMembersData, newMemberData]);
    return res;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const addTotalTime = async (guildData: Guild, member: GuildMember, passedTime: number): Promise<boolean> => {
  try {
    const memberData = guildData.members.find((v) => v.id === member.id);
    const otherMembersData = guildData.members.filter((v) => v.id !== member.id);
    const newMemberData: Member = {
      name: member.displayName,
      id: member.id,
      joinedAt: null,
      totalTime: (memberData?.totalTime ?? 0) + passedTime,
    };

    const res = await updateGuildMembers(member.guild.id, member.guild.name, [...otherMembersData, newMemberData]);
    return res;
  } catch (e) {
    console.error(e);
    return false;
  }
};
