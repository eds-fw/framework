import { InteractionReplyOptions, InteractionUpdateOptions, MessageCreateOptions } from "discord.js";

/**
 * Class for managing interactive message panels.
 * 
 * Usage example:
 * ```ts
 * ... imports ...
 * const panelAuthors = new Map<string, string>();
 * interface RegPanelData
 * {
 *      name: string;
 *      surname: string;
 *      age?: string;
 *      acceptedRules: boolean;
 * }
 * function createPanel(ctx: eds.TextContext)
 * {
 *      const message: eds.InteractivePanel.ConstructMessageFn<RegPanelData> = menuData => ({
 *          content: "Your data:\n" + eds.InteractivePanel.renderValues([
 *              ["Name: `", menuData.name, "`"],
 *              ["Surname: `", menuData.surname, "`"],
 *              ["Age: `", menuData.age, "`"],
 *          ]),
 *          components: [{
 *              type: ComponentType.ActionRow,
 *              components: [{
 *                  type: ComponentType.Button,
 *                  style: ButtonStyle.Secondary,
 *                  label: "Set name/surname",
 *                  customId: "regpanel.set-name/surname"
 *              }, {
 *                  type: ComponentType.Button,
 *                  style: menuData.acceptedRules ? ButtonStyle.Success : ButtonStyle.Primary,
 *                  label: "Accept the rules",
 *                  customId: "regpanel.accept-rules",
 *                  disabled: menuData.acceptedRules
 *              }]
 *          }, {
 *              type: ComponentType.ActionRow,
 *              components: [{
 *                  type: ComponentType.StringSelect,
 *                  style: ButtonStyle.Primary,
 *                  customId: "regpanel.select-age",
 *                  options: eds.optionsWithDefaultValues([
 *                      { label: "13-17", value: "13-17" },
 *                      { label: "18-23", value: "18-23" },
 *                      { label: "24-29", value: "24-29" },
 *                      { label: "30-453", value: "30-453" },
 *                  ], menuData.age ?? null)
 *              }]
 *          }, {
 *              type: ComponentType.ActionRow,
 *              components: [{
 *                  type: ComponentType.Button,
 *                  style: ButtonStyle.Primary,
 *                  label: "Submit",
 *                  customId: "regpanel.submit",
 *                  disabled: !(menuData.name && menuData.surname && menuData.acceptedRules)
 *              }]
 *          }]
 *      });
 *      const reply = await ctx.channel.send( message({}) ).catch(console.error);
 *      if (!reply) return;
 *      InteractivePanel.register(message, reply.id);
 *      panelAuthors.set(reply.id, ctx.authorId);
 * }
 * 
 * eds.createButton({
 *      custom_id: "regpanel.accept-rules"
 * }, async ctx => {
 *      if (panelAuthors.get(ctx.message.id) != ctx.user.id) return;
 *      const menu = InteractivePanel.getMenu<RegPanelData>(ctx.message.id);
 *      if (!menu) return;
 *      
 *      menu.data.acceptedRules = true;
 *      ctx.update(menu.render()).catch(console.error);
 * });
 * ... and so on ...
 * ```
 */
export class InteractivePanel<T extends object>
{
    private static instances: Map<string, InteractivePanel<object>> = new Map();

    /**
     * Retrieves an instance of the panel by message ID
     */
    public static getMenu<T extends object>(msgId: string): InteractivePanel<T> | undefined
    {
        return this.instances.get(msgId) as unknown as InteractivePanel<T>;
    }

    /**
     * Registers a new panel instance with the specified message constructor
     */
    public static register<T extends object>(messageConstructor: InteractivePanel.ConstructMessageFn<T>, msgId: string)
    {
        this.instances.set(msgId, new this(messageConstructor));
    }

    /**
     * Creates a string representation of keys and values for displaying in the message
     *
     */
    public static renderValues(keysAndValues: [string, string | undefined, string?][]): string
    {
        let rendered = '';
        for (const [key, maybeValue, afterValue] of keysAndValues)
            if (maybeValue !== undefined)
                rendered += (key + maybeValue + (afterValue ?? '') + '\n')
        return rendered;
    }



    /**
     * Panel data
     */
    public data: Partial<T> = {};
    private constructor(private messageConstructor: InteractivePanel.ConstructMessageFn<T>) {}

    /**
     * Renders the current state of the panel data into a message
    */
    public render(): MessageCreateOptions & InteractionUpdateOptions & InteractionReplyOptions
    {
        return this.messageConstructor(this.data);
    }

    /**
     * Don't forget to call this when the user submits the panel and it is no longer needed
     */
    public deleteInstance()
    {
        let instanceKey: string | undefined;
        for (const [key, value] of InteractivePanel.instances.entries())
            if ((value as unknown as InteractivePanel<T>) == this)
                instanceKey = key;
        if (!instanceKey) return;

        InteractivePanel.instances.delete(instanceKey);
    }
}
export namespace InteractivePanel
{
    export type ConstructMessageFn<T extends {}> = (menuData: Partial<T>) => MessageCreateOptions & InteractionUpdateOptions & InteractionReplyOptions;
}
