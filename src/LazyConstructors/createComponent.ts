import type { eds } from "..";
import runtimeStorage from "../runtime";

export function createButton(options: eds.ComponentManager.ButtonOptions, code: eds.ComponentManager.ButtonCode)
{
    let componentManager = runtimeStorage.getProp<eds.ComponentManager>("componentManager");
    componentManager.createButton(options, code);
}

export function createMenu<T extends eds.ComponentManager.MenuOptions>(options: T, code: T["type"] extends "string" ? eds.ComponentManager.MenuCode : eds.ComponentManager.MenuUserSelectCode)
{
    let componentManager = runtimeStorage.getProp<eds.ComponentManager>("componentManager");
    componentManager.createMenu<T>(options, code);
}

export function createModal(options: eds.ComponentManager.ButtonOptions, code: eds.ComponentManager.ButtonCode)
{
    let componentManager = runtimeStorage.getProp<eds.ComponentManager>("componentManager");
    componentManager.createButton(options, code);
}