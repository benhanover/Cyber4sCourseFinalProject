"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rooms = express_1.Router();
// const mockRooms: Iroom[] = [
//   {
//     name: "first Room",
//     id: "adgrfadf-54656afdg-5sdf4g65-sdfg465dfg",
//     participants: ["firstUser", "secondUser", "thirdUser"],
//   },
//   {
//     name: "second Room",
//     id: "adgrfadf-54656afdg-5sdf4g65-sdfg465dfg",
//     participants: ["firstUser", "secondUser", "thirdUser"],
//   },
//   {
//     name: "third Room",
//     id: "adgrfadf-54656afdg-5sdf4g65-sdfg465dfg",
//     participants: ["firstUser", "secondUser", "thirdUser"],
//   },
//   {
//     name: "fourth Room",
//     id: "adgrfadf-54656afdg-5sdf4g65-sdfg465dfg",
//     participants: ["firstUser", "secondUser", "thirdUser"],
//   },
// ];
rooms.get("/all", (req, res) => {
    // return res.json(mockRooms);
});
rooms.post("/new", (req, res) => {
    const { name, id, participants } = req.body;
    // mockRooms.push({ name, id, participants });
    res.send("updated successfully");
});
exports.default = rooms;
