import type { Client, GatewayIntentsString } from "discord.js";

export interface ConfigExemplar
{
//DISCORD OPTIONS
    /**
     * Bot's token
     * 
     * You can get it from the [Discord Developer Portal](https://discord.com/developers/applications)
     */
    token: string;
    /**
     * Array of bot intents or `"all"` string
     */
    intents: GatewayIntentsString[] | "all";
    /**
     * Code that will be run when the bot is ready
     * @default () => console.log("I am ready")
     * @deprecated
     */
    onReady?: (client: Client) => Promise<void> | void;
//==========
//PATHS
    /**
     * Path to commands folder
     * 
     * **Warning! The path is counted from the folder where the `package.json` and `start.bat`/`start.sh` files are located**
     */
    commandsPath: string;
    /**
     * Path to logs folder.
     * To disable logs remove this field
     * 
     * **Warning! The path is counted from the folder where the `package.json` and `start.bat`/`start.sh` files are located**
     * @default undefined
     * @deprecated
     */
    logsPath?: string;
//==========
//RESOURCES
    /**
     * Array of bot developers IDs
     */
    developers: string[];
    /**
     * Bot embeds colors
     * 
     * Default color is `default`
     * 
     * **Warning! You need to convert string HEX to number: replace `#` with `0x`**
     */
    colors?: {
        /**
         * **Warning! You need to convert string HEX to number: replace `#` with `0x`**
         */
        [key: string]: number;
    },
    /**
     * Text to be added to all `EmbedTemplates` footers
     * 
     * If it's an array, a random string will be selected from it
     * @default undefined
     */
    footerText?: string | string[];
    /**
     * Icon to be added to all `EmbedTemplates` footers
     * 
     * If it's an array, a random string will be selected from it
     * @default undefined
     */
    footerIcon?: string | string[];
//=========
//HANDLER OPTIONS
    /**
     * Allows to execute only slash commands
     * 
     * **Warning! If you set it to false it will add extra load to the bot**
     * @default true
     */
    slashOnly?: boolean;
    /**
     * Allows to execute commands only in guilds
     * @default true
     */
    guildOnly?: boolean;
    /**
     * Ingore bot messages?
     * @default true
     */
    ignoreBots?: boolean;
    /**
     * Prefix (for text commands)
     */
    prefix?: string;
//==========
//LOADER OPTIONS
    /**
     * Do not load files start with ...
     * @default ["#"]
     */
    doNotLoadFilesStartsWith?: string[];
    /**
     * Add built-in bot commands: `help`, `devtools`
     * @default { help: true, devtools: true }
     */
    includeBuiltinCommands?: {
        help: boolean;
        devtools: boolean;
    };
    /**
     * Some built-in commands settings
     */
    builtinCommandsSettings?: {
        /**
         * @default "All bot commands:"
         */
        helpListTitleText?: string;
        /**
         * @default "Command help:"
         */
        helpPageTitleText?: string;
        /**
         * @default "General"
         */
        helpCommandCategory?: string;
        /**
         * @default "Show a list of all bot commands"
         */
        helpCommandDescription?: string;
        /**
         * @default "Command name"
         */
        helpCommandArgumentDescription?: string;
        /**
         * @default "help"
         */
        helpCommandName?: string;
        /**
         * @default true
         */
        helpEphemeral?: boolean;
        /**
         * Option's emoji (/help > menu)
         * @default undefined
         */
        helpPageMenuEmoji?: string;
        /**
         * Thumbnail icon URL
         * @default undefined
         */
        helpPageThumbnail?: string;
        /**
         * Thumbnail icon URL
         * @default undefined
         */
        helpListThumbnail?: string;
        /**
         * The text that will appear before the list of commands
         * @default undefined
         */
        helpListAdditionalText?: string;
    };
//LOGGER OPTIONS
    /**
     * Time offset relative to GMT in hours
     * 
     * Example: `9` = `GMT+9`, `-1` = `GMT-1`
     * @default 0
     * @deprecated
     */
    timeOffset?: number;
}

export default ConfigExemplar;