import { roleMention } from "discord.js";

import { buildEmbed } from "../../util/embed";
import { generalError, notFoundGuildError, argumentTypeError } from "../error";
import { getOption } from "../option";

import type { Subcommand } from "../../type/command";
import type { EmbedContent } from "../../type/embed";
import type { GuildUseCaseInterface } from "../../usecase/guild/interface";
import type { CommandInteractionInterface } from "../interface";
import type { CommandInteraction, Guild, RoleMention } from "discord.js";

export class NoticeMentionJoinCommand implements CommandInteractionInterface<Subcommand> {
  public readonly hasSubcommands = false;
  public readonly schema: Subcommand = {
    name: "join",
    description: {
      en: "Set the role mention when join VC",
      ja: "入室通知時のロールメンションを設定します",
    },
    options: {
      roleOptions: [
        {
          name: {
            en: "role",
            ja: "ロール",
          },
          description: {
            en: "Select the role to mention",
            ja: "メンションするロールを選択してください",
          },
          required: true,
        },
      ],
    },
  };

  constructor(private readonly guildUseCase: GuildUseCaseInterface) {}

  public embed(mention: RoleMention): EmbedContent {
    return {
      en: {
        title: "Set role mention when join VC",
        description: mention,
        footer: {
          text: "NOT mentioned when moving between voice channels",
        },
      },
      ja: {
        title: "入室通知時のメンションを設定しました",
        description: mention,
        footer: {
          text: "ボイスチャンネル間の移動ではメンションされません",
        },
      },
    };
  }

  private async createGuild(guild: Guild, joinMention: RoleMention) {
    const res = await this.guildUseCase.upsertGuild({
      name: guild.name,
      id: guild.id,
      language: undefined,
      webhookUrl: undefined,
      botDisabled: undefined,
      joinMention,
      noticeMode: undefined,
      members: [],
    });

    return res;
  }

  public async on(interaction: CommandInteraction) {
    try {
      if (!interaction.guild) {
        await notFoundGuildError(interaction);
        return;
      }

      const role = getOption(interaction, "role")?.role;
      if (!role) {
        await argumentTypeError(interaction, { en: "role", ja: "ロール" });
        return;
      }

      const mention = role.name === "@everyone" ? "@everyone" : roleMention(role.id);
      const guild = await this.guildUseCase.findGuild(interaction.guild.id);
      if (guild) await this.guildUseCase.updateGuild(guild, { joinMention: mention });
      else await this.createGuild(interaction.guild, mention);

      await interaction.reply({
        embeds: [buildEmbed(this.embed(mention), interaction.locale)],
      });
    } catch (e) {
      console.error(e);
      await generalError(interaction);
    }
  }
}
