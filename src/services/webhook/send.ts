import { WebhookClient } from "discord.js";

import type { Client, EmbedBuilder } from "discord.js";

/**
 * Webhookを使用して埋め込みを送信します
 *
 * @param client Discord Bot Client
 * @param url 送信するWebhook URL
 * @param embed 送信する埋め込み
 */
export const sendWebhook = async (client: Client, url: string | undefined, embed: EmbedBuilder) => {
  if (!url) return;

  try {
    const webhook = new WebhookClient({ url });
    await webhook.send({
      username: client.user?.username ?? "VC Notice",
      avatarURL: client.user?.avatarURL() ?? undefined,
      embeds: [embed],
    });
  } catch (e) {
    console.error(e);
  }
};
