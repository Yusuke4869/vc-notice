import type { TLanguage } from "./language";
import type { voiceChannelActivityType } from "./vc";
import type { APIEmbedField, ColorResolvable, EmbedAuthorOptions, EmbedFooterOptions } from "discord.js";

export type EmbedContents = {
  [key in TLanguage]: {
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
  };
};

export type NoticeEmbedText = {
  [key in TLanguage]: {
    title: {
      [key in voiceChannelActivityType]: string;
    };
    description: {
      [key in voiceChannelActivityType]: string;
    };
    footer: {
      callTime: string;
    };
    color: {
      [key in voiceChannelActivityType]: ColorResolvable;
    };
  };
};
