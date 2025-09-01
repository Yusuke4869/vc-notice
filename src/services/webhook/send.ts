import { WebhookClient } from "discord.js";

import type { Client, Guild, EmbedBuilder } from "discord.js";

/**
 * Webhook を用いて Embed を送信します
 */
export const sendWebhook = async (
  client: Client,
  guild: Guild,
  url: string | undefined,
  embed: EmbedBuilder,
  content?: string
) => {
  if (!url) return;

  try {
    const webhooks = await guild.fetchWebhooks();
    if (!webhooks.some((v) => v.url === url)) return;
  } catch (e) {
    console.error(e);
  }

  const webhook = new WebhookClient({ url });

  try {
    await webhook.send({
      username: client.user?.username ?? "VC Notice",
      avatarURL: client.user?.avatarURL() ?? undefined,
      content,
      embeds: [embed],
    });
  } catch (e) {
    console.error(e);
  } finally {
    webhook.destroy();
  }
};
