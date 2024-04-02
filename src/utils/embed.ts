import { ColorResolvable, EmbedBuilder, Locale } from "discord.js";

import type { EmbedContents, TLanguage } from "../types";
import { locale2language } from "./language";

export const defaultColor: ColorResolvable = "#faa61a";

/**
 * Embedを生成
 *
 * @param contents コンテンツ
 * @param locale ロケール（言語を指定するとこの値は無視されます）
 * @param language 言語
 * @returns
 */
export const buildEmbed = (contents: EmbedContents, locale: Locale, language?: TLanguage): EmbedBuilder => {
  const lang = language ?? locale2language(locale);

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
