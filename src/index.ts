import { ActivityType, Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";

import { helpMention, helpSlash, overview, ping, set } from "./commands";
import { join, voiceActivity } from "./service";
import { DataBase } from "./util";

dotenv.config();

const intents = [
  // ギルドイベント
  GatewayIntentBits.Guilds,
  // メッセージイベント
  GatewayIntentBits.GuildMembers,
  // ボイスイベント
  GatewayIntentBits.GuildVoiceStates,
];

export const db = new DataBase();

const client = new Client({ intents });
const TOKEN = process.env.DISCORD_TOKEN;

// 起動イベント
client.once("ready", async () => {
  const clientUser = client.user;
  if (!clientUser) throw new Error("Error: Cannot connect to Discord!");

  console.info(`Logged in as ${clientUser.tag}`);

  setInterval(() => {
    clientUser.setActivity(`ping: ${client.ws.ping}ms`, { type: ActivityType.Playing });
  }, 1000 * 10);
});

client.login(TOKEN).catch(console.error);

// bot参加イベント
client.on("guildCreate", async (guild) => {
  await join(client, guild);
});

// メッセージイベント
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // 自身がメンションされたとき
  if (message.mentions.users.has(client.user?.id ?? "")) await helpMention(client, message);
});

// スラッシュコマンド
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === "help") await helpSlash(client, interaction);
  else if (commandName === "overview") await overview(client, interaction);
  else if (commandName === "set") await set(client, interaction);
  else if (commandName === "ping") await ping(client, interaction);
});

// 通話イベント
client.on("voiceStateUpdate", async (oldVoiceState, newVoiceState) => {
  await voiceActivity(client, oldVoiceState, newVoiceState);
});
