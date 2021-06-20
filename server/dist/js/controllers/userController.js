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
exports.newToken = exports.logout = exports.login = exports.register = void 0;
const bcrypt_1 = require("bcrypt");
const jwt = require('jsonwebtoken'); // types errors if imported and not required
const index_1 = require("../enums/index");
// import mongo-functions
const mongo_functions_1 = require("../mongo/mongo-functions");
// import assistance functions
const functions_1 = require("../utils/functions");
// env
const refreshTokenKey = process.env.REFRESH_TOKEN_KEY;
const accessTokenKey = process.env.ACCESS_TOKEN_KEY;
if (!refreshTokenKey || !accessTokenKey) {
    console.log(index_1.errorEnums.NO_TOKEN);
    throw index_1.errorEnums.NO_TOKEN;
}
/*---------------------------------------------------------------------------------------------------------- */
// saves a new user to db with hashed password; saves the new tokens in db.
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Trying to Register...");
    const user = req.body;
    const registrationAvailability = yield mongo_functions_1.canRegister(user.email, user.username);
    if (!registrationAvailability.return) {
        console.log(index_1.errorEnums.REGISTER_FAILED + registrationAvailability.message);
        return res
            .status(409)
            .send(index_1.errorEnums.REGISTER_FAILED + registrationAvailability.message);
    }
    user.password = yield bcrypt_1.hash(user.password, 10);
    const registered = yield mongo_functions_1.registerUser(user);
    if (!registered) {
        console.log(index_1.errorEnums.REGISTER_FAILED);
        res.status(500).send(index_1.errorEnums.REGISTER_FAILED);
        return;
    }
    const newTokens = functions_1.generateTokens(user);
    if (!newTokens) {
        console.log(index_1.errorEnums.REGISTER_FAILED + index_1.errorEnums.NO_TOKEN);
        return;
    }
    yield mongo_functions_1.saveRefreshToken(newTokens.refreshToken);
    yield mongo_functions_1.saveAccessToken(newTokens.accessToken);
    console.log(index_1.logsEnums.REGISTER_SUCCESSFULY);
    return res.send(Object.assign(Object.assign({}, newTokens), { message: index_1.logsEnums.REGISTER_SUCCESSFULY }));
});
exports.register = register;
/*---------------------------------------------------------------------------------------------------------- */
// authenticate the user and saves new tokens in db
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Trying to Login...");
    const { email, password } = req.body;
    const foundUser = yield mongo_functions_1.findDocument('User', 'email', email);
    // all but Iuser
    if (!('username' in foundUser)) {
        console.log(index_1.errorEnums.NO_SUCH_USER);
        res.status(409).send(index_1.errorEnums.NO_SUCH_USER);
        return;
    }
    try {
        const isPasswordCorrect = yield bcrypt_1.compare(password, foundUser.password);
        if (!isPasswordCorrect) {
            console.log(index_1.errorEnums.WRONG_CREDENTIALS);
            res.status(409).send(index_1.errorEnums.WRONG_CREDENTIALS);
            return;
        }
        const newTokens = functions_1.generateTokens({ foundUser });
        if (!newTokens) {
            console.log(index_1.errorEnums.NO_TOKEN);
            res.sendStatus(500);
            return;
        }
        yield mongo_functions_1.saveRefreshToken(newTokens.refreshToken);
        yield mongo_functions_1.saveAccessToken(newTokens.accessToken);
        console.log(index_1.logsEnums.LOGGED_IN_SUCCESSFULY);
        res.send(Object.assign(Object.assign({}, newTokens), { message: index_1.logsEnums.LOGGED_IN_SUCCESSFULY }));
        return;
    }
    catch (error) {
        console.log(index_1.errorEnums.LOGIN_FAILED + error);
        res.sendStatus(500);
        return;
    }
});
exports.login = login;
/*---------------------------------------------------------------------------------------------------------- */
//  removes tokens from db
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Trying to Logout...");
    const accessToken = req.body.accessToken;
    const refreshToken = req.headers['refreshtoken'];
    if (!refreshToken || Array.isArray(refreshToken)) {
        console.log(index_1.errorEnums.NO_TOKEN);
        res.status(401).send(index_1.errorEnums.NO_TOKEN);
        return;
    }
    const refreshremoved = yield mongo_functions_1.removeRefreshToken(refreshToken);
    const accessremoved = yield mongo_functions_1.removeAccessToken(accessToken);
    if (refreshremoved && accessremoved) {
        console.log(index_1.logsEnums.LOGGED_OUT_SUCCESSFULY);
        res.send(index_1.logsEnums.LOGGED_OUT_SUCCESSFULY);
        return;
    }
    console.log(index_1.errorEnums.LOGOUT_FAILED);
    res.send(index_1.errorEnums.LOGOUT_FAILED);
});
exports.logout = logout;
/*---------------------------------------------------------------------------------------------------------- */
//  sends a new saved accessToken to db and removes the old one.
const newToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Trying to Get a New AccessToken...");
    const token = req.headers['refreshtoken'];
    if (!token || Array.isArray(token)) {
        console.log(index_1.errorEnums.NO_TOKEN);
        res.status(401).send(index_1.errorEnums.NO_TOKEN);
        return;
    }
    // TODO: find type of user
    jwt.verify(token, refreshTokenKey, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.log(index_1.errorEnums.INVALID_TOKEN + err);
            res.status(403).send(index_1.errorEnums.INVALID_TOKEN);
            return;
        }
        if (!mongo_functions_1.isRefreshSaved(token)) {
            // catfish in the site
            console.log(index_1.errorEnums.CATFISH);
            res.status(403).send(index_1.errorEnums.FORBIDDEN);
            return;
        }
        const userAssignedToToken = {
            username: user.username,
            email: user.email,
            lastName: user.lastName,
            firstName: user.firstName,
            password: user.password,
            birthDate: user.birthDate,
        };
        const accessToken = jwt.sign(userAssignedToToken, accessTokenKey, {
            expiresIn: '15m',
        });
        const accessUpdated = yield mongo_functions_1.saveAccessToken(accessToken);
        if (accessUpdated) {
            res.status(200).json({ accessToken });
            return;
        }
        console.log(index_1.errorEnums.FAILED_ADDING_DATA);
        res.status(400).send(index_1.errorEnums.FAILED_ADDING_DATA);
        return;
    }));
});
exports.newToken = newToken;
