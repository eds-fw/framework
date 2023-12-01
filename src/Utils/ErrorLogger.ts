import { eds, runtimeStorage } from "..";

/** @deprecated */
export async function reportError(error: string, ctx: eds.SlashCommandContext | eds.TextCommandContext | eds.InteractionContext | null): Promise<void>
{
console.log(`Function \`reportError()\` has been deprecated.`);
    let logger = runtimeStorage.getProp<eds.Logger>("logger");
    console.error(error);
    logger.log(`[E] ${error}`);

    if (ctx === null) return;
}