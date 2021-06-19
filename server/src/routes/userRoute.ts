import { Router } from 'express';
import { login, register } from '../controllers/userController';

// import middlewares
// use this before any reqest besides login/register
import { accessTokenValidator } from '../middlewares/index';

const users = Router();

users.post('/login', login);
users.post('/register', register);

export default users;
