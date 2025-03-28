import { about, help, ping, set, check } from "../../commands";

import type { Client, CommandInteraction } from "discord.js";

export const commandInteraction = async (client: Client, interaction: CommandInteraction) => {
  const { commandName } = interaction;

  console.log(interaction.options.data);
  console.log(interaction.options.data.at(0)?.options);
  console.log(interaction.options.data.at(0)?.options?.at(0)?.options);

  if (commandName === "help") await help(interaction);
  else if (commandName === "ping") await ping(client, interaction);
  else if (commandName === "about") await about(interaction);
  else if (commandName === "set") await set(client, interaction);
  else if (commandName === "check") await check(client, interaction);
  else await help(interaction);
};
