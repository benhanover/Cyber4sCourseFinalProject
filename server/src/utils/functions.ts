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
export const generateTokens = (user: Iuser ): UgenerateTokens  => {
  try {
    console.log("user in generateTokens", user);
    const {_id, username, password, email, firstName, lastName, birthDate} = user
    const userForTokens = {_id, password, username, email, firstName, lastName, birthDate}
    const accessToken: string = jwt.sign(userForTokens, accessTokenKey, {
      expiresIn: '15m',
    });
    const refreshToken: string = jwt.sign(userForTokens, refreshTokenKey, {
      expiresIn: '8h',
    });
    return { accessToken, refreshToken };
  } catch (e) {
    console.log("userForTokens in generateTokens catch", {...user});
    console.log(errorEnums.NO_TOKEN + e);
  }
};
