/**
 * 対応言語
 *
 * これらの言語に対応する必要がある
 *
 * {@link Language} - 対応言語の型
 *
 * {@link LanguageRecord} - 各言語をキーとしたレコード型
 */
export const language = {
  /**
   * 英語
   */
  English: "en",
  /**
   * 日本語
   */
  Japanese: "ja",
} as const;

/**
 * 対応言語の型
 *
 * それぞれの型がどの言語なのかは {@link language} を参照
 */
export type Language = (typeof language)[keyof typeof language];

export const isLanguage = (arg: string): arg is Language => Object.values(language).includes(arg as Language);

/**
 * 各言語をキーとしたレコード型
 *
 * @template T レコードの値の型
 *
 * @example
 * ```
 * const hello: LanguagesRecord<string> = {
 *  en: "Hello",
 *  ja: "こんにちは",
 * };
 * ```
 */
export type LanguageRecord<T> = Record<Language, T>;
