import { WebhookClient } from "discord.js";
import type { Client, TextChannel } from "discord.js";

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
