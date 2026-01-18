/* eslint-disable @typescript-eslint/no-misused-promises */
import { ActivityType, Client, Events, GatewayIntentBits, Options } from "discord.js";
import { config } from "dotenv";

import { deleteGuildData } from "./repositories/guild";
import { commandInteraction, join, mention, voiceActivity } from "./services";

config();

const intents = [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates];

const client = new Client({
  intents,
  shards: "auto",
  sweepers: {
    ...Options.DefaultSweeperSettings,

    // 60秒ごとに、VCに接続していない VoiceState キャッシュを削除
    voiceStates: {
      interval: 60,
      filter: () => (state) => state.channelId === null,
    },
  },
});
const TOKEN = process.env.DISCORD_TOKEN;

console.info(`
Node.js version: ${process.version}
Process ID: ${process.pid.toString()}
`);

// 起動イベント
// eslint-disable-next-line @typescript-eslint/require-await
client.once(Events.ClientReady, async () => {
  const clientUser = client.user;
  if (!clientUser) throw new Error("Error: Cannot connect to Discord!");

  console.info(`Logged in as ${clientUser.tag} at ${new Date().toString()}`);

  setInterval(() => {
    clientUser.setActivity(`ping: ${client.ws.ping.toString()}ms`, { type: ActivityType.Playing });
  }, 1000 * 10);
});

client.login(TOKEN).catch((e: unknown) => {
  console.error(e);
});

// bot参加イベント
client.on(Events.GuildCreate, async (guild) => {
  await join(guild);
});

// bot退出イベント
client.on(Events.GuildDelete, async (guild) => {
  await deleteGuildData(guild.id);
});

// メッセージイベント
client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;

  // 自身がメンションされたとき
  if (message.mentions.users.has(client.user?.id ?? "")) await mention(message);
});

// スラッシュコマンド
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isCommand()) return;

  await commandInteraction(client, interaction);
});

// 通話イベント
client.on(Events.VoiceStateUpdate, async (oldVoiceState, newVoiceState) => {
  await voiceActivity(client, oldVoiceState, newVoiceState);
});
