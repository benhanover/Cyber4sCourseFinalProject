"use strict";
// require('dotenv').config({ path: '../../.env' });
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newToken = exports.logout = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("../enums/index");
// import mongo-functions
const mongo_functions_1 = require("../mongo/mongo-functions");
// import assistance functions
const functions_1 = require("../utils/functions");
const { hash, compare } = bcrypt_1.default;
const refreshTokenKey = process.env.REFRESH_TOKEN_KEY;
const accessTokenKey = process.env.ACCESS_TOKEN_KEY;
/*---------------------------------------------------------------------------------------------------------- */
/* function
  - checks the availibilty of the credentials
  - hash the password
  - register the new user to the DB
  - generates tokens
  - saves the tokens
*/
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // prettier-ignore
    const { lastName, firstName, email, password, birthDate, username } = req.body;
    const registrationAvailability = yield mongo_functions_1.canRegister(email, username);
    if (!registrationAvailability.return) {
        console.log(index_1.errorEnums.REGISTER_FAILED + registrationAvailability.message);
        return res
            .status(409)
            .send(index_1.errorEnums.REGISTER_FAILED + registrationAvailability.message);
    }
    const hashPassword = yield hash(password, 10);
    // prettier-ignore
    const user = { lastName, firstName, email, password: hashPassword, birthDate, username };
    const registered = yield mongo_functions_1.registerUser(user);
    if (!registered)
        return res.status(500).send('Could Not Register');
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
/*
function
  - looks for the user
  - test the hash password
  - generate tokens
  - save the tokens
 */
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const foundUser = yield mongo_functions_1.findDocument('User', 'email', email);
    // all but Iuser
    if (!('username' in foundUser)) {
        console.log(index_1.errorEnums.NO_SUCH_USER);
        return res.status(409).send(index_1.errorEnums.NO_SUCH_USER);
    }
    try {
        const isPasswordCorrect = yield compare(password, foundUser.password);
        if (!isPasswordCorrect) {
            console.log(index_1.errorEnums.WRONG_CREDENTIALS);
            return res.status(409).send(index_1.errorEnums.WRONG_CREDENTIALS);
        }
        const newTokens = functions_1.generateTokens({ foundUser });
        if (!newTokens) {
            console.log(index_1.errorEnums.NO_TOKEN);
            return;
        }
        yield mongo_functions_1.saveRefreshToken(newTokens.refreshToken);
        yield mongo_functions_1.saveAccessToken(newTokens.accessToken);
        console.log(index_1.logsEnums.LOGGED_IN_SUCCESSFULY);
        return res.send(Object.assign(Object.assign({}, newTokens), { message: index_1.logsEnums.LOGGED_IN_SUCCESSFULY }));
    }
    catch (error) {
        console.log(index_1.errorEnums.LOGIN_FAILED + error);
        res.sendStatus(500);
    }
});
exports.login = login;
/*---------------------------------------------------------------------------------------------------------- */
/*
  - recives both access and refresh tokens
  -
*/
// prettier-ignore
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = req.headers['authorization'];
    const refreshToken = req.headers['refreshtoken'];
    if (!refreshToken || Array.isArray(refreshToken)) {
        console.log(index_1.errorEnums.NO_TOKEN);
        res.status(401).send('Refresh Token Required');
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
const newToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Requesting new accessToken');
    const token = req.headers['refreshtoken'];
    let accessUpdated;
    if (!token || Array.isArray(token)) {
        console.log(index_1.errorEnums.NO_TOKEN);
        return res.status(401).send(index_1.errorEnums.NO_TOKEN);
    }
    jsonwebtoken_1.default.verify(token, refreshTokenKey, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.log(index_1.errorEnums.INVALID_TOKEN + err);
            return res.status(403).send(index_1.errorEnums.INVALID_TOKEN);
        }
        if (!mongo_functions_1.isRefreshSaved(token)) {
            // catfish in the site
            console.log('Catfish Detected');
            return res.status(403).send(index_1.errorEnums.INVALID_TOKEN);
        }
        const userAssignedToToken = {
            username: user.username,
            email: user.email,
            lastName: user.lastName,
            firstName: user.firstName,
            password: user.password,
            birthDate: user.birthDate,
        };
        const accessToken = jsonwebtoken_1.default.sign(userAssignedToToken, accessTokenKey, {
            expiresIn: '15m',
        });
        accessUpdated = yield mongo_functions_1.saveAccessToken(accessToken);
        if (accessUpdated) {
            return res.status(200).json({ accessToken });
        }
        console.log(index_1.errorEnums.FAILED_ADDING_DATA);
        return res.status(400).send(index_1.errorEnums.FAILED_ADDING_DATA);
    }));
});
exports.newToken = newToken;
