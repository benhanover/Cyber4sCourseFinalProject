"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users = express_1.Router();
users.post("/login", (req, res) => {
    console.log("Holas!!");
    const { email, password } = req.body;
});
users.post("/register", (req, res) => {
    const { lastName, firstName, email, password } = req.body;
});
exports.default = users;
