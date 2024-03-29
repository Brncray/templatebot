import { premiumCode, guildSettings } from "../../data/mongodb.js";
/** @type {import("../../bot.js").Command} */
export const data = {
  name: "get-premium",
  type: 1,
  description: "Use a premium code",
  dm_permission: false,
  default_member_permissions: 0,
  options: [
    {
      name: "code",
      description: "What code to use",
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
  await interaction.deferReply({ ephemeral: false });

  const code = interaction.options.get("code")?.value;

  const codeData = await premiumCode.findOne({
    code: code,
  });

  if (!codeData) {
    return interaction.editReply({
      content: "Invalid code",
      ephemeral: true,
    });
  }
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
  if (serverConfig.premium) {
    return interaction.editReply({
      content: "Server already has premium",
      ephemeral: true,
    });
  }
  serverConfig.premium = true;
  await serverConfig.save();
  codeData.uses -= 1;
  if (codeData.uses <= 0) {
    await premiumCode.deleteOne({
      code: code,
    });
  } else {
    await codeData.save();
  }
  await interaction.editReply({
    content: "Code used successfully",
    ephemeral: true,
  });
}
