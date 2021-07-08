// import libraries
import { Router, Request, Response } from "express";

// import interfaces
import { Iroom } from "../types/index";

// import controllers
import {
  createRoom,
  getAllRooms,
  getRoom,
  validatedRoomPassword,
} from "../controllers/roomController";

// import middlewares
// use this before any reqest besides login/register
import { accessTokenValidator } from "../middlewares/index";

/*---------------------------------------------------------------------------------------------------------- */
const rooms: Router = Router();

rooms.use(accessTokenValidator);
rooms.get("/all", getAllRooms);
rooms.post("/new", createRoom);
rooms.get("/:roomId", getRoom);
rooms.post("/valid-password", validatedRoomPassword);

export default rooms;
