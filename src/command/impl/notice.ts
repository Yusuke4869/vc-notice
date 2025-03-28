import type { Command, Subcommand } from "../../type/command";
import type {
  CommandInteractionInterface,
  CommandInteractionSubcommandGroupInterface,
  CommandInteractionWithSubcommandsInterface,
} from "../interface";

export class NoticeCommand implements CommandInteractionWithSubcommandsInterface {
  public readonly hasSubcommands = true;
  private readonly _schema: Command = {
    name: "notice",
    description: {
      en: "Set the notification settings",
      ja: "通知関連の設定を行います",
    },
    allowDM: false,
    permission: "ManageGuild",
  };

  public readonly subcommands: CommandInteractionInterface<Subcommand>[];
  public readonly subcommandGroups: CommandInteractionSubcommandGroupInterface[];

  constructor(
    subcommands: CommandInteractionInterface<Subcommand>[],
    subcommandGroups: CommandInteractionSubcommandGroupInterface[]
  ) {
    this.subcommands = subcommands;
    this.subcommandGroups = subcommandGroups;
  }

  public get schema(): Command {
    const schema: Command = {
      ...this._schema,
      subcommands: this.subcommands.map((subcommand) => subcommand.schema),
      subcommandGroups: this.subcommandGroups.map((subcommandGroup) => subcommandGroup.schema),
    };

    return schema;
  }
}
