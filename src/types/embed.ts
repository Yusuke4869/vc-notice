import type { TLanguage } from "./language";
import type { voiceChannelActivityType } from "./vc";
import type { APIEmbedField, ColorResolvable, EmbedAuthorOptions, EmbedFooterOptions } from "discord.js";

export type EmbedContents = Record<
  TLanguage,
  {
    title: string | null;
    description?: string | null;
    author?: EmbedAuthorOptions | null;
    color?: ColorResolvable | null;
    url?: string | null;
    image?: string | null;
    thumbnail?: string | null;
    footer?: EmbedFooterOptions | null;
    timestamp?: number | Date | null | undefined;
    fields?: APIEmbedField[] | null;
  }
>;

export type NoticeEmbedText = Record<
  TLanguage,
  {
    title: Record<voiceChannelActivityType, string>;
    description: Record<voiceChannelActivityType, string>;
    footer: {
      callTime: string;
    };
    color: Record<voiceChannelActivityType, ColorResolvable>;
  }
>;
