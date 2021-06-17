"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Schema } = require("mongoose");
const roomSchema = new Schema({
    name: String,
    id: String,
    participants: [String],
});
exports.default = roomSchema;
