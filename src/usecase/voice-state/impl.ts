import { PermissionFlagsBits } from "discord.js";

import { noticeOption } from "../../type/notice-option";
import { isNotifiableVCActions, vcAction } from "../../type/vc-action";

import type { VoiceStateUseCaseInterface } from "./interface";
import type { Guild } from "../../domain/guild/impl";
import type { MemberField } from "../../domain/guild/interface";
import type { GuildRepositoryInterface } from "../../repository/guild/interface";
import type { NotifiableVCAction, VCAction } from "../../type/vc-action";
import type { Client, GuildMember, VoiceState } from "discord.js";

export class VoiceStateUseCase implements VoiceStateUseCaseInterface {
  constructor(
    private readonly client: Client,
    private readonly guildRepository: GuildRepositoryInterface
  ) {}

  public getVCAction(oldVoiceState: VoiceState, newVoiceState: VoiceState): VCAction | null {
    // 入室
    if (!oldVoiceState.channel) return vcAction.JoinChannel;
    // 退室
    else if (!newVoiceState.channel) return vcAction.LeaveChannel;
    // 前後のチャンネルが同じ
    else if (oldVoiceState.channelId === newVoiceState.channelId) {
      // 配信ステータスが異なるとき
      if (oldVoiceState.streaming !== newVoiceState.streaming) {
        // 配信開始
        if (!oldVoiceState.streaming && newVoiceState.streaming) return vcAction.StartStreaming;
        // 配信終了
        else if (oldVoiceState.streaming && !newVoiceState.streaming) return vcAction.EndStreaming;
      }

      // ビデオステータスが異なるとき
      if (oldVoiceState.selfVideo !== newVoiceState.selfVideo) {
        // ビデオ開始
        if (!oldVoiceState.selfVideo && newVoiceState.selfVideo) return vcAction.StartVideo;
        // ビデオ終了
        else if (oldVoiceState.selfVideo && !newVoiceState.selfVideo) return vcAction.EndVideo;
      }

      // セルフミュートステータスが異なるとき
      if (oldVoiceState.selfMute !== newVoiceState.selfMute) {
        // セルフミュート開始
        if (!oldVoiceState.selfMute && newVoiceState.selfMute) return vcAction.StartSelfMute;
        // セルフミュート終了
        else if (oldVoiceState.selfMute && !newVoiceState.selfMute) return vcAction.EndSelfMute;
      }

      // サーバーミュートステータスが異なるとき
      if (oldVoiceState.serverMute !== newVoiceState.serverMute) {
        // サーバーミュート開始
        if (!oldVoiceState.serverMute && newVoiceState.serverMute) return vcAction.StartServerMute;
        // サーバーミュート終了
        else if (oldVoiceState.serverMute && !newVoiceState.serverMute) return vcAction.EndServerMute;
      }

      // セルフスピーカーミュートステータスが異なるとき
      if (oldVoiceState.selfDeaf !== newVoiceState.selfDeaf) {
        // セルフスピーカーミュート開始
        if (!oldVoiceState.selfDeaf && newVoiceState.selfDeaf) return vcAction.StartSelfDeaf;
        // セルフスピーカーミュート終了
        else if (oldVoiceState.selfDeaf && !newVoiceState.selfDeaf) return vcAction.EndSelfDeaf;
      }

      // サーバースピーカーミュートステータスが異なるとき
      if (oldVoiceState.serverDeaf !== newVoiceState.serverDeaf) {
        // サーバースピーカーミュート開始
        if (!oldVoiceState.serverDeaf && newVoiceState.serverDeaf) return vcAction.StartServerDeaf;
        // サーバースピーカーミュート終了
        else if (oldVoiceState.serverDeaf && !newVoiceState.serverDeaf) return vcAction.EndServerDeaf;
      }
    }
    // 前後のチャンネルが異なるとき
    else if (oldVoiceState.channelId !== newVoiceState.channelId) {
      // AFKチャンネル参加
      if (newVoiceState.channelId === newVoiceState.guild.afkChannelId) return vcAction.JoinAfkChannel;
      // チャンネル移動
      else return vcAction.MoveChannel;
    }

    return null;
  }

  public getNotifiableVCAction(
    action: VCAction,
    oldVoiceState: VoiceState,
    newVoiceState: VoiceState,
    guild: Guild
  ): NotifiableVCAction | null {
    // 通知対象外
    if (!isNotifiableVCActions(action)) return null;

    // BOTユーザー
    if (newVoiceState.member?.user.bot && guild.botDisabled) return null;

    // 接続権限
    if (!this.client.user) return null;
    if (action === vcAction.LeaveChannel) {
      if (!oldVoiceState.channel?.permissionsFor(this.client.user)?.has(PermissionFlagsBits.Connect)) {
        return null;
      }
    } else if (!newVoiceState.channel?.permissionsFor(this.client.user)?.has(PermissionFlagsBits.Connect)) {
      return null;
    }

    // 通知モード
    if (guild.noticeMode === noticeOption.JoinOnly) {
      if (action === vcAction.JoinChannel || action === vcAction.MoveChannel || action === vcAction.JoinAfkChannel)
        return action;

      return null;
    } else if (guild.noticeMode === noticeOption.JoinLeave) {
      if (
        action === vcAction.JoinChannel ||
        action === vcAction.MoveChannel ||
        action === vcAction.JoinAfkChannel ||
        action === vcAction.LeaveChannel
      )
        return action;

      return null;
    }

    return action;
  }

  public getDate(): Date {
    return new Date();
  }

  public getElapsedTime(guild: Guild, newVoiceState: VoiceState, now: Date): number | null {
    const member = guild.members.find((m) => m.id === newVoiceState.member?.id);
    if (!member?.joinedAt) return null;

    const elapsedTime = Math.floor(now.getTime() / 1000) - member.joinedAt;
    return elapsedTime;
  }

  private getMemberField(memberField: MemberField | undefined, member: GuildMember): MemberField {
    return {
      name: member.displayName,
      id: member.id,
      joinedAt: memberField?.joinedAt ?? null,
      totalTime: memberField?.totalTime ?? 0,
    };
  }

  public async updateJoinedAt(guild: Guild, voiceState: VoiceState, joinedAt: Date | null): Promise<Guild> {
    const member = voiceState.member;
    if (!member) return guild;

    const memberField = guild.members.find((m) => m.id === member.id);
    const updatedMemberField = this.getMemberField(memberField, member);

    const r = this.guildRepository.updateGuild(guild, { name: member.guild.name }, [
      { ...updatedMemberField, joinedAt: joinedAt ? Math.floor(joinedAt.getTime() / 1000) : null },
    ]);
    return r;
  }

  public async updateTotalTime(guild: Guild, voiceState: VoiceState, elapsedTime: number): Promise<Guild> {
    const member = voiceState.member;
    if (!member) return guild;

    const memberField = guild.members.find((m) => m.id === member.id);
    const updatedMemberField = this.getMemberField(memberField, member);

    const r = this.guildRepository.updateGuild(guild, { name: member.guild.name }, [
      { ...updatedMemberField, totalTime: updatedMemberField.totalTime + elapsedTime },
    ]);
    return r;
  }
}
