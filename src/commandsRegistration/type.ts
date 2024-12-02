import type { TLanguage } from "../types/language";

interface SlashCommandSubcommandConfig {
  name: string;
  description: Record<TLanguage, string>;
  stringOptions?: {
    name: string;
    description: Record<TLanguage, string>;
    required: boolean;
    choices: {
      name: Record<TLanguage, string>;
      value: string;
    }[];
  }[];
  booleanOptions?: {
    name: string;
    description: Record<TLanguage, string>;
    required: boolean;
  }[];
  roleMentionOptions?: {
    name: string;
    description: Record<TLanguage, string>;
    required: boolean;
  }[];
  voiceChannelOptions?: {
    name: string;
    description: Record<TLanguage, string>;
    required: boolean;
  }[];
}

export interface SlashCommandConfig {
  name: string;
  description: Record<TLanguage, string>;
  allowDM: boolean;
  permissions?: bigint | null;
  subCommands?: SlashCommandSubcommandConfig[];
}
