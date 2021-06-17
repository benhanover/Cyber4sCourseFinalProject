import { Document } from "mongoose";
export interface Iroom extends Document {
  name: String;
  id: String;
  participants: Array<string>;
}

export interface Iuser extends Document {
  firstName: String;
  lastName: String;
  email: String;
  password: String;
  birthDate: Date;
  username: String;
}
