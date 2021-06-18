import { Document } from "mongoose";
export interface Iroom {
  id: String;
  host: String;
  subject: String;
  subSubject: String;
  title: String;
  description: String;
  participants: Array<string>;
  limit: Number;
  isLocked: Boolean;
}

// export interface Iuser extends Document {
//   firstName: String;
//   lastName: String;
//   email: String;
//   password: String;
//   birthDate: Date;
//   username: String;
// }
export interface Iuser {
  firstName: String;
  lastName: String;
  email: String;
  password: String;
  birthDate: Date;
  username: String;
}

export interface IcanRegister {
  return: Boolean,
  message?: String
}