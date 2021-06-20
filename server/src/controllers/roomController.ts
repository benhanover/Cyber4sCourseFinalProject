// import from libraries
import { Request, Response } from 'express';

// import interfaces
import { Iroom } from '../types/index';
import { errorEnums } from '../enums/errorEnums';

// import mongo-functions
import { getRooms, saveRoom } from '../mongo/mongo-functions';

/*---------------------------------------------------------------------------------------------------------- */
// creates a room and saves it into the data base
export const createRoom = async (req: Request, res: Response): Promise<void> => {
  const roomToCreate: Iroom = req.body;
  try {
    const savedRoom: boolean | false = await saveRoom(roomToCreate);
    if (savedRoom) {
      res.json({ message: 'updated successfully', newRoom: savedRoom });
      return;
    }
    throw ""
  } catch (e: unknown) {
    console.log(errorEnums.FAILED_CREATE_ROOM, e);
    res.status(500).send(errorEnums.FAILED_CREATE_ROOM);
    return;
  }
};

/*---------------------------------------------------------------------------------------------------------- */
// returns all of the rooms in the data base
export const getAllRooms = async (req: Request, res: Response): Promise<void> => {
  const rooms: Array<Iroom> = await getRooms();
  res.status(200).json(rooms);
  return;
};
