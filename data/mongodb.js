import { Schema, model } from "mongoose";

const guildsettings = new Schema({
  guildId: { type: String, required: true },
  guildOwner: { type: String, required: true },
  ticketsEnabled: { type: Boolean, default: false },
  markingEnabled: { type: Boolean, default: false },
  maxTickets: { type: Number, default: 3 },
  maxMarkings: { type: Number, default: 3 },
  startupEmbed: {
    type: Object,
    default: {
      title: "Server not configured",
      description:
        "This server has not been configured yet. Please run the /config command to configure the bot for your server.",
      color: 0xff0000,
    },
  },
  releaseEmbed: {
    type: Object,
    default: {
      title: "Server not configured",
      description:
        "This server has not been configured yet. Please run the /config command to configure the bot for your server.",
      color: 0xff0000,
    },
  },
  reinvitesEmbed: {
    type: Object,
    default: {
      title: "Server not configured",
      description:
        "This server has not been configured yet. Please run the /config command to configure the bot for your server.",
      color: 0xff0000,
    },
    
  },
  pings: { type: Array, default: [] },
});

export const guildSettings = model("guildSettings", guildsettings);
