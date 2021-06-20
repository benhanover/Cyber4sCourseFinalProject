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
  const { host, subject, subSubject, title, description, participants, limit, isLocked } = req.body;

  // prettier-ignore
  const roomToCreate: Iroom = { host, subject, subSubject, title, description, participants, limit, isLocked }
  try {
    const savedRoom = await saveRoom(roomToCreate);
    return res.json({ message: 'updated successfully', newRoom: savedRoom });
  } catch (e) {
    console.log('Could Not Create A New Room:', e);
    return res.status(500).send('Could Not Create A New Room');
  }
};

export const getAllRooms = async (req: Request, res: Response) => {
  try {
    const rooms: Array<Iroom> = await getRooms();
    return res.json(rooms);
  } catch (e) {
    console.log('Could Not Get All Rooms', e);
    return res.status(500).send('Could Not Get All Rooms');
  }
};
