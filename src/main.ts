import { ActivityType, Client, Events, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";

import { DataBase } from "./db";
import { join, mention, slashCommand, voiceActivity } from "./services";

dotenv.config();

const intents = [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates];

export const db = new DataBase();

const client = new Client({ intents });
const TOKEN = process.env.DISCORD_TOKEN;

// 起動イベント
client.once(Events.ClientReady, async () => {
  const clientUser = client.user;
  if (!clientUser) throw new Error("Error: Cannot connect to Discord!");

  console.info(`Logged in as ${clientUser.tag} at ${new Date().toString()}`);

  setInterval(() => {
    clientUser.setActivity(`ping: ${client.ws.ping}ms`, { type: ActivityType.Playing });
  }, 1000 * 10);
});

client.login(TOKEN).catch(console.error);

// bot参加イベント
client.on(Events.GuildCreate, async (guild) => {
  await join(client, guild);
});

// bot退出イベント
client.on(Events.GuildDelete, async (guild) => {
  await db.deleteGuildData(guild.id);
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

  await slashCommand(client, interaction);
});

// 通話イベント
client.on(Events.VoiceStateUpdate, async (oldVoiceState, newVoiceState) => {
  await voiceActivity(client, oldVoiceState, newVoiceState);
});
