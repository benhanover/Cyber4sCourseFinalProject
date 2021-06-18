"use strict";
// import models
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModel = void 0;
const models_1 = require("./models");
function getModel(modelEnum) {
    switch (modelEnum) {
        case 'User':
            return models_1.User;
        case 'Room':
            return models_1.Room;
        default:
            return undefined;
            break;
    }
}
exports.getModel = getModel;
