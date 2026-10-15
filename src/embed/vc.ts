import {
  ContainerBuilder,
  SectionBuilder,
  TextDisplayBuilder,
  ThumbnailBuilder,
  TimestampStyles,
  channelMention,
  resolveColor,
  time,
  userMention,
} from "discord.js";

import { calcTime } from "../utils";

import type { NoticeEmbedText, TLanguage, voiceChannelActivityType } from "../types";
import type { GuildMember, VoiceBasedChannel } from "discord.js";

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

export const vcComponents = (
  member: GuildMember | null,
  channel: VoiceBasedChannel,
  activityType: voiceChannelActivityType,
  language: TLanguage,
  passedTime?: number
): ContainerBuilder => {
  const text = noticeText(channel)[language];
  const heading = new TextDisplayBuilder().setContent(`### ${text.title[activityType]}`);
  const container = new ContainerBuilder().setAccentColor(resolveColor(text.color[activityType]));
  const body = new TextDisplayBuilder().setContent(
    `${text.description[activityType]}\n\n${time(new Date(), TimestampStyles.FullDateShortTime)}`
  );

  if (member) {
    container.addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(heading, new TextDisplayBuilder().setContent(userMention(member.id)), body)
        .setThumbnailAccessory(new ThumbnailBuilder().setURL(member.displayAvatarURL()))
    );
  } else {
    container.addTextDisplayComponents(heading, body);
  }

  if (passedTime && (activityType === "left" || activityType === "joinedAFK")) {
    container.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`-# ${text.footer.callTime} ${calcTime(passedTime)}`)
    );
  }

  return container;
};
