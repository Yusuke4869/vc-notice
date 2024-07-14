import type { EmbedContents } from "../../types";

export const helpEmbed = (hasManageGuild: boolean): EmbedContents => {
  const res: EmbedContents = {
    en: {
      title: "Help",
      description: "List of major commands",
      fields: [
        {
          name: "`/ping`",
          value: "replies with pong!",
        },
        {
          name: "`/about`",
          value: "show about this bot",
        },
      ],
    },
    ja: {
      title: "ヘルプ",
      description: "主要コマンド一覧",
      fields: [
        {
          name: "`/ping`",
          value: "pong! と返します",
        },
        {
          name: "`/about`",
          value: "このBotについて表示します",
        },
      ],
    },
  };

  if (!hasManageGuild) return res;

  res.en.fields?.push({
    name: "/set",
    value: "show about the settings commands",
  });
  res.ja.fields?.push({
    name: "/set",
    value: "設定コマンドについて表示します",
  });
  return res;
};
