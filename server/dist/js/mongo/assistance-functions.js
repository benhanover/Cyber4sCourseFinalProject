"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModel = void 0;
// import models
const models_1 = require("./models");
/*---------------------------------------------------------------------------------------------------------- */
//  gets a model by given string
function getModel(modelEnum) {
    switch (modelEnum) {
        case 'User':
            return models_1.User;
        case 'Room':
            return models_1.Room;
        default:
            return undefined;
    }
}
exports.getModel = getModel;
