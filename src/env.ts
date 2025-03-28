import { config } from "dotenv";

import type { ColorResolvable, HexColorString } from "discord.js";

config();

const { MONGODB_URI, MONGODB_DB_NAME, MONGODB_DB_COLLECTION_NAME, DISCORD_BOT_TOKEN, DEFAULT_HEX_COLOR } = process.env;

if (!MONGODB_URI) throw new Error("MONGODB_URI is NOT defined");
if (!DISCORD_BOT_TOKEN) throw new Error("DISCORD_BOT_TOKEN is NOT defined");

const isHexColorString = (color: string | undefined): color is HexColorString =>
  color ? /^#[0-9a-f]{6}$/i.test(color) : false;

const defaultColor = (isHexColorString(DEFAULT_HEX_COLOR) ? DEFAULT_HEX_COLOR : "#FAA61A") satisfies ColorResolvable;

export const env = {
  MONGODB_URI,
  MONGODB_DB_NAME: MONGODB_DB_NAME ?? "bots",
  MONGODB_DB_COLLECTION_NAME: MONGODB_DB_COLLECTION_NAME ?? "vc-notice",
  DISCORD_BOT_TOKEN,
  DEFAULT_COLOR: defaultColor,
} as const;
