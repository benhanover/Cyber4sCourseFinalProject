import { Schema } from 'mongoose';

const profileSchema = new Schema({
  address: { type: String, default: 'test' },
  status: { type: String, default: 'test' },
  about: { type: String, default: 'test' },
  intrests: { type: String, default: 'test' },
  hobbys: { type: String, default: 'test' },
  relationship: { type: String, default: 'test' },
  activeTime: { type: String, default: 'test' }
});
export default profileSchema;
// img: { data: Buffer, contentType: String },
