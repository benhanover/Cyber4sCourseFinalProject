require('dotenv').config({ path: '../../.env' });
// import from liraries
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// import interfaces
import { Iuser } from '../interfaces/index';

// import mongo-functions
import {
  canRegister,
  registerUser,
  findDocument,
  saveRefreshToken,
  saveAccessToken,
  removeRefreshToken,
  removeAccessToken,
  isValidRefresh,
} from '../mongo/mongo-functions';

// import assistance functions
import { generateTokens } from '../utils/functions';

const { hash, compare } = bcrypt;
const refreshTokenKey: any = process.env.REFRESH_TOKEN_KEY;
const accessTokenKey: any = process.env.ACCESS_TOKEN_KEY;

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

  const newTokens = generateTokens(user);
  await saveRefreshToken(newTokens.refreshToken);
  await saveAccessToken(newTokens.accessToken);
  return res.send({
    ...newTokens,
    message: 'Registerd Successfuly',
  });
};

// need to add user does not exist
export const login = async (req: Request, res: Response) => {
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
    const newTokens = generateTokens({ foundUser });
    await saveRefreshToken(newTokens.refreshToken);
    await saveAccessToken(newTokens.accessToken);

    return res.send({
      ...newTokens,
      message: 'Connected Successfuly',
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

// prettier-ignore
export const logout = async (req: Request, res: Response): Promise<void> => {
  
  const accessToken: string = req.headers['authorization']!;
  const refreshToken: string | string[] | undefined = req.headers['refreshtoken'];  
     
  if (!refreshToken || Array.isArray(refreshToken)) {
    console.log("No RefreshToken");
    res.status(401).send('Refresh Token Required');
    return
  }
  const refreshremoved = await removeRefreshToken(refreshToken);
  const accessremoved = await removeAccessToken(accessToken);
  if(refreshremoved && accessremoved){
    res.send("Logout Successfully");
    return
     
  }
  res.send("Could Not Logout");
}

export const newToken = async (req: Request, res: Response) => {
  console.log('in the newToken');

  const token: string | string[] | undefined = req.headers['refreshtoken'];
  let accessUpdated;
  if (!token || Array.isArray(token)) {
    console.log('No RefreshToken');
    return res.status(401).send('Refresh Token Required');
  }
  //   const isExist = refreshTokens.includes(token);
  if (!isValidRefresh(token)) {
    // catfish in the site
    console.log('Catfish Detected');
    return res.status(403).send('Invalid Refresh Token');
  }
  jwt.verify(token, refreshTokenKey, async (err: any, user: any) => {
    if (err) {
      console.log('Invalid Refresh Token');
      return res.status(403).send('Invalid Refresh Token');
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
      console.log('AccessToken Updated');
      return res.status(200).json({ accessToken });
    }
    console.log('Could Not Add Access Token In DB');
    return res.status(400).send('Could Not Add Access Token');
  });
};
