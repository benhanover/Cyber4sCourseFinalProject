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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newToken = exports.logout = exports.login = exports.register = void 0;
require('dotenv').config({ path: '../../.env' });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import mongo-functions
const mongo_functions_1 = require("../mongo/mongo-functions");
// import assistance functions
const functions_1 = require("../utils/functions");
const { hash, compare } = bcrypt_1.default;
const refreshTokenKey = process.env.REFRESH_TOKEN_KEY;
const accessTokenKey = process.env.ACCESS_TOKEN_KEY;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // prettier-ignore
    const { lastName, firstName, email, password, birthDate, username } = req.body;
    const registrationAvailability = yield mongo_functions_1.canRegister(email, username);
    if (!registrationAvailability.return) {
        return res
            .status(409)
            .send('Could Not Register: ' + registrationAvailability.message);
    }
    const hashPassword = yield hash(password, 10);
    // prettier-ignore
    const user = { lastName, firstName, email, password: hashPassword, birthDate, username };
    const registered = yield mongo_functions_1.registerUser(user);
    if (!registered)
        return res.status(500).send('Could Not Register');
    const newTokens = functions_1.generateTokens(user);
    yield mongo_functions_1.saveRefreshToken(newTokens.refreshToken);
    yield mongo_functions_1.saveAccessToken(newTokens.accessToken);
    return res.send(Object.assign(Object.assign({}, newTokens), { message: 'Registerd Successfuly' }));
});
exports.register = register;
// need to add user does not exist
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const foundUser = yield mongo_functions_1.findDocument('User', 'email', email);
    // all but Iuser
    if (!('username' in foundUser)) {
        return res.status(409).send('Username or Password is incorrect');
    }
    try {
        const isPasswordCorrect = yield compare(password, foundUser.password);
        if (!isPasswordCorrect) {
            return res.status(409).send('Username or Password is incorrect');
        }
        const newTokens = functions_1.generateTokens({ foundUser });
        yield mongo_functions_1.saveRefreshToken(newTokens.refreshToken);
        yield mongo_functions_1.saveAccessToken(newTokens.accessToken);
        return res.send(Object.assign(Object.assign({}, newTokens), { message: 'Connected Successfuly' }));
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});
exports.login = login;
// prettier-ignore
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = req.headers['authorization'];
    const refreshToken = req.headers['refreshtoken'];
    if (!refreshToken || Array.isArray(refreshToken)) {
        console.log("No RefreshToken");
        res.status(401).send('Refresh Token Required');
        return;
    }
    const refreshremoved = yield mongo_functions_1.removeRefreshToken(refreshToken);
    const accessremoved = yield mongo_functions_1.removeAccessToken(accessToken);
    if (refreshremoved && accessremoved) {
        res.send("Logout Successfully");
        return;
    }
    res.send("Could Not Logout");
});
exports.logout = logout;
const newToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('in the newToken');
    const token = req.headers['refreshtoken'];
    let accessUpdated;
    if (!token || Array.isArray(token)) {
        console.log('No RefreshToken');
        return res.status(401).send('Refresh Token Required');
    }
    //   const isExist = refreshTokens.includes(token);
    if (!mongo_functions_1.isValidRefresh(token)) {
        // catfish in the site
        console.log('Catfish Detected');
        return res.status(403).send('Invalid Refresh Token');
    }
    jsonwebtoken_1.default.verify(token, refreshTokenKey, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.log('Invalid Refresh Token');
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
        const accessToken = jsonwebtoken_1.default.sign(userAssignedToToken, accessTokenKey, {
            expiresIn: '15m',
        });
        accessUpdated = yield mongo_functions_1.saveAccessToken(accessToken);
        if (accessUpdated) {
            console.log('AccessToken Updated');
            return res.status(200).json({ accessToken });
        }
        console.log('Could Not Add Access Token In DB');
        return res.status(400).send('Could Not Add Access Token');
    }));
});
exports.newToken = newToken;
