import { ActivityType, Client, Events, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";

import { helpMention, helpSlash, overview, ping, set } from "./commands";
import { join, voiceActivity } from "./service";
import { DataBase } from "./util";

dotenv.config();

const intents = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.GuildVoiceStates,
  GatewayIntentBits.MessageContent,
];

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

// メッセージイベント
client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;

  // 自身がメンションされたとき
  if (message.mentions.users.has(client.user?.id ?? "")) await helpMention(client, message);
});

// スラッシュコマンド
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === "help") await helpSlash(client, interaction);
  else if (commandName === "overview") await overview(client, interaction);
  else if (commandName === "set") await set(client, interaction);
  else if (commandName === "ping") await ping(client, interaction);
});

// 通話イベント
client.on(Events.VoiceStateUpdate, async (oldVoiceState, newVoiceState) => {
  await voiceActivity(client, oldVoiceState, newVoiceState);
});
