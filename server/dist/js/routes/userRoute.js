"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const models_1 = require("../mongo/models");
const users = express_1.Router();
users.post("/login", (req, res) => {
    console.log("Holas!!");
    const { email, password } = req.body;
});
users.post("/register", (req, res) => {
    const { lastName, firstName, email, password, birthDate, username } = req.body;
    models_1.User.find({ $or: [{ email }, { username }] }).then((users) => {
        const alreadyExist = users.find((user) => {
            if (user.email === email) {
                res.send("email allready exist");
                return true;
            }
            else if (user.username === username) {
                res.send("username allready exist");
                return true;
            }
        });
        if (alreadyExist)
            return;
        models_1.User.create({
            lastName,
            firstName,
            email,
            password,
            birthDate,
            username,
        })
            .then(() => {
            console.log("register succesfuly");
            res.send("register succesfuly");
        })
            .catch((e) => {
            console.log("could not register:", e);
            res.send("could not register: " + e.message);
        });
    });
});
exports.default = users;
