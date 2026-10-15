import { TimestampStyles, channelMention, time, userMention } from "discord.js";

import { calcTime } from "../utils";

import type { EmbedContents, NoticeEmbedText, TLanguage, voiceChannelActivityType } from "../types";
import type { EmbedFooterOptions, GuildMember, VoiceBasedChannel } from "discord.js";

const noticeText = (channel: VoiceBasedChannel): NoticeEmbedText => ({
  en: {
    title: {
      joined: "Connected to a Voice Channel",
      left: "Disconnected from a Voice Channel",
      startedStreaming: "Started Streaming",
      stoppedStreaming: "Stopped Streaming",
      turnedOnVideo: "Turned On Video",
      turnedOffVideo: "Turned Off Video",
      joinedAFK: "Sent to the AFK Channel",
    },
    description: {
      joined: `Joined ${channelMention(channel.id)}`,
      left: `Left ${channelMention(channel.id)}`,
      startedStreaming: "Let's watch the stream together!",
      stoppedStreaming: "Please stream again later!",
      turnedOnVideo: "Let's watch the video!",
      turnedOffVideo: "Please turn on your video again sometime!",
      joinedAFK: "I can't hear you!",
    },
    footer: {
      callTime: "Call Time:",
    },
    color: {
      joined: "#008000",
      left: "#ff0000",
      startedStreaming: "#008000",
      stoppedStreaming: "#ff0000",
      turnedOnVideo: "#008000",
      turnedOffVideo: "#ff0000",
      joinedAFK: "#000000",
    },
  },
  ja: {
    title: {
      joined: "VCに接続しました",
      left: "VCから切断しました",
      startedStreaming: "配信を開始しました",
      stoppedStreaming: "配信を終了しました",
      turnedOnVideo: "ビデオを開始しました",
      turnedOffVideo: "ビデオを終了しました",
      joinedAFK: "AFKに飛ばされました",
    },
    description: {
      joined: `${channelMention(channel.id)} に参加しました`,
      left: `${channelMention(channel.id)} から退出しました`,
      startedStreaming: "みんなで見よう！",
      stoppedStreaming: "またやってね！",
      turnedOnVideo: "ビデオを見よう！",
      turnedOffVideo: "またやってね！",
      joinedAFK: "あなたの声は聞こえないよ",
    },
    footer: {
      callTime: "通話時間:",
    },
    color: {
      joined: "#008000",
      left: "#ff0000",
      startedStreaming: "#008000",
      stoppedStreaming: "#ff0000",
      turnedOnVideo: "#008000",
      turnedOffVideo: "#ff0000",
      joinedAFK: "#000000",
    },
  },
});

const generateFooter = (
  text: NoticeEmbedText,
  activityType: voiceChannelActivityType,
  passedTime?: number
): Record<TLanguage, EmbedFooterOptions> | null => {
  if (!passedTime) return null;
  if (activityType !== "left" && activityType !== "joinedAFK") return null;

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
  passedTime?: number
): EmbedContents => {
  const memberMention = member ? userMention(member.id) : "member";
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
          name: "",
          value: memberMention,
        },
        {
          name: "",
          value: `${text.en.description[activityType]}\n\n${time(new Date(), TimestampStyles.FullDateShortTime)}`,
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
          name: "",
          value: memberMention,
        },
        {
          name: "",
          value: `${text.ja.description[activityType]}\n\n${time(new Date(), TimestampStyles.FullDateShortTime)}`,
        },
      ],
    },
  } satisfies EmbedContents;
};
