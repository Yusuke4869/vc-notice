// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { notifiableVCAction } from "./vc-action";

/**
 * 通知モード
 *
 * - `All`: 全て通知する
 * - `JoinOnly`: 入室のみ通知する
 * - `JoinLeave`: 入室と退出を通知する
 *
 * {@link NoticeOption} - 通知モードの型
 */
export const noticeOption = {
  /**
   * 全て通知する
   *
   * {@link notifiableVCAction} に含まれるアクションを全て通知する
   */
  All: "all",
  /**
   * 入室のみ通知する
   *
   * 以下のアクションを通知する
   *
   * - {@link notifiableVCAction.JoinChannel}
   * - {@link notifiableVCAction.MoveChannel}
   * - {@link notifiableVCAction.JoinAfkChannel}
   */
  JoinOnly: "join-only",
  /**
   * 入室と退出を通知する
   *
   * 以下のアクションを通知する
   *
   * - {@link notifiableVCAction.JoinChannel}
   * - {@link notifiableVCAction.MoveChannel}
   * - {@link notifiableVCAction.JoinAfkChannel}
   * - {@link notifiableVCAction.LeaveChannel}
   */
  JoinLeave: "join-leave",
} as const;

/**
 * 通知モードの型
 *
 * それぞれの型がどの通知モードなのかは {@link noticeOption} を参照
 */
export type NoticeOption = (typeof noticeOption)[keyof typeof noticeOption];

export const isNoticeOption = (arg: string): arg is NoticeOption =>
  Object.values(noticeOption).includes(arg as NoticeOption);
