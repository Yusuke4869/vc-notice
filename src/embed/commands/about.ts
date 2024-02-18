import type { EmbedContents } from "../../types";

export const aboutEmbed = (): EmbedContents => ({
  en: {
    title: "About me",
    fields: [
      {
        name: "What is this bot?",
        value: "Notify activities such as joining and leaving VC",
      },
      {
        name: "Commands",
        value: "You can show the command list with /help",
      },
    ],
  },
  ja: {
    title: "このBotについて",
    fields: [
      {
        name: "何をするBot？",
        value: "VCの入退室といったアクティビティをお知らせします",
      },
      {
        name: "コマンド",
        value: "/help でコマンド一覧を表示できます",
      },
    ],
  },
});
