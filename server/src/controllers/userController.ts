require('dotenv').config({ path: '../../.env' });
// import from liraries
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// import interfaces
import { Iuser } from '../interfaces/index';

// import mongo-functions
import {
  canRegister,
  registerUser,
  findDocument,
} from '../mongo/mongo-functions';

const { hash, compare } = bcrypt;

// Type 'string | undefined' is not assignable to type 'string'.
// Type 'undefined' is not assignable to type 'string'
// Adding ! tells TypeScript that even though something looks like it could be null, it can trust you that it's not
const accessTokenKey: string = process.env.ACCESS_TOKEN_KEY!;
const refreshTokenKey: string = process.env.REFRESH_TOKEN_KEY!;

export const register = async (req: Request, res: Response) => {
  // prettier-ignore
  const { lastName, firstName, email, password, birthDate, username } = req.body;

  const registrationAvailability = await canRegister(email, username);
  if (!registrationAvailability.return) {
    return res
      .status(409)
      .send('Could Not Register: ' + registrationAvailability.message);
  }

  const hashPassword: string = await hash(password, 10);
  // prettier-ignore
  const user: Iuser = { lastName, firstName, email, password: hashPassword, birthDate, username };

  const registered = await registerUser(user);
  console.log(registered);

  if (!registered) return res.status(500).send('Could Not Register');
  return res.send('Registered Successfully');
};

// need to add user does not exist
export const login = async (req: Request, res: Response) => {
  console.log('in the route');

  const { email, password } = req.body;
  const foundUser = await findDocument('User', 'email', email);
  // all but Iuser
  if (!('username' in foundUser)) {
    return res.status(409).send('Username or Password is incorrect');
  }

  try {
    const isPasswordCorrect = await compare(password, foundUser.password);
    if (!isPasswordCorrect) {
      return res.status(409).send('Username or Password is incorrect');
    }
    const accessToken = jwt.sign({ foundUser }, accessTokenKey, {
      expiresIn: '15m',
    });
    const refreshToken = jwt.sign({ foundUser }, refreshTokenKey, {
      expiresIn: '8h',
    });
    // prettier-ignore
    return res.send({accessToken, refreshToken, message: 'Connected Successfuly',});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};
