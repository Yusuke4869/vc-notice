/* eslint-disable no-empty */
import { WebhookClient } from "discord.js";
import type { Client, EmbedBuilder, Guild, TextChannel } from "discord.js";

/**
 * Webhookを使用して埋め込みを送信します
 * @param client Discord Bot Client
 * @param url 送信するWebhook URL
 * @param embed 送信する埋め込み
 */
export const send = async (client: Client, url: string | undefined, embed: EmbedBuilder) => {
  if (!url) return;

  try {
    const webhook = new WebhookClient({ url });
    await webhook.send({
      username: client.user?.username ?? "VC Notice",
      avatarURL: client.user?.avatarURL() ?? undefined,
      embeds: [embed],
    });
  } catch (e) {}
};

/**
 * Webhookの送信先を変更します
 * @param client Discord Bot Client
 * @param newChannel 新しい送信先チャンネル
 * @param url それまで使用していたWebhook URL
 */
export const updateWebhook = async (client: Client, newChannel: TextChannel, url: string | null) => {
  if (url) {
    // webhook.edit() ではチャンネル変更ができなかったため、一回削除して再度作成
    try {
      const webhook = new WebhookClient({ url });
      await webhook.delete();
    } catch (e) {}
  }

  const res = await createWebhook(client, newChannel);
  return res;
};

// export はせずに updateWebhook() から呼び出すように
const createWebhook = async (client: Client, newChannel: TextChannel) => {
  const webhook = await newChannel.createWebhook({
    name: client.user?.username ?? "VC Notice",
    avatar: client.user?.avatarURL(),
  });

  return webhook.url;
};

/**
 * Webhook URLから送信先チャンネルを返します
 * @param client Discord Bot Client
 * @param guild URLが存在するギルド
 * @param url チャンネルを返してほしいWebhookのURL
 * @returns テキストチャンネル
 */
export const getWebhookChannel = async (client: Client, guild: Guild, url: string) => {
  const webhooks = await guild.fetchWebhooks();
  const webhookId = url
    .replace(/https?:\/\/discord.com\/api\/webhooks\//, "")
    .match(/\d+\//)
    ?.at(0)
    ?.replace(/\//g, "");

  const channelId = webhooks
    .map((v) => {
      if (v.id === webhookId) return v.channelId;
    })
    .filter((v) => v !== undefined)
    .at(0);

  if (!channelId) return undefined;
  const channel = guild.channels.cache.get(channelId) as TextChannel;
  return channel;
};
