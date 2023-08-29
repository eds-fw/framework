const { runtimeStorage } = require("..");
exports.createButton = (...params) => runtimeStorage.getProp("componentManager").createButton(...params);
exports.createMenu = (...params) => runtimeStorage.getProp("componentManager").createMenu(...params);
exports.createModal = (...params) => runtimeStorage.getProp("componentManager").createModal(...params);