import { Schema } from 'mongoose';

const participantsSchema = new Schema({
    participantId: String,
    participantSocket: String
});
export default participantsSchema;
