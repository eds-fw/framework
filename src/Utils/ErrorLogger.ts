import { eds, runtimeStorage } from "..";
import { deprecatedWarning } from "./DeprecatedWarning";

/** @deprecated */
export async function reportError(error: string, ctx: eds.SlashCommandContext | eds.TextCommandContext | eds.InteractionContext | null): Promise<void>
{
deprecatedWarning("reportError", "Function");
    let logger = runtimeStorage.getProp<eds.Logger>("logger");
    console.error(error);
    logger.log(`[E] ${error}`);

    if (ctx === null) return;
}