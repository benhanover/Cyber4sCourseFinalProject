
  import { Request, Response } from 'express';
  import { User } from '../mongo/models';
  import { Iuser } from '../interfaces/index';
export const getAll = (req: Request, res: Response) => {
    // return res.json(mockRooms);
    console.log("all rooms route, does nothing for now");
}
  
export const createRoom = (req: Request, res: Response) => {
    const { name, id, participants } = req.body;
    // mockRooms.push({ name, id, participants });
    res.send("updated successfully");
  }
