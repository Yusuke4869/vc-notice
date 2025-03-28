import type { GuildDomain, GuildField, MemberField } from "./interface";
import type { Language } from "../../type/language";
import type { NoticeOption } from "../../type/notice-option";
import type { RoleMention, Snowflake } from "discord.js";

export class GuildDummy implements GuildDomain {
  public readonly name: string = "dummy";
  public readonly id: Snowflake = "123456789012345678";
  public readonly language: Language = "ja";
  public readonly webhookUrl: string | undefined = undefined;
  public readonly botDisabled: boolean | undefined = undefined;
  public readonly joinMention: RoleMention | undefined = undefined;
  public readonly noticeMode: NoticeOption | undefined = undefined;
  public readonly members: MemberField[] = [];

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
