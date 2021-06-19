"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findDocument = exports.getRooms = exports.saveRoom = exports.registerUser = exports.canRegister = void 0;
// import models
const models_1 = require("./models");
const enums_1 = require("../enums");
const assistance_functions_1 = require("./assistance-functions");
// src/controllers/userControllers
const canRegister = (email, username) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield models_1.User.find({
            $or: [{ email }, { username }],
        });
        console.log('1');
        console.log(users);
        let returnObjCaseExist;
        users.find((user) => {
            if (user.email === email) {
                returnObjCaseExist = { return: false, message: 'Email Already Exist' };
            }
            else if (user.username === username) {
                returnObjCaseExist = {
                    return: false,
                    message: 'Username Already Exist',
                };
            }
        });
        console.log('2');
        if (returnObjCaseExist) {
            return returnObjCaseExist;
        }
        console.log('3');
        return { return: true };
    }
    catch (e) {
        console.log('4');
        return { return: false, message: e.message };
    }
});
exports.canRegister = canRegister;
// src/controllers/userControllers
const registerUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        models_1.User.create(user);
        return true;
    }
    catch (e) {
        console.log(e);
        return false;
    }
});
exports.registerUser = registerUser;
// src/controllers/roomControllers
const saveRoom = (room) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        models_1.Room.create(room);
        return true;
    }
    catch (e) {
        console.log(e);
        return false;
    }
});
exports.saveRoom = saveRoom;
const getRooms = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rooms = yield models_1.Room.find();
        return rooms;
    }
    catch (e) {
        console.log(enums_1.errorEnums.UNREACHABLE_DB + e.message);
        return [];
    }
});
exports.getRooms = getRooms;
// finds a document by model and fiel
const findDocument = (modelString, field, fieldContent) => __awaiter(void 0, void 0, void 0, function* () {
    const model = assistance_functions_1.getModel(modelString);
    if (!model) {
        console.log('No Model Enum Entered to findOne Function');
        return {
            return: false,
            message: 'Missing parameter line 68 ,mongo-functions',
        };
    }
    try {
        const foundDocument = yield model.findOne({
            [field]: fieldContent,
        });
        console.log('found Document: ', foundDocument);
        return foundDocument
            ? foundDocument
            : { return: false, message: modelString + enums_1.errorEnums.NOT_FOUND };
    }
    catch (e) {
        console.log(e, 'Inside findeOne Function');
        return { return: false, message: enums_1.errorEnums.UNREACHABLE_DB + e };
    }
});
exports.findDocument = findDocument;
