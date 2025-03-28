/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * VCでのアクション
 *
 * {@link VCAction} - アクションの型
 */
export const vcAction = {
  // 入室
  /**
   * ボイスチャンネルに入室した
   */
  JoinChannel: "join-channel",
  /**
   * ボイスチャンネルを移動した
   */
  MoveChannel: "move-channel",
  /**
   * AFKチャンネルに入室した
   */
  JoinAfkChannel: "join-afk-channel",

  // 退室
  /**
   * ボイスチャンネルから退室した
   */
  LeaveChannel: "leave-channel",

  // 配信
  /**
   * 画面共有を開始した
   */
  StartStreaming: "start-streaming",
  /**
   * 画面共有を終了した
   */
  EndStreaming: "end-streaming",

  // ビデオ
  /**
   * ビデオを開始した
   */
  StartVideo: "start-video",
  /**
   * ビデオを終了した
   */
  EndVideo: "end-video",

  // ミュート
  /**
   * セルフミュートにした
   */
  StartSelfMute: "start-self-mute",
  /**
   * セルフミュートを解除した
   */
  EndSelfMute: "end-self-mute",
  /**
   * サーバーミュートにされた
   */
  StartServerMute: "start-server-mute",
  /**
   * サーバーミュートを解除された
   */
  EndServerMute: "end-server-mute",

  // スピーカーミュート
  /**
   * セルフスピーカーミュートにした
   */
  StartSelfDeaf: "start-self-deaf",
  /**
   * セルフスピーカーミュートを解除した
   */
  EndSelfDeaf: "end-self-deaf",
  /**
   * サーバースピーカーミュートにされた
   */
  StartServerDeaf: "start-server-deaf",
  /**
   * サーバースピーカーミュートを解除された
   */
  EndServerDeaf: "end-server-deaf",
} as const;

const {
  // ミュート
  StartSelfMute,
  EndSelfMute,
  StartServerMute,
  EndServerMute,

  // スピーカーミュート
  StartSelfDeaf,
  EndSelfDeaf,
  StartServerDeaf,
  EndServerDeaf,

  // その他
  ...otherVCActions
} = vcAction;

/**
 * 通知可能なVCアクション
 *
 * {@link NotifiableVCAction} - 通知可能なアクションの型
 */
export const notifiableVCAction = otherVCActions;

/**
 * VCでのアクションの型
 *
 * それぞれの型がどのアクションなのかは {@link vcAction} を参照
 */
export type VCAction = (typeof vcAction)[keyof typeof vcAction];

/**
 * 通知可能なVCアクションの型
 *
 * それぞれの型がどのアクションなのかは {@link notifiableVCAction} を参照
 */
export type NotifiableVCAction = (typeof notifiableVCAction)[keyof typeof notifiableVCAction];

export const isNotifiableVCActions = (vcAction: VCAction): vcAction is NotifiableVCAction =>
  Object.values(notifiableVCAction).includes(vcAction as NotifiableVCAction);
