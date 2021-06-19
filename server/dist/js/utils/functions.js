"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokens = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const accessTokenKey = process.env.ACCESS_TOKEN_KEY;
const refreshTokenKey = process.env.REFRESH_TOKEN_KEY;
if (!accessTokenKey || !refreshTokenKey) {
    throw 'Could Not Get Env Vars, The Env File';
}
const generateTokens = (user) => {
    const accessToken = jsonwebtoken_1.default.sign(user, accessTokenKey, {
        expiresIn: '15m',
    });
    const refreshToken = jsonwebtoken_1.default.sign(user, refreshTokenKey, {
        expiresIn: '8h',
    });
    return { accessToken, refreshToken };
};
exports.generateTokens = generateTokens;
