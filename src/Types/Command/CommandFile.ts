import { CommandContext } from "./CommandContext";
import type { CommandInfo } from "./CommandInfo";

export interface CommandFile<T extends boolean>
{
    /** Disables this command loading */
    pragmaSkip?: boolean;
    /** Disables this command logging */
    pragmaNoLog?: boolean;
    /** Command code */
    run: (context: CommandContext<T>) => Promise<void> | void;
    /** Command info */
    info: CommandInfo<T>;
}