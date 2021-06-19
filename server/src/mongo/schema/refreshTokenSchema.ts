import { Schema } from 'mongoose';

const refreshTokenSchema = new Schema({
  refreshToken: String,
});
export default refreshTokenSchema;
