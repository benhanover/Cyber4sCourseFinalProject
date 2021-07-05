// environment
require("dotenv").config();

// libraries
import cors from "cors";
import axios from "axios";
import mongoose from "mongoose";
const { v4: uuid } = require("uuid");
import express from "express";
import http from "http";

// routes
import { users, rooms, fallbacks } from "./routes/index";

// declarations
const app = express();
const server = http.createServer(app);

const { PORT, DB, MONGO_SERVER } = process.env;

console.log(DB, "from the server");

// middlewares
app.use(express.json());
app.use(cors());
app.get('/test', (req, res) => {
  res.send('IM ALIVE')
})
app.use("/user", users);
app.use("/room", rooms);
app.use(fallbacks);
/*---------------------------------------------------------------------------------------------------------- */

import {
  findDocument,
  getRooms,
  removePartecipentfromRoom,
  saveRoom,
  updateDocument,
} from "./mongo/mongo-functions";
import WebSocket from "ws";
import { ImessageBox } from "./ws/interfaces";
import { Room } from "./mongo/models";
import { Iroom, Umodels } from "./types";

const wsServer = new WebSocket.Server({ server });

//  connection listener
wsServer.on("connection", async (clientSocket: any) => {
  console.log("connected!");

  const rooms = await getRooms();
  clientSocket.send(JSON.stringify({ type: "rooms", message: rooms }));

  //cadding event listeners
  clientSocket.on("message", async (messageBoxEvent: any) => {
    // console.log("received:", messageBoxEvent);

    const messageData: ImessageBox = JSON.parse(messageBoxEvent);
    switch (messageData.type) {
      case "creating new room":
        if (
          typeof messageData.message === "string" ||
          Array.isArray(messageData.message)
        )
          return;
        wsServer.emit("populate new room", messageData.message);
        console.log("creating new room");
        break;
      case "lock room":
        console.log("in the lock room!!");
        break;
      case "delete room": //havent been tested
        wsServer.emit("delete room for all", messageData.message);

        // wsServer.clients.forEach((client) => {
        //   client.send(
        //     JSON.stringify({ type: "room deleted", message: messageData })
        //   );
        // });
        //log the received message and send it back to the client
        break;
      case "leave room":
        // console.log("testttttttttttttttttttt", messageData.message);

        //remove the participent from room db
        const isRemoved = await removePartecipentfromRoom(
          messageData.message.participant.roomId,
          messageData.message.participant
        );
        // console.log(isRemoved, "isremoved!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        if (!isRemoved) {
          console.log("could not remove participant from db");
          return;
        }
        wsServer.emit("send rooms to all");
        break;
      case "join room":
        console.log(
          `${messageData.message.username} joined to room ${messageData.message.roomId} using the new peer: ${messageData.message.participant.peerId} and the stream with if: ${messageData.message.participant.streamId}`
        );
        // console.log(
        //   messageData.message.participant,
        //   "participent !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
        // );

        const room: Umodels = await updateDocument(
          "Room",
          "_id",
          messageData.message.roomId,
          "participants",
          messageData.message.participant
        );
        console.log(room);
        ///update everyone

        console.log("after if there are participent");
        wsServer.emit("send rooms to all", messageData.message);
        break;
      default:
        console.log("in ws default", messageData.type);

        return;
    }
  });
});

//wsServer event listeners
/*-------------------------------------------------------------------------------------------------------------------------------*/
wsServer.on("populate new room", (newRoom) => {
  wsServer.clients.forEach((client) => {
    client.send(
      JSON.stringify({
        type: "new room was created",
        message: newRoom,
      })
    );
  });
});

wsServer.on("delete room for all", (room) => {
  wsServer.clients.forEach((client) => {
    client.send(JSON.stringify({ type: "room deleted", message: room }));
  });
});
wsServer.on("send rooms to all", async () => {
  const rooms = await getRooms();
  wsServer.clients.forEach((client) => {
    client.send(
      JSON.stringify({
        type: "rooms",
        message: rooms,
      })
    );
  });
  // console.log("sent rooms to all");
});

wsServer.on("close", () => {
  "connection closed";
});
console.log("Db" , DB)
mongoose
  // .connect(`mongodb://${MONGO_SERVER}:27017/${DB}`, {
  .connect(`mongodb://localhost:27017/${DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Connected To MongodDB " + DB);
    server.listen(PORT, () =>
      console.log("Listening On Port", PORT, "and", server.address())
    );
  })
  .catch((e) => console.log(e));
