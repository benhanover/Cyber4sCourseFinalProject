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
// import mongo-functions
const mongo_functions_1 = require("../mongo/mongo-functions");
// export const getAll = (req: Request, res: Response) => {
//     // return res.json(mockRooms);
//     console.log("all rooms route, does nothing for now");
// }
const createRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // prettier-ignore
    const { host, subject, subSubject, title, description, participants, limit, isLocked } = req.body;
    // prettier-ignore
    const roomToCreate = { host, subject, subSubject, title, description, participants, limit, isLocked };
    const savedRoom = yield mongo_functions_1.saveRoom(roomToCreate);
    res.json({ message: 'updated successfully', newRoom: savedRoom });
});
exports.createRoom = createRoom;
const getAllRooms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rooms = yield mongo_functions_1.getRooms();
        return res.json(rooms);
    }
    catch (e) { }
});
exports.getAllRooms = getAllRooms;
