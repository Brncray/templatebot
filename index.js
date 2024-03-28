import { Collection } from "discord.js";
import { Bot } from "./bot.js";
import { config } from "dotenv";
config();
process.on("uncaughtException", (e) => console.log("[ UNCAUGHT EXCEPTION ] →", e));
process.on("unhandledRejection", (e) => console.log("[ UNHANDLED REJECTION ] →", e));
(async () => {
    const client = new Bot({
        intents: 3276799,
    });
    client.settings = {
        ...client.settings,
        color: 0x2a2c31,
    };
    await client.init();
})();
