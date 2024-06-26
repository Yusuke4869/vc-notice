import { EmbedFooterOptions, GuildMember, TimestampStyles, VoiceBasedChannel, channelMention, time } from "discord.js";

import type { EmbedContents, NoticeEmbedText, TLanguage, voiceChannelActivityType } from "../types";
import { calcTime } from "../utils";

const noticeText = (channel: VoiceBasedChannel): NoticeEmbedText => ({
  en: {
    title: {
      joined: "Connected Voice Channel",
      leaved: "Disconnected Voice Channel",
      startedStreaming: "Started Streaming",
      endedStreaming: "Ended Streaming",
      startedVideo: "Started Video",
      endedVideo: "Ended Video",
      joinedAFK: "Connected AFK Channel",
    },
    description: {
      joined: `Joined ${channelMention(channel.id)}`,
      leaved: `Leaved ${channelMention(channel.id)}`,
      startedStreaming: "Let's watch the streaming together!",
      endedStreaming: "Please stream again later!",
      startedVideo: "Let's watch the video!",
      endedVideo: "Please video again!",
      joinedAFK: "Your voice hasn't been heard",
    },
    footer: {
      callTime: "Call Time:",
    },
    color: {
      joined: "#008000",
      leaved: "#ff0000",
      startedStreaming: "#008000",
      endedStreaming: "#ff0000",
      startedVideo: "#008000",
      endedVideo: "#ff0000",
      joinedAFK: "#000000",
    },
  },
  ja: {
    title: {
      joined: "VCに接続しました",
      leaved: "VCから切断しました",
      startedStreaming: "配信を開始しました",
      endedStreaming: "配信を終了しました",
      startedVideo: "ビデオを開始しました",
      endedVideo: "ビデオを終了しました",
      joinedAFK: "AFKに飛ばされました",
    },
    description: {
      joined: `${channelMention(channel.id)} に参加しました`,
      leaved: `${channelMention(channel.id)} から退出しました`,
      startedStreaming: "みんなで見よう！",
      endedStreaming: "またやってね！",
      startedVideo: "ビデオを見よう！",
      endedVideo: "またやってね！",
      joinedAFK: "あなたの声は聞こえないよ",
    },
    footer: {
      callTime: "通話時間:",
    },
    color: {
      joined: "#008000",
      leaved: "#ff0000",
      startedStreaming: "#008000",
      endedStreaming: "#ff0000",
      startedVideo: "#008000",
      endedVideo: "#ff0000",
      joinedAFK: "#000000",
    },
  },
});

const generateFooter = (
  text: NoticeEmbedText,
  activityType: voiceChannelActivityType,
  passedTime?: number,
): Record<TLanguage, EmbedFooterOptions> | null => {
  if (!passedTime) return null;
  if (activityType !== "leaved" && activityType !== "joinedAFK") return null;

  const t = calcTime(passedTime);
  return {
    en: {
      text: `${text.en.footer.callTime} ${t}`,
    },
    ja: {
      text: `${text.ja.footer.callTime} ${t}`,
    },
  };
};

export const vcEmbed = (
  member: GuildMember | null,
  channel: VoiceBasedChannel,
  activityType: voiceChannelActivityType,
  passedTime?: number,
): EmbedContents => {
  const text = noticeText(channel);
  const footerText = generateFooter(text, activityType, passedTime);

  return {
    en: {
      title: text.en.title[activityType],
      color: text.en.color[activityType],
      thumbnail: member?.displayAvatarURL() ?? null,
      footer: footerText?.en,
      fields: [
        {
          name: member?.displayName ?? "member",
          value: `${text.en.description[activityType]}\n\n${time(new Date(), TimestampStyles.LongDateTime)}`,
        },
      ],
    },
    ja: {
      title: text.ja.title[activityType],
      color: text.ja.color[activityType],
      thumbnail: member?.displayAvatarURL() ?? null,
      footer: footerText?.ja,
      fields: [
        {
          name: member?.displayName ?? "member",
          value: `${text.ja.description[activityType]}\n\n${time(new Date(), TimestampStyles.LongDateTime)}`,
        },
      ],
    },
  };
};
