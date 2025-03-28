import { WebhookClient, DiscordAPIError } from "discord.js";

import type { WebhookRepositoryInterface } from "./interface";
import type { Client, TextChannel } from "discord.js";

export class WebhookRepository implements WebhookRepositoryInterface {
  constructor(private readonly client: Client) {}

  public getWebhook(url: string): WebhookClient {
    const webhook = new WebhookClient({ url });
    return webhook;
  }

  public async createWebhook(channel: TextChannel): Promise<WebhookClient> {
    try {
      const res = await channel.createWebhook({
        name: this.client.user?.username ?? "VC Notice",
        avatar: this.client.user?.avatarURL(),
      });

      const webhook = new WebhookClient({ url: res.url });
      return webhook;
    } catch (e) {
      console.error(e);
      throw new Error("failed to create webhook");
    }
  }

  // webhook.edit() ではチャンネル変更ができなかったため、一回削除して再度作成する
  public async updateWebhook(channel: TextChannel, prevUrl?: string): Promise<WebhookClient> {
    try {
      if (prevUrl) await this.deleteWebhook(prevUrl);

      const webhook = await this.createWebhook(channel);
      return webhook;
    } catch (e) {
      console.error(e);
      throw new Error("failed to update webhook");
    }
  }

  public async deleteWebhook(url: string): Promise<void> {
    try {
      const webhook = new WebhookClient({ url });
      await webhook.delete();
    } catch (e) {
      // Webhook の削除が失敗しても他の処理に影響はないためエラーは投げない
      if (e instanceof DiscordAPIError) {
        /**
         * 10015: Unknown Webhook は手動で削除された場合に発生するエラーのため無視する
         *
         * @see https://discord.com/developers/docs/topics/opcodes-and-status-codes#json-json-error-codes
         */
        if (e.code !== 10015) console.error(e);
      } else {
        console.error(e);
      }
    }
  }
}
