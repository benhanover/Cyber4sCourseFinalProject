import { Iuser } from '../interfaces/index';
import jwt from 'jsonwebtoken';

const accessTokenKey: string | undefined = process.env.ACCESS_TOKEN_KEY;
const refreshTokenKey: string | undefined = process.env.REFRESH_TOKEN_KEY;
if (!accessTokenKey || !refreshTokenKey) {
  throw 'Could Not Get Env Vars, The Env File';
}

export const generateTokens = (user: Iuser | { foundUser: Iuser }) => {
  const accessToken = jwt.sign(user, accessTokenKey, {
    expiresIn: '15m',
  });
  const refreshToken = jwt.sign(user, refreshTokenKey, {
    expiresIn: '8h',
  });
  return { accessToken, refreshToken };
};
