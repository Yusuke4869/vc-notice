import { WebhookClient } from "discord.js";
import type { Client, EmbedBuilder, Guild, TextChannel } from "discord.js";

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

/**
 * Webhookの送信先を変更します
 *
 * @param client Discord Bot Client
 * @param newChannel 新しい送信先チャンネル
 * @param prevUrl 変更前のWebhook URL
 * @returns 新しいWebhook URL
 */
export const updateWebhook = async (client: Client, newChannel: TextChannel, prevUrl: string | null) => {
  if (prevUrl) {
    // webhook.edit() ではチャンネル変更ができなかったため、一回削除して再度作成
    try {
      const webhook = new WebhookClient({ url: prevUrl });
      await webhook.delete();
    } catch (e) {
      console.error(e);
    }
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
 *
 * @param guild URLが存在するギルド
 * @param url チャンネルを返してほしいWebhookのURL
 * @returns テキストチャンネル
 */
export const getWebhookChannel = async (guild: Guild, url: string) => {
  const webhooks = await guild.fetchWebhooks();
  const webhookId = url
    .replace(/https?:\/\/discord.com\/api\/webhooks\//, "")
    .match(/\d+\//)
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
