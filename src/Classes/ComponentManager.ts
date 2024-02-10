import {
    AnySelectMenuInteraction,
    ButtonInteraction,
    ChannelSelectMenuInteraction,
    MentionableSelectMenuInteraction,
    ModalMessageModalSubmitInteraction,
    ModalSubmitFields,
    ModalSubmitInteraction,
    RoleSelectMenuInteraction,
    StringSelectMenuInteraction,
    UserSelectMenuInteraction
} from "discord.js";

import type { eds } from "..";

type MapVal<R, I> = {
    run: R;
    info: I;
};

/**
 * Stores information and code for all message components.
 */
export class ComponentManager
{
    private readonly _ButtonsMap = new Map<string, MapVal<ComponentManager.ButtonCode, ComponentManager.ButtonOptions>>();
    private readonly _MenusMap = new Map<string, MapVal<ComponentManager.AnyMenuCode, ComponentManager.MenuOptions>>();
    private readonly _ModalsMap = new Map<string, MapVal<ComponentManager.ModalCode, ComponentManager.ModalOptions>>();

    public get getButtonsMap()
    {
        return this._ButtonsMap;
    }
    public get getMenusMap()
    {
        return this._MenusMap;
    }
    public get getModalsMap()
    {
        return this._ModalsMap;
    }

    public clearMaps(): void
    {
        this._ButtonsMap.clear();
        this._MenusMap.clear();
        this._ModalsMap.clear();
    }
    
    public createButton(options: ComponentManager.ButtonOptions, code: ComponentManager.ButtonCode): void
    {
        this._ButtonsMap.set(options.custom_id, {
            run: code,
            info: options
        });
    }
    public createMenu<T extends ComponentManager.MenuOptions>(options: T,
        code: T["userSelect"] extends true
                ? ComponentManager.MenuUserCode
                : T["channelSelect"] extends true
                    ? ComponentManager.MenuChannelCode
                    : T["mentionableSelect"] extends true
                        ? ComponentManager.MenuMentionableCode
                        : T["roleSelect"] extends true
                            ? ComponentManager.MenuRoleCode
                            : ComponentManager.MenuStringCode,
    ): void {
        this._MenusMap.set(options.custom_id, {
            run: code,
            info: options
        });
    }
    public createModal(options: ComponentManager.ModalOptions, code: ComponentManager.ModalCode): void
    {
        this._ModalsMap.set(options.custom_id, {
            run: code,
            info: options
        });
    }
}

export namespace ComponentManager
{
    export type ButtonCode = (ctx: eds.InteractionContext<ButtonInteraction>, options: ButtonOptions) => Promise<void> | void;

    export type MenuStringCode = Record<string, (ctx: eds.InteractionContext<StringSelectMenuInteraction>, options: MenuOptions) => Promise<void> | void>;
    export type MenuUserCode = (ctx: eds.InteractionContext<UserSelectMenuInteraction>, options: MenuOptions) => Promise<void> | void;
    export type MenuChannelCode = (ctx: eds.InteractionContext<ChannelSelectMenuInteraction>, options: MenuOptions) => Promise<void> | void;
    export type MenuMentionableCode = (ctx: eds.InteractionContext<MentionableSelectMenuInteraction>, options: MenuOptions) => Promise<void> | void;
    export type MenuRoleCode = (ctx: eds.InteractionContext<RoleSelectMenuInteraction>, options: MenuOptions) => Promise<void> | void;
    export type AnyMenuCode = MenuStringCode | MenuUserCode | MenuChannelCode | MenuMentionableCode | MenuRoleCode;

    export type ModalCode = (ctx: eds.InteractionContext<ModalSubmitInteraction | ModalMessageModalSubmitInteraction>, fields: ModalSubmitFields, options: ModalOptions) => Promise<void> | void;

    interface BaseOptions
    {
        custom_id:          string;
        noLog?:             boolean;
        /** Do not add 'everyone' role ID @functional may affect command execution */
        allowedRoles?:      string[];
        /** @functional may affect command execution */
        noCheckAccess?:     boolean;
    }

    export interface ButtonOptions extends BaseOptions
    {
    }

    export interface MenuOptions extends BaseOptions
    {
        userSelect?: boolean;
        channelSelect?: boolean;
        mentionableSelect?: boolean;
        roleSelect?: boolean;
        onSelect?: (ctx: eds.InteractionContext<AnySelectMenuInteraction>, options: MenuOptions) => Promise<void> | void;
    }

    export interface ModalOptions extends BaseOptions
    {
    }
}