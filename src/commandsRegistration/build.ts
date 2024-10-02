import { SlashCommandBuilder } from "discord.js";

import type { SlashCommandConfig } from "./type";
import type { SlashCommandSubcommandsOnlyBuilder } from "discord.js";

export const buildCommands = (commands: SlashCommandConfig[]): SlashCommandSubcommandsOnlyBuilder[] =>
  commands.map((commandConfig) => {
    const command = new SlashCommandBuilder()
      .setName(commandConfig.name.toLowerCase())
      .setDescription(commandConfig.description.en)
      .setDescriptionLocalizations({
        ja: commandConfig.description.ja,
      })
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
                  }))
                )
            )
          );
        }

        if (subcommandConfig.booleanOptions) {
          subcommandConfig.booleanOptions.forEach((option) =>
            sc.addBooleanOption((opt) =>
              opt
                .setName(option.name.toLowerCase())
                .setDescription(option.description.en)
                .setDescriptionLocalizations({
                  ja: option.description.ja,
                })
                .setRequired(option.required)
            )
          );
        }

        if (subcommandConfig.roleMentionOptions) {
          subcommandConfig.roleMentionOptions.forEach((option) =>
            sc.addRoleOption((opt) =>
              opt
                .setName(option.name.toLowerCase())
                .setDescription(option.description.en)
                .setDescriptionLocalizations({
                  ja: option.description.ja,
                })
                .setRequired(option.required)
            )
          );
        }

        return sc;
      });
    }

    return command;
  });
