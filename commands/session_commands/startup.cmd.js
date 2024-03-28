import { guildSettings } from "../../data/mongodb.js";
/** @type {import("../../bot.js").Command} */
export const data = {
  name: "startup",
  type: 1,
  description: "Start a session",
  dm_permission: false,
  default_member_permissions: 0,
  options: [
    {
      name: "reactions",
      description: "Amount of reactions needed",
      type: 4,
      required: true,
      min_value: 1,
    },
  ],
};

/**
 *
 * @param {import("discord.js").ChatInputCommandInteraction<'cached'>} interaction
 * @param {import("../../bot.js").Bot} client
 */
export async function execute(interaction, client) {
  if (!interaction.member.permissions.has("ManageMessages")) {
    return interaction.reply({
      content:
        "You are missing the proper permission (``MANAGE_MESSAGES``) to use this command.",
      ephemeral: true,
    });
  }
  await interaction.deferReply({ ephemeral: false });
  const reactions = interaction.options.getInteger("reactions");
  let serverConfig = await guildSettings.findOne({
    guildId: interaction.guild.id,
  });
  if (!serverConfig) {
    const settings = new guildSettings({
      guildId: interaction.guild.id,
      guildOwner: interaction.guild.ownerId,
    });
    await settings.save();
    serverConfig = await guildSettings.findOne({
      guildId: interaction.guild.id,
    });
  }
  const embed = serverConfig.startupEmbed;
  if (embed.description.includes("{reactions}")) {
    embed.description = embed.description.replace("{reactions}", reactions);
  }
  if (embed.description.includes("{server}")) {
    embed.description = embed.description.replace(
      "{server}",
      interaction.guild.name
    );
  }
  if (embed.description.includes("{user}")) {
    embed.description = embed.description.replace(
      "{user}",
      `<@${interaction.user.id}>`
    );
  }

  // take the pings, which are seperate by commas that may or may not have spaces, and put them in a string
    let pings = serverConfig.pings.join(", ");

    // if there are no pings, set the string to "null"
    if (pings === "") {
      pings = null;
    }
  const message = await interaction.editReply({
    content: pings,
    embeds: [embed],
  });
  if (!serverConfig.title === "Server not configured")  await message.react("✅");
}
