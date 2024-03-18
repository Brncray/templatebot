import { Client, Collection, Options } from "discord.js";
import pkg from "mongoose";
import { fdir } from "fdir";
const { connect } = pkg;

/**
 * @typedef {Object} Settings
 * @property {Number} color
 * @property {String} iconURL
 * @property {Object[]} vehicleColors
 * @property {string} vehicleColors.name
 * @property {number} vehicleColors.value
 * @property {Object[]} vehicles
 * @property {string} vehicles.name
 * @property {number} vehicles.value
 * @property {Object} vehicleLimits
 * @property {number} vehicleLimits.regular
 * @property {number} vehicleLimits.special
 */

/**
 * @typedef {Object} Button
 * @prop {String} name
 * @prop {function(import("discord.js").ButtonInteraction<'cached'>,Bot): Promise<any>} execute
 */

/**
 * @typedef {Object} ChoiceData
 * @prop {String} name
 * @prop {{}} value
 */

/**
 * @typedef {Object} SelectMenuData
 * @prop {String} name
 * @prop {String} description
 * @prop {OptionData[]} options
 */

/**
 * @typedef {Object} SelectMenu
 * @prop {String} name
 * @prop {function(import("discord.js").StringSelectMenuInteraction<'cached'>,Bot): Promise<any>} execute
 */

/**
 * @typedef {Object} OptionData
 * @prop {String} name
 * @prop {String} description
 * @prop {1|2|3|4|5|6|7|8|9|10|11} type 1-SubCommand; 2-SubCommandGroup; 3-String; 4-Integer; 5-Boolean; 6-User; 7-Channel; 8-Role; 9-Mentionable; 10-Number; 11-Attachment
 * @prop {OptionData[]} [options] Only for type 1
 * @prop {Boolean} [required]
 * @prop {Boolean} [autocomplete]
 * @prop {Array<ChoiceData>} [choices]
 * @prop {Array<0|2|4|5|10|11|12|13|14|15>} [channel_types] 0-GuildText; 2-GuildVoice; 4-GuildCategory; 5-GuildAnnouncement; 10-AnnouncementThread; 11-Public_Thread; 12-Private_Thread; 13-GuildStageVoice; 14-GuildDirectory; 15-GuildForum
 * @prop {Number} [max_value]
 * @prop {Number} [min_value]
 * @prop {Number} [max_length]
 * @prop {Number} [min_length]
 */

/**
 *
 * @typedef {Object} Command
 * @prop {1|2|3} type 1- chat input; 2 - user context; 3 - message context
 * @prop {String} name
 * @prop {String} description
 * @prop {OptionData[]} [options]
 * @prop {Number} [default_member_permissions]
 * @prop {Boolean} [dm_permission]
 * @prop {Boolean} [nsfw]
 */

/**
 * @typedef {ChatInputCommandData|ContextCommandData} CommandData
 */

/**
 * @typedef {Object} ChatInputCommandData
 * @prop {1} type 1- chat input
 * @prop {String} name
 * @prop {String} description
 * @prop {OptionData[]} [options]
 * @prop {import("discord.js").PermissionsBitField | Number} [default_member_permissions]
 * @prop {Boolean} [dm_permission]
 * @prop {Boolean} [nsfw]
 * @prop {function(import("discord.js").ChatInputCommandInteraction<"cached">,Bot): Promise<any>} execute
 * @prop {function(import("discord.js").AutocompleteInteraction<"cached">,Bot): Promise<any>} autocomplete
 */

/**
 * @typedef {Object} ContextCommandData
 * @prop {2|3} type 2 - user context; 3 - message context
 * @prop {String} name
 * @prop {import("discord.js").PermissionsBitField | Number} [default_member_permissions]
 * @prop {Boolean} [dm_permission]
 * @prop {Boolean} [nsfw]
 * @prop {function(import("discord.js").ChatInputCommandInteraction<"cached">,Bot): Promise<any>} execute
 */

