// import from libraries
import { Request, Response } from 'express';

// import interfaces
import { Iroom } from '../interfaces/index';

// import mongo-functions

import { getRooms, saveRoom } from '../mongo/mongo-functions';

// export const getAll = (req: Request, res: Response) => {
//     // return res.json(mockRooms);
//     console.log("all rooms route, does nothing for now");
// }

export const createRoom = async (req: Request, res: Response) => {
  // prettier-ignore
  const { id, host, subject, subSubject, title, description, participants, limit, isLocked } = req.body;
  // prettier-ignore
  const roomToCreate: Iroom = { id, host, subject, subSubject, title, description, participants, limit, isLocked }
  await saveRoom(roomToCreate);

  res.json({ message: 'updated successfully', newRoom: roomToCreate });
};
export const getAllRooms = async (req: Request, res: Response) => {
  try {
    const rooms: Array<Iroom> = await getRooms();
    return res.json(rooms);
  } catch (e) {}
};
