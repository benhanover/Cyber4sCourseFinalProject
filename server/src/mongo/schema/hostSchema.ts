import { Schema } from 'mongoose';

const hostSchema = new Schema({
    userId: String,
    userSocket: String
});
export default hostSchema;
