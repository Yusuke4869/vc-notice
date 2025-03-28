import type { Guild, EmbedBuilder, TextChannel, WebhookClient, GuildBasedChannel } from "discord.js";

export interface WebhookUseCaseInterface {
  getWebhookChannel(guild: Guild, webhookUrl: string): Promise<GuildBasedChannel | null>;
  updateWebhook(channel: TextChannel, prevWebhookUrl?: string): Promise<WebhookClient>;
  deleteWebhook(webhookUrl: string): Promise<void>;
  send(webhookUrl: string, embed: EmbedBuilder, content?: string): Promise<void>;
}
