export const data = {
    name: "interactionCreate",
  };
  /**
   * @param {import("discord.js").ChatInputCommandInteraction<"cached">|import("discord.js").ButtonInteraction<"cached">|import("discord.js").AutocompleteInteraction<"cached">|import("discord.js").SelectMenuInteraction<"cached">|import("discord.js").ModalSubmitInteraction<"cached">|import("discord.js").MessageContextMenuCommandInteraction<"cached">|import("discord.js").UserContextMenuCommandInteraction} interaction
   * @param {import("../bot.js").Bot} client
   */
  export async function execute(interaction, client) {
    if (interaction.isCommand()) {
      const command = client.cmds.get(interaction.commandName);
      if (!command) return;
      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error(error);
        let pick = 0;
        const options = ["reply", "editReply"];
        if (interaction.replied || interaction.deferred) pick = 1;
        await interaction[options[pick]]({
          content: "There was an error while executing this command!",
        });
      }
  
      
  
    } else if (interaction.isButton()) {
      let button =
        client.buttons.get(interaction.customId) ||
        (client.settings.departments.has(interaction.customId)
          ? client.buttons.get("role_link")
          : undefined);
  
      if (!button) return;
      try {
        await button.execute(interaction, client);
      } catch (error) {
        console.error(error);
      }
    } else if (interaction.isAutocomplete()) {
      const command = client.cmds.get(interaction.commandName);
      if (!command) return;
      try {
        await command.autocomplete(interaction, client);
      } catch (error) {
        console.error(error);
      }
    } else if (interaction.isStringSelectMenu()) {
      let selectMenu = client.selectMenus.get(interaction.customId);
  
      if (!selectMenu) return;
      try {
        await selectMenu.execute(interaction, client);
      } catch (error) {
        console.log(error);
      }
    } else if (interaction.isUserContextMenuCommand()) {
      if (!interaction.isUserContextMenuCommand()) return;
      console.log(interaction);
    } else if (interaction.isMessageContextMenuCommand()) {
      if (!interaction.isMessageContextMenuCommand()) return;
      console.log(interaction);
    } else if (interaction.isModalSubmit()) {
      if (!interaction.isModalSubmit()) return;
      if(interaction.customId === "tickets_mdl" || interaction.customId === "marks_mdl" || interaction.customId === "startup_mdl" || interaction.customId === "release_mdl" || interaction.customId === "reinvites_mdl") {
        const cmd = await client.cmds.get("config");
        if (!cmd) return;
        try {
          cmd.handleModals(interaction, client);
        } catch (error) {
          console.error(error);
        }
      
      }
    }
  }
  