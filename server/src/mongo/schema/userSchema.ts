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
    address: { type: String, default: 'Change me:)' },
    status: { type: String, default: 'Change me:)' },
    about: { type: String, default: 'Change me:)' },
    intrests: { type: String, default: 'Change me:)' },
    hobbys: { type: String, default: 'Change me:)' },
    relationship: { type: String, default: 'Change me:)' },
    activeTime: { type: String, default: 'Change me:)' },
    gender: { type: String, default: 'We Accept Anyone Around Here:)'},
    img: {type: String, default: 'https://roomie-profile-images.s3.amazonaws.com/default'}
  }
});

export default userSchema;

