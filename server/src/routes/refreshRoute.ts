import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { isValidRefresh } from '../mongo/mongo-functions';

// import interfaces
import { Iuser } from '../interfaces/index';

const refreshTokenKey: any = process.env.REFRESH_TOKEN_KEY;
const accessTokenKey: any = process.env.ACCESS_TOKEN_KEY;

const refresh = Router();

refresh.get('/', (req, res) => {
  const token: string | string[] | undefined = req.headers['refreshtoken'];

  if (!token || Array.isArray(token)) {
    return res.status(401).send('Refresh Token Required');
  }
  //   const isExist = refreshTokens.includes(token);
  if (!isValidRefresh(token)) {
    // catfish in the site

    return res.status(403).send('Invalid Refresh Token');
  }
  jwt.verify(token, refreshTokenKey, (err: any, user: any) => {
    if (err) {
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
    console.log(user);

    const accessToken = jwt.sign(userAssignedToToken, accessTokenKey, {
      expiresIn: '15m',
    });
    return res.status(200).json({ accessToken });
  });
});
export default refresh;
