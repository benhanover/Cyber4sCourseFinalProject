import { Schema } from "mongoose";
import { Iroom } from "../../types";
import participantsSchema from "./participantsSchema";


const roomSchema = new Schema<Iroom>({
  host: String,
  subject: String,
  subSubject: String,
  title: String,
  description: String,
  participants: [participantsSchema], //////////
  limit: Number,
  isLocked: Boolean,
  roomPassword: String,
});
export default roomSchema;
