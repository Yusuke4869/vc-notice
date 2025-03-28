import type { GuildDomain, GuildField, MemberField } from "./interface";
import type { Language } from "../../type/language";
import type { NoticeOption } from "../../type/notice-option";
import type { RoleMention, Snowflake } from "discord.js";

export class Guild implements GuildDomain {
  public readonly name: string;
  public readonly id: Snowflake;
  public readonly language: Language | undefined;
  public readonly webhookUrl: string | undefined;
  public readonly botDisabled: boolean | undefined;
  public readonly joinMention: RoleMention | undefined;
  public readonly noticeMode: NoticeOption | undefined;
  public readonly members: MemberField[];

  constructor({ name, id, language, webhookUrl, botDisabled, joinMention, noticeMode, members }: GuildField) {
    this.name = name;
    this.id = id;
    this.language = language;
    this.webhookUrl = webhookUrl;
    this.botDisabled = botDisabled;
    this.joinMention = joinMention;
    this.noticeMode = noticeMode;
    this.members = members;
  }

  public getAllField(): GuildField {
    return {
      name: this.name,
      id: this.id,
      language: this.language,
      webhookUrl: this.webhookUrl,
      botDisabled: this.botDisabled,
      joinMention: this.joinMention,
      noticeMode: this.noticeMode,
      members: this.members,
    };
  }
}
