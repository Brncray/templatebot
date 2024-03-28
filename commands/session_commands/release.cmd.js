import { guildSettings } from "../../data/mongodb.js";
/** @type {import("../../bot.js").Command} */
export const data = {
  name: "release",
  type: 1,
  description: "Release a session",
  dm_permission: false,
  default_member_permissions: 0,
  options: [
    {
      name: "peacetime",
      description: "The peacetime of the session",
      choices: [
        {
          name: "Normal",
          value: "normal",
        },
        {
          name: "Strict",
          value: "strict",
        },
        {
          name: "Off",
          value: "off",
        },
      ],
      type: 3,
      required: true,
    },
    {
      name: "frp",
      description: "the FRP speed of the session",
      type: 4,
      required: true,
      min_value: 1,
    },
    {
      name: "link",
      description: "The link to the session",
      type: 3,
      required: true,
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
  const embed = serverConfig.releaseEmbed;
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
    if (embed.description.includes("{peacetime}")) {
        embed.description = embed.description.replace(
        "{peacetime}",
        interaction.options.getString("peacetime")
        );
    }
    if (embed.description.includes("{frp}")) {
        embed.description = embed.description.replace(
        "{frp}",
        interaction.options.getInteger("frp")
        );
    }
    if (embed.description.includes("{link}")) {
        embed.description = embed.description.replace(
        "{link}",
        interaction.options.getString("link")
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
  if (!serverConfig.title === "Server not configured")
    await message.react("✅");
}
