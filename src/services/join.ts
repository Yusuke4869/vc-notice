import type { Guild } from "discord.js";

import { joinEmbed } from "../embed/join";
import { buildEmbed } from "../utils";

export const join = async (guild: Guild) => {
  try {
    await guild.systemChannel?.send({ embeds: [buildEmbed(joinEmbed(), guild.preferredLocale)] });
  } catch (e) {
    console.error(e);
  }
};
