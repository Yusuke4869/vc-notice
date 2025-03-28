import { GuildDummy } from "../../domain/guild/dummy";

import type { GuildUseCaseInterface } from "./interface";
import type { GuildDomain } from "../../domain/guild/interface";

export class GuildUseCaseDummy implements GuildUseCaseInterface {
  public async findGuild(): Promise<null> {
    return Promise.resolve(null);
  }

  public async updateGuild(): Promise<GuildDomain> {
    return Promise.resolve(new GuildDummy());
  }

  public async upsertGuild(): Promise<GuildDomain> {
    return Promise.resolve(new GuildDummy());
  }

  public async deleteGuild(): Promise<void> {
    return Promise.resolve();
  }

  public async deleteGuildById(): Promise<void> {
    return Promise.resolve();
  }
}
