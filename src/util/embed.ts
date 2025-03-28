import { EmbedBuilder } from "discord.js";

import { getLanguageFromLocale } from "./language";
import { env } from "../env";

import type { EmbedContent } from "../type/embed";
import type { Language } from "../type/language";
import type { Locale } from "discord.js";

const { DEFAULT_COLOR } = env;

export const buildEmbed = (content: EmbedContent, locale: Locale, language?: Language): EmbedBuilder => {
  const lang = language ?? getLanguageFromLocale(locale);
  const field = content[lang];

  const res = new EmbedBuilder()
    .setTitle(field.title ?? null)
    .setDescription(field.description ?? null)
    .setAuthor(field.author ?? null)
    .setColor(field.color ?? DEFAULT_COLOR)
    .setURL(field.url ?? null)
    .setImage(field.image ?? null)
    .setThumbnail(field.thumbnail ?? null)
    .setFooter(field.footer ?? null)
    .setTimestamp(field.timestamp ?? null)
    .addFields(field.fields ?? []);
  return res;
};
