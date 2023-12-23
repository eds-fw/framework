const { runtimeStorage, ComponentManager } = require("..");

/** @type {ComponentManager["createButton"]} */
exports.createButton = (...params) => runtimeStorage.componentManager.createButton(...params);

/** @type {ComponentManager["createMenu"]} */
exports.createMenu = (...params) => runtimeStorage.componentManager.createMenu(...params);

/** @type {ComponentManager["createModal"]} */
exports.createModal = (...params) => runtimeStorage.componentManager.createModal(...params);