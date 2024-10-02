import type { TLanguage } from "../types/language";

interface SlashCommandSubcommandConfig {
  name: string;
  description: {
    [key in TLanguage]: string;
  };
  stringOptions?: {
    name: string;
    description: {
      [key in TLanguage]: string;
    };
    required: boolean;
    choices: {
      name: {
        [key in TLanguage]: string;
      };
      value: string;
    }[];
  }[];
  booleanOptions?: {
    name: string;
    description: {
      [key in TLanguage]: string;
    };
    required: boolean;
  }[];
  roleMentionOptions?: {
    name: string;
    description: {
      [key in TLanguage]: string;
    };
    required: boolean;
  }[];
}

export interface SlashCommandConfig {
  name: string;
  description: {
    [key in TLanguage]: string;
  };
  allowDM: boolean;
  permissions?: bigint | null;
  subCommands?: SlashCommandSubcommandConfig[];
}
