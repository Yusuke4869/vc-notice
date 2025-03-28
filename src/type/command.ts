import type { LanguageRecord } from "./language";
import type { ApplicationCommandOptionAllowedChannelTypes, PermissionResolvable } from "discord.js";

export interface Options {
  booleanOptions?: {
    name: LanguageRecord<string>;
    description: LanguageRecord<string>;
    required: boolean;
  }[];
  channelOptions?: {
    name: LanguageRecord<string>;
    description: LanguageRecord<string>;
    required: boolean;
    channelTypes: ApplicationCommandOptionAllowedChannelTypes[];
  }[];
  integerOptions?: {
    name: LanguageRecord<string>;
    description: LanguageRecord<string>;
    required: boolean;
    minValue?: number;
    maxValue?: number;
    choices?: {
      name: LanguageRecord<string>;
      value: number;
    }[];
  }[];
  mentionableOptions?: {
    name: LanguageRecord<string>;
    description: LanguageRecord<string>;
    required: boolean;
  }[];
  numberOptions?: {
    name: LanguageRecord<string>;
    description: LanguageRecord<string>;
    required: boolean;
    minValue?: number;
    maxValue?: number;
    choices?: {
      name: LanguageRecord<string>;
      value: number;
    }[];
  }[];
  roleOptions?: {
    name: LanguageRecord<string>;
    description: LanguageRecord<string>;
    required: boolean;
  }[];
  stringOptions?: {
    name: LanguageRecord<string>;
    description: LanguageRecord<string>;
    required: boolean;
    minLength?: number;
    maxLength?: number;
    choices?: {
      name: LanguageRecord<string>;
      value: string;
    }[];
  }[];
  userOptions?: {
    name: LanguageRecord<string>;
    description: LanguageRecord<string>;
    required: boolean;
  }[];
}

export interface Subcommand {
  name: string;
  description: LanguageRecord<string>;
  botPermissions?: PermissionResolvable;
  options?: Options;
}

export interface SubcommandGroup {
  name: string;
  description: LanguageRecord<string>;
  subcommands: Subcommand[];
}

export interface Command {
  name: string;
  description: LanguageRecord<string>;
  allowDM: boolean;
  permission: "ManageGuild" | null;
  botPermissions?: PermissionResolvable;
  options?: Options;
  subcommands?: Subcommand[];
  subcommandGroups?: SubcommandGroup[];
}
