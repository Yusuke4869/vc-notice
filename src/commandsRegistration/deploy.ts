/* eslint-disable @typescript-eslint/no-misused-promises */
import { Client, IntentsBitField, Routes, REST } from "discord.js";
import { config } from "dotenv";

import { buildCommands } from "./build";
import { slashCommands } from "./commands";

config();

const client = new Client({ intents: new IntentsBitField(), shards: "auto" });
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
    .then(() => {
      console.log("Successfully reloaded application (/) commands.");
    })
    .catch((e: unknown) => {
      console.error(e);
    });

  await client.destroy();
});

client.login(TOKEN).catch((e: unknown) => {
  console.error(e);
});
