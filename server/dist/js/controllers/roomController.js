"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoom = exports.getAll = void 0;
const getAll = (req, res) => {
    // return res.json(mockRooms);
    console.log("all rooms route, does nothing for now");
};
exports.getAll = getAll;
const createRoom = (req, res) => {
    const { name, id, participants } = req.body;
    // mockRooms.push({ name, id, participants });
    res.send("updated successfully");
};
exports.createRoom = createRoom;
