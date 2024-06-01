<p align="center">
    <img src="https://avatars.githubusercontent.com/u/142582396?s=400&u=efba7a6a242149915b23e51923a6c3afb7fa8fcb&v=4" width="200"/>
</p>

<b align="center">
    
    Simply TypeScript framework for your discord.js bots
    
</b>
<hr>

# Features
- Intuitive and does not complicate the development process
- Contains type declarations (.d.ts)
- Fully configurable
- Built-in `/help` command
- Lazy constructors (`createSlashCommand()`, `createButton()` and more)
- Smart Fetches: get from cache or fetch (`sfMember(context, context.interaction.user.id)` and more)
- Simply 'Map'-based storage: `get()`, `set()`, `save()` and more

# Requirements
- [NodeJS](https://nodejs.org/en) `v18` or newer

# Setup
1. Install EDS via npm:
```bat
npm i @eds-fw/framework
```

2. Create `tsconfig.json` file:
```json
{
    "extends": "./node_modules/@eds-fw/framework/tsconfig.base.json",
    "exclude": [
        "node_modules/",
        "logs/",
        "vault.json",
        "dist/",
        "assets/"
    ],
    "compilerOptions": {
        "rootDit": "src",
        "outDir": "dist"
    }
}
```

3. Create your first bot using EDS:
```ts
// src/index.ts
//'runtime' is a 'global' object equivalent
import { eds, djs } from "@eds-fw/framework";
const { token } = require("../vault.json");
const config: eds.ConfigExemplar = {
    token,
    intents: "all",
    commandsPath: "./commands/",
    slashOnly: true, //default value
    includeBuiltinCommands: {
        help: true, //default value
    },
    colors: {
        default: 0xffffff, //'0x' + HEX color without '#'
        info: 0x00FFEA,
    },
};

const bot = eds.createBot(config);
eds.createSlashCommand({
    name: "cake",
    description: "Give me a cake!",
    nsfw: false,
    type: djs.ApplicationCommandType.ChatInput,
    defaultMemberPermissions: null,
    dmPermission: false,
});
eds.startBot();

export default bot;
```

4. Create your first `/cake` command:
```ts
// src/commands/cake.ts
import { eds, djs } from "@eds-fw/framework";

//eds components are resistant to bot restarts
eds.createButton({
    custom_id: "get cake"
}, async context => { //"get cake" button code
    await context.reply(
        true, //epemeral?
        undefined, //title
        "# :cake:" //description
    );
})

export = {
    async run(context)
    {
        await context.reply(
            true, //ephemeral?
            "aloha hawaii", //embed title (optional if has desc)
            `<@${context.interaction.user.id}>, do you want a cake?`, //embed desc (optional if has title)
            "info", //?embed color name (set in config)
            [{ //?djs components
                type: djs.ComponentType.ActionRow,
                components: [{
                    type: djs.ComponentType.Button,
                    style: djs.ButtonStyle.Secondary, //gray
                    custom_id: "get cake",
                    label: "Get cake"
                }]
            }]
        );
    },

    //command options
    info: {
        name: "cake",
        type: "slash",
        
        //for auto-help:
        desc: "Give me a cake!",
        category: "General",
        usage: '',
        hidden: true,
    }
} satisfies eds.CommandFile<"slash">;
```

5. A) Create `start.bat` file (WINDOWS ONLY) for easily compile & launch your bot:
```batch
rem start.bat
@npx tsc
@node dist/index.js
@pause
rem "@pause" keeps window open after bot crash
```
5. B) Create `start.sh` file for easily compile & launch your bot:
```sh
# start.sh
npx tsc
node dist/index.js
read -p "" #keeps window open after bot crash
```

6. Execute (open) `start.bat` or `start.sh` file. Voila! It's alive!

# API
- *module* `@eds-fw/utils`
- *module* `@eds-fw/timeparser`
- *module* `@eds-fw/storage`
- *module* `@eds-fw/fetch`
- `createBot (config: ConfigExemplar): KnownRuntimeProperties` *(lazyConstructor)*
- `createButton (options: ButtonOptions, code: ButtonCode): void` *(lazyConstructor)*
    >- runtime: `componentManager`
- `createMenu (options: MenuOptions, code: MenuUserCode | MenuStringCode): void` *(lazyConstructor)*
    >- runtime: `componentManager`
- `createModal (options: ModalOptions, code: ModalCode): void` *(lazyConstructor)*
    >- runtime: `componentManager`
- `createSlashCommand (options: SpplicationCommandData): void` *(lazyConstructor)*
    >- runtime: `slashCommandsManager`
