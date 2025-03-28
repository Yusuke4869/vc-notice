import type { GuildUseCaseInterface } from "./interface";
import type { Guild } from "../../domain/guild/impl";
import type { GuildField } from "../../domain/guild/interface";
import type { GuildRepositoryInterface } from "../../repository/guild/interface";

export class GuildUseCase implements GuildUseCaseInterface {
  constructor(private readonly guildRepository: GuildRepositoryInterface) {}

  public async findGuild(id: string): Promise<Guild | null> {
    return this.guildRepository.findGuild(id);
  }

  public async updateGuild(
    guild: Guild,
    fields: Partial<Omit<GuildField, "id" | "members">>,
    memberFields?: GuildField["members"]
  ): Promise<Guild> {
    return this.guildRepository.updateGuild(guild, fields, memberFields);
  }

  public async upsertGuild(fields: GuildField): Promise<Guild> {
    return this.guildRepository.upsertGuild(fields);
  }

  public async deleteGuild(guild: Guild): Promise<void> {
    return this.guildRepository.deleteGuild(guild);
  }

  public async deleteGuildById(id: string): Promise<void> {
    return this.guildRepository.deleteGuildById(id);
  }
}
