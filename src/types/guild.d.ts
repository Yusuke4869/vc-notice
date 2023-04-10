import type { Snowflake } from "discord.js";

import { languages } from "../util";
import type { Member } from "./member";

export interface Guild {
  name: string;
  id: Snowflake;
  lang: keyof typeof languages;
  webhookUrl: string | undefined;
  members: Member[];
}
