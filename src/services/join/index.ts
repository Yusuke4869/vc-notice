import { joinEmbed } from "../../old-embed/join";
import { buildEmbed } from "../../utils";

import type { Guild } from "discord.js";

export const join = async (guild: Guild) => {
  try {
    await guild.systemChannel?.send({ embeds: [buildEmbed(joinEmbed(), guild.preferredLocale)] });
  } catch (e) {
    console.error(e);
  }
};
