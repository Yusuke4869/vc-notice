import type { GuildDomain, GuildField } from "../../domain/guild/interface";

export interface GuildRepositoryInterface {
  findGuild(id: string): Promise<GuildDomain | null>;
  updateGuild(
    guild: GuildDomain,
    fields: Partial<Omit<GuildField, "id" | "members">>,
    memberFields?: GuildField["members"]
  ): Promise<GuildDomain>;
  upsertGuild(fields: GuildField): Promise<GuildDomain>;
  deleteGuild(guild: GuildDomain): Promise<void>;
  deleteGuildById(id: string): Promise<void>;
}
