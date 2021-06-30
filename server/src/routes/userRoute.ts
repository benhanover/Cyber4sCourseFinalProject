import { Router } from 'express';
// prettier-ignore
import { login, register, logout, newToken, returnValidation, updateProfile, getAllUsers, getUserProfile, updateUser } from '../controllers/userController';

import { accessTokenValidator } from '../middlewares/index';

/*---------------------------------------------------------------------------------------------------------- */
const users: Router = Router();

users.post('/login', login);
users.delete('/logout', accessTokenValidator, logout);
users.post('/register', register);
users.get('/refreshToken/', newToken);
users.get('/validator', accessTokenValidator, returnValidation);
users.put('/update-profile', accessTokenValidator, updateProfile);
users.put('/update-user', accessTokenValidator, updateUser);
users.get('/get-all', accessTokenValidator, getAllUsers);
users.get('/profile', accessTokenValidator, getUserProfile)

export default users;
