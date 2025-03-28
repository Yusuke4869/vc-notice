import { TimestampStyles, channelMention, time } from "discord.js";

import { notifiableVCAction } from "../type/vc-action";

import type { EmbedContent } from "../type/embed";
import type { LanguageRecord } from "../type/language";
import type { NotifiableVCAction } from "../type/vc-action";
import type { EmbedFooterOptions, GuildMember, VoiceBasedChannel, ColorResolvable } from "discord.js";

type VCActionEmbedText = LanguageRecord<{
  title: Record<NotifiableVCAction, string>;
  description: Record<NotifiableVCAction, string>;
  color: Record<NotifiableVCAction, ColorResolvable>;
  footer: {
    callTimeText: string;
  };
}>;

const START_COLOR = "#008000" satisfies ColorResolvable;
const END_COLOR = "#FF0000" satisfies ColorResolvable;
const AFK_COLOR = "#000000" satisfies ColorResolvable;

// TODO: 埋め込み内容の見直し（名前は1回でいい）
// embed/ から移動させたい（embedを空にしたい）
const embedText = (channel: VoiceBasedChannel, member: GuildMember): VCActionEmbedText => ({
  en: {
    title: {
      "join-channel": `${member.displayName} joined VC`,
      "move-channel": `${member.displayName} joined VC`,
      "leave-channel": `${member.displayName} leaved VC`,
      "start-streaming": `${member.displayName} started streaming`,
      "end-streaming": `${member.displayName} ended streaming`,
      "start-video": `${member.displayName} started video`,
      "end-video": `${member.displayName} ended video`,
      "join-afk-channel": `${member.displayName} joined AFK`,
    },
    description: {
      "join-channel": `Joined ${channelMention(channel.id)}`,
      "move-channel": `Moved ${channelMention(channel.id)}`,
      "leave-channel": `Leaved ${channelMention(channel.id)}`,
      "start-streaming": "Let's watch the streaming together!",
      "end-streaming": "Please stream again later!",
      "start-video": "Let's watch the video!",
      "end-video": "Please video again!",
      "join-afk-channel": "Your voice hasn't been heard.",
    },
    footer: {
      callTimeText: "Call Time:",
    },
    color: {
      "join-channel": START_COLOR,
      "move-channel": START_COLOR,
      "leave-channel": END_COLOR,
      "start-streaming": START_COLOR,
      "end-streaming": END_COLOR,
      "start-video": START_COLOR,
      "end-video": END_COLOR,
      "join-afk-channel": AFK_COLOR,
    },
  },
  ja: {
    title: {
      "join-channel": `${member.displayName} がVCに参加しました`,
      "move-channel": `${member.displayName} がVCに参加しました`,
      "leave-channel": `${member.displayName} がVCから退出しました`,
      "start-streaming": `${member.displayName} が配信を開始しました`,
      "end-streaming": `${member.displayName} が配信を終了しました`,
      "start-video": `${member.displayName} がビデオを開始しました`,
      "end-video": `${member.displayName} がビデオを終了しました`,
      "join-afk-channel": `${member.displayName} がAFKに飛ばされました`,
    },
    description: {
      "join-channel": `${channelMention(channel.id)} に参加しました`,
      "move-channel": `${channelMention(channel.id)} に移動しました`,
      "leave-channel": `${channelMention(channel.id)} から退出しました`,
      "start-streaming": "みんなで見よう！",
      "end-streaming": "またやってね！",
      "start-video": "ビデオを見よう！",
      "end-video": "またやってね！",
      "join-afk-channel": "あなたの声は聞こえないよ",
    },
    footer: {
      callTimeText: "通話時間:",
    },
    color: {
      "join-channel": START_COLOR,
      "move-channel": START_COLOR,
      "leave-channel": END_COLOR,
      "start-streaming": START_COLOR,
      "end-streaming": END_COLOR,
      "start-video": START_COLOR,
      "end-video": END_COLOR,
      "join-afk-channel": AFK_COLOR,
    },
  },
});

/**
 * hh:mm:ss 形式にフォーマットする
 *
 * @param time - 時間（秒）
 */
const formatTime = (time: number): `${string}:${string}:${string}` => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  const h = hours < 100 ? hours.toString().padStart(2, "0") : hours.toString();
  const m = minutes.toString().padStart(2, "0");
  const s = seconds.toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
};

const generateFooterText = (
  text: VCActionEmbedText,
  action: NotifiableVCAction,
  elapsedTime?: number
): LanguageRecord<EmbedFooterOptions> | null => {
  if (!elapsedTime) return null;
  if (action !== notifiableVCAction.LeaveChannel && action !== notifiableVCAction.JoinAfkChannel) return null;

  const t = formatTime(elapsedTime);
  return {
    en: {
      text: `${text.en.footer.callTimeText} ${t}`,
    },
    ja: {
      text: `${text.ja.footer.callTimeText} ${t}`,
    },
  };
};

export const vcActionEmbed = (
  action: NotifiableVCAction,
  channel: VoiceBasedChannel,
  member: GuildMember,
  elapsedTime?: number
): EmbedContent => {
  const text = embedText(channel, member);
  const footerText = generateFooterText(text, action, elapsedTime);

  return {
    en: {
      title: text.en.title[action],
      color: text.en.color[action],
      thumbnail: member.displayAvatarURL(),
      footer: footerText?.en,
      fields: [
        {
          name: member.displayName,
          value: `${text.en.description[action]}\n\n${time(new Date(), TimestampStyles.LongDateTime)}`,
        },
      ],
    },
    ja: {
      title: text.ja.title[action],
      color: text.ja.color[action],
      thumbnail: member.displayAvatarURL(),
      footer: footerText?.ja,
      fields: [
        {
          name: member.displayName,
          value: `${text.ja.description[action]}\n\n${time(new Date(), TimestampStyles.LongDateTime)}`,
        },
      ],
    },
  };
};
