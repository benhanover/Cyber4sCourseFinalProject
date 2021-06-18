import { Schema } from 'mongoose';
import { Iuser } from '../../interfaces';

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
