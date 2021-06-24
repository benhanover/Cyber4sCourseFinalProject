import { Router } from 'express';
// prettier-ignore
import { login, register, logout, newToken, returnValidation } from '../controllers/userController';

import { accessTokenValidator } from '../middlewares/index';

/*---------------------------------------------------------------------------------------------------------- */
const users: Router = Router();

users.post('/login', login);
users.delete('/logout', accessTokenValidator, logout);
users.post('/register', register);
users.get('/refreshToken/', newToken);
users.get('/validator', accessTokenValidator, returnValidation)
export default users;
