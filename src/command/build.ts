import { InteractionContextType, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

import type { Command, Options } from "../type/command";
import type {
  SharedSlashCommandOptions,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandBuilder,
} from "discord.js";

const addOptions = <
  T extends
    | SharedSlashCommandOptions<SlashCommandOptionsOnlyBuilder>
    | SharedSlashCommandOptions<SlashCommandSubcommandBuilder>,
>(
  builder: T,
  options: Options
): T => {
  for (const option of options.booleanOptions ?? []) {
    builder.addBooleanOption((opt) =>
      opt
        .setName(option.name.en)
        .setNameLocalizations({
          ja: option.name.ja,
        })
        .setDescription(option.description.en)
        .setDescriptionLocalizations({
          ja: option.description.ja,
        })
        .setRequired(option.required)
    );
  }

  for (const option of options.channelOptions ?? []) {
    builder.addChannelOption((opt) =>
      opt
        .setName(option.name.en)
        .setNameLocalizations({
          ja: option.name.ja,
        })
        .setDescription(option.description.en)
        .setDescriptionLocalizations({
          ja: option.description.ja,
        })
        .setRequired(option.required)
        .addChannelTypes(option.channelTypes)
    );
  }

  for (const option of options.integerOptions ?? []) {
    builder.addIntegerOption((opt) => {
      opt
        .setName(option.name.en)
        .setNameLocalizations({
          ja: option.name.ja,
        })
        .setDescription(option.description.en)
        .setDescriptionLocalizations({
          ja: option.description.ja,
        })
        .setRequired(option.required);

      if (option.minValue && Number.isSafeInteger(option.minValue)) opt.setMinValue(Math.floor(option.minValue));
      if (option.maxValue && Number.isSafeInteger(option.maxValue)) opt.setMaxValue(Math.floor(option.maxValue));

      if (option.choices)
        opt.addChoices(
          ...option.choices
            .filter((choice) => Number.isSafeInteger(choice.value))
            .map((choice) => ({
              name: choice.name.en,
              name_localizations: {
                ja: choice.name.ja,
              },
              value: Math.floor(choice.value),
            }))
        );

      return opt;
    });
  }

  for (const option of options.mentionableOptions ?? []) {
    builder.addMentionableOption((opt) =>
      opt
        .setName(option.name.en)
        .setNameLocalizations({
          ja: option.name.ja,
        })
        .setDescription(option.description.en)
        .setDescriptionLocalizations({
          ja: option.description.ja,
        })
        .setRequired(option.required)
    );
  }

  for (const option of options.numberOptions ?? []) {
    builder.addNumberOption((opt) => {
      opt
        .setName(option.name.en)
        .setNameLocalizations({
          ja: option.name.ja,
        })
        .setDescription(option.description.en)
        .setDescriptionLocalizations({
          ja: option.description.ja,
        })
        .setRequired(option.required);

      if (option.minValue) opt.setMinValue(option.minValue);
      if (option.maxValue) opt.setMaxValue(option.maxValue);

      if (option.choices)
        opt.addChoices(
          ...option.choices.map((choice) => ({
            name: choice.name.en,
            name_localizations: {
              ja: choice.name.ja,
            },
            value: choice.value,
          }))
        );

      return opt;
    });
  }

  for (const option of options.roleOptions ?? []) {
    builder.addRoleOption((opt) =>
      opt
        .setName(option.name.en)
        .setNameLocalizations({
          ja: option.name.ja,
        })
        .setDescription(option.description.en)
        .setDescriptionLocalizations({
          ja: option.description.ja,
        })
        .setRequired(option.required)
    );
  }

  for (const option of options.stringOptions ?? []) {
    builder.addStringOption((opt) => {
      opt
        .setName(option.name.en)
        .setNameLocalizations({
          ja: option.name.ja,
        })
        .setDescription(option.description.en)
        .setDescriptionLocalizations({
          ja: option.description.ja,
        })
        .setRequired(option.required);

      if (option.minLength) opt.setMinLength(option.minLength);
      if (option.maxLength) opt.setMaxLength(option.maxLength);

      if (option.choices)
        opt.addChoices(
          ...option.choices.map((choice) => ({
            name: choice.name.en,
            name_localizations: {
              ja: choice.name.ja,
            },
            value: choice.value,
          }))
        );

      return opt;
    });
  }

  for (const option of options.userOptions ?? []) {
    builder.addUserOption((opt) =>
      opt
        .setName(option.name.en)
        .setNameLocalizations({
          ja: option.name.ja,
        })
        .setDescription(option.description.en)
        .setDescriptionLocalizations({
          ja: option.description.ja,
        })
        .setRequired(option.required)
    );
  }

  return builder;
};

const buildOptions = <
  T extends
    | SharedSlashCommandOptions<SlashCommandOptionsOnlyBuilder>
    | SharedSlashCommandOptions<SlashCommandSubcommandBuilder>,
>(
  builder: T,
  options: Options
): T => {
  const requiredOptions: Options = {
    booleanOptions: options.booleanOptions?.filter((option) => option.required),
    channelOptions: options.channelOptions?.filter((option) => option.required),
    integerOptions: options.integerOptions?.filter((option) => option.required),
    mentionableOptions: options.mentionableOptions?.filter((option) => option.required),
    numberOptions: options.numberOptions?.filter((option) => option.required),
    roleOptions: options.roleOptions?.filter((option) => option.required),
    stringOptions: options.stringOptions?.filter((option) => option.required),
    userOptions: options.userOptions?.filter((option) => option.required),
  };

  const optionalOptions: Options = {
    booleanOptions: options.booleanOptions?.filter((option) => !option.required),
    channelOptions: options.channelOptions?.filter((option) => !option.required),
    integerOptions: options.integerOptions?.filter((option) => !option.required),
    mentionableOptions: options.mentionableOptions?.filter((option) => !option.required),
    numberOptions: options.numberOptions?.filter((option) => !option.required),
    roleOptions: options.roleOptions?.filter((option) => !option.required),
    stringOptions: options.stringOptions?.filter((option) => !option.required),
    userOptions: options.userOptions?.filter((option) => !option.required),
  };

  // NOTE: required オプションを先に追加する必要がある
  return addOptions(addOptions(builder, requiredOptions), optionalOptions);
};

export const buildCommands = (commands: Command[]): SlashCommandBuilder[] =>
  commands.map((command) => {
    const slashCommand = new SlashCommandBuilder()
      .setName(command.name.toLowerCase())
      .setDescription(command.description.en)
      .setDescriptionLocalizations({
        ja: command.description.ja,
      })
      .setContexts(
        command.allowDM
          ? [InteractionContextType.BotDM, InteractionContextType.Guild, InteractionContextType.PrivateChannel]
          : [InteractionContextType.Guild]
      )
      .setDefaultMemberPermissions(command.permission === "ManageGuild" ? PermissionFlagsBits.ManageGuild : null);

    for (const subcommand of command.subcommands ?? []) {
      slashCommand.addSubcommand((subcommandBuilder) => {
        subcommandBuilder
          .setName(subcommand.name.toLowerCase())
          .setDescription(subcommand.description.en)
          .setDescriptionLocalizations({
            ja: subcommand.description.ja,
          });

        if (!subcommand.options) return subcommandBuilder;
        return buildOptions(subcommandBuilder, subcommand.options);
      });
    }

    for (const subcommandGroup of command.subcommandGroups ?? []) {
      slashCommand.addSubcommandGroup((subcommandGroupBuilder) => {
        subcommandGroupBuilder
          .setName(subcommandGroup.name.toLowerCase())
          .setDescription(subcommandGroup.description.en)
          .setDescriptionLocalizations({
            ja: subcommandGroup.description.ja,
          });

        for (const subcommand of subcommandGroup.subcommands) {
          subcommandGroupBuilder.addSubcommand((subcommandBuilder) => {
            subcommandBuilder
              .setName(subcommand.name.toLowerCase())
              .setDescription(subcommand.description.en)
              .setDescriptionLocalizations({
                ja: subcommand.description.ja,
              });

            if (!subcommand.options) return subcommandBuilder;
            return buildOptions(subcommandBuilder, subcommand.options);
          });
        }

        return subcommandGroupBuilder;
      });
    }

    if (!command.options) return slashCommand;
    return buildOptions(slashCommand, command.options);
  });
