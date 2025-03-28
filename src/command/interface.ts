import type { Command, Subcommand, SubcommandGroup } from "../type/command";
import type { EmbedContent } from "../type/embed";
import type { CommandInteraction, Message } from "discord.js";

export interface CommandInteractionBaseInterface<COMMAND_SCHEMA> {
  readonly hasSubcommands: boolean;
  readonly schema: COMMAND_SCHEMA;
}

export interface CommandInteractionInterface<COMMAND_SCHEMA> extends CommandInteractionBaseInterface<COMMAND_SCHEMA> {
  readonly hasSubcommands: false;

  embed(...args: unknown[]): EmbedContent;
  on(interaction: CommandInteraction): Promise<void>;
}

export interface CommandInteractionSubcommandGroupInterface extends CommandInteractionBaseInterface<SubcommandGroup> {
  readonly hasSubcommands: true;

  readonly subcommands: CommandInteractionInterface<Subcommand>[];
}

export interface CommandInteractionWithSubcommandsInterface extends CommandInteractionBaseInterface<Command> {
  readonly hasSubcommands: true;

  readonly subcommands: CommandInteractionInterface<Subcommand>[];
  readonly subcommandGroups: CommandInteractionSubcommandGroupInterface[];
}

export interface CommandInteractionMessageInterface<COMMAND_SCHEMA>
  extends CommandInteractionInterface<COMMAND_SCHEMA> {
  onMessage(message: Message): Promise<void>;
}
