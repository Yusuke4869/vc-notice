import type { Snowflake } from "discord.js";

import type { TLanguage } from "./language";

export interface Member {
  name: string;
  id: Snowflake;
  joinedAt: number | null;
  totalTime: number;
}

export interface Guild {
  name: string;
  id: Snowflake;
  lang: TLanguage;
  webhookUrl: string | undefined;
  members: Member[];
}
