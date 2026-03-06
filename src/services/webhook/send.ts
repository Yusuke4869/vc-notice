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

// 未使用の WebhookClient を破棄するまでのアイドル時間（10分）
const WEBHOOK_CLIENT_TTL_MS = 10 * 60 * 1000;

/**
 * URL ごとに保持する Webhook 実行ランタイム情報
 */
interface WebhookRuntime {
  client: WebhookClient;
  queue: Promise<void>;
  cleanupTimer: ReturnType<typeof setTimeout> | null;
  lastUsedAt: number;
}

// 同一 URL への送信を直列化するためのランタイムキャッシュ
const webhookRuntimeByUrl = new Map<string, WebhookRuntime>();

const destroyWebhookRuntime = (url: string) => {
  const runtime = webhookRuntimeByUrl.get(url);
  if (!runtime) return;

  if (runtime.cleanupTimer) {
    clearTimeout(runtime.cleanupTimer);
    runtime.cleanupTimer = null;
  }

  runtime.client.destroy();
  webhookRuntimeByUrl.delete(url);
};

const scheduleWebhookRuntimeCleanup = (url: string, runtime: WebhookRuntime) => {
  if (runtime.cleanupTimer) {
    clearTimeout(runtime.cleanupTimer);
  }

  runtime.cleanupTimer = setTimeout(() => {
    const current = webhookRuntimeByUrl.get(url);
    if (!current) return;

    const idleMs = Date.now() - current.lastUsedAt;
    if (idleMs < WEBHOOK_CLIENT_TTL_MS) {
      scheduleWebhookRuntimeCleanup(url, current);
      return;
    }

    destroyWebhookRuntime(url);
  }, WEBHOOK_CLIENT_TTL_MS);

  runtime.cleanupTimer.unref();
};

const getOrCreateWebhookRuntime = (url: string): WebhookRuntime => {
  const existing = webhookRuntimeByUrl.get(url);
  if (existing) {
    existing.lastUsedAt = Date.now();
    return existing;
  }

  const runtime: WebhookRuntime = {
    client: new WebhookClient({ url }),
    queue: Promise.resolve(),
    cleanupTimer: null,
    lastUsedAt: Date.now(),
  };
  webhookRuntimeByUrl.set(url, runtime);
  scheduleWebhookRuntimeCleanup(url, runtime);
  return runtime;
};

// URL 単位で前回送信完了を待ってから次を実行する
const enqueueWebhookSend = async <T>(url: string, task: (webhook: WebhookClient) => Promise<T>): Promise<T> => {
  const runtime = getOrCreateWebhookRuntime(url);

  const currentTask = runtime.queue
    .catch(() => undefined)
    .then(async () => {
      runtime.lastUsedAt = Date.now();
      return task(runtime.client);
    });

  runtime.queue = currentTask.then(
    () => undefined,
    () => undefined
  );

  return currentTask;
};

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

  try {
    await enqueueWebhookSend(url, async (webhook) => {
      await webhook.send({
        username: client.user?.username ?? "VC Notice",
        avatarURL: client.user?.avatarURL() ?? undefined,
        content,
        embeds: [embed],
      });
    });
  } catch (e) {
    if (e instanceof DiscordAPIError && STALE_WEBHOOK_ERROR_CODES.has(e.code)) {
      const modifiedCount = await unsetWebhookUrlByGuildId(guild.id);
      console.warn(`Webhook unavailable for URL (code ${e.code.toString()}): ${e.message}`);
      destroyWebhookRuntime(url);
      if (modifiedCount > 0) {
        console.warn(`Unset stale webhook URL for guild ${guild.id} (${modifiedCount.toString()} record updated)`);
      }
      return;
    }
    console.error(e);
  }
};
