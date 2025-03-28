import { Guild } from "../../domain/guild/impl";

import type { GuildRepositoryInterface } from "./interface";
import type { GuildField } from "../../domain/guild/interface";
import type { Collection } from "mongodb";

export class GuildRepository implements GuildRepositoryInterface {
  constructor(private readonly collection: Collection<GuildField>) {}

  public async findGuild(id: string): Promise<Guild | null> {
    try {
      const guild = await this.collection.findOne({ id });
      return guild ? new Guild(guild) : null;
    } catch (e) {
      console.error(e);
      throw new Error("failed to find guild");
    }
  }

  public async updateGuild(
    guild: Guild,
    fields: Partial<Omit<GuildField, "id" | "members">>,
    memberFields?: GuildField["members"]
  ): Promise<Guild> {
    try {
      const res = await this.upsertGuild({
        ...guild.getAllField(),
        ...fields,
        members: memberFields
          ? [...guild.members.filter((m) => !memberFields.some((mf) => mf.id === m.id)), ...memberFields]
          : guild.members,
      });

      return res;
    } catch (e) {
      console.error(e);
      throw new Error("failed to update guild");
    }
  }

  public async upsertGuild(fields: GuildField): Promise<Guild> {
    try {
      const res = await this.collection.replaceOne({ id: fields.id }, fields, { upsert: true });
      if (typeof res.acknowledged !== "boolean" || !res.acknowledged) throw new Error("failed to upsert guild");

      return new Guild(fields);
    } catch (e) {
      console.error(e);
      throw new Error("failed to upsert guild");
    }
  }

  public async deleteGuild(guild: Guild): Promise<void> {
    try {
      const res = await this.collection.deleteOne({ id: guild.id });
      if (!res.acknowledged) throw new Error("failed to delete guild");
    } catch (e) {
      console.error(e);
      throw new Error("failed to delete guild");
    }
  }

  public async deleteGuildById(id: string): Promise<void> {
    try {
      const res = await this.collection.deleteOne({ id });
      if (!res.acknowledged) throw new Error("failed to delete guild");
    } catch (e) {
      console.error(e);
      throw new Error("failed to delete guild");
    }
  }
}
