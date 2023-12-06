import { eds, runtimeStorage } from "..";

/**
 * Automatically generates the message text of the help command. Also generates detailed help for each command.
 */
export class AutoCommandHelp
{
    private runtime;
    
    private _publicCommands: string = '';
    private _publicCommandsNames: string[] = [];
    private _limitedCommands = new Map<string[], string>();
    private _limitedCommandsNames = new Map<string[], string>();
    public _fullCommandList: string = '';
    public pages = new Map<string, string>();
    public descriptions = new Map<string, string>();
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
        if (file.info.desc) this.descriptions.set(file.info.name, file.info.desc);
        let buf = '';
        if (file.info.slash)
            buf = this.templates.commandSlash(file.info.name + (file.info.usage ? ' ' + file.info.usage : ''), file.info.desc);
        else
            buf = this.templates.commandText(file.info.name + (file.info.usage ? ' ' + file.info.usage : ''), file.info.desc);
        this._fullCommandList += buf;
        if (file.info.allowedRoles === undefined || file.info.allowedRoles.length == 0)
        {
            this._publicCommands += buf;
            this._publicCommandsNames.push(file.info.name);
        }
        else {
            this._limitedCommands.set(file.info.allowedRoles, this._limitedCommands.get(file.info.allowedRoles) ?? "" + buf);
            this._limitedCommandsNames.set(file.info.allowedRoles, this._limitedCommandsNames.get(file.info.allowedRoles) ?? "" + file.info.name);
        }
    }

    public getCommandList(roles: string[]): string
    {
        let baked = this._publicCommands;
        if (roles.length == 0) return baked;
        this._limitedCommands.forEach((command, command_roles) => {
            for (const role of command_roles)
                if (roles.includes(role))
                {
                    baked += command;
                    break;
                }
        });
        return baked;
    }
    public getCommandNames(roles: string[]): string[]
    {
        let baked = Object.assign([], this._publicCommandsNames);
        if (roles.length == 0) return baked;
        this._limitedCommandsNames.forEach((command, roles) => {
            for (const role of roles)
                if (roles.includes(role))
                {
                    baked.push(command);
                    break;
                }
        });
        return baked;
    }

    public clear(): void
    {
        this._fullCommandList = '';
        this._limitedCommands.clear();
        this._publicCommands = '';
    }
}