// import from libraries
import { Request, Response } from 'express';
import { hash, compare } from 'bcrypt';
const jwt = require('jsonwebtoken') // types errors if imported and not required

// import interfaces
import { Iuser, IreturnInfo, Itokens, Umodels, UgenerateTokens, Urefresh } from '../types/index';
import { errorEnums, logsEnums } from '../enums/index';

// import mongo-functions
import { canRegister, registerUser, findDocument, saveRefreshToken, saveAccessToken, removeRefreshToken, removeAccessToken, isRefreshSaved } from '../mongo/mongo-functions';

// import assistance functions
import { generateTokens } from '../utils/functions';

// env
const refreshTokenKey: string | undefined = process.env.REFRESH_TOKEN_KEY;
const accessTokenKey: string  | undefined = process.env.ACCESS_TOKEN_KEY;
if(!refreshTokenKey || !accessTokenKey){
  console.log(errorEnums.NO_TOKEN);
  throw errorEnums.NO_TOKEN
}

/*---------------------------------------------------------------------------------------------------------- */
// saves a new user to db with hashed password; saves the new tokens in db.
export const register = async (req: Request, res: Response) => {
  console.log("Trying to Register...");
  const user: Iuser = req.body;
  const registrationAvailability: IreturnInfo = await canRegister(user.email, user.username);
  if (!registrationAvailability.return) {
    console.log(errorEnums.REGISTER_FAILED + registrationAvailability.message);
    return res
      .status(409)
      .json({ message: errorEnums.REGISTER_FAILED + registrationAvailability.message });
  }
  user.password = await hash(user.password, 10);
  const registered: boolean = await registerUser(user);
  if (!registered) {
    console.log(errorEnums.REGISTER_FAILED);
    res.status(500).json({ message: errorEnums.REGISTER_FAILED });
    return;
  }
    
  const newTokens: Itokens | void = generateTokens(user);
  if (!newTokens) {
    console.log(errorEnums.REGISTER_FAILED + errorEnums.NO_TOKEN);
    return;
  }
  await saveRefreshToken(newTokens.refreshToken);
  await saveAccessToken(newTokens.accessToken);
  console.log(logsEnums.REGISTER_SUCCESSFULY);
  return res.json({
    ...newTokens,
    message: logsEnums.REGISTER_SUCCESSFULY,
  });
};

/*---------------------------------------------------------------------------------------------------------- */

// authenticate the user and saves new tokens in db
export const login = async (req: Request, res: Response): Promise<void> => {
  console.log("Trying to Login...");
  const { email, password }: { email: string, password: string } = req.body;
  const foundUser: Umodels = await findDocument('User', 'email', email);
  // all but Iuser
  if (!('username' in foundUser)) {
    console.log(errorEnums.NO_SUCH_USER);
    res.status(409).json({message: errorEnums.NO_SUCH_USER});
    return;
  }

  try {
    const isPasswordCorrect: boolean = await compare(password, foundUser.password);
    if (!isPasswordCorrect) {
      console.log(errorEnums.WRONG_CREDENTIALS);
      res.status(409).json({message: errorEnums.WRONG_CREDENTIALS});
      return;
    }
    const newTokens: UgenerateTokens = generateTokens({ foundUser });
    if (!newTokens) {
      console.log(errorEnums.NO_TOKEN);
      res.sendStatus(500);
      return;
    }
    await saveRefreshToken(newTokens.refreshToken);
    await saveAccessToken(newTokens.accessToken);
    console.log(logsEnums.LOGGED_IN_SUCCESSFULY);
   
    res.json({
      ...newTokens,
      message: logsEnums.LOGGED_IN_SUCCESSFULY,
    });
    return;
  } catch (error) {
    console.log(errorEnums.LOGIN_FAILED + error);
    res.sendStatus(500);
    return;
  }
};

/*---------------------------------------------------------------------------------------------------------- */

//  removes tokens from db
export const logout = async (req: Request, res: Response): Promise<void> => {
  console.log("Trying to Logout...");
  const accessToken: string  = req.body.accessToken;
  const refreshToken: Urefresh = req.headers['refreshtoken'];  
     
  if (!refreshToken || Array.isArray(refreshToken)) {
    console.log(errorEnums.NO_TOKEN);
    res.status(401).send(errorEnums.NO_TOKEN);
    return
  }
  const refreshremoved = await removeRefreshToken(refreshToken);
  const accessremoved = await removeAccessToken(accessToken);
  if (refreshremoved && accessremoved) {
    console.log(logsEnums.LOGGED_OUT_SUCCESSFULY);
    res.send({message: logsEnums.LOGGED_OUT_SUCCESSFULY});
    return
     
  }
  console.log(errorEnums.LOGOUT_FAILED)
  res.send(errorEnums.LOGOUT_FAILED);
}

/*---------------------------------------------------------------------------------------------------------- */
//  sends a new saved accessToken to db and removes the old one.
export const newToken = async (req: Request, res: Response): Promise<void> => {
  console.log("Trying to Get a New AccessToken...");
  const token: Urefresh = req.headers['refreshtoken'];
  if (!token || Array.isArray(token)) {
    console.log(errorEnums.NO_TOKEN);
    res.status(401).send(errorEnums.NO_TOKEN);
    return;
  }
  // TODO: find type of user
  jwt.verify(token, refreshTokenKey, async (err: unknown, user: Iuser): Promise<void> => {
    if (err) {
      console.log(errorEnums.INVALID_TOKEN + err);
      res.status(403).send(errorEnums.INVALID_TOKEN);
      return;
    }
    if (!isRefreshSaved(token)) {
      // catfish in the site
      console.log(errorEnums.CATFISH);
      res.status(403).send(errorEnums.FORBIDDEN);
      return;
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
    const accessUpdated: boolean = await saveAccessToken(accessToken);
    if (accessUpdated) {
      res.status(200).json({ accessToken });
      return;
    }
    console.log(errorEnums.FAILED_ADDING_DATA);
    res.status(400).send(errorEnums.FAILED_ADDING_DATA);
    return;
  });
};
