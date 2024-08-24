import { sep } from "path";
import { CommandFile, CommandHelpInfo, ConfigExemplar, type eds, expandDirs } from "../index.js";
import * as messages from "../errors.js";
import { AutoCommandHelp } from "./AutoCommandHelp.js";

/**
 * Text and slash command loader.
 */
export class Loader
{
    private _path: string;
    private readonly _CallMap = new Map<string[], string>();
    private readonly _SlashCallMap = new Map<string, string>();
    private _AlwaysCallMap: string[] = [];
    private readonly _HelpInfoMap = new Map<string[], CommandHelpInfo>();

    public commandHelp: AutoCommandHelp;

    public constructor(
    /** Path to the command folder.
     * 
     * **WARNING!** The path is based on your main file that you are running
     */
    path: string, private noLog: boolean = false, private ignorePrefixes: string[] = ['#'], private builtinCommands: ConfigExemplar["includeBuiltinCommands"])
    {
        if (path.startsWith('/') || path.startsWith('\\'))
            this._path = process.cwd() + path.replace(/(\/|\\)/g, sep);
        else 
            this._path = process.cwd() + sep + path.replace(/(\/|\\)/g, sep);
        this.commandHelp = new AutoCommandHelp();
    }

    public clearMaps(): void
    {
        this._CallMap.clear();
        this._AlwaysCallMap = [];
        this._HelpInfoMap.clear();

        this.commandHelp.clear();
    }

    public async load(): Promise<void>
    {
        const paths: string[] = (await expandDirs(this._path)).filter($ => $.endsWith('.js'));
        paths.forEach(async path => {
            let file: CommandFile<"text" | "slash">;

            if (this._checkIgnorePrefix(path))
            {
                if (!this.noLog)
                    console.log(messages.Loader.templateLoadCommandSkipped(path));
                this._clear(path);
                return;
            }

            try {
                file = (await import(path)).default || await import(path);
            } catch (err) {
                throw new Error(messages.Loader.loadFileError(path, err));
            }

            if (file?.pragmaSkip === true)
            {
                if (!this.noLog)
                    console.log(messages.Loader.templateLoadCommandSkipped(path));
                this._clear(path);
                return;
            }

            if (file?.run === undefined)
            {
                if (!this.noLog)
                    console.log(messages.Loader.templateLoadCommandError(path, "MISSING RUN() EXPORT"));
                this._clear(path);
                return;
            }
            if (file?.info === undefined)
            {
                if (!this.noLog)
                   console.log(messages.Loader.templateLoadCommandError(path, "MISSING OPTIONS EXPORT"));
                this._clear(path);
                return;
            }

            const isSlash = this._loadFile(file, path);
            this.commandHelp.reg(file);

            if (!isSlash)
            {
                if (!this.noLog)
                    console.log(messages.Loader.templateLoadCommandSuccessText(file?.info?.name));
            }
            else if (!this.noLog)
                console.log(messages.Loader.templateLoadCommandSuccessSlash(file?.info?.name));
        });

        if (!this.noLog)
            console.log(`==============================`);
    }

    public async loadBuiltin(): Promise<void>
    {
        if (!this.noLog)
            console.log(`==============================`);
        if (this.builtinCommands?.help !== false)
        {
            const path = "@eds-fw/framework/dist/BuiltinCommands/help";
            const file = require(path);
            this._loadFile(file, path);
            this.commandHelp.reg(file);
            if (!this.noLog)
                console.log(messages.Loader.templateLoadBuiultinCommand("help"));
        }
    }

    private _loadFile(data: CommandFile<eds.CommandType>, path: string): boolean
    {
        if (data.info.type == "slash")
        {
            this._HelpInfoMap.set([data.info.name], {
                name:           data.info?.name,
                type:           data.info.type,
                usage:          data.info?.usage             ?? "NO_USAGE",
                usageDocs:      data.info?.usageDocs,
                desc:           data.info?.desc,
                category:       data.info?.category,
                hidden:         false,
                allowInDM:      data.info?.allowInDM         ?? false,
            });
            this._SlashCallMap.set(data.info.name, path);
            return true;
        }
        else {
            if (data.info?.nonPrefixed) {
                this._AlwaysCallMap.push(path);
            } else {
                let aliases: string[] | null = [];
                aliases.push(data.info.name);
    
                if (data.info?.aliases) aliases = aliases.concat(data.info.aliases);
    
                this._CallMap.set(aliases, path);
    
                this._HelpInfoMap.set(aliases, {
                    name:           data.info?.name,
                    type:           data.info.type,
                    usage:          data.info?.usage         ?? "NO_USAGE",
                    usageDocs:      data.info?.usageDocs,
                    desc:           data.info?.desc,
                    category:       data.info?.category,
                    hidden:         data.info?.hidden        ?? false,
                    allowInDM:      data.info?.allowInDM     ?? false,
                });
    
                aliases = null;
            }
            return false;
        }
    }

    private _checkIgnorePrefix(path: string): boolean
    {
        return new RegExp(`^${this.ignorePrefixes.join('|^')}`, 'gi').test(path.split(sep).at(-1) ?? '');
    }
    private _clear(path: string): void
    {
        delete require.cache[require.resolve(path)];
    }

    public get getCallMap()
    {
        return this._CallMap;
    }

    public get getSlashCallMap()
    {
        return this._SlashCallMap;
    }

    public get getAlwaysCallMap()
    {
        return this._AlwaysCallMap;
    }

    public get getHelpInfoMap()
    {
        return this._HelpInfoMap;
    }
}