import { Schema } from 'mongoose';
import { Iuser } from '../../types';

const userSchema = new Schema<Iuser>({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  birthDate: Date,
  username: String,
  peerId: String
});
export default userSchema;
