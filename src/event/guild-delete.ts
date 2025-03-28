import type { GuildUseCaseInterface } from "../usecase/guild/interface";
import type { Guild } from "discord.js";

export class GuildDelete {
  constructor(private readonly guildUseCase: GuildUseCaseInterface) {}

  public async on(guild: Guild): Promise<void> {
    await this.guildUseCase.deleteGuildById(guild.id);
  }
}
