import { Router } from 'express';
import {login, register} from '../controllers/userController';

const users = Router();

users.post('/login', login);
users.post('/register', register);

export default users;
