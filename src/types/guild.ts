import type { Snowflake } from "discord.js";

import type { TLanguage } from "./language";
import type { Member } from "./member";

export interface Guild {
  name: string;
  id: Snowflake;
  lang: TLanguage;
  webhookUrl: string | undefined;
  members: Member[];
}
