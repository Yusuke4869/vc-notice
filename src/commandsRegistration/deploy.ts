/* eslint-disable @typescript-eslint/no-misused-promises */
import { Client, IntentsBitField, Routes, REST, SlashCommandBuilder } from "discord.js";
import { config } from "dotenv";

import { buildCommands } from "./build";
import { slashCommands } from "./commands";

config();

const client = new Client({ intents: new IntentsBitField(), shards: "auto" });
const TOKEN = process.env.DISCORD_TOKEN ?? "";
const commands = [
  ...buildCommands(slashCommands).map((command) => command.toJSON()),
  new SlashCommandBuilder()
    .setName("subcommand")
    .setDescription("サブコマンド")
    .addSubcommandGroup((subcommandGroup) =>
      subcommandGroup
        .setName("group1")
        .setDescription("グループ1")
        .addSubcommand((subcommand) =>
          subcommand
            .setName("subcommand1")
            .setDescription("サブコマンド1")
            .addStringOption((opt) => opt.setName("option11").setDescription("オプション11").setRequired(true))
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("subcommand1")
        .setDescription("サブコマンド1")
        .addStringOption((opt) => opt.setName("option11").setDescription("オプション11").setRequired(true))
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("subcommand2")
        .setDescription("サブコマンド2")
        .addBooleanOption((opt) => opt.setName("option22").setDescription("オプション22").setRequired(true))
    )
    .toJSON(),
];

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
