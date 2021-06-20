"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokens = void 0;
// import libraries
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import unions
const errorEnums_1 = require("../enums/errorEnums");
// import env
const accessTokenKey = process.env.ACCESS_TOKEN_KEY;
const refreshTokenKey = process.env.REFRESH_TOKEN_KEY;
if (!accessTokenKey || !refreshTokenKey) {
    throw errorEnums_1.errorEnums.NO_ENV_VAR;
}
/*---------------------------------------------------------------------------------------------------------- */
const generateTokens = (user) => {
    try {
        const accessToken = jsonwebtoken_1.default.sign(user, accessTokenKey, {
            expiresIn: '15m',
        });
        const refreshToken = jsonwebtoken_1.default.sign(user, refreshTokenKey, {
            expiresIn: '8h',
        });
        return { accessToken, refreshToken };
    }
    catch (e) {
        console.log(errorEnums_1.errorEnums.NO_TOKEN + e);
    }
};
exports.generateTokens = generateTokens;
