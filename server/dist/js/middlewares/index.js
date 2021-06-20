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
// require('dotenv').config({ path: '../../.env' });
// import libraries
const jwt = require('jsonwebtoken'); // types errors if imported and not required
// import mongo-functions
const mongo_functions_1 = require("../mongo/mongo-functions");
// import env
const accessTokenKey = process.env.ACCESS_TOKEN_KEY;
// import enums
const index_1 = require("../enums/index");
if (!accessTokenKey) {
    throw index_1.errorEnums.NO_TOKEN;
}
// Checks AccessToken Validity
const accessTokenValidator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = req.headers['authorization'];
    if (!accessToken) {
        console.log(index_1.errorEnums.NO_TOKEN);
        res.status(401).send(index_1.errorEnums.NO_TOKEN);
        return;
    }
    return jwt.verify(accessToken, accessTokenKey, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            // ask for the refresh token
            console.log("Invalid AccessToken");
            res.status(401).send();
            return;
        }
        if (!(yield mongo_functions_1.isAccessSaved(accessToken))) {
            // catfish detected
            console.log(index_1.errorEnums.CATFISH);
            res.status(403).send(index_1.errorEnums.FORBIDDEN);
            return;
        }
        req.body.accessToken = accessToken;
        req.body.user = user;
        return next();
    }));
});
exports.accessTokenValidator = accessTokenValidator;
