import type { TLanguage } from "../types/language";

type SlashCommandSubcommandConfig = {
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
};

export type SlashCommandConfig = {
  name: string;
  description: {
    [key in TLanguage]: string;
  };
  allowDM: boolean;
  permissions?: bigint | null;
  subCommands?: SlashCommandSubcommandConfig[];
};
