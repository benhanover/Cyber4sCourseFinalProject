"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongo_functions_1 = require("../mongo/mongo-functions");
const refreshTokenKey = process.env.REFRESH_TOKEN_KEY;
const accessTokenKey = process.env.ACCESS_TOKEN_KEY;
const refresh = express_1.Router();
refresh.get('/', (req, res) => {
    const token = req.headers['refreshtoken'];
    if (!token || Array.isArray(token)) {
        return res.status(401).send('Refresh Token Required');
    }
    //   const isExist = refreshTokens.includes(token);
    if (!mongo_functions_1.isValidRefresh(token)) {
        // catfish in the site
        return res.status(403).send('Invalid Refresh Token');
    }
    jsonwebtoken_1.default.verify(token, refreshTokenKey, (err, user) => {
        if (err) {
            return res.status(403).send('Invalid Refresh Token');
        }
        const userAssignedToToken = {
            username: user.username,
            email: user.email,
            lastName: user.lastName,
            firstName: user.firstName,
            password: user.password,
            birthDate: user.birthDate,
        };
        console.log(user);
        const accessToken = jsonwebtoken_1.default.sign(userAssignedToToken, accessTokenKey, {
            expiresIn: '15m',
        });
        return res.status(200).json({ accessToken });
    });
});
exports.default = refresh;
