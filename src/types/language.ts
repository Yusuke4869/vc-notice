export const Language = {
  English: "en",
  Japanese: "ja",
} as const;

export type TLanguage = (typeof Language)[keyof typeof Language];
