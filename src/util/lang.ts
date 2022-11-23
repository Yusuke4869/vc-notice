export const languages = {
  en: ["en", "english", "英語"],
  ja: ["ja", "japanese", "日本語"],
};

export const str2langType = (language: string) => {
  if (language.toLowerCase() in languages.en) return "en";
  else if (language.toLowerCase() in languages.ja) return "ja";
  else return "en";
};
