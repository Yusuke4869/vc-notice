/* eslint-disable @typescript-eslint/no-misused-promises */
import { ActivityType, Client, Events, GatewayIntentBits } from "discord.js";

import { env } from "./env";
import { GuildCreate } from "./event/guild-create";
import { GuildDelete } from "./event/guild-delete";
import { InteractionCreate } from "./event/interaction-create";
import { VoiceStateUpdate } from "./event/voice-state-update";
import { Mongodb } from "./infrastructure/mongodb";
import { GuildRepository } from "./repository/guild/impl";
import { WebhookRepository } from "./repository/webhook/impl";
import { GuildUseCase } from "./usecase/guild/impl";
import { VoiceStateUseCase } from "./usecase/voice-state/impl";
import { WebhookUseCase } from "./usecase/webhook/impl";

import type { GuildField } from "./domain/guild/interface";

const intents = [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates];

const client = new Client({ intents, shards: "auto" });
const { DISCORD_BOT_TOKEN, MONGODB_DB_COLLECTION_NAME } = env;

const collection = await Mongodb.getCollection<GuildField>(MONGODB_DB_COLLECTION_NAME);
const guildRepository = new GuildRepository(collection);
const guildUseCase = new GuildUseCase(guildRepository);

const webhookRepository = new WebhookRepository(client);
const webhookUseCase = new WebhookUseCase(client, webhookRepository);

const guildCreate = new GuildCreate();
const guildDelete = new GuildDelete(guildUseCase);
const voiceStateUpdate = new VoiceStateUpdate(
  guildUseCase,
  webhookUseCase,
  new VoiceStateUseCase(client, guildRepository)
);

const interactionCreate = new InteractionCreate(client, guildUseCase, webhookUseCase);

console.info(`
Node.js version: ${process.version}
Process ID: ${process.pid.toString()}
`);

// 起動イベント
client.once(Events.ClientReady, () => {
  const clientUser = client.user;
  if (!clientUser) throw new Error("cannot get client user");

  console.info(`Logged in as ${clientUser.tag} at ${new Date().toString()}`);

  setInterval(() => {
    clientUser.setActivity(`ping: ${Math.floor(client.ws.ping).toString()}ms`, { type: ActivityType.Playing });
  }, 1000 * 10);
});

client.login(DISCORD_BOT_TOKEN).catch((e: unknown) => {
  console.error(e);
});

// bot参加イベント
client.on(Events.GuildCreate, async (guild) => {
  await guildCreate.on(guild);
});

// bot退出イベント
client.on(Events.GuildDelete, async (guild) => {
  await guildDelete.on(guild);
});

// メッセージイベント
// client.on(Events.MessageCreate, async (message) => {
// });

// スラッシュコマンド
client.on(Events.InteractionCreate, async (interaction) => {
  await interactionCreate.on(interaction);
});

// 通話イベント
client.on(Events.VoiceStateUpdate, async (oldVoiceState, newVoiceState) => {
  await voiceStateUpdate.on(oldVoiceState, newVoiceState);
});
