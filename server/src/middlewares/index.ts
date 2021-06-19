require('dotenv').config({ path: '../../.env' });
import { Request, Response, NextFunction } from 'express';

const jwt = require('jsonwebtoken');
const accessTokenKey = process.env.ACCESS_TOKEN_KEY;

// PROBLEM- go to todo.txt
// prettier-ignore
export const accessTokenValidator = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers['authorization'];
  if (!accessToken) return res.status(401).send('Valid Token Required');
  jwt.verify(accessToken, accessTokenKey, async (err: any, user: any) => {
    if (err) {
      return res.status(401).end();
    }
    req.body.accessToken = accessToken;
    req.body.user = user;
  });
  return next();
};
