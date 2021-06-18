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
exports.saveRoom = exports.registerUser = exports.canRegister = void 0;
// import models
const models_1 = require("./models");
// src/controllers/userControllers
const canRegister = (email, username) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield models_1.User.find({ $or: [{ email }, { username }] });
        let returnObjCaseExist;
        users.find((user) => {
            if (user.email === email) {
                returnObjCaseExist = { return: false, message: 'Email Already Exist' };
            }
            else if (user.username === username) {
                returnObjCaseExist = { return: false, message: 'UserName Already Exist' };
            }
        });
        if (returnObjCaseExist) {
            return returnObjCaseExist;
        }
        return { return: true };
    }
    catch (e) {
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
