"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import libraries
const express_1 = require("express");
// import controllers
const roomController_1 = require("../controllers/roomController");
const rooms = express_1.Router();
const mockRooms = [
    {
        id: 'dsfjhnb43-32jfdsfds-fb2-ajsdbna2',
        host: 'fjkednj-fafd56-324fsh-3asdsr3e',
        subject: 'Mathmatics',
        subSubject: 'Geometric',
        title: 'Geomtric is so awsome!',
        description: 'high school level geometric, doing some bagrut excercises',
        participants: ['sdffdh-hsasw-jsh63-sdfs-gfd', 'fdshj-s4e5t-neswdcvyj-63e', 'dfrdy6c-dsf2qch6-a24g-2sdg'],
        limit: 3,
        isLocked: true
    }
];
rooms.get("/all", roomController_1.getAllRooms);
rooms.post("/new", roomController_1.createRoom);
exports.default = rooms;
