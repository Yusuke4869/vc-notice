import type { Snowflake } from "discord.js";

import { languages } from "../util";

export interface GuildData {
  guildName: string;
  guildId: Snowflake;
  lang: keyof typeof languages;
  webhookUrl: string | undefined;
}
