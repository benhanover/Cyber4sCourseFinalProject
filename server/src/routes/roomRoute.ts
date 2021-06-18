// import libraries
import { Router, Request, Response } from "express";

// import interfaces
import {Iroom} from "../interfaces/index";

// import controllers
import { createRoom, getAllRooms } from '../controllers/roomController'

const rooms = Router();

const mockRooms: [Iroom] = [
  {
    id: 'dsfjhnb43-32jfdsfds-fb2-ajsdbna2',
    host: 'fjkednj-fafd56-324fsh-3asdsr3e',
    subject: 'Mathmatics',
    subSubject: 'Geometric',
    title: 'Geomtric is so awsome!',
    description: 'high school level geometric, doing some bagrut excercises',
    participants: ['sdffdh-hsasw-jsh63-sdfs-gfd', 'fdshj-s4e5t-neswdcvyj-63e', 'dfrdy6c-dsf2qch6-a24g-2sdg'],
    limit: 3,
    isLocked: true
  }
]

rooms.get("/all", getAllRooms);
rooms.post("/new", createRoom);

export default rooms;
