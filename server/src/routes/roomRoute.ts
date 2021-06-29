// import libraries
import { Router, Request, Response } from 'express';

// import interfaces
import { Iroom } from '../types/index';

// import controllers
import { createRoom, getAllRooms, getRoom } from '../controllers/roomController';

// import middlewares
// use this before any reqest besides login/register
import { accessTokenValidator } from '../middlewares/index';

/*---------------------------------------------------------------------------------------------------------- */
const rooms : Router = Router();

rooms.use(accessTokenValidator);
rooms.get('/all', getAllRooms);
rooms.post('/new', createRoom);
rooms.get('/:roomId' ,getRoom );

export default rooms;
