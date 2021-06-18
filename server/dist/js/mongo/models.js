"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.Room = void 0;
const index_1 = require("./schema/index");
const mongoose_1 = __importDefault(require("mongoose"));
exports.Room = mongoose_1.default.model('Room', index_1.roomSchema);
exports.User = mongoose_1.default.model('User', index_1.userSchema);
