"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.Room = exports.RefreshToken = exports.AccessToken = void 0;
// prettier-ignore
const index_1 = require("./schema/index");
const mongoose_1 = __importDefault(require("mongoose"));
exports.AccessToken = mongoose_1.default.model('AccessToken', index_1.accessTokenSchema);
exports.RefreshToken = mongoose_1.default.model('RefreshToken', index_1.refreshTokenSchema);
exports.Room = mongoose_1.default.model('Room', index_1.roomSchema);
exports.User = mongoose_1.default.model('User', index_1.userSchema);
