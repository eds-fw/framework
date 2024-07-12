import { ClientOptions, Client as DClient, GatewayIntentsString } from "discord.js";

export class Client extends DClient
{
    private _token: string;

    public constructor(options: Client.Options)
    {
        super({
            ...options,
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
    export interface Options extends Omit<ClientOptions, "intents">
    {
        intents: GatewayIntentsString[] | "all";
        token: string;
    }
}

export default Client;