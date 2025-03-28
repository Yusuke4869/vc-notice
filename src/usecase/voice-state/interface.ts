import type { GuildDomain } from "../../domain/guild/interface";
import type { NotifiableVCAction, VCAction } from "../../type/vc-action";
import type { VoiceState } from "discord.js";

export interface VoiceStateUseCaseInterface {
  /**
   * VCAction を取得する
   */
  getVCAction(oldVoiceState: VoiceState, newVoiceState: VoiceState): VCAction | null;
  /**
   * 取得した VCAction を NotifiableVCAction として取得する
   *
   * このメソッドで null が返された場合は通知を行わないこと
   */
  getNotifiableVCAction(
    action: VCAction,
    oldVoiceState: VoiceState,
    newVoiceState: VoiceState,
    guild: GuildDomain
  ): NotifiableVCAction | null;
  getDate(): Date;
  getElapsedTime(guild: GuildDomain, newVoiceState: VoiceState, now: Date): number | null;
  updateJoinedAt(guild: GuildDomain, voiceState: VoiceState, joinedAt: Date | null): Promise<GuildDomain>;
  // TODO: joinedAtも更新したい（method名変更）
  updateTotalTime(guild: GuildDomain, voiceState: VoiceState, elapsedTime: number): Promise<GuildDomain>;
}
