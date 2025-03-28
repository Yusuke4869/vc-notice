/* eslint-disable @typescript-eslint/no-misused-promises */
import { Client, IntentsBitField, Routes, REST } from "discord.js";

import { env } from "../env";
import { buildCommands } from "./build";
import { GuildUseCaseDummy } from "../usecase/guild/dummy";
import { WebhookUseCaseDummy } from "../usecase/webhook/dummy";

import type { RESTPostAPIChatInputApplicationCommandsJSONBody } from "discord.js";

import { commandSchemas } from "./index";

const { DISCORD_BOT_TOKEN } = env;

const client = new Client({ intents: new IntentsBitField(), shards: "auto" });
const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = buildCommands(
  commandSchemas(client, new GuildUseCaseDummy(), new WebhookUseCaseDummy())
).map((command) => command.toJSON());

client.once("ready", async () => {
  const clientUser = client.user;
  if (!clientUser) throw new Error("cannot get client user");

  console.info(`Logged in as ${clientUser.tag}`);
  const rest = new REST({ version: "10" }).setToken(DISCORD_BOT_TOKEN);

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

client.login(DISCORD_BOT_TOKEN).catch((e: unknown) => {
  console.error(e);
});
