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
exports.isAccessSaved = exports.isRefreshSaved = exports.saveAccessToken = exports.saveRefreshToken = exports.removeRefreshToken = exports.removeAccessToken = exports.findDocument = exports.getRooms = exports.saveRoom = exports.registerUser = exports.canRegister = void 0;
// import models
const models_1 = require("./models");
const enums_1 = require("../enums");
// import models
const assistance_functions_1 = require("./assistance-functions");
/*---------------------------------------------------------------------------------------------------------- */
// used in: userControllers | checks wether the username and email are avalable.
const canRegister = (email, username) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield models_1.User.find({
            $or: [{ email }, { username }],
        });
        let returnObjCaseExist;
        users.find((user) => {
            if (user.email === email) {
                console.log(enums_1.errorEnums.EMAIL_TAKEN);
                returnObjCaseExist = { return: false, message: enums_1.errorEnums.EMAIL_TAKEN };
            }
            else if (user.username === username) {
                console.log(enums_1.errorEnums.USERNAME_TAKEN);
                returnObjCaseExist = {
                    return: false,
                    message: enums_1.errorEnums.USERNAME_TAKEN,
                };
            }
        });
        if (returnObjCaseExist) {
            return returnObjCaseExist;
        }
        return { return: true };
    }
    catch (e) {
        console.log(enums_1.errorEnums.FAILED_GETTING_DATA + e);
        return { return: false, message: e };
    }
});
exports.canRegister = canRegister;
/*---------------------------------------------------------------------------------------------------------- */
//   used in: userControllers | saves a given user in db
const registerUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = models_1.User.create(user);
        if (Boolean(updatedUser))
            return true;
        console.log(enums_1.errorEnums.FAILED_ADDING_DATA);
        return false;
    }
    catch (e) {
        console.log(enums_1.errorEnums.FAILED_ADDING_DATA + e);
        return false;
    }
});
exports.registerUser = registerUser;
/*---------------------------------------------------------------------------------------------------------- */
//   used in: roomControllers | saves a given room in db
const saveRoom = (room) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedRoom = yield models_1.Room.create(room);
        if (Boolean(updatedRoom))
            return true;
        console.log(enums_1.errorEnums.FAILED_ADDING_DATA);
        return false;
    }
    catch (e) {
        console.log(enums_1.errorEnums.FAILED_ADDING_DATA + e);
        return false;
    }
});
exports.saveRoom = saveRoom;
/*---------------------------------------------------------------------------------------------------------- */
//  used in: roomControllers | returns all rooms from db
const getRooms = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rooms = yield models_1.Room.find();
        return rooms;
    }
    catch (e) {
        console.log(enums_1.errorEnums.FAILED_GETTING_DATA + e);
        return [];
    }
});
exports.getRooms = getRooms;
/*---------------------------------------------------------------------------------------------------------- */
// used in: userControllers | finds a document by model and field
const findDocument = (modelString, field, fieldContent) => __awaiter(void 0, void 0, void 0, function* () {
    const model = assistance_functions_1.getModel(modelString);
    if (!model) {
        console.log(enums_1.errorEnums.NO_MODEL_ENUM);
        return {
            return: false,
            message: 'Missing parameter line 68 ,mongo-functions',
        };
    }
    try {
        const foundDocument = yield model.findOne({
            [field]: fieldContent,
        });
        return foundDocument ? foundDocument : { return: false, message: modelString + enums_1.errorEnums.NOT_FOUND };
    }
    catch (e) {
        console.log(enums_1.errorEnums.FAILED_GETTING_DATA + e);
        return { return: false, message: enums_1.errorEnums.FAILED_GETTING_DATA + e };
    }
});
exports.findDocument = findDocument;
/*---------------------------------------------------------------------------------------------------------- */
// used in: userControllers | removes accessToken from db
const removeAccessToken = (accessToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { deletedCount: accessDeleted } = yield models_1.AccessToken.deleteOne({ accessToken });
        console.log('Access Token Deleted');
        if (accessDeleted && accessDeleted > 0) {
            return true;
        }
        console.log(enums_1.errorEnums.NOT_FOUND);
        return false;
    }
    catch (e) {
        console.log(enums_1.errorEnums.FAILED_DELETING_DATA + e);
        return false;
    }
});
exports.removeAccessToken = removeAccessToken;
/*---------------------------------------------------------------------------------------------------------- */
// used in: userController | removes refreshToken from db
const removeRefreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { deletedCount: refreshDeleted } = yield models_1.RefreshToken.deleteOne({ refreshToken });
        if (refreshDeleted && refreshDeleted > 0) {
            console.log('Refresh Token Deleted');
            return true;
        }
        console.log(enums_1.errorEnums.NOT_FOUND);
        return false;
    }
    catch (e) {
        console.log(enums_1.errorEnums.FAILED_DELETING_DATA + e);
        return false;
    }
});
exports.removeRefreshToken = removeRefreshToken;
/*---------------------------------------------------------------------------------------------------------- */
//  used in: userControllers | saves a refreshToken in db
const saveRefreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield models_1.RefreshToken.create({ refreshToken });
        console.log('Refresh Token Saved');
        return true;
    }
    catch (e) {
        console.log(enums_1.errorEnums.FAILED_ADDING_DATA + e);
        return false;
    }
});
exports.saveRefreshToken = saveRefreshToken;
/*---------------------------------------------------------------------------------------------------------- */
//  used in: userControllers | saves a accessToken in db
const saveAccessToken = (accessToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield models_1.AccessToken.create({ accessToken });
        console.log('Access Token Saved');
        return true;
    }
    catch (e) {
        console.log(enums_1.errorEnums.FAILED_ADDING_DATA + e);
        return false;
    }
});
exports.saveAccessToken = saveAccessToken;
/*---------------------------------------------------------------------------------------------------------- */
// used in: userController | checks if refreshToken exists in db 
const isRefreshSaved = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    return Boolean(yield models_1.RefreshToken.findOne({ refreshToken }));
});
exports.isRefreshSaved = isRefreshSaved;
/*---------------------------------------------------------------------------------------------------------- */
//  used in: middlewares/index | checks if accessToken exists in db 
const isAccessSaved = (accessToken) => __awaiter(void 0, void 0, void 0, function* () {
    return Boolean(yield models_1.AccessToken.findOne({ accessToken }));
});
exports.isAccessSaved = isAccessSaved;
