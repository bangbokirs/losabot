import { ActivityType, Client } from "discord.js";
import { config } from "@/lib/config";
import { commands } from "@/commands";
import { deployCommands } from "@/lib/deploy-command";

const client = new Client({
  intents: ["Guilds", "GuildMessages", "DirectMessages"],
});

client.once("ready", async () => {
  console.log("Losa bot is ready! 🤖");

  //enable this to deploy commands to all guilds
  // const guilds = await client.guilds.fetch();
  // for (const guild of guilds.values()) {
  //   await deployCommands({ guildId: guild.id });
  // }

  await deployCommands({ guildId: config.DISCORD_GUILD_ID });

  client?.user?.setActivity({
    name: "Nova Saga",
    type: ActivityType.Watching,
  });
});

client.on("guildCreate", async (guild) => {
  await deployCommands({ guildId: guild.id });
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  const { commandName } = interaction;
  if (commands[commandName as keyof typeof commands]) {
    commands[commandName as keyof typeof commands].execute(interaction);
  }
});

client.login(config.DISCORD_TOKEN);
