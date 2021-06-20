"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// prettier-ignore
const userController_1 = require("../controllers/userController");
const index_1 = require("../middlewares/index");
const users = express_1.Router();
users.post('/login', userController_1.login);
users.delete('/logout', index_1.accessTokenValidator, userController_1.logout);
users.post('/register', userController_1.register);
users.get('/refreshToken/', userController_1.newToken);
exports.default = users;
