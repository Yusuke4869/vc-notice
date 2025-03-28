import type { LanguageRecord } from "./language";
import type { APIEmbedField, ColorResolvable, EmbedAuthorOptions, EmbedFooterOptions } from "discord.js";

interface EmbedContentField {
  title: string | null;
  description?: string | null;
  author?: EmbedAuthorOptions | null;
  color?: ColorResolvable | null;
  url?: string | null;
  image?: string | null;
  thumbnail?: string | null;
  footer?: EmbedFooterOptions | null;
  timestamp?: Date | number | null;
  fields?: APIEmbedField[] | null;
}

export type EmbedContent = LanguageRecord<EmbedContentField>;
