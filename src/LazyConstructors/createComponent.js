import { runtimeStorage, ComponentManager } from "../index.js";

/** @type {ComponentManager["createButton"]} */
export const createButton = (...params) => runtimeStorage.componentManager.createButton(...params);

/** @type {ComponentManager["createMenu"]} */
export const createMenu = (...params) => runtimeStorage.componentManager.createMenu(...params);

/** @type {ComponentManager["createModal"]} */
export const createModal = (...params) => runtimeStorage.componentManager.createModal(...params);