- *async* `sfUser (mng_or_ctx: AnyContext | UserManager | undefined, id: Snowflake | undefined): Promise<User | undefined>`
- *async* `sfMember (mng_or_ctx: AnyContext | GuildMemberManager | undefined, id: Snowflake | undefined): Promise<GuildMember | undefined>`
- *async* `sfChannel (mng_or_ctx: AnyContext | GuildChannelManager | undefined, id: Snowflake | undefined): Promise<GuildBasedChannel | undefined>`
- *async* `sfGuild (mng_or_ctx: AnyContext | GuildManager | undefined, id: Snowflake | undefined): Promise<Guild | undefined>`
- *async* `sfRole (mng_or_ctx: AnyContext | RoleManager | undefined, id: Snowflake | undefined): Promise<Role | undefined>`
- *async* `sfMessage (mng_or_ctx: AnyContext | MessageManager | undefined, id: Snowflake | undefined): Promise<Message | undefined>`
- *async* `startBot (): Promise<void>`
    >- runtime: `slashCommandsManager, client, config`
- *anonimous class* `runtimeStorage` *(runtime)*
    >- `[key: string]: any`
    >- `getAll <T>(...keys: (keyof T)): T`
    >- `get <V>(key: string): V`
    >- `setAll <T>(values: T): T`
    >- `set <K, V>(key: K, value: V): { [X in K]: V }`
- *class* `Client` *extends djs.Client*
    >- *constructor* `(options: Options)`
    >- *async* `init (): Promise<void>`
- *class* `Handler`
    >- runtime: `config, loader, client, contextFactory`
    >- *constructor* `new ()`
- *class* `Loader`
    >- *field* `commandHelp: AutoCommandHelp`
    >- *constructor* `new (path: string, noLog?: boolean, ignorePrefixes?: string[], builtinCommands?: ConfigExemplar.includeBuiltinCommands)`
    >- `clearMaps (): void`
    >- *async* `load (): Promise<void>`
    >- *iternal* *async* `loadBuiltin (): Promise<void>`
    >- *iternal* *get* `getCallMap: Map<string[], string>`
    >- *iternal* *get* `getSlashCallMap: Map<string, string>`
    >- *iternal* *get* `getAlwaysCallMap: string[]`
    >- *iternal* *get* `getHelpInfoMap: Map<string[], CommandHelpInfo>`
- *class* `SlashCommandsManager`
    >- runtime: `client`
    >- `create (options: djs.ApplicationCommandData): void`
    >- `save (): void`
- *type* `SupportedInteractions`
- *type* `CommandContext <type>`
- *type* `AnyContext`
- *type* `InteractionContext <SupportedInteractions>`
- *type* `SlashCommandContext`
- *type* `TextCommandContext`
- *type* `CommandFile`
- *type* `CommandHelpInfo`
- *type* `CommandInfo`
- *type* `ConfigExemplar`
- *type* `KnownRuntimeProperties`
- *iternal* *async* `expandDirs (path: string): Promise<string[]>`
- *iternal* *async* `templateEmbedReply (...params): Promise<void>`
- *iternal* *async* `templateEmbedEditReply (...params): Promise<void>`
- *iternal* *class* `AutoCommandHelp`
    >- runtime: `config`
    >- *field* `pages: Map<string, string>`
    >- *field* `commandTypes: Map<string, "slash" | "text" | "nonPrefixed">`
    >- *field* `descriptions: Map<string, string>`
    >- *field* `templates: {...}`
    >- *field* `_fullCommandList: string`
    >- *constructor* `new ()`
    >- `getCommandList (roles: string[]): string`
    >- `getCommandNames (roles: string[]): string[]`
    >- `getBakedCommandNames (roles: string[]): string[]`
    >- `clear (): void`
    >- *iternal* `reg (file: CommandFile<boolean> as const): void`
    >- *iternal* *field* `_publicCommands: string`
    >- *iternal* *field* `_fullCommandList: string`
- *iternal* *class* `ContextFactory`
    >- runtime: `config`
    >- *constructor* `new ()`
    >- `createTextContext (message: djs.Message): CommandContext<false>`
    >- `createSlashContext (interaction: djs.ChatInputCommandInteraction): CommandContext<true>`
- *iternal* *class* `ComponentsManager`
    >- *constructor* `()` *empty*
    >- `clearMaps (): void`
    >- `createButton (options: ButtonOptions, code: ButtonCode): void`
    >- `createMenu (options: MenuOptions, code: MenuUserCode | MenuStringCode): void`
    >- `createModal (options: ModalOptions, code: ModalCode): void`
    >- *iternal* *get* `getButtonsMap: Map<string, MapVal<...>>`
    >- *iternal* *get* `getMenusMap: Map<string, MapVal<...>>`
    >- *iternal* *get* `getModalsMap: Map<string, MapVal<...>>`

# [Source (git)](https://github.com/eds-fw/framework)
# [Issues (git)](https://github.com/eds-fw/framework/issues)