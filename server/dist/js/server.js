"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// environment
require('dotenv').config();
// libraries
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
// routes
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const roomRoute_1 = __importDefault(require("./routes/roomRoute"));
// declarations
const app = express_1.default();
const { PORT, DB } = process.env;
// middlewares
app.use(express_1.default.json());
app.use(cors_1.default());
app.use('/user', userRoute_1.default);
app.use('/room', roomRoute_1.default);
mongoose_1.default
    .connect(`mongodb://localhost:27017/${DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
    console.log('Connected To MongodDB ' + DB);
    app.listen(PORT, () => console.log('Listening On Port', PORT));
})
    .catch((e) => console.log(e));
