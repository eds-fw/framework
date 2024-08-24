import type { ClientOptions, GatewayIntentsString } from "discord.js";
import type { InteractionContext, AnyContext, SlashContext, TextContext } from "./Context.d.ts";

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
     * For advanced djs `Client` configuration (e.g. custom cache limits)
     */
    clientOptions?: Omit<ClientOptions, "intents">;
//==========
//PATHS
    /**
     * Path to commands folder
     * 
     * **Warning! The path is counted from the folder where the `package.json` and `start.bat`/`start.sh` files are located**
     */
    commandsPath: string;
//==========
//METHODS
    logSlashCommand?:   (context: SlashContext)             => any;
    logTextCommand?:    (context: TextContext)              => any;
    logInteraction?:    (context: InteractionContext)       => any;
    noAccess?:          (context: AnyContext)               => any;
//==========
//RESOURCES
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
}

export default ConfigExemplar;