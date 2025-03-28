import { AboutCommand } from "./impl/about";
import { NoticeCommand } from "./impl/notice";
import { NoticeBotCommand } from "./impl/notice-bot";
import { NoticeChannelCommand } from "./impl/notice-channel";
import { NoticeLanguageCommand } from "./impl/notice-language";
import { NoticeMentionCommand } from "./impl/notice-mention";
import { NoticeMentionJoinCommand } from "./impl/notice-mention-join";
import { NoticeMentionResetCommand } from "./impl/notice-mention-reset";
import { NoticeOptionCommand } from "./impl/notice-option";
import { NoticeSetCommand } from "./impl/notice-set";
import { PingCommand } from "./impl/ping";

import type { CommandInteractionInterface, CommandInteractionWithSubcommandsInterface } from "./interface";
import type { Command } from "../type/command";
import type { GuildUseCaseInterface } from "../usecase/guild/interface";
import type { WebhookUseCaseInterface } from "../usecase/webhook/interface";
import type { Client } from "discord.js";

export const commands = (
  client: Client,
  guildUseCase: GuildUseCaseInterface,
  webhookUseCase: WebhookUseCaseInterface
): (CommandInteractionInterface<Command> | CommandInteractionWithSubcommandsInterface)[] => [
  new AboutCommand(),
  new PingCommand(client),
  new NoticeCommand(
    [
      new NoticeBotCommand(guildUseCase),
      new NoticeChannelCommand(guildUseCase, webhookUseCase),
      new NoticeLanguageCommand(guildUseCase),
      new NoticeOptionCommand(guildUseCase),
      new NoticeSetCommand(guildUseCase, webhookUseCase),
    ],
    [
      new NoticeMentionCommand([
        new NoticeMentionJoinCommand(guildUseCase),
        new NoticeMentionResetCommand(guildUseCase),
      ]),
    ]
  ),
];

export const commandSchemas = (
  client: Client,
  guildUseCase: GuildUseCaseInterface,
  webhookUseCase: WebhookUseCaseInterface
): Command[] => commands(client, guildUseCase, webhookUseCase).map((command) => command.schema);
