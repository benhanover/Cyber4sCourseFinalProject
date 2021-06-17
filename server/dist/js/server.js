"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const roomRoute_1 = __importDefault(require("./routes/roomRoute"));
const app = express_1.default();
app.use(cors_1.default());
// const RoomObj = require("./types/index");
// const { request, response } = require("./types/index.ts");
//regiter users
//
//login users
const port = 4000;
app.use("/user", userRoute_1.default);
app.use("/room", roomRoute_1.default);
try {
    app.listen(port);
    console.log("listening on port", port);
}
catch (e) {
    console.log("error loading server:", e);
}
