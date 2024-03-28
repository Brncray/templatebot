import "is-hexcolor";
import { guildSettings } from "../../data/mongodb.js";
import {
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  SlashCommandBuilder,
  ActionRowBuilder,
  Events,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import isHexcolor from "is-hexcolor";

/** @type {import("../../bot.js").Command} */
export const data = {
  name: "config",
  type: 1,
  description: "Configure the bot for your server.",
  dm_permission: false,
  default_member_permissions: 0,
  guild: "1201605268937658418",
};

/**
 *
 * @param {import("discord.js").ChatInputCommandInteraction<'cached'>} interaction
 * @param {import("../../bot.js").Bot} client
 */
export async function execute(interaction, client) {
  if (!interaction.member.permissions.has("MANAGE_GUILD")) {
    return interaction.reply({
      content:
        "You are missing the proper permission (``MANAGE_GUILD``) to use this command.",
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

  const embed = [
    {
      title: "Server Configuration",
      description:
        "\n**IMPORTANT!** You must configure __each__ embed separately. The startup commands will **not** work until you have configured them.\n\n**Available Variables:**\n{reactions} - The amount of reactions needed to start the session.\n{server} - Displays the server name.\n{user} - Displays the user who started the session.\n{frp} - The FRP speeds.\n{peacetime} - The peacetime of the session.",
      fields: [
        {
          name: "Max Tickets",
          value: serverConfig.maxTickets,
          inline: true,
        },
        {
          name: "Max Marks",
          value: serverConfig.maxMarkings,
          inline: true,
        },
      ],
    },
  ];
  const select = new StringSelectMenuBuilder()
    .setCustomId("config")
    .setPlaceholder("Select a setting to configure")
    .addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel("Tickets")
        .setValue("tickets")
        .setDescription("Configure the ticket system.")
        .setEmoji("🎟️"),
      new StringSelectMenuOptionBuilder()
        .setLabel("Marks")
        .setValue("marks")
        .setDescription("Configure the mark system.")
        .setEmoji("📌"),
      new StringSelectMenuOptionBuilder()
        .setLabel("Startup Embed")
        .setValue("startup_config")
        .setDescription("Configure the startup embed.")
        .setEmoji("🚀"),
      new StringSelectMenuOptionBuilder()
        .setLabel("Release Embed")
        .setValue("release_config")
        .setDescription("Configure the release embed.")
        .setEmoji("🔓"),
      new StringSelectMenuOptionBuilder()
        .setLabel("Reinvites Embed")
        .setValue("reinvites_config")
        .setDescription("Configure the reinvites embed.")
        .setEmoji("🔁")
    );
  const actionRow = new ActionRowBuilder().addComponents(select);

  const initialResp = await interaction.editReply({
    embeds: embed,
    components: [actionRow],
  });

  const collector = initialResp.createMessageComponentCollector({
    filter: (i) => i.user.id === interaction.user.id,
    time: 60000,
  });

  collector.on("collect", async (i) => {
    if (i.customId === "config") {
      if (i.values[0] === "tickets") {
        const modal = new ModalBuilder()
          .setCustomId("tickets_mdl")
          .setTitle("Ticket Configuration");

        const maxTickets = new TextInputBuilder()
          .setCustomId("max_tickets")
          .setPlaceholder("3")
          .setLabel("Max Tickets")
          .setStyle(TextInputStyle.Short);

        const row = new ActionRowBuilder().addComponents(maxTickets);
        modal.addComponents(row);
        i.showModal(modal);
      } else if (i.values[0] === "marks") {
        const modal = new ModalBuilder()
          .setCustomId("marks_mdl")
          .setTitle("Marking Configuration");

        const maxMarks = new TextInputBuilder()
          .setCustomId("max_marks")
          .setPlaceholder("3")
          .setLabel("Max Marks")
          .setStyle(TextInputStyle.Short);

        const row = new ActionRowBuilder().addComponents(maxMarks);
        modal.addComponents(row);
        i.showModal(modal);
      } else if (i.values[0] === "startup_config") {
        const modal = new ModalBuilder()
          .setCustomId("startup_mdl")
          .setTitle("Startup Embed Configuration");
        const title = new TextInputBuilder()
          .setCustomId("startup_title")
          .setPlaceholder("Session Starting! || Server Startup!")
          .setLabel("Title")
          .setStyle(TextInputStyle.Short);
        const description = new TextInputBuilder()
          .setCustomId("startup_description")
          .setPlaceholder(
            "Ex. {user} needs {reactions} reactions to start the session."
          )
          .setLabel("Description")
          .setStyle(TextInputStyle.Paragraph);
        const color = new TextInputBuilder()
          .setCustomId("startup_color")
          .setPlaceholder("#ff0000")
          .setLabel("Color")
          .setStyle(TextInputStyle.Short);
        const pings = new TextInputBuilder()
          .setCustomId("startup_pings")
          .setPlaceholder("@everyone, <&role> || seperate with commas")
          .setLabel("Pings")
          .setStyle(TextInputStyle.Short)
          .setRequired(false);
        const row1 = new ActionRowBuilder().addComponents(title);
        const row2 = new ActionRowBuilder().addComponents(description);
        const row3 = new ActionRowBuilder().addComponents(color);
        const row4 = new ActionRowBuilder().addComponents(pings);
        modal.addComponents(row1);
        modal.addComponents(row2);
        modal.addComponents(row3);
        modal.addComponents(row4);
        i.showModal(modal);
      } else if (i.values[0] === "release_config") {
        const modal = new ModalBuilder()
          .setCustomId("release_mdl")
          .setTitle("Release Embed Configuration");
        const title = new TextInputBuilder()
          .setCustomId("release_title")
          .setPlaceholder("Session Release")
          .setLabel("Embed Title")
          .setStyle(TextInputStyle.Short);
        const description = new TextInputBuilder()
          .setCustomId("release_description")
          .setPlaceholder("Please be sure to read...")
          .setLabel("Description")
          .setStyle(TextInputStyle.Paragraph);
        const color = new TextInputBuilder()
          .setCustomId("release_color")
          .setPlaceholder("#ff0000")
          .setLabel("Color")
          .setStyle(TextInputStyle.Short);
        const pings = new TextInputBuilder()
          .setCustomId("release_pings")
          .setPlaceholder("@everyone, <&role> || seperate with commas")
          .setLabel("Pings")
          .setStyle(TextInputStyle.Short)
          .setRequired(false);
        const row1 = new ActionRowBuilder().addComponents(title);
        const row2 = new ActionRowBuilder().addComponents(description);
        const row3 = new ActionRowBuilder().addComponents(color);
        const row4 = new ActionRowBuilder().addComponents(pings);
        modal.addComponents(row1);
        modal.addComponents(row2);
        modal.addComponents(row3);
        modal.addComponents(row4);
        i.showModal(modal);
      } else if (i.values[0] === "reinvites_config") {
        const modal = new ModalBuilder()
          .setCustomId("reinvites_mdl")
          .setTitle("Reinvites Embed Configuration");
        const title = new TextInputBuilder()
          .setCustomId("reinvites_title")
          .setPlaceholder("Reinvite Embed")
          .setLabel("Embed Title")
          .setStyle(TextInputStyle.Short);
        const description = new TextInputBuilder()
          .setCustomId("reinvites_description")
          .setPlaceholder("Please be sure to read...")
          .setLabel("Description")
          .setStyle(TextInputStyle.Paragraph);
        const color = new TextInputBuilder()
          .setCustomId("reinvites_color")
          .setPlaceholder("#ff0000")
          .setLabel("Color")
          .setStyle(TextInputStyle.Short);
        const pings = new TextInputBuilder()
          .setCustomId("reinvites_pings")
          .setPlaceholder("@everyone, <&role> || seperate with commas")
          .setLabel("Pings")
          .setStyle(TextInputStyle.Short)
          .setRequired(false);
        const row1 = new ActionRowBuilder().addComponents(title);
        const row2 = new ActionRowBuilder().addComponents(description);
        const row3 = new ActionRowBuilder().addComponents(color);
        const row4 = new ActionRowBuilder().addComponents(pings);
        modal.addComponents(row1);
        modal.addComponents(row2);
        modal.addComponents(row3);
        modal.addComponents(row4);
        i.showModal(modal);
      }
    }

    // respond to modal submit
  });
  collector.on("end", async () => {
    await interaction.editReply({
      components: [],
    });
  });
}

export async function handleModals(interaction, client) {
  if (interaction.customId === "tickets_mdl") {
    let maxTickets = parseInt(
      interaction.fields.getTextInputValue("max_tickets")
    );

    if (isNaN(maxTickets)) {
      return interaction.reply({
        content: "Please provide a valid number.",
        ephemeral: true,
      });
    }

    const serverConfig = await guildSettings.findOne({
      guildId: interaction.guild.id,
    });

    serverConfig.maxTickets = maxTickets;
    await serverConfig.save();

    interaction.reply({
      content: `Max tickets set to ${maxTickets}`,
      ephemeral: true,
    });
  } else if (interaction.customId === "marks_mdl") {
    let maxMarks = parseInt(interaction.fields.getTextInputValue("max_marks"));
    if (isNaN(maxMarks)) {
      return interaction.reply({
        content: "Please provide a valid number.",
        ephemeral: true,
      });
    }

    const serverConfig = await guildSettings.findOne({
      guildId: interaction.guild.id,
    });

    serverConfig.maxMarkings = maxMarks;

    await serverConfig.save();

    interaction.reply({
      content: `Max marks set to ${maxMarks}`,
      ephemeral: true,
    });
  } else if (interaction.customId === "startup_mdl") {
    let title = interaction.fields.getTextInputValue("startup_title");
    let description = interaction.fields.getTextInputValue(
      "startup_description"
    );
    let color = interaction.fields.getTextInputValue("startup_color");
    let pings = interaction.fields.getTextInputValue("startup_pings");
    if (title.length > 256) {
      return interaction.reply({
        content: "Title must be less than 256 characters.",
        ephemeral: true,
      });
    }
    if (description.length > 2048) {
      return interaction.reply({
        content: "Description must be less than 2048 characters.",
        ephemeral: true,
      });
    }
    if (!pings) pings = [];

    if (parseInt(color) === NaN)
      return interaction.reply({
        content: "Please provide a valid hex color code.",
        ephemeral: true,
      });
    if (!isHexcolor(color) && !isHexcolor(`#${color}`))
      return interaction.reply({
        content: "Please provide a valid hex color code.",
        ephemeral: true,
      });
    color = color.replace("#", "");
    color = `0x${color}`;

    const serverConfig = await guildSettings.findOne({
      guildId: interaction.guild.id,
    });
    serverConfig.startupEmbed = {
      title: title,
      description: description,
      color: parseInt(color),
    };
    serverConfig.pings = pings;

    await serverConfig.save();
    let response_embed = [
      {
        title: "Startup Embed",
        fields: [
          {
            name: "Title",
            value: title,
            inline: true,
          },
          {
            name: "Description",
            value: description,
            inline: true,
          },
          {
            name: "Color",
            value: color,
            inline: true,
          },
        ],
        color: parseInt(color),
      },
    ];

    interaction.reply({ embeds: response_embed, ephemeral: true });
  } else if (interaction.customId === "release_mdl") {
    let title = interaction.fields.getTextInputValue("release_title");
    let description = interaction.fields.getTextInputValue(
      "release_description"
    );
    let color = interaction.fields.getTextInputValue("release_color");
    let pings = interaction.fields.getTextInputValue("release_pings");
    if (title.length > 256) {
      return interaction.reply({
        content: "Title must be less than 256 characters.",
        ephemeral: true,
      });
    }
    if (description.length > 2048) {
      return interaction.reply({
        content: "Description must be less than 2048 characters.",
        ephemeral: true,
      });
    }
    if (!pings) pings = [];

    if (parseInt(color) === NaN)
      return interaction.reply({
        content: "Please provide a valid hex color code.",
        ephemeral: true,
      });
    if (!isHexcolor(color) && !isHexcolor(`#${color}`))
      return interaction.reply({
        content: "Please provide a valid hex color code.",
        ephemeral: true,
      });
    color = color.replace("#", "");
    color = `0x${color}`;

    const serverConfig = await guildSettings.findOne({
      guildId: interaction.guild.id,
    });
    serverConfig.releaseEmbed = {
      title: title,
      description: description,
      color: parseInt(color),
    };
    serverConfig.pings = pings;

    await serverConfig.save();
    let response_embed = [
      {
        title: "Release Embed",
        fields: [
          {
            name: "Title",
            value: title,
            inline: true,
          },
          {
            name: "Description",
            value: description,
            inline: true,
          },
          {
            name: "Color",
            value: color,
            inline: true,
          },
        ],
        color: parseInt(color),
      },
    ];

    interaction.reply({ embeds: response_embed, ephemeral: true });
  } else if (interaction.customId === "reinvites_mdl") {
    let title = interaction.fields.getTextInputValue("reinvites_title");
    let description = interaction.fields.getTextInputValue(
      "reinvites_description"
    );
    let color = interaction.fields.getTextInputValue("reinvites_color");
    let pings = interaction.fields.getTextInputValue("reinvites_pings");
    if (title.length > 256) {
      return interaction.reply({
        content: "Title must be less than 256 characters.",
        ephemeral: true,
      });
    }
    if (description.length > 2048) {
      return interaction.reply({
        content: "Description must be less than 2048 characters.",
        ephemeral: true,
      });
    }
    if (!pings) pings = [];

    if (parseInt(color) === NaN)
      return interaction.reply({
        content: "Please provide a valid hex color code.",
        ephemeral: true,
      });
    if (!isHexcolor(color) && !isHexcolor(`#${color}`))
      return interaction.reply({
        content: "Please provide a valid hex color code.",
        ephemeral: true,
      });
    color = color.replace("#", "");
    color = `0x${color}`;

    const serverConfig = await guildSettings.findOne({
      guildId: interaction.guild.id,
    });
    serverConfig.reinvitesEmbed = {
      title: title,
      description: description,
      color: parseInt(color),
    };
    serverConfig.pings = pings;

    await serverConfig.save();
    let response_embed = [
      {
        title: "Reinvites Embed",
        fields: [
          {
            name: "Title",
            value: title,
            inline: true,
          },
          {
            name: "Description",
            value: description,
            inline: true,
          },
          {
            name: "Color",
            value: color,
            inline: true,
          },
        ],
        color: parseInt(color),
      },
    ];

    interaction.reply({ embeds: response_embed, ephemeral: true });
  }
}
