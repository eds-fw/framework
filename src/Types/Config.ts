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
     * @default undefined
     */
    footerText?: string;
    /**
     * Icon to be added to all `EmbedTemplates` footers
     * @default undefined
     */
    footerIcon?: string;
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
     * @default true
     */
    includeBuiltinCommands?: boolean;
//==========
//LOGGER OPTIONS
    /**
     * Time offset relative to GMT in hours
     * 
     * Example: `9` = `GMT+9`, `-1` = `GMT-1`
     */
    timeOffset?: number;
}

export default ConfigExemplar;