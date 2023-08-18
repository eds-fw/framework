import type { CommandHelpInfo } from "./CommandHelpInfo";

export interface CommandInfo<T extends boolean> extends CommandHelpInfo
{
    aliases?:       T extends true ? never : string[];
    nonPrefixed?:   T extends true ? never : boolean;
}