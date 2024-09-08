import { sep, normalize as normalizePath } from "path";
import { pathToFileURL } from "url";
import { type eds, expandDirs } from "../index.js";
import * as messages from "../errors.js";
import { AutoCommandHelp } from "./AutoCommandHelp.js";

/**
 * Text and slash command loader.
 */
export class Loader
{
    private _path: string;
    private readonly _CallMap = new Map<string, eds.CommandExecutor>();
    private readonly _SlashCallMap = new Map<string, eds.CommandExecutor>();
    private _AlwaysCallMap: eds.CommandExecutor[] = [];
    private readonly _HelpInfoMap = new Map<string, eds.CommandHelpInfo>();

    public commandHelp: AutoCommandHelp;

    public constructor(
        /** Path to the command folder.
         * 
         * **WARNING!** The path is based on your main file that you are running
         */
        path: string,
        private noLog: boolean = false,
        private ignorePrefixes: string[] = [],
        private loadPrefixes: string[] = [],
        private builtinCommands: eds.ConfigExemplar["includeBuiltinCommands"]
    ) {
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
        Promise.all(paths.map(async path => {
            let file: eds.CommandFile<"text" | "slash">;

            if (this._checkIgnorePrefix(path) || !this._checkLoadPrefix(path))
            {
                if (!this.noLog)
                    messages.Loader.templateLoadCommandSkipped(path);
                return;
            }

            try {
                const bakedPath = pathToFileURL(normalizePath(path)).toString();
                const _imported = await import(bakedPath);
                file = _imported.default || _imported;
            } catch (err) {
                throw messages.Loader.loadFileError(path, err);
            }

            if (file?.pragmaSkip === true)
            {
                if (!this.noLog)
                    messages.Loader.templateLoadCommandSkipped(path);
                return;
            }

            if (file?.run === undefined)
            {
                if (!this.noLog)
                    messages.Loader.templateLoadCommandError(path, "MISSING RUN() EXPORT");
                return;
            }
            if (file?.info === undefined)
            {
                if (!this.noLog)
                   messages.Loader.templateLoadCommandError(path, "MISSING OPTIONS EXPORT");
                return;
            }

            const isSlash = this._loadFile(file);
            this.commandHelp.reg(file);

            if (!isSlash)
            {
                if (!this.noLog)
                    messages.Loader.templateLoadCommandSuccessText(file?.info?.name);
            }
            else if (!this.noLog)
                messages.Loader.templateLoadCommandSuccessSlash(file?.info?.name);
        }));

        if (!this.noLog)
            console.log(`==============================`);
    }

    public async loadBuiltin(): Promise<void>
    {
        if (!this.noLog)
            console.log(`==============================`);
        if (this.builtinCommands?.help !== false)
        {
            const path = "@eds-fw/framework/dist/BuiltinCommands/help.js";
            const file = (await import(path)).default;
            this._loadFile(file);
            this.commandHelp.reg(file);
            if (!this.noLog)
                messages.Loader.templateLoadBuiultinCommand("help");
        }
    }

    private _loadFile(data: eds.CommandFile<eds.CommandType>): boolean
    {
        if (data.info.type == "slash")
        {
            this._HelpInfoMap.set(data.info.name, {
                name:           data.info?.name,
                type:           data.info.type,
                usage:          data.info?.usage             ?? "NO_USAGE",
                usageDocs:      data.info?.usageDocs,
                desc:           data.info?.desc,
                category:       data.info?.category,
                hidden:         false,
                allowInDM:      data.info?.allowInDM         ?? false,
            });
            this._SlashCallMap.set(data.info.name, data.run);
            return true;
        }
        else {
            if (data.info?.nonPrefixed)
                this._AlwaysCallMap.push(data.run);
            else {
                let aliases: string[] | null = [];
                aliases.push(data.info.name);
    
                this._CallMap.set(data.info.name, data.run);
    
                this._HelpInfoMap.set(data.info.name, {
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
        const filepath = path.split(sep).at(-1) ?? '';
        return this.ignorePrefixes.length > 0
            ? this.ignorePrefixes.map($ => filepath.startsWith($)).includes(true)
            : false;
    }
    private _checkLoadPrefix(path: string): boolean
    {
        const filepath = path.split(sep).at(-1) ?? '';
        return this.loadPrefixes.length > 0
            ? this.loadPrefixes.map($ => filepath.startsWith($)).includes(true)
            : true;
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