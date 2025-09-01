import { WebhookClient } from "discord.js";

import type { Client, TextChannel } from "discord.js";

// export はせずに updateWebhook() から呼び出すように
const createWebhook = async (client: Client, channel: TextChannel): Promise<string | null> => {
  try {
    const webhook = await channel.createWebhook({
      name: client.user?.username ?? "VC Notice",
      avatar: client.user?.avatarURL(),
    });

    return webhook.url;
  } catch (e) {
    console.error(e);
    return null;
  }
};

/**
 * Webhook を作成または更新します
 * @param channel Webhook を送信するチャンネル
 * @param prevUrl 更新前の Webhook URL
 */
export const updateWebhook = async (client: Client, channel: TextChannel, prevUrl?: string): Promise<string | null> => {
  // webhook.edit() ではチャンネル変更ができなかったため、一回削除して再度作成
  if (prevUrl) {
    try {
      const webhook = new WebhookClient({ url: prevUrl });
      await webhook.delete();
      webhook.destroy();

      // 手動で削除された場合に発生するエラーのため無視 (404: Unknown Webhook)
      // eslint-disable-next-line no-empty
    } catch {}
  }

  const res = await createWebhook(client, channel);
  return res;
};
