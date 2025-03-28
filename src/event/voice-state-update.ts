import { vcActionEmbed } from "../embed/vc-action";
import { vcAction } from "../type/vc-action";
import { buildEmbed } from "../util/embed";

import type { Guild } from "../domain/guild/impl";
import type { VCAction } from "../type/vc-action";
import type { GuildUseCaseInterface } from "../usecase/guild/interface";
import type { VoiceStateUseCaseInterface } from "../usecase/voice-state/interface";
import type { WebhookUseCaseInterface } from "../usecase/webhook/interface";
import type { VoiceState, VoiceBasedChannel, GuildMember } from "discord.js";

export class VoiceStateUpdate {
  constructor(
    private readonly guildUseCase: GuildUseCaseInterface,
    private readonly webhookUseCase: WebhookUseCaseInterface,
    private readonly voiceStateUseCase: VoiceStateUseCaseInterface
  ) {}

  public async on(oldVoiceState: VoiceState, newVoiceState: VoiceState): Promise<void> {
    const guild = await this.guildUseCase.findGuild(newVoiceState.guild.id);

    if (!guild) {
      console.log(`guild data is not found: ${newVoiceState.guild.id}`);
      return;
    }

    const action = this.voiceStateUseCase.getVCAction(oldVoiceState, newVoiceState);
    if (!action) return;

    // 通話記録の更新
    const now = this.voiceStateUseCase.getDate();
    await this.updateMemberRecord(action, guild, newVoiceState, now);

    if (!guild.webhookUrl) return;
    const notifiableVCAction = this.voiceStateUseCase.getNotifiableVCAction(
      action,
      oldVoiceState,
      newVoiceState,
      guild
    );
    if (!notifiableVCAction) return;

    // 通知
    const channel = this.getVoiceBasedChannel(oldVoiceState, newVoiceState);
    const member = this.getGuildMember(oldVoiceState, newVoiceState);
    if (!channel || !member) return;

    const elapsedTime =
      action === vcAction.LeaveChannel || action === vcAction.JoinAfkChannel
        ? this.voiceStateUseCase.getElapsedTime(guild, newVoiceState, now)
        : null;

    // TODO: 入室メンション
    await this.webhookUseCase.send(
      guild.webhookUrl,
      buildEmbed(
        vcActionEmbed(notifiableVCAction, channel, member, elapsedTime ?? undefined),
        newVoiceState.guild.preferredLocale,
        guild.language
      ),
      guild.joinMention
    );
  }

  private async updateMemberRecord(action: VCAction, guild: Guild, voiceState: VoiceState, now: Date): Promise<void> {
    try {
      if (action === vcAction.JoinChannel) {
        await this.voiceStateUseCase.updateJoinedAt(guild, voiceState, now);
      }
      // 退室だけでなく、AFKチャンネルに移動した場合も通話時間を更新する
      else if (action === vcAction.LeaveChannel || action === vcAction.JoinAfkChannel) {
        const elapsedTime = this.voiceStateUseCase.getElapsedTime(guild, voiceState, now);

        if (elapsedTime) {
          await this.voiceStateUseCase.updateTotalTime(guild, voiceState, elapsedTime);
        }
        // 通話時間が取得できなかった場合は joinedAt を null にする処理のみ行う
        else {
          await this.voiceStateUseCase.updateJoinedAt(guild, voiceState, null);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  private getVoiceBasedChannel(oldVoiceState: VoiceState, newVoiceState: VoiceState): VoiceBasedChannel | null {
    if (newVoiceState.channel) return newVoiceState.channel;
    if (oldVoiceState.channel) return oldVoiceState.channel;

    return null;
  }

  private getGuildMember(oldVoiceState: VoiceState, newVoiceState: VoiceState): GuildMember | null {
    if (newVoiceState.member) return newVoiceState.member;
    if (oldVoiceState.member) return oldVoiceState.member;

    return null;
  }
}
