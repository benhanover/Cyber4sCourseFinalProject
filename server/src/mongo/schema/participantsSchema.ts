import { Schema } from "mongoose";

const participantsSchema = new Schema({
  peerId: String,
  streamId: String,
  user: {
    firstName: String,
    lastName: String,
    age: Number,
    birthDate: Date,
    username: String,
    _id: String,
    profile: {
      address: { type: String, default: "Change me:)" },
      status: { type: String, default: "Change me:)" },
      about: { type: String, default: "Change me:)" },
      intrests: { type: String, default: "Change me:)" },
      hobbys: { type: String, default: "Change me:)" },
      relationship: { type: String, default: "Change me:)" },
      activeTime: { type: String, default: "Change me:)" },
      gender: { type: String, default: "We Accept Anyone Around Here:)" },
    },
  },
});
export default participantsSchema;
