import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { Client, IntentsBitField } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * コマンド一覧
 * setName()に入れるコマンド名は小文字に
 * NOTE: https://discordjs.guide/creating-your-bot/slash-commands.html#individual-command-files
 */
const commands = [
  new SlashCommandBuilder().setName("help").setDescription("Display help").setDescriptionLocalizations({
    ja: "Helpを表示します",
  }),
  new SlashCommandBuilder().setName("overview").setDescription("Display overview of me").setDescriptionLocalizations({
    ja: "このBotの概要を表示します",
  }),
  new SlashCommandBuilder()
    .setName("set")
    .setDescription("Settings")
    .setDescriptionLocalizations({
      ja: "設定",
    })
    .addSubcommand((subcommand) =>
      subcommand.setName("help").setDescription("Display help of settings").setDescriptionLocalizations({
        ja: "設定のHelpを表示します",
      }),
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("channel").setDescription("Set notification channel").setDescriptionLocalizations({
        ja: "通知するチャンネルを設定します",
      }),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("language")
        .setDescription("Set language in this server")
        .setDescriptionLocalizations({
          ja: "表示言語を設定します",
        })
        .addStringOption((option) =>
          option
            .setName("language")
            .setDescription("shown language")
            .setDescriptionLocalizations({
              ja: "表示する言語",
            })
            .addChoices(
              {
                name: "English",
                name_localizations: {
                  ja: "英語",
                },
                value: "en",
              },
              {
                name: "Japanese",
                name_localizations: {
                  ja: "日本語",
                },
                value: "ja",
              },
            )
            .setRequired(true),
        ),
    ),
  new SlashCommandBuilder().setName("ping").setDescription("Replies with pong!").setDescriptionLocalizations({
    ja: "Pingを確認します",
  }),
].map((command) => command.toJSON());

const client = new Client({ intents: new IntentsBitField() });
const TOKEN = process.env.DISCORD_TOKEN ?? "";

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
