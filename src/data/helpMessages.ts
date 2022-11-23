export const createHelpMessages = (prefix: string) => ({
  help: {
    en: {
      title: "Help",
      description: "main commands of this bot",
      details: [
        {
          name: `${prefix}help`,
          value: "display this help",
        },
        {
          name: `${prefix}overview`,
          value: "display overview of this bot",
        },
        {
          name: `${prefix}set`,
          value: "display help of settings",
        },
      ],
    },
    ja: {
      title: "ヘルプ",
      description: "主要コマンド一覧",
      details: [
        {
          name: `${prefix}help`,
          value: "Helpを表示します",
        },
        {
          name: `${prefix}overview`,
          value: "このbotの概要を表示します",
        },
        {
          name: `${prefix}set`,
          value: "設定のヘルプを表示します",
        },
      ],
    },
  },
  overview: {
    en: {
      title: "Overview",
      description: null,
      details: [
        {
          name: "What is this bot?",
          value: "This bot notify your activity in voice channels",
        },
      ],
    },
    ja: {
      title: "概要",
      description: null,
      details: [
        {
          name: "このBotについて",
          value: "このBotは音声チャンネルでの活動をお知らせします",
        },
      ],
    },
  },
  settings: {
    en: {
      title: "Settings Help",
      description: "argument is []",
      details: [
        {
          name: `${prefix}set language [language]`,
          value: "change language of your server (English or Japanese only)",
        },
        {
          name: `${prefix}set channel`,
          value: "set notice channel",
        },
      ],
    },
    ja: {
      title: "設定ヘルプ",
      description: "[] は引数です",
      details: [
        {
          name: `${prefix}set language [language]`,
          value: "あなたのサーバーでの言語を変更します (英語 または 日本語 のみ)",
        },
        {
          name: `${prefix}set channel`,
          value: "通知チャンネルを設定します",
        },
      ],
    },
  },
});
