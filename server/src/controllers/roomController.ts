// import from libraries
import { Request, Response } from 'express';

// import interfaces
import { Iroom } from '../interfaces/index';
import { errorEnums } from '../enums/errorEnums';

// import mongo-functions
import { getRooms, saveRoom } from '../mongo/mongo-functions';

/*---------------------------------------------------------------------------------------------------------- */
// function create a room and saves it into the data base
export const createRoom = async (req: Request, res: Response) => {
  // prettier-ignore
  const { host, subject, subSubject, title, description, participants, limit, isLocked } = req.body;

  // prettier-ignore
  const roomToCreate: Iroom = { host, subject, subSubject, title, description, participants, limit, isLocked }
  try {
    const savedRoom = await saveRoom(roomToCreate);
    res.json({ message: 'updated successfully', newRoom: savedRoom });
    return;
  } catch (e) {
    console.log(errorEnums.FAILED_CREATE_ROOM, e);
    return res.status(500).send(errorEnums.FAILED_CREATE_ROOM);
  }
};

/*---------------------------------------------------------------------------------------------------------- */
// function returns all of the rooms in the data base
export const getAllRooms = async (req: Request, res: Response) => {
  const rooms: Array<Iroom> = await getRooms();
  return res.json(rooms);
};
