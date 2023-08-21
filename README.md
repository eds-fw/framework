<p align="center">
    <img src="https://avatars.githubusercontent.com/u/142582396?s=400&u=081f3176405a243f5090002723556c3e723089e3&v=4"/>
</p>

<b align="center">
    
    Simply TypeScript framework for your discord.js bots
    
</b>
<hr>

# Requirements
- [NodeJS](https://nodejs.org/en) `v18` or newer
# Setup
1. Install `easy-ds-bot` via npm:
```bat
npm i @easy-ds-bot/framework
```

2. Create `tsconfig.json` file:
```json
{
    "extends": "./node_modules/@easy-ds-bot/framework/tsconfig.base.json",
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

3. Create your first bot using `easy-ds-bot`:
```ts
// src/index.ts
//'runtime' is a 'global' object equivalent
import { ApplicationCommandType } from "discord.js";
import { eds } from "@easy-ds-bot/framework";
const { token } = require("../vault.json");
const config: eds.ConfigExemplar = {
    token,
    intents: "all",
    developers: ["YOUR ID IS HERE"],
    commandsPath: "./commands/",
    logsPath: "./logs/", //optional. You can disable logs
    slashOnly: true, //default value
    includeBuiltinCommands: true, //default value
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
    type: ApplicationCommandType.ChatInput,
    defaultMemberPermissions: null,
    dmPermission: false,
});
eds.startBot();

export default bot;
```

4. Create your first `/cake` command:
```ts
// src/commands/cake.ts
import { ComponentType, ButtonStyle } from "discord.js";
import { eds } from "@easy-ds-bot/framework";

//eds components are resistant to bot restarts
eds.createButton({
    custom_id: "get cake"
}, async (context, options) => { //"get cake" button code
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
                type: ComponentType.ActionRow,
                components: [{
                    type: ComponentType.Button,
                    style: ButtonStyle.Secondary, //gray
                    custom_id: "get cake",
                    label: "Get cake"
                }]
            }]
        );
    },

    //command options
    info: {
        name: "cake",
        slash: true,
        
        //for auto-help:
        desc: "Give me a cake!",
        category: "General",
        usage: '',
        hidden: true,
    }
} satisfies eds.CommandFile<true>;
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

6. Execute (open) `start.bat` file. Voila! It's alive!

# [Source (git)](https://github.com/easy-ds-bot/framework)
# [Issues (git)](https://github.com/easy-ds-bot/framework/issues)
