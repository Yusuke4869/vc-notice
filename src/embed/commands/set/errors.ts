import type { EmbedContents } from "../../../types";

export const setNotFoundInteractionChannelErrorEmbed = (): EmbedContents => ({
  en: {
    title: "An error occurred!",
    color: "#ff0000",
    fields: [
      {
        name: "Failed to set",
        value: "Channel or server not found",
      },
    ],
    footer: {
      text: "Please try again in the server's text channel",
    },
  },
  ja: {
    title: "エラーが発生しました",
    color: "#ff0000",
    fields: [
      {
        name: "設定に失敗しました",
        value: "チャンネル または サーバーが見つかりませんでした",
      },
    ],
    footer: {
      text: "サーバーのテキストチャンネルでもう一度お試しください",
    },
  },
});

export const noManageWebhooksPermissionErrorEmbed = (): EmbedContents => ({
  en: {
    title: "An error occurred!",
    color: "#ff0000",
    fields: [
      {
        name: "Permission required",
        value: 'You need the "Manage Webhooks" permission in VC Notice',
      },
    ],
    footer: {
      text: "Please grant permission and try again",
    },
  },
  ja: {
    title: "エラーが発生しました",
    color: "#ff0000",
    fields: [
      {
        name: "権限が必要です",
        value: "VC Notice に「ウェブフックの管理」の権限が必要です",
      },
    ],
    footer: {
      text: "権限を付与してからもう一度お試しください",
    },
  },
});
