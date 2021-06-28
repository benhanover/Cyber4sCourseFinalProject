import { Schema } from 'mongoose';

const participantsSchema = new Schema({
    peerId: String,
    streamId: String,
    username: String
});
export default participantsSchema;
