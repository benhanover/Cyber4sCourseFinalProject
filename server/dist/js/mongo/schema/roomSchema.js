"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const roomSchema = new mongoose_1.Schema({
    id: String,
    host: String,
    subject: String,
    subSubject: String,
    title: String,
    description: String,
    participants: [String],
    limit: Number,
    isLocked: Boolean,
});
exports.default = roomSchema;
