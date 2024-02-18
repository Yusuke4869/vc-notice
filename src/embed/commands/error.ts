import type { EmbedContents } from "../../types";

export const noPermissionErrorEmbed = (): EmbedContents => ({
  en: {
    title: "You don't have permission",
    color: "#ff0000",
    description: "Requires server management permission",
  },
  ja: {
    title: "権限がありません",
    color: "#ff0000",
    description: "サーバー管理権限が必要です",
  },
});

export const dmErrorEmbed = (): EmbedContents => ({
  en: {
    title: "Not available in DM",
    color: "#ff0000",
    description: "This command is not available in DM",
  },
  ja: {
    title: "DMでは利用できません",
    color: "#ff0000",
    description: "このコマンドはDMでは利用できません",
  },
});
