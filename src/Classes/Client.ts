import { Client as DClient, GatewayIntentBits, GatewayIntentsString } from "discord.js";

export class Client extends DClient
{
    private _token: string;

    public constructor(options: Client.Options)
    {
        super({
            intents: options.intents == "all"
            ? [
                "Guilds",
                "GuildMembers",
                "GuildModeration",
                "GuildEmojisAndStickers",
                "GuildIntegrations",
                "GuildWebhooks",
                "GuildInvites",
                "GuildVoiceStates",
                "GuildPresences",
                "GuildMessages",
                "GuildMessageReactions",
                "GuildMessageTyping",
                "DirectMessages",
                "DirectMessageReactions",
                "DirectMessageTyping",
                "MessageContent",
                "GuildScheduledEvents",
                "AutoModerationConfiguration",
                "AutoModerationExecution"
            ]
            : options.intents
        });

        this._token = options.token;
    }

    public onReady(code: () => Promise<void> | void = () => console.log("I am ready"))
    {
        this.on("ready", async () => code());
    }

    /**
     * `client.login(...)` analog
     */
    public async init(): Promise<void>
    {
        await super.login(this._token);
    }
}

export namespace Client
{
    export interface Options
    {
        intents: GatewayIntentsString[] | "all";
        token: string;
    }
}

export default Client;