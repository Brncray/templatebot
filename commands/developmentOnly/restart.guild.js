/** @type {import("../../bot.js").Command} */
export const data = {
    name: "restart",
    type: 1,
    description: "Restarts the Discord Bot",
    dm_permission: false,
    default_member_permissions: 0,
    guild: '1201605268937658418'
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
        ephemeral: true
      });
    }
  
    await interaction.deleteReply();
    let timeout = 10000;
  
    try {
      const restartmsg = await interaction.channel?.send({
        content: `Restarting ${client.user}...`,
        ephemeral: false,
        fetchReply: true
      });
  
      // Delay for 3 seconds before editing the message
      setTimeout(async () => {
        await restartmsg.edit({
          content: `Restarted Successfully!`,
          ephemeral: false
        });
        process.exit();
      }, timeout);
    } catch (error) {
      console.log(error);
      return interaction.reply({
        content: `Error while Restarting ${client.user}: ${error}`,
        ephemeral: false
      });
    }
  }