import type { SubcommandGroup, Subcommand } from "../../type/command";
import type { CommandInteractionSubcommandGroupInterface, CommandInteractionInterface } from "../interface";

export class NoticeMentionCommand implements CommandInteractionSubcommandGroupInterface {
  public readonly hasSubcommands = true;
  private readonly _schema: Omit<SubcommandGroup, "subcommands"> = {
    name: "mention",
    description: {
      en: "Set the mention settings when notified",
      ja: "通知時のメンションの設定を行います",
    },
  };

  public readonly subcommands: CommandInteractionInterface<Subcommand>[] = [];

  constructor(subcommands: CommandInteractionInterface<Subcommand>[]) {
    this.subcommands = subcommands;
  }

  public get schema(): SubcommandGroup {
    const schema: SubcommandGroup = {
      ...this._schema,
      subcommands: this.subcommands.map((subcommand) => subcommand.schema),
    };

    return schema;
  }
}
