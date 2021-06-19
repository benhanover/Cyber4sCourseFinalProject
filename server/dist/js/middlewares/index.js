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
const jwt = require('jsonwebtoken');
const accessTokenKey = process.env.ACCESS_TOKEN_KEY;
// PROBLEM- go to todo.txt
// prettier-ignore
const accessTokenValidator = (req, res, next) => {
    const accessToken = req.headers['authorization'];
    if (!accessToken)
        return res.status(401).send('Valid Token Required');
    jwt.verify(accessToken, accessTokenKey, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(401).end();
        }
        req.body.accessToken = accessToken;
        req.body.user = user;
    }));
    return next();
};
exports.accessTokenValidator = accessTokenValidator;
