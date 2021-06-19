import { Schema } from 'mongoose';

const accessTokenSchema = new Schema({
  accessToken: String,
});
export default accessTokenSchema;
