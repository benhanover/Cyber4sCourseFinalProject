import { Schema } from 'mongoose';
const roomSchema: Schema = new Schema({
  host: String,
  subject: String,
  subSubject: String,
  title: String,
  description: String,
  participants: [String],
  limit: Number,
  isLocked: Boolean,
});
export default roomSchema;

