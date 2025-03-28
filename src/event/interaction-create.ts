import { PermissionFlagsBits } from "discord.js";

import { commands } from "../command";
import { generalError, commandNotFoundError, noServerManagePermissionError, notAllowedDMError } from "../command/error";

import type { GuildUseCaseInterface } from "../usecase/guild/interface";
import type { WebhookUseCaseInterface } from "../usecase/webhook/interface";
import type { Client, Interaction } from "discord.js";

export class InteractionCreate {
  constructor(
    private readonly client: Client,
    private readonly guildUseCase: GuildUseCaseInterface,
    private readonly webhookUseCase: WebhookUseCaseInterface
  ) {}

  public async on(interaction: Interaction): Promise<void> {
    if (!interaction.isChatInputCommand()) return;

    try {
      const commandList = commands(this.client, this.guildUseCase, this.webhookUseCase);
      const command = commandList.find((command) => command.schema.name === interaction.commandName);

      if (!command) {
        await commandNotFoundError(interaction);
        return;
      }

      if (!command.schema.allowDM && !interaction.guild) {
        await notAllowedDMError(interaction);
        return;
      }

      switch (command.schema.permission) {
        case "ManageGuild":
          if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild)) {
            await noServerManagePermissionError(interaction);
            return;
          }
      }

      if (!command.hasSubcommands) {
        await command.on(interaction);
        return;
      }

      if (interaction.options.getSubcommandGroup()) {
        const subcommandGroup = command.subcommandGroups.find(
          (command) => command.schema.name === interaction.options.getSubcommandGroup()
        );

        if (!subcommandGroup) {
          await commandNotFoundError(interaction);
          return;
        }

        const subcommand = subcommandGroup.subcommands.find(
          (command) => command.schema.name === interaction.options.getSubcommand()
        );

        if (subcommand) await subcommand.on(interaction);
        else await commandNotFoundError(interaction);

        return;
      }

      const subcommand = command.subcommands.find(
        (command) => command.schema.name === interaction.options.getSubcommand()
      );

      if (subcommand) {
        await subcommand.on(interaction);
        return;
      }

      await commandNotFoundError(interaction);
    } catch (e) {
      console.error(e);
      await generalError(interaction);
    }
  }
}
