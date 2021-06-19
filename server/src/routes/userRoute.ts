import { Router } from 'express';
import { login, register, logout } from '../controllers/userController';

import { accessTokenValidator } from '../middlewares/index';

const users = Router();

users.post('/login', login);
users.delete('/logout', accessTokenValidator, logout);
users.post('/register', register);

export default users;
