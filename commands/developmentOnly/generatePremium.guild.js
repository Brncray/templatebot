import { premiumCode } from "../../data/mongodb.js";
/** @type {import("../../bot.js").Command} */
export const data = {
  name: "generate",
  type: 1,
  description: "Generates a premium code",
  dm_permission: false,
  default_member_permissions: 0,
  guild: "1201605268937658418",
  options: [
    {
      name: "uses",
      description: "The amount of uses the code will have",
      type: 4,
      required: false,
    },
    {
      name: "code",
      description: "The code to generate",
      type: 3,
      required: false,
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
  if (interaction.member.id != "539213950688952320") {
    return interaction.reply({
      content: "You do not have the proper permissions to use this command.",
      ephemeral: true,
    });
  }
  const uses = interaction.options.get("uses")?.value || 1;
  const code =
    interaction.options.get("code")?.value ||
    Math.random().toString(36).substring(2, 8);

  const newCode = new premiumCode({
    code: code,
    uses: uses,
  });
  await newCode.save();
  await interaction.editReply({
    content: `Generated code: ${code} with ${uses} uses`,
    ephemeral: false,
  });
}
