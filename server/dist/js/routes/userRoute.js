"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const users = express_1.Router();
users.post('/login', userController_1.login);
users.post('/register', userController_1.register);
exports.default = users;
