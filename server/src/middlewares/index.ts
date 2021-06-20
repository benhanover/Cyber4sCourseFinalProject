// require('dotenv').config({ path: '../../.env' });
// import libraries
import { Request, Response, NextFunction } from 'express';
const jwt = require('jsonwebtoken');

// import mongo-functions
import { isAccessSaved } from '../mongo/mongo-functions';

// import env
const accessTokenKey = process.env.ACCESS_TOKEN_KEY;

// prettier-ignore
export const accessTokenValidator = async (req: Request, res: Response, next: NextFunction) => {
  
  const accessToken = req.headers['authorization'];
  if (!accessToken) return res.status(401).send('Valid Token Required');
  return jwt.verify(accessToken, accessTokenKey, async (err: any, user: any) => {
    if (err) {
      // ask for the refresh token
      console.log("Invalid AccessToken");
      return res.status(401).send();
    }
    if(!await isAccessSaved(accessToken)){
      // catfish detected
      console.log("Catfish Detected");
      return res.status(403).send('Forbidden Token');
    }
    
    req.body.accessToken = accessToken;
    req.body.user = user;
    return next();
  });
  
};
