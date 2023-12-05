import { ApplicationCommandType, ButtonStyle, ComponentType, TextInputStyle } from "discord.js";
import { eds, runtimeStorage } from "..";

const config = runtimeStorage.getProp<eds.ConfigExemplar>("config");
const loader = runtimeStorage.getProp<eds.Loader>("loader");
const componentManager = runtimeStorage.getProp<eds.ComponentManager>("componentManager");
const slashCommandsManager = runtimeStorage.getProp<eds.SlashCommandsManager>("slashCommandsManager");

slashCommandsManager.create({
    name: "devtools",
    description: "Open eds devtools",
    nsfw: false,
    type: ApplicationCommandType.ChatInput,
    defaultMemberPermissions: null,
    dmPermission: true,
});

const eval_buffers = new Map<string, [string, string]>();

componentManager.createButton({
    custom_id: "devtools $$ evalJS"
}, async (ctx) => {
        await ctx.interaction.showModal({
            custom_id: "devtools $$ evalModal",
            title: "EvalMenu",
            components: [{
                type: ComponentType.ActionRow,
                components: [{
                    type: ComponentType.TextInput,
                    style: TextInputStyle.Paragraph,
                    custom_id: "code",
                    label: "Code (async)",
                    required: true,
                    placeholder: `You can use 'return' statement and 'ctx: InteractionContext' object.`,
                    value: eval_buffers.get(ctx.interaction.user.id)?.[0],
                }]
            }, {
                type: ComponentType.ActionRow,
                components: [{
                    type: ComponentType.TextInput,
                    style: TextInputStyle.Short,
                    custom_id: "flags",
                    label: "Flags (e.g. save)",
                    required: false,
                    placeholder: "save",
                    value: eval_buffers.get(ctx.interaction.user.id)?.[1],
                }]
            }]
        });
    }
);

componentManager.createMenu({
    custom_id: "devtools $$ toolSelect",
    stringSelect: true,
}, {
    "updateCommands": async (ctx) => {
        loader.clearMaps();
        loader.load();

        await ctx.reply(true, "Bot commands successfully reloaded");
    },

    "clearWeakCache": async (ctx) => {
        let databases;
        try {
            databases = Object.values(runtimeStorage.getProp<Record<string, eds.Database>>("databases"));
        } catch (err) {
            return await ctx.reply(true, "Failed", "You don't have any database", "error");
        }

        let i = 0;
        for (const value of databases)
            i += await value.clearWeakData();
        //
        await ctx.reply(true, "Success!", `Weak database data cleared. Removed \`${i}\` items`);
    }
})

componentManager.createModal({
    custom_id: "devtools $$ evalModal"
}, async (ctx, fields) => {
    let error: string | undefined = undefined;
    let reply: string | undefined = "<noreply>";
    
    if (fields.getTextInputValue("flags").includes("save"))
        eval_buffers.set(ctx.interaction.user.id, [fields.getTextInputValue("code"), fields.getTextInputValue("flags")]);
    
    try {
        reply = await eval(`;(async () => { ${fields.getTextInputValue("code")} })();`);
    } catch (err) {
        error = String(err);
    }

    if (error === undefined)
        await ctx.reply(true, `Evaluated!`, `\`\`\`js\n${reply}\`\`\``, 'info');
    else
        await ctx.reply(true, `Error`, `\`\`\`js\n${error}\`\`\``, 'error');
});

export = {
    async run(ctx)
    {
        async function conditions()
        {
            if (!config.developers.includes(ctx.interaction.user.id))
            {
                await ctx.reply(true, "You are not a bot developer", undefined, "error");
                return false;
            }
            return true;
        }

        if (!await conditions()) return;

        await ctx.reply(true, undefined, "Welcome to `eds` developer menu!\nYou see this message - it means that your ID is in `config.developers` array", "info", [{
            type: ComponentType.ActionRow,
            components: [{
                type: ComponentType.StringSelect,
                custom_id: "devtools $$ toolSelect",
                placeholder: "toolbox",
                options: [{
                    label: "updateCommands",
                    description: "Unload & load bot commands",
                    value: "updateCommands"
                }, {
                    label: "clearWeakCache",
                    description: "Clear all message cache with $weak$ flag",
                    value: "clearWeakCache"
                }]
            }]
        }, {
            type: ComponentType.ActionRow,
            components: [{
                type: ComponentType.Button,
                label: "evalJS",
                custom_id: "devtools $$ evalJS",
                style: ButtonStyle.Success
            }]
        }]);
    },
    info: {
        name: "devtools",
        slash: true,
        desc: "Open developer tools",
        hidden: true
    }
} satisfies eds.CommandFile<true>;