export class Bot extends Client {
    /**
     * @param {import("discord.js").ClientOptions} o
     */
    constructor(o) {
        const options = {
            allowedMentions: {
                parse: ["users", "roles", "everyone"],
                repliedUser: true
            },

            ...o,
        };
        // @ts-ignore
        super(options);
    }
    regex = /^(?:[\u2600-\u27BF\u{1F004}-\u{1F0CF}\u{1F170}-\u{1F171}\u{1F17E}-\u{1F17F}\u{1F18E}\u{1F191}-\u{1F19A}\u{1F1E6}-\u{1F1FF}\u{1F201}\u{1F21A}\u{1F22F}\u{1F232}-\u{1F23A}\u{1F250}\u{1F300}-\u{1F321}\u{1F324}-\u{1F393}\u{1F396}-\u{1F397}\u{1F399}-\u{1F39B}\u{1F39E}-\u{1F3F0}\u{1F3F3}-\u{1F3F5}\u{1F3F7}-\u{1F3FF}\u{1F400}-\u{1F4FE}\u{1F500}-\u{1F53D}\u{1F546}-\u{1F579}\u{1F57A}-\u{1F594}\u{1F597}-\u{1F5A3}\u{1F5A6}-\u{1F5A7}\u{1F5AA}-\u{1F5B0}\u{1F5B3}\u{1F5B4}\u{1F5B5}-\u{1F5BD}\u{1F5BE}-\u{1F5C1}\u{1F5C5}-\u{1F5D0}\u{1F5D4}-\u{1F5DB}\u{1F5DF}-\u{1F5E0}\u{1F5E2}\u{1F5E3}\u{1F5E8}\u{1F5EF}\u{1F5F3}\u{1F5FA}-\u{1F64F}\u{1F680}-\u{1F6C5}\u{1F6CB}-\u{1F6D2}\u{1F6E0}-\u{1F6E5}\u{1F6E9}\u{1F6EB}-\u{1F6EC}\u{1F6F0}-\u{1F6F9}\u{1F6FA}\u{1F7E0}-\u{1F7EB}\u{1F90D}-\u{1F90F}\u{1F910}-\u{1F918}\u{1F919}-\u{1F91E}\u{1F91F}\u{1F920}-\u{1F927}\u{1F928}-\u{1F92F}\u{1F930}-\u{1F930}\u{1F931}-\u{1F932}\u{1F933}-\u{1F93A}\u{1F93C}-\u{1F93E}\u{1F93F}\u{1F940}-\u{1F945}\u{1F947}-\u{1F94B}\u{1F94C}-\u{1F94F}\u{1F950}-\u{1F95E}\u{1F95F}-\u{1F96B}\u{1F96C}-\u{1F970}\u{1F971}-\u{1F972}\u{1F973}-\u{1F976}\u{1F977}-\u{1F979}\u{1F97A}-\u{1F97C}\u{1F97D}-\u{1F97F}\u{1F980}-\u{1F984}\u{1F985}-\u{1F991}\u{1F992}-\u{1F997}\u{1F998}-\u{1F9A2}\u{1F9A3}-\u{1F9A4}\u{1F9A5}-\u{1F9AA}\u{1F9AB}\u{1F9AC}-\u{1F9AD}\u{1F9AE}-\u{1F9AF}\u{1F9B0}-\u{1F9B9}\u{1F9BA}-\u{1F9BF}\u{1F9C0}-\u{1F9C2}\u{1F9C3}-\u{1F9CA}\u{1F9CB}-\u{1F9CC}\u{1F9CD}-\u{1F9CF}\u{1F9D0}-\u{1F9E6}\u{1F9E7}-\u{1F9FF}\u{1FA00}-\u{1FA6D}\u{1FA6E}-\u{1FA6F}\u{1FA70}-\u{1FA73}\u{1FA74}\u{1FA78}-\u{1FA7A}\u{1FA80}-\u{1FA82}\u{1FA83}-\u{1FA86}\u{1FA87}\u{1FA90}-\u{1FA95}\u{1FA96}-\u{1FFFD}\u{200D}\uD83C}[\\\uDC00-\uDFFF]|[\u200D\uD83D][\\\uDC00-\uDFFF]|[\u200D\uD83E][\\\uDC00-\uDFFF]|\u26A0\uFE0F|\uD83D\uDDC4\uFE0F|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83C\uDF85\uD83C\uDFFC|\uD83E\uDDC2)+.*BitToon.*Trophy$/giu;
    sleep = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    /**@type {Settings} */
    settings = {
        color: 0, // leave as 0, gets settings from index.js
        iconURL: '',
        vehicleColors: [],
        vehicles: [],
        vehicleLimits: {
            regular: 0,
            special: 0
        },
    };

    /**@type {Collection<string, CommandData>} */
    cmds = new Collection();

    /** @type {Collection<string, Button>} */
    buttons = new Collection();

    /**@type {Collection<string, SelectMenuData>} */
    selectMenus = new Collection();

    /**
     * @param {string} p
     * @param {number} lvl
     * @param {string} ext
     */
    //@ts-ignore
    crawler = (p, lvl = 0, ext = ".js") =>
        new fdir()
            .withBasePath()
            .filter((path, isDirectory) => path.endsWith(ext))
            .withMaxDepth(lvl)
            .crawl(p)
            .sync();
    handleEvents = async () => {
        const evtFiles = this.crawler("./events", 1, ".evt.js");
        for (const file of evtFiles) {
            const evt = await import(`./${file}`);
            if (evt.data.once) {
                this.once(evt.data.name, (...args) => evt.execute(...args, this));
            } else {
                this.on(evt.data.name, (...args) => evt.execute(...args, this));
            }
        }
        return this;
    };
    handleButtons = async () => {
        const btnFo = this.crawler("./buttons", 2, ".btn.js");
        for (const btnFi of btnFo) {
            const btn = await import(`./${btnFi}`);
            this.buttons.set(btn.data.name, btn);
        }
        return this;
    };
    handleSelects = async () => {
        const stmFo = this.crawler("./selectMenus", 3, ".stm.js");
        for (const stmfi of stmFo) {
            const selectM = await import(`./${stmfi}`);
            this.selectMenus.set(selectM.data.name, selectM);
        }
        return this;
    };
    handleCommands = async () => {
        while (!this.application?.commands) {
            await this.sleep(100);
        }
        const commandArray = [];
        const cmdFo = this.crawler("./commands", 2, ".cmd.js");
        for (const cmdFi of cmdFo) {
            const command = await import(`./${cmdFi}`);
            this.cmds.set(command.data.name, command);
            commandArray.push(command.data);
        }
        await this?.application?.commands?.set(commandArray);
        console.log(`Slash commands uploaded`);
        return this;
    };
    /**
     * @returns {Promise<Bot>}
     */
    init = async () => {
        await this.handleEvents();
        await this.handleButtons();
        await this.handleSelects();
        await this.login(process.env.token);
        await connect(process.env.mongo || "")
            .then(() => {
                console.log("Connected to MongoDB");
            })
            .catch((err) => {
                console.error("Error connecting to MongoDB:", err);
            })
            .finally(() => this);
        return this;
    };
};