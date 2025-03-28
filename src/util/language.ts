import { Locale } from "discord.js";

import { language } from "../type/language";

import type { Language } from "../type/language";

export const getLanguageFromLocale = (locale: Locale): Language => {
  switch (locale) {
    case Locale.EnglishUS:
    case Locale.EnglishGB:
      return language.English;
    case Locale.Japanese:
      return language.Japanese;
    default:
      return language.English;
  }
};

export const getLanguageText = (lang: Language): string => {
  switch (lang) {
    case language.English:
      return "English";
    case language.Japanese:
      return "日本語";
    default:
      return "English";
  }
};
