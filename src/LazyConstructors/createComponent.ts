import { type eds, runtimeStorage } from "..";

export function createButton(options: eds.ComponentManager.ButtonOptions, code: eds.ComponentManager.ButtonCode): void
{
    let componentManager = runtimeStorage.getProp<eds.ComponentManager>("componentManager");
    componentManager.createButton(options, code);
}

export function createMenu<T extends eds.ComponentManager.MenuOptions>(options: T,
    code: T["userSelect"] extends true
        ? eds.ComponentManager.MenuUserCode
        : eds.ComponentManager.MenuStringCode
): void {
    let componentManager = runtimeStorage.getProp<eds.ComponentManager>("componentManager");
    componentManager.createMenu<T>(options, code);
}

export function createModal(options: eds.ComponentManager.ModalOptions, code: eds.ComponentManager.ModalCode): void
{
    let componentManager = runtimeStorage.getProp<eds.ComponentManager>("componentManager");
    componentManager.createModal(options, code);
}