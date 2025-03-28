import { MessageFlags } from "discord.js";

import { buildEmbed } from "../../util/embed";
import { generalError } from "../error";

import type { Command } from "../../type/command";
import type { EmbedContent } from "../../type/embed";
import type { CommandInteractionInterface } from "../interface";
import type { Client, CommandInteraction } from "discord.js";

export class PingCommand implements CommandInteractionInterface<Command> {
  public readonly hasSubcommands = false;
  public readonly schema: Command = {
    name: "ping",
    description: {
      en: "Check the bot's latency",
      ja: "ボットのレイテンシを確認します",
    },
    permission: null,
    allowDM: true,
  };

  constructor(private readonly client: Client) {}

  public embed(): EmbedContent {
    const ping = Math.floor(this.client.ws.ping).toString();

    return {
      en: {
        title: "🏓 Pong!",
        fields: [
          {
            name: "Latency",
            value: `${ping}ms`,
          },
        ],
      },
      ja: {
        title: "🏓 Pong!",
        fields: [
          {
            name: "レイテンシ",
            value: `${ping}ms`,
          },
        ],
      },
    };
  }

  public async on(interaction: CommandInteraction) {
    try {
      await interaction.reply({
        embeds: [buildEmbed(this.embed(), interaction.locale)],
        flags: MessageFlags.Ephemeral,
      });
    } catch (e) {
      console.error(e);
      await generalError(interaction);
    }
  }
}
