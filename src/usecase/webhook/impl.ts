import type { WebhookUseCaseInterface } from "./interface";
import type { WebhookRepositoryInterface } from "../../repository/webhook/interface";
import type { Guild, EmbedBuilder, Client, TextChannel, GuildBasedChannel, WebhookClient } from "discord.js";

export class WebhookUseCase implements WebhookUseCaseInterface {
  constructor(
    private readonly client: Client,
    private readonly webhookRepository: WebhookRepositoryInterface
  ) {}

  public async getWebhookChannel(guild: Guild, webhookUrl: string): Promise<GuildBasedChannel | null> {
    try {
      const webhook = this.webhookRepository.getWebhook(webhookUrl);
      const { id: webhookId } = webhook;

      const webhooks = await guild.fetchWebhooks();
      const channelId = webhooks.find((v) => v.id === webhookId)?.channelId;
      if (!channelId) return null;

      const channel = await guild.channels.fetch(channelId);
      return channel;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  public async updateWebhook(channel: TextChannel, prevWebhookUrl?: string): Promise<WebhookClient> {
    const webhook = await this.webhookRepository.updateWebhook(channel, prevWebhookUrl);
    return webhook;
  }

  public async deleteWebhook(webhookUrl: string): Promise<void> {
    await this.webhookRepository.deleteWebhook(webhookUrl);
  }

  public async send(webhookUrl: string, embed: EmbedBuilder, content?: string): Promise<void> {
    try {
      // TODO: 404なWebhookのハンドリングとその処理
      const webhook = this.webhookRepository.getWebhook(webhookUrl);
      await webhook.send({
        username: this.client.user?.username ?? "VC Notice",
        avatarURL: this.client.user?.avatarURL() ?? undefined,
        content,
        embeds: [embed],
      });
    } catch (e) {
      console.error(e);
    }
  }
}
