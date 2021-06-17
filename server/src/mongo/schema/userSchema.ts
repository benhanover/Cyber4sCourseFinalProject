const { Schema } = require("mongoose");
const userSchema: typeof Schema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  birthDate: Date,
  username: String,
});
export default userSchema;
