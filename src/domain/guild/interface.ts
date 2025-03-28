import type { Language } from "../../type/language";
import type { NoticeOption } from "../../type/notice-option";
import type { RoleMention, Snowflake } from "discord.js";

export interface MemberField {
  name: string;
  id: Snowflake;
  joinedAt: number | null;
  totalTime: number;
}

export interface GuildField {
  name: string;
  id: Snowflake;
  language: Language | undefined;
  webhookUrl: string | undefined;
  botDisabled: boolean | undefined;
  joinMention: RoleMention | undefined;
  noticeMode: NoticeOption | undefined;
  members: MemberField[];
}

export interface GuildDomain {
  readonly name: string;
  readonly id: Snowflake;
  readonly language: Language | undefined;
  readonly webhookUrl: string | undefined;
  readonly botDisabled: boolean | undefined;
  readonly joinMention: RoleMention | undefined;
  readonly noticeMode: NoticeOption | undefined;
  readonly members: MemberField[];

  getAllField(): GuildField;
}
