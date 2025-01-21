import { LosaGameDB } from "@/lib/prisma";
import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("whoami")
  .setDescription("Tells you who you are in this guild!");

export async function execute(interaction: CommandInteraction) {
  const existUser = await LosaGameDB.userMemberDB.findUnique({
    where: {
      userID: interaction.user.id,
    },
    include: {
      gameinfo: true,
      cashinfo: true,
      walletinfo: true,
    },
  });

  if (
    !interaction.guild ||
    !interaction.member ||
    !interaction.user ||
    !existUser
  ) {
    return interaction.reply({
      content: "This command can only be used in a guild.",
      ephemeral: true,
    });
  }

  const user = interaction.user;
  const member = interaction.guild.members.cache.get(user.id);

  const userEmbed = new EmbedBuilder()
    .setColor(0x1f8b4c)
    .setTitle("Who Am I?")
    .setThumbnail(user.displayAvatarURL({ size: 512, extension: "png" }))
    .addFields(
      { name: "Username", value: `${user.tag}`, inline: true },
      { name: "User ID", value: `${user.id}`, inline: true },
      {
        name: "Nickname",
        value: `${member?.nickname || member?.displayName || "None"}`,
        inline: true,
      },
      {
        name: "Joined Server",
        value: `${member?.joinedAt?.toLocaleString() || "Unknown"}`,
        inline: true,
      },
      {
        name: "Account Created",
        value: `${user.createdAt.toLocaleString()}`,
        inline: true,
      },
      {
        name: "Roles",
        value:
          member?.roles.cache
            .filter((role) => role.name !== "@everyone")
            .map((role) => role.name)
            .join(", ") || "No roles",
      },
      {
        name: "Boost",
        value: member?.premiumSince
          ? `Yes (${member.premiumSince.toLocaleString()})`
          : "No",
      }
    )
    .addFields(
      {
        name: "In Game Name",
        value: existUser?.nickName || "None",
        inline: true,
      },
      {
        name: "In Game Level",
        value: existUser?.gameinfo?.userLevel.toString() || "None",
        inline: true,
      }
    )
    .addFields({
      name: "Cash",
      value: existUser?.cashinfo?.amtCash.toString() || "None",
      inline: true,
    })
    .setTimestamp()
    .setFooter({
      text: `Requested by ${user.tag}`,
      iconURL: user.displayAvatarURL({ size: 64, extension: "png" }),
    });

  return interaction.reply({
    embeds: [userEmbed],
    ephemeral: true,
  });
}
