"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Schema } = require("mongoose");
const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    birthDate: Date,
    username: String,
});
exports.default = userSchema;
