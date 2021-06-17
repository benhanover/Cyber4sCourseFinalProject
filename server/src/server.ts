import express from "express";
import cors from "cors";

import users from "./routes/userRoute";
import rooms from "./routes/roomRoute";
const app = express();
app.use(cors());

// const RoomObj = require("./types/index");
// const { request, response } = require("./types/index.ts");

//regiter users
//
//login users

const port: number = 4000;
app.use("/user", users);
app.use("/room", rooms);

try {
  app.listen(port);
  console.log("listening on port", port);
} catch (e) {
  console.log("error loading server:", e);
}
