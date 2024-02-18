import { REST } from "@discordjs/rest";
import { Client, IntentsBitField, Routes } from "discord.js";
import dotenv from "dotenv";

import { buildCommands } from "./build";
import { slashCommands } from "./commands";

dotenv.config();

const client = new Client({ intents: new IntentsBitField() });
const TOKEN = process.env.DISCORD_TOKEN ?? "";
const commands = buildCommands(slashCommands).map((command) => command.toJSON());

client.once("ready", async () => {
  const clientUser = client.user;
  if (!clientUser) throw new Error("Error: Cannot connect to Discord!");

  console.info(`Logged in as ${clientUser.tag}`);

  const rest = new REST({ version: "10" }).setToken(TOKEN);
  // コマンド登録（グローバル）
  rest
    .put(Routes.applicationCommands(clientUser.id), { body: commands })
    .then(() => console.log("Successfully reloaded application (/) commands."))
    .catch(console.error);

  client.destroy();
});

client.login(TOKEN).catch(console.error);
