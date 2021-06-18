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
const bcrypt_1 = __importDefault(require("bcrypt"));
// import mongo-functions
const mongo_functions_1 = require("../mongo/mongo-functions");
const { hashSync, compare } = bcrypt_1.default;
const pass = hashSync('sfdgnakjasdf', 10);
console.log(pass);
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { lastName, firstName, email, password, birthDate, username } = req.body;
    const registrationAvailability = yield mongo_functions_1.canRegister(email, username);
    if (!registrationAvailability.return) {
        return res.status(409).send('Could Not Register: ' + registrationAvailability.message);
    }
    const hashPassword = hashSync(password, 10);
    const user = { lastName, firstName, email, password: hashPassword, birthDate, username };
    const registered = yield mongo_functions_1.registerUser(user);
    if (registered)
        return res.send("Registered Successfully");
    return res.status(500).send("Could Not Register");
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //     // const { email, password } = req.body;
    //     // ////////////if there are no usuername or password
    //     let foundUser: Iuser | undefined
    //     // try 
    //     {foundUser = await User.findOne({email});}
    //     // catch(e){
    //     //   console.log(e);
    //     //   res.send("Coulnt login -internal error")// add status
    //     // }
    //     // if (!foundUser) {
    //     //   return res.status(409).send("One or tow of the following is incorrect");
    //     // }
    //     // try {
    //     //   const isPasswordCorrect = await compare(password, foundUser.password);
    //     //   if (!isPasswordCorrect) {
    //     //     return res.status(409).send("password is incorrect");
    //     //   }
    //     //   const userData = { username };
    //     //   const accessToken = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, {
    //     //     expiresIn: "10s",
    //     //   });
    //     //   const refreshToken = jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET, {
    //     //     expiresIn: "4h",
    //     //   });
    //     //   RefreshTokens.create(
    //     //     {
    //     //       refresh_token: refreshToken,
    //     //       expires_at: new Date().getTime() / 1000 + 14400,
    //     //       username,
    //     //     },
    //     //     { fields: ["refresh_token", "expires_at", "username"] }
    //     //   );
    //     //   return res.json({ accessToken, refreshToken });
    //     // } catch (error) {
    //     //   console.log(error);
    //     //   res.sendStatus(500);
    //     // }
});
exports.login = login;
