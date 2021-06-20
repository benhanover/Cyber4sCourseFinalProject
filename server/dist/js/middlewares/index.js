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
exports.accessTokenValidator = void 0;
require('dotenv').config({ path: '../../.env' });
const mongo_functions_1 = require("../mongo/mongo-functions");
const jwt = require('jsonwebtoken');
const accessTokenKey = process.env.ACCESS_TOKEN_KEY;
// PROBLEM- go to todo.txt
// prettier-ignore
const accessTokenValidator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = req.headers['authorization'];
    if (!accessToken)
        return res.status(401).send('Valid Token Required');
    return jwt.verify(accessToken, accessTokenKey, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            // ask for the refresh token
            console.log("Invalid AccessToken");
            return res.status(401).send();
        }
        if (!(yield mongo_functions_1.isValidAccess(accessToken))) {
            // catfish detected
            console.log("Catfish Detected");
            return res.status(403).send('Forbidden Token');
        }
        req.body.accessToken = accessToken;
        req.body.user = user;
        return next();
    }));
});
exports.accessTokenValidator = accessTokenValidator;
