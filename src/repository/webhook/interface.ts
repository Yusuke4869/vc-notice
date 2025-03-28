import type { WebhookClient, TextChannel } from "discord.js";

export interface WebhookRepositoryInterface {
  getWebhook(url: string): WebhookClient;
  createWebhook(channel: TextChannel): Promise<WebhookClient>;
  updateWebhook(channel: TextChannel, prevUrl?: string): Promise<WebhookClient>;
  deleteWebhook(url: string): Promise<void>;
}
