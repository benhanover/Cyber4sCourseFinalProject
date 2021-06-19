"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import libraries
const express_1 = require("express");
// import controllers
const roomController_1 = require("../controllers/roomController");
// import middlewares
// use this before any reqest besides login/register
const index_1 = require("../middlewares/index");
const rooms = express_1.Router();
rooms.use(index_1.accessTokenValidator);
rooms.get('/all', roomController_1.getAllRooms);
rooms.post('/new', roomController_1.createRoom);
exports.default = rooms;
