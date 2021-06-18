import { Schema } from 'mongoose';
const userSchema: Schema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  birthDate: Date,
  userName: String,
  peerId: String
});
export default userSchema;
