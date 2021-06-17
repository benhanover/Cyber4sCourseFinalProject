"use strict";
const { Schema } = require("mongoose");
const schema = new Schema({
    name: String,
    id: String,
    participants: [String],
});
module.exports.roomSchema = schema;
