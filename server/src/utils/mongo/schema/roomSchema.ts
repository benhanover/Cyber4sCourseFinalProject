const { Schema } = require("mongoose");
const schema: typeof Schema = new Schema({
  name: String,
  id: String,
  participants: [String],
});

module.exports.roomSchema = schema;
