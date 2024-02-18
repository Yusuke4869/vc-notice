import { SlashCommandBuilder } from "@discordjs/builders";
import type { SlashCommandSubcommandsOnlyBuilder } from "discord.js";

import type { SlashCommandConfig } from "./type";

export const buildCommands = (commands: SlashCommandConfig[]): SlashCommandSubcommandsOnlyBuilder[] =>
  commands.map((commandConfig) => {
    const command = new SlashCommandBuilder()
      .setName(commandConfig.name.toLowerCase())
      .setDescription(commandConfig.description.en)
      .setDescriptionLocalizations({
        ja: commandConfig.description.ja,
      })
      .setDMPermission(commandConfig.allowDM)
      .setDefaultMemberPermissions(commandConfig.permissions ?? null);

    if (!commandConfig.subCommands) return command;

    for (const subcommandConfig of commandConfig.subCommands) {
      command.addSubcommand((sc) => {
        sc.setName(subcommandConfig.name.toLowerCase())
          .setDescription(subcommandConfig.description.en)
          .setDescriptionLocalizations({
            ja: subcommandConfig.description.ja,
          });

        if (subcommandConfig.stringOptions) {
          subcommandConfig.stringOptions.forEach((option) =>
            sc.addStringOption((opt) =>
              opt
                .setName(option.name.toLowerCase())
                .setDescription(option.description.en)
                .setDescriptionLocalizations({
                  ja: option.description.ja,
                })
                .setRequired(option.required)
                .addChoices(
                  ...option.choices.map((choice) => ({
                    name: choice.name.en,
                    name_localizations: {
                      ja: choice.name.ja,
                    },
                    value: choice.value,
                  })),
                ),
            ),
          );
        }

        return sc;
      });
    }

    return command;
  });
