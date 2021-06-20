// import libraries
import jwt from 'jsonwebtoken';

// import interfaces
import { Iuser, UgenerateTokens } from '../types/index';

// import unions

import { errorEnums } from '../enums/errorEnums';

// import env
const accessTokenKey: string | undefined = process.env.ACCESS_TOKEN_KEY;
const refreshTokenKey: string | undefined = process.env.REFRESH_TOKEN_KEY;
if (!accessTokenKey || !refreshTokenKey) {
  throw errorEnums.NO_ENV_VAR;
}

/*---------------------------------------------------------------------------------------------------------- */
export const generateTokens = (user: Iuser | { foundUser: Iuser }): UgenerateTokens  => {
  try {
    const accessToken: string = jwt.sign(user, accessTokenKey, {
      expiresIn: '15m',
    });
    const refreshToken: string = jwt.sign(user, refreshTokenKey, {
      expiresIn: '8h',
    });
    return { accessToken, refreshToken };
  } catch (e) {
    console.log(errorEnums.NO_TOKEN + e);
  }
};
