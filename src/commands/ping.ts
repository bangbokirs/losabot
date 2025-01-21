import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong!");

export async function execute(interaction: CommandInteraction) {
  console.log("ping command executed");
  console.info(interaction);
  return interaction.reply(`Hello ${interaction.user.displayName}!`);
}
