// import libraries
import { Router, Request, Response } from 'express';

// import interfaces
import { Iroom } from '../interfaces/index';

// import controllers
import { createRoom, getAllRooms } from '../controllers/roomController';

// import middlewares
// use this before any reqest besides login/register
import { accessTokenValidator } from '../middlewares/index';

/*---------------------------------------------------------------------------------------------------------- */
const rooms = Router();

rooms.use(accessTokenValidator);
rooms.get('/all', getAllRooms);
rooms.post('/new', createRoom);

export default rooms;
