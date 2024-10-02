import type { EmbedContents } from "../../../types";

export const setMentionEmbed = (mention: "@everyone" | `<@&${string}>` | undefined): EmbedContents => ({
  en: {
    title: "Set the mention for joining notification",
    fields: [
      {
        name: "Mention",
        value: mention ?? "Removed the mention",
      },
    ],
    footer: {
      text: "No mention of moving between voice channels",
    },
  },
  ja: {
    title: "入室通知のメンションを設定しました",
    fields: [
      {
        name: "メンション",
        value: mention ?? "メンションを解除しました",
      },
    ],
    footer: {
      text: "ボイスチャンネル間の移動ではメンションされません",
    },
  },
});
