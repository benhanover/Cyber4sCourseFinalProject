import { Schema } from "mongoose";
import userSchema from "./userSchema";

const participantsSchema = new Schema({
  peerId: String,
  streamId: String,
  user: userSchema,
});
export default participantsSchema;
