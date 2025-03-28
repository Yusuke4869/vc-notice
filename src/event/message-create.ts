import type { Message, OmitPartialGroupDMChannel } from "discord.js";

export class MessageCreate {
  // eslint-disable-next-line @typescript-eslint/require-await
  public async on(message: OmitPartialGroupDMChannel<Message>): Promise<void> {
    if (message.author.bot || message.author.system) return;
  }
}
