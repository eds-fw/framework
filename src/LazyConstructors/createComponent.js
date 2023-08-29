const { runtimeStorage, ComponentManager } = require("..");

/** @type {ComponentManager["createButton"]} */
exports.createButton = (...params) => runtimeStorage.getProp("componentManager").createButton(...params);

/** @type {ComponentManager["createMenu"]} */
exports.createMenu = (...params) => runtimeStorage.getProp("componentManager").createMenu(...params);

/** @type {ComponentManager["createModal"]} */
exports.createModal = (...params) => runtimeStorage.getProp("componentManager").createModal(...params);