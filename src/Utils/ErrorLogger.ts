import { eds, runtimeStorage } from "..";

export async function reportError(error: string, ctx: eds.SlashCommandContext | eds.TextCommandContext | eds.InteractionContext | null): Promise<void>
{
    let logger = runtimeStorage.getProp<eds.Logger>("logger");
    console.error(error);
    logger.log(`[E] ${error}`);

    const args: [boolean, string, string, "error"] = [false, `Failed to execute command. Recieved error:`, `\`\`\`js\n${error}\`\`\``, "error"];

    if (ctx === null) return;
    await eds.templateEmbedReply(ctx, ...args);
}