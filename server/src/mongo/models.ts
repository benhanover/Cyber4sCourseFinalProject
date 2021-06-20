// import Schemas
// prettier-ignore
import { roomSchema, userSchema, refreshTokenSchema, accessTokenSchema } from './schema/index';

// import libraries
import mongoose, {Model} from 'mongoose';

// import interfaces
import { Iuser, Iroom } from '../types/index';

/*---------------------------------------------------------------------------------------------------------- */
export const AccessToken: typeof Model = mongoose.model('AccessToken', accessTokenSchema);
export const RefreshToken: typeof Model = mongoose.model('RefreshToken', refreshTokenSchema);
export const Room: typeof Model = mongoose.model<Iroom>('Room', roomSchema);
export const User: typeof Model = mongoose.model<Iuser>('User', userSchema);
