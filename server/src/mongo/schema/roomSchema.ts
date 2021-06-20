import { Schema } from 'mongoose';
import { Iroom } from '../../types';

const roomSchema = new Schema<Iroom>({
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