import { ApplicationCommandOptionType } from "discord.js";

import type { CommandInteraction, CommandInteractionOption } from "discord.js";

export const getOption = (interaction: CommandInteraction, name: string): CommandInteractionOption | undefined => {
  const r = interaction.options.data.find(
    (option) =>
      option.name === name &&
      option.type !== ApplicationCommandOptionType.Subcommand &&
      option.type !== ApplicationCommandOptionType.SubcommandGroup
  );
  if (r) return r;

  const subcommandOptions = interaction.options.data
    .filter((option) => option.options && option.options.length > 0)
    .map((option) => option.options)
    .filter((v) => v !== undefined)
    .flat();

  const rr = subcommandOptions.find(
    (option) =>
      option.name === name &&
      option.type !== ApplicationCommandOptionType.Subcommand &&
      option.type !== ApplicationCommandOptionType.SubcommandGroup
  );
  if (rr) return rr;

  const subcommandGroupOptions = subcommandOptions
    .filter((option) => option.options && option.options.length > 0)
    .map((option) => option.options)
    .filter((v) => v !== undefined)
    .flat();

  const rrr = subcommandGroupOptions.find(
    (option) =>
      option.name === name &&
      option.type !== ApplicationCommandOptionType.Subcommand &&
      option.type !== ApplicationCommandOptionType.SubcommandGroup
  );
  if (rrr) return rrr;

  return undefined;
};
