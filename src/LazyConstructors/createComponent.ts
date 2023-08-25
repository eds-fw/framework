import { type eds, runtimeStorage } from "..";

export function createButton(options: eds.ComponentManager.ButtonOptions, code: eds.ComponentManager.ButtonCode)
{
    let componentManager = runtimeStorage.getProp<eds.ComponentManager>("componentManager");
    componentManager.createButton(options, code);
}

export function createMenu<T extends eds.ComponentManager.MenuOptions>(options: T,
    code: T["userSelect"] extends true
        ? eds.ComponentManager.MenuUserSelectCode
        : eds.ComponentManager.MenuStringSelectCode)
{
    let componentManager = runtimeStorage.getProp<eds.ComponentManager>("componentManager");
    componentManager.createMenu<T>(options, code);
}

export function createModal(options: eds.ComponentManager.ModalOptions, code: eds.ComponentManager.ModalCode)
{
    let componentManager = runtimeStorage.getProp<eds.ComponentManager>("componentManager");
    componentManager.createModal(options, code);
}