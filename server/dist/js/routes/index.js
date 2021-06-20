"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fallbacks = exports.users = exports.rooms = void 0;
const roomRoute_1 = __importDefault(require("./roomRoute"));
exports.rooms = roomRoute_1.default;
const userRoute_1 = __importDefault(require("./userRoute"));
exports.users = userRoute_1.default;
const fallbacksRoute_1 = __importDefault(require("./fallbacksRoute"));
exports.fallbacks = fallbacksRoute_1.default;
