import { Router } from 'express';
// const bodyParser = require('body-parser')
const multer = require('multer');
const upload = multer({ dest: 'uploads/' })
import { login, register, logout, newToken, returnValidation, updateProfile, getAllUsers, getUserProfile, saveImageToS3 } from '../controllers/userController';

import { accessTokenValidator } from '../middlewares/index';

/*---------------------------------------------------------------------------------------------------------- */
const users: Router = Router();

users.post('/login', login);
users.delete('/logout', accessTokenValidator, logout);
users.post('/register', register);
users.get('/refreshToken/', newToken);
users.get('/validator', accessTokenValidator, returnValidation);
users.put('/update', accessTokenValidator, updateProfile);
users.get('/get-all', accessTokenValidator, getAllUsers);
users.get('/profile', accessTokenValidator, getUserProfile);
users.post('/images', upload.single('image'), saveImageToS3);

export default users;
