const mongoose = require("mongoose");
// const { roomSchema } = require("./schema/index");
let database: string;
switch (process.env.environment) {
  case "dev":
    database = "together-dev";
    break;
  case "test":
    database = "together-test";
    break;
  case "prod":
    database = "together";
    break;

  default:
    database = "together-dev";
    break;
}

const db = mongoose.connect(`mongodb://mongo:27017/${database}`);

module.exports.Room = new mongoose.model("Room", roomSchema);
