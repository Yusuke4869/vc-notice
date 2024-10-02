import type { EmbedContents } from "../../../types";

export const setMentionEmbed = (mention: "@everyone" | `<@&${string}>` | undefined): EmbedContents => ({
  en: {
    title: "Set the mention for joining notification",
    fields: [
      {
        name: "Mention",
        value: mention ?? "Failed to set, Please try again",
      },
    ],
    footer: {
      text: "No mention of moving between voice chats",
    },
  },
  ja: {
    title: "入室通知のメンションを設定しました",
    fields: [
      {
        name: "メンション",
        value: mention ?? "設定に失敗しました、もう一度お試しください",
      },
    ],
    footer: {
      text: "ボイスチャット間の移動ではメンションされません",
    },
  },
});
