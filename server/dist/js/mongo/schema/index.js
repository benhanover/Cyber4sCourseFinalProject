"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.accessTokenSchema = exports.refreshTokenSchema = exports.userSchema = exports.roomSchema = void 0;
const roomSchema_1 = __importDefault(require("./roomSchema"));
exports.roomSchema = roomSchema_1.default;
const userSchema_1 = __importDefault(require("./userSchema"));
exports.userSchema = userSchema_1.default;
const refreshTokenSchema_1 = __importDefault(require("./refreshTokenSchema"));
exports.refreshTokenSchema = refreshTokenSchema_1.default;
const accessTokenSchema_1 = __importDefault(require("./accessTokenSchema"));
exports.accessTokenSchema = accessTokenSchema_1.default;
