// import libraries
import jwt from 'jsonwebtoken';

// import interfaces
import { Iuser } from '../interfaces/index';

import { errorEnums } from '../enums/errorEnums';

// import env
const accessTokenKey: string | undefined = process.env.ACCESS_TOKEN_KEY;
const refreshTokenKey: string | undefined = process.env.REFRESH_TOKEN_KEY;
if (!accessTokenKey || !refreshTokenKey) {
  throw errorEnums.NO_ENV_VAR;
}

/*---------------------------------------------------------------------------------------------------------- */
export const generateTokens = (user: Iuser | { foundUser: Iuser }) => {
  try {
    const accessToken = jwt.sign(user, accessTokenKey, {
      expiresIn: '15m',
    });
    const refreshToken = jwt.sign(user, refreshTokenKey, {
      expiresIn: '8h',
    });
    return { accessToken, refreshToken };
  } catch (e) {
    console.log(errorEnums.NO_TOKEN + e);
  }
};
