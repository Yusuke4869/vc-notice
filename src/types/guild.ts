import type { TLanguage } from "./language";
import type { Snowflake } from "discord.js";

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
  botDisabled: boolean | undefined;
  joinMention: "@everyone" | `<@&${string}>` | undefined;
  noticeMode: "all" | "join-only" | "join-leave" | "stream-video" | undefined;
  members: Member[];
}
