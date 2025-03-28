import { ChannelType, SlashCommandBuilder } from "discord.js";

import type { SlashCommandConfig } from "./type";
import type { SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";

export const buildCommands = (
  commands: SlashCommandConfig[]
): (SlashCommandSubcommandsOnlyBuilder | SlashCommandOptionsOnlyBuilder)[] =>
  commands.map((commandConfig) => {
    const command = new SlashCommandBuilder()
      .setName(commandConfig.name.toLowerCase())
      .setDescription(commandConfig.description.en)
      .setDescriptionLocalizations({
        ja: commandConfig.description.ja,
      })
      .setDefaultMemberPermissions(commandConfig.permissions ?? null);

    if (!commandConfig.subcommands) return command;

    for (const subcommandConfig of commandConfig.subcommands) {
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

        if (subcommandConfig.voiceChannelOptions) {
          subcommandConfig.voiceChannelOptions.forEach((option) =>
            sc.addChannelOption((opt) =>
              opt
                .setName(option.name.toLowerCase())
                .setDescription(option.description.en)
                .setDescriptionLocalizations({
                  ja: option.description.ja,
                })
                .setRequired(option.required)
                .addChannelTypes([ChannelType.GuildVoice])
            )
          );
        }

        return sc;
      });
    }

    return command;
  });
