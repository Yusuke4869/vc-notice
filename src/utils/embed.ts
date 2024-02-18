import { ColorResolvable, EmbedBuilder, Locale } from "discord.js";

import type { EmbedContents } from "../types";
import { locale2language } from "./language";

export const defaultColor: ColorResolvable = "#faa61a";

export const buildEmbed = (contents: EmbedContents, locale: Locale) => {
  const lang = locale2language(locale);

  const res = new EmbedBuilder()
    .setTitle(contents[lang].title)
    .setDescription(contents[lang].description ?? null)
    .setAuthor(contents[lang].author ?? null)
    .setColor(contents[lang].color ?? defaultColor)
    .setURL(contents[lang].url ?? null)
    .setImage(contents[lang].image ?? null)
    .setThumbnail(contents[lang].thumbnail ?? null)
    .setFooter(contents[lang].footer ?? null)
    .setTimestamp(contents[lang].timestamp ?? null)
    .addFields(contents[lang].fields ?? []);
  return res;
};
