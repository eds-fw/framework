import { type eds, runtimeStorage } from "..";

/**
 * Automatically generates the message text of the help command. Also generates detailed help for each command.
 */
export class AutoCommandHelp
{
    private runtime;
    
    public commandList: string = '';
    public pages = new Map<string, string>();
    public templates = {
        noDesc: "<no description>",
        category: (name: string) => `**${name}:**`,
        commandSlash: (usage: string, desc?: string) => `> \`/${usage}\` ${desc ? '― ' + desc : ''}\n`,
        commandText: (usage: string, desc?: string) => `> \`${this.runtime.config.prefix}${usage}\` ${desc ? '― ' + desc : ''}\n`,
        page: (usage: string, slash: boolean, desc?: string, usageDocs: string = '') =>
            `\`\`\`\n${slash ? '/' : this.runtime.config.prefix}${usage} ― ${desc ?? this.templates.noDesc}\`\`\`\n\n${usageDocs ? '>>> ' + usageDocs : ''}`,
    };

    public constructor() {
        this.runtime = {
            config: runtimeStorage.getProp<eds.ConfigExemplar>("config")
        }
    };

    public reg(file: Readonly<eds.CommandFile<boolean>>): void
    {
        if (file.info.hidden === true) return;

        this.pages.set(file.info.name, this.templates.page(
            file.info.name + (file.info.usage ? ' ' + file.info.usage : ''),
            file.info.slash,
            file.info.desc,
            file.info.usageDocs
        ));
        this.commandList += file.info.slash
            ? this.templates.commandSlash(file.info.name + (file.info.usage ? ' ' + file.info.usage : ''), file.info.desc)
            : this.templates.commandText(file.info.name + (file.info.usage ? ' ' + file.info.usage : ''), file.info.desc);
        //
    }
}