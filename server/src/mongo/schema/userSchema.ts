import { Schema } from 'mongoose';
import { Iuser } from '../../types';



const userSchema = new Schema<Iuser>({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  birthDate: Date,
  username: String,
  peerId: String,
  profileUrl: String,
  profile: {
    // img: { type: String, default: 'data:image/png;base64,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' },
    // img: { type: String, data: Buffer },
    address: { type: String, default: 'Change me:)' },
    status: { type: String, default: 'Change me:)' },
    about: { type: String, default: 'Change me:)' },
    intrests: { type: String, default: 'Change me:)' },
    hobbys: { type: String, default: 'Change me:)' },
    relationship: { type: String, default: 'Change me:)' },
    activeTime: { type: String, default: 'Change me:)' }
  }
});

export default userSchema;
// profile: profileSchema,

