import type { Snowflake } from "discord.js";

export interface Member {
  name: string;
  id: Snowflake;
  joinedAt: number | null;
  totalTime: number;
}
