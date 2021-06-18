import { Schema } from 'mongoose';
const roomSchema: Schema = new Schema({
  name: String,
  id: String,
  participants: [String],
});
export default roomSchema;
