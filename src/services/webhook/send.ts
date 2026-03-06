/* eslint import/order: "off" */
import { DiscordAPIError, WebhookClient } from "discord.js";
import { unsetWebhookUrlByGuildId } from "../../repositories/guild";

import type { Client, Guild, EmbedBuilder } from "discord.js";

/**
 * Webhook URL が利用不能になったことを示すエラーコード
 * 該当コードを受け取った場合、Guild 設定から Webhook URL を削除する
 * - `10015`: Unknown Webhook
 * - `50027`: Invalid Webhook Token
 *
 * @see https://discord.com/developers/docs/topics/opcodes-and-status-codes#json-json-error-codes
 * @see https://discord.com/developers/docs/resources/webhook#execute-webhook
 */
const STALE_WEBHOOK_ERROR_CODES = new Set<string | number>([10015, 50027]);

/**
 * Webhook を用いて Embed を送信します
 */
export const sendWebhook = async (
  client: Client,
  guild: Guild,
  url: string | undefined,
  embed: EmbedBuilder,
  content?: string
) => {
  if (!url) return;

  const webhook = new WebhookClient({ url });

  try {
    await webhook.send({
      username: client.user?.username ?? "VC Notice",
      avatarURL: client.user?.avatarURL() ?? undefined,
      content,
      embeds: [embed],
    });
  } catch (e) {
    if (e instanceof DiscordAPIError && STALE_WEBHOOK_ERROR_CODES.has(e.code)) {
      const modifiedCount = await unsetWebhookUrlByGuildId(guild.id);
      if (modifiedCount > 0) {
        console.warn(`Unset stale webhook URL for guild ${guild.id} (${modifiedCount.toString()} record updated)`);
      }
      console.warn(`Webhook unavailable for URL (code ${e.code.toString()}): ${e.message}`);
      return;
    }
    console.error(e);
  } finally {
    webhook.destroy();
  }
};
