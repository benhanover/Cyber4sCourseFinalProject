const { Schema } = require("mongoose");
const roomSchema: typeof Schema = new Schema({
  name: String,
  id: String,
  participants: [String],
});
export default roomSchema;
