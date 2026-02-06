import type { EmbedContents } from "../../../types";

export const setNoticeEmbed = (
  mode: "all" | "join-only" | "join-leave" | "stream-video" | undefined
): EmbedContents => {
  const { en, ja } = (() => {
    switch (mode) {
      case "join-only":
        return {
          en: "Join only",
          ja: "入室のみ",
        };
      case "join-leave":
        return {
          en: "Join/Leave",
          ja: "入室・退室",
        };
      case "stream-video":
        return {
          en: "Streaming/Video only",
          ja: "配信・ビデオのみ",
        };
      default:
        return {
          en: "All activities",
          ja: "すべてのアクティビティ",
        };
    }
  })() satisfies { en: string; ja: string };

  return {
    en: {
      title: "Set the activity to notify",
      fields: [
        {
          name: mode === "join-only" ? "Activity" : "Activities",
          value: en,
        },
      ],
    },
    ja: {
      title: "通知するアクティビティを設定しました",
      fields: [
        {
          name: "アクティビティ",
          value: ja,
        },
      ],
    },
  };
};
