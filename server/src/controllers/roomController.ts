// import from libraries
import { Request, Response } from 'express';

// import interfaces
import { Iroom } from '../interfaces/index';

// import mongo-functions

import { saveRoom } from '../mongo/mongo-functions';

// export const getAll = (req: Request, res: Response) => {
//     // return res.json(mockRooms);
//     console.log("all rooms route, does nothing for now");
// }
  
export const createRoom = async (req: Request, res: Response) => {
  const { id, host, subject, subSubject, title, description, participants, limit, isLocked } = req.body;
  const roomToCreate: Iroom = { id, host, subject, subSubject, title, description, participants, limit, isLocked }
  await saveRoom(roomToCreate)


  res.send("updated successfully");
}
export const getAllRooms = (req: Request, res: Response) => {
    // return res.json(mockRooms);
  }


  