import { hash, compare } from "bcrypt";
// import from libraries
import { Request, Response } from "express";

// import interfaces
import { Iroom, Umodels, IreturnInfo } from "../types/index";
import { errorEnums } from "../enums/errorEnums";

// import mongo-functions
import { findDocument, getRooms, saveRoom, isRoomPasswordValid } from "../mongo/mongo-functions";

/*---------------------------------------------------------------------------------------------------------- */
// creates a room and saves it into the data base
export const createRoom = async (req: Request, res: Response): Promise<void> => {
  const roomToCreate: Iroom = req.body;
  if(roomToCreate.roomPassword) {
    roomToCreate.roomPassword = await hash(roomToCreate.roomPassword, 10);
  }
  try {
    const savedRoom: Iroom | false = await saveRoom(roomToCreate);
    if (savedRoom) {
      res.json({ message: "updated successfully", newRoom: savedRoom });
      return;
    } else if (!savedRoom) {
      console.log(errorEnums.FAILED_CREATE_ROOM);
      res.status(500).send(errorEnums.ROOM_TITLE_IS_USED);
      return;
    }
  } catch (e: unknown) {
    console.log(errorEnums.FAILED_CREATE_ROOM, e);
    res.status(500).send(errorEnums.FAILED_CREATE_ROOM);
    return;
  }
};

/*---------------------------------------------------------------------------------------------------------- */
// returns all of the rooms in the data base
export const getAllRooms = async (
  req: Request,
  res: Response
): Promise<void> => {
  const rooms: Array<Iroom> = await getRooms();
  res.status(200).json(rooms);
  return;
};
/*---------------------------------------------------------------------------------------------------------- */
// returns room by roomId
export const getRoom = async (req: Request, res: Response): Promise<void> => {
  const roomId: string = req.params.roomId;
  const room: Umodels = await findDocument("Room", "_id", roomId);
  if ("return" in room) {
    res.sendStatus(500);
    return;
  }
  res.status(200).json(room);
  return;
};

/*---------------------------------------------------------------------------------------------------------- */
export const validatedRoomPassword = async (req: Request, res: Response): Promise<void> => {
  const { roomId, password } = req.body;
  const room = await isRoomPasswordValid(roomId, password);
  console.log('return value', room.roomPassword === password);
  const isPasswordCorrect: boolean = await compare(password, room.roomPassword);
  if(isPasswordCorrect) {
    res.status(200).send(true)
    return
  }
  res.status(401).send(false);
  return
}
