// import Schemas
// prettier-ignore
import { roomSchema, userSchema, refreshTokenSchema, accessTokenSchema } from './schema/index';

// import libraries
import mongoose from 'mongoose';

// import interfaces
import { Iuser, Iroom } from '../interfaces/index';

/*---------------------------------------------------------------------------------------------------------- */
export const AccessToken = mongoose.model('AccessToken', accessTokenSchema);
export const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);
export const Room = mongoose.model<Iroom>('Room', roomSchema);
export const User = mongoose.model<Iuser>('User', userSchema);
