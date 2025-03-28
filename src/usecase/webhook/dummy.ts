import { WebhookClient } from "discord.js";

import type { WebhookUseCaseInterface } from "./interface";

export class WebhookUseCaseDummy implements WebhookUseCaseInterface {
  public async getWebhookChannel(): Promise<null> {
    return Promise.resolve(null);
  }

  public async updateWebhook(): Promise<WebhookClient> {
    return Promise.resolve(
      new WebhookClient({
        url: "https://example.com",
      })
    );
  }

  public async deleteWebhook(): Promise<void> {
    return Promise.resolve();
  }

  public async send(): Promise<void> {
    return Promise.resolve();
  }
}
