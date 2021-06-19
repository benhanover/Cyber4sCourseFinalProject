require('dotenv').config({ path: '../../.env' });
// import from liraries
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

// import interfaces
import { Iuser } from '../interfaces/index';

// import mongo-functions
import {
  canRegister,
  registerUser,
  findDocument,
} from '../mongo/mongo-functions';

// import assistance functions
import { generateTokens } from '../utils/functions';

const { hash, compare } = bcrypt;

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
  if (!registered) return res.status(500).send('Could Not Register');

  return res.send({
    ...generateTokens(user),
    message: 'Registerd Successfuly',
  });
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
    return res.send({
      ...generateTokens({ foundUser }),
      message: 'Connected Successfuly',
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};
