import { WebhookClient } from "discord.js";

import type { Guild, GuildBasedChannel } from "discord.js";

/**
 * Webhook URL から送信先チャンネルを取得します
 */
export const getWebhookChannel = async (guild: Guild, url: string): Promise<GuildBasedChannel | null> => {
  const webhook = new WebhookClient({ url });
  const webhookId = webhook.id;

  try {
    const webhooks = await guild.fetchWebhooks();
    const channelId = webhooks
      .filter((v) => v.id === webhookId)
      .map((v) => v.channelId)
      .at(0);

    webhook.destroy();

    if (!channelId) return null;

    const channel = await guild.channels.fetch(channelId);
    return channel;
  } catch (e) {
    webhook.destroy();
    console.error(e);
    return null;
  }
};
