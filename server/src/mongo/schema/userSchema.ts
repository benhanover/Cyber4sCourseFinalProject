import { Schema } from "mongoose";
import { Iuser } from "../../types";

const userSchema = new Schema<Iuser>({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  birthDate: Date,
  username: String,
  peerId: String,
  profileUrl: String,
  friendList: [String],
  blackList: [String],
  profile: {
    address: { type: String, default: '' },
    status: { type: String, default: '' },
    about: { type: String, default: '' },
    intrests: { type: String, default: '' },
    hobbys: { type: String, default: '' },
    relationship: { type: String, default: '' },
    activeTime: { type: String, default: '' },
    gender: { type: String, default: ''},
    img: {type: String, default: 'https://roomie-profile-images.s3.amazonaws.com/default'}
  }
});

export default userSchema;

