import { Locale } from "discord.js";

import { Language } from "../types";

import type { TLanguage } from "../types";

export const locale2language = (loc: Locale): TLanguage => {
  if (loc === Locale.EnglishUS) return Language.English;
  else if (loc === Locale.EnglishGB) return Language.English;
  else if (loc === Locale.Japanese) return Language.Japanese;
  else return Language.English;
};

export const getLanguageText = (lang: TLanguage): string => {
  if (lang === Language.English) return "English";
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  else if (lang === Language.Japanese) return "日本語";
  else return "English";
};
