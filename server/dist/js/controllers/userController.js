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
exports.login = exports.register = void 0;
require('dotenv').config({ path: '../../.env' });
const bcrypt_1 = __importDefault(require("bcrypt"));
// import mongo-functions
const mongo_functions_1 = require("../mongo/mongo-functions");
// import assistance functions
const functions_1 = require("../utils/functions");
const { hash, compare } = bcrypt_1.default;
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
    return res.send(Object.assign(Object.assign({}, functions_1.generateTokens(user)), { message: 'Registerd Successfuly' }));
});
exports.register = register;
// need to add user does not exist
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('in the route');
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
        return res.send(Object.assign(Object.assign({}, functions_1.generateTokens({ foundUser })), { message: 'Connected Successfuly' }));
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});
exports.login = login;
