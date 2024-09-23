import type { Guild, TextChannel } from "discord.js";

/**
 * Webhook URLから送信先チャンネルを返します
 *
 * @param guild URLが存在するギルド
 * @param url チャンネルを返してほしいWebhookのURL
 * @returns テキストチャンネル
 */
export const getWebhookChannel = async (guild: Guild, url: string) => {
  const webhooks = await guild.fetchWebhooks();
  const webhookId = /\d+\//
    .exec(url.replace(/https?:\/\/discord.com\/api\/webhooks\//, ""))
    ?.at(0)
    ?.replace(/\//g, "");

  const channelId = webhooks
    .filter((v) => v.id === webhookId)
    .map((v) => v.channelId)
    .at(0);

  if (!channelId) return undefined;
  const channel = guild.channels.cache.get(channelId) as TextChannel;
  return channel;
};
