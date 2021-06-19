"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const accessTokenSchema = new mongoose_1.Schema({
    accessToken: String,
});
exports.default = accessTokenSchema;
