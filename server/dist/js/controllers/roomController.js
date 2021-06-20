"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllRooms = exports.createRoom = void 0;
const errorEnums_1 = require("../enums/errorEnums");
// import mongo-functions
const mongo_functions_1 = require("../mongo/mongo-functions");
/*---------------------------------------------------------------------------------------------------------- */
// creates a room and saves it into the data base
const createRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roomToCreate = req.body;
    try {
        const savedRoom = yield mongo_functions_1.saveRoom(roomToCreate);
        if (savedRoom) {
            res.json({ message: 'updated successfully', newRoom: savedRoom });
            return;
        }
        throw "";
    }
    catch (e) {
        console.log(errorEnums_1.errorEnums.FAILED_CREATE_ROOM, e);
        res.status(500).send(errorEnums_1.errorEnums.FAILED_CREATE_ROOM);
        return;
    }
});
exports.createRoom = createRoom;
/*---------------------------------------------------------------------------------------------------------- */
// returns all of the rooms in the data base
const getAllRooms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rooms = yield mongo_functions_1.getRooms();
    res.status(200).json(rooms);
    return;
});
exports.getAllRooms = getAllRooms;
