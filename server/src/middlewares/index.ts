require('dotenv').config({ path: '../../.env' });
import { Request, Response, NextFunction } from 'express';
import { isValidAccess } from '../mongo/mongo-functions';
const jwt = require('jsonwebtoken');
const accessTokenKey = process.env.ACCESS_TOKEN_KEY;

// PROBLEM- go to todo.txt
// prettier-ignore
export const accessTokenValidator = async (req: Request, res: Response, next: NextFunction) => {
  
  const accessToken = req.headers['authorization'];
  if (!accessToken) return res.status(401).send('Valid Token Required');
  if(!await isValidAccess(accessToken)){
    // catfish detected
    return res.status(403).send('Forbidden Token');
  }
  jwt.verify(accessToken, accessTokenKey, async (err: any, user: any) => {
    if (err) {
      // ask for the refresh token
      return res.status(401).send();
    }
    req.body.accessToken = accessToken;
    req.body.user = user;
  });
  
  return next();
};
