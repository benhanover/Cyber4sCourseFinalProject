// require('dotenv').config({ path: '../../.env' });

// import from liraries
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// import interfaces
import { Iuser } from '../interfaces/index';
import { errorEnums, logsEnums } from '../enums/index';

// import mongo-functions
import {
  canRegister,
  registerUser,
  findDocument,
  saveRefreshToken,
  saveAccessToken,
  removeRefreshToken,
  removeAccessToken,
  isRefreshSaved,
} from '../mongo/mongo-functions';

// import assistance functions
import { generateTokens } from '../utils/functions';

const { hash, compare } = bcrypt;
const refreshTokenKey: any = process.env.REFRESH_TOKEN_KEY;
const accessTokenKey: any = process.env.ACCESS_TOKEN_KEY;

/*---------------------------------------------------------------------------------------------------------- */
/* function 
  - checks the availibilty of the credentials
  - hash the password
  - register the new user to the DB
  - generates tokens 
  - saves the tokens
*/

export const register = async (req: Request, res: Response) => {
  // prettier-ignore
  const { lastName, firstName, email, password, birthDate, username } = req.body;

  const registrationAvailability = await canRegister(email, username);
  if (!registrationAvailability.return) {
    console.log(errorEnums.REGISTER_FAILED + registrationAvailability.message);
    return res
      .status(409)
      .send(errorEnums.REGISTER_FAILED + registrationAvailability.message);
  }

  const hashPassword: string = await hash(password, 10);
  // prettier-ignore
  const user: Iuser = { lastName, firstName, email, password: hashPassword, birthDate, username };
  const registered = await registerUser(user);
  if (!registered) return res.status(500).send('Could Not Register');

  const newTokens = generateTokens(user);
  if (!newTokens) {
    console.log(errorEnums.REGISTER_FAILED + errorEnums.NO_TOKEN);
    return;
  }
  await saveRefreshToken(newTokens.refreshToken);
  await saveAccessToken(newTokens.accessToken);
  console.log(logsEnums.REGISTER_SUCCESSFULY);
  return res.send({
    ...newTokens,
    message: logsEnums.REGISTER_SUCCESSFULY,
  });
};

/*---------------------------------------------------------------------------------------------------------- */
/*
function
  - looks for the user
  - test the hash password
  - generate tokens
  - save the tokens
 */
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const foundUser = await findDocument('User', 'email', email);
  // all but Iuser
  if (!('username' in foundUser)) {
    console.log(errorEnums.NO_SUCH_USER);
    return res.status(409).send(errorEnums.NO_SUCH_USER);
  }

  try {
    const isPasswordCorrect = await compare(password, foundUser.password);
    if (!isPasswordCorrect) {
      console.log(errorEnums.WRONG_CREDENTIALS);
      return res.status(409).send(errorEnums.WRONG_CREDENTIALS);
    }
    const newTokens = generateTokens({ foundUser });
    if (!newTokens) {
      console.log(errorEnums.NO_TOKEN);
      return;
    }
    await saveRefreshToken(newTokens.refreshToken);
    await saveAccessToken(newTokens.accessToken);
    console.log(logsEnums.LOGGED_IN_SUCCESSFULY);

    return res.send({
      ...newTokens,
      message: logsEnums.LOGGED_IN_SUCCESSFULY,
    });
  } catch (error) {
    console.log(errorEnums.LOGIN_FAILED + error);
    res.sendStatus(500);
  }
};

/*---------------------------------------------------------------------------------------------------------- */
/*
  - recives both access and refresh tokens
  - 
*/
// prettier-ignore
export const logout = async (req: Request, res: Response): Promise<void> => {
  
  const accessToken: string = req.headers['authorization']!;
  const refreshToken: string | string[] | undefined = req.headers['refreshtoken'];  
     
  if (!refreshToken || Array.isArray(refreshToken)) {
    console.log(errorEnums.NO_TOKEN);
    res.status(401).send('Refresh Token Required');
    return
  }
  const refreshremoved = await removeRefreshToken(refreshToken);
  const accessremoved = await removeAccessToken(accessToken);
  if (refreshremoved && accessremoved) {
    console.log(logsEnums.LOGGED_OUT_SUCCESSFULY);
    res.send(logsEnums.LOGGED_OUT_SUCCESSFULY);
    return
     
  }
  console.log(errorEnums.LOGOUT_FAILED)
  res.send(errorEnums.LOGOUT_FAILED);
}

/*---------------------------------------------------------------------------------------------------------- */
export const newToken = async (req: Request, res: Response) => {
  console.log('Requesting new accessToken');
  const token: string | string[] | undefined = req.headers['refreshtoken'];
  let accessUpdated;
  if (!token || Array.isArray(token)) {
    console.log(errorEnums.NO_TOKEN);
    return res.status(401).send(errorEnums.NO_TOKEN);
  }
  jwt.verify(token, refreshTokenKey, async (err: any, user: any) => {
    if (err) {
      console.log(errorEnums.INVALID_TOKEN + err);
      return res.status(403).send(errorEnums.INVALID_TOKEN);
    }
    if (!isRefreshSaved(token)) {
      // catfish in the site
      console.log('Catfish Detected');
      return res.status(403).send(errorEnums.INVALID_TOKEN);
    }
    const userAssignedToToken: Iuser = {
      username: user.username,
      email: user.email,
      lastName: user.lastName,
      firstName: user.firstName,
      password: user.password,
      birthDate: user.birthDate,
    };

    const accessToken: string = jwt.sign(userAssignedToToken, accessTokenKey, {
      expiresIn: '15m',
    });
    accessUpdated = await saveAccessToken(accessToken);
    if (accessUpdated) {
      return res.status(200).json({ accessToken });
    }
    console.log(errorEnums.FAILED_ADDING_DATA);
    return res.status(400).send(errorEnums.FAILED_ADDING_DATA);
  });
};
