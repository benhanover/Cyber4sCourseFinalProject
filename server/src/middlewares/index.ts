
// import libraries
const jwt = require('jsonwebtoken') // types errors if imported and not required
import { Request, Response, NextFunction } from 'express';

// import mongo-functions
import { isAccessSaved } from '../mongo/mongo-functions';

// import env
const accessTokenKey: string | undefined = process.env.ACCESS_TOKEN_KEY;
// import types
import {Iuser} from '../types/index'

// import enums
import {errorEnums} from '../enums/index'


if (!accessTokenKey) {
  throw errorEnums.NO_ENV_VAR;
}

// Checks AccessToken Validity
export const accessTokenValidator = async (req: Request, res: Response, next: NextFunction): Promise<NextFunction | void> => {
  console.log("in the validator, " , )
  const accessToken: string | undefined = req.headers['authorization'];
  console.log(accessToken ,"line 26")
  if (!accessToken) {
    console.log(errorEnums.NO_TOKEN);
    res.status(401).send(errorEnums.NO_TOKEN); // 400 bad Request
    return;
  }
  return jwt.verify(accessToken, accessTokenKey, async (err: unknown, user: Iuser): Promise<void> => {
    if (err) {
      // ask for the refresh token
      console.log("Invalid AccessToken");
      res.status(401).send();
      return;
    }
    if(!await isAccessSaved(accessToken)){
      // catfish detected
      console.log(errorEnums.CATFISH);
      res.status(403).send(errorEnums.FORBIDDEN);
      return;
    }
    
    req.body.accessToken = accessToken;
    req.body.user = user;
    return next();
  });
  
};
