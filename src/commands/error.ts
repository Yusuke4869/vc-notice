import type { ChatInputCommandInteraction } from "discord.js";

const UNKNOWN_INTERACTION_ERROR_CODE = 10062;

const extractErrorCode = (error: unknown): number | undefined => {
  if (typeof error !== "object" || !error || !("code" in error)) return undefined;
  const { code } = error as { code: unknown };
  return typeof code === "number" ? code : undefined;
};

export const handleCommandError = async (interaction: ChatInputCommandInteraction, error: unknown) => {
  if (extractErrorCode(error) === UNKNOWN_INTERACTION_ERROR_CODE) {
    console.error(`Unknown interaction: /${interaction.commandName}`);
    return;
  }

  console.error(error);

  try {
    if (interaction.deferred) {
      await interaction.followUp({
        content: "An unexpected error occurred. Please try again.",
        ephemeral: true,
      });
      return;
    }

    if (!interaction.replied) {
      await interaction.reply({
        content: "An unexpected error occurred. Please try again.",
        ephemeral: true,
      });
    }
  } catch (replyError) {
    console.error(replyError);
  }
};
