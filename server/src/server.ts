// environment
require("dotenv").config();

// libraries
import cors from "cors";
import axios from "axios";
import mongoose  from "mongoose";
const { v4: uuid } = require('uuid');
import express from 'express';
import http from 'http';



// routes
import { users, rooms, fallbacks } from "./routes/index";


// declarations
const app = express();
const server = http.createServer(app);


const { PORT, DB } = process.env;
const MONGO_SERVER = DB === 'together_dev' ? 'localhost' : 'mongo'

console.log(DB, "from the server");

// middlewares
app.use(express.json());
app.use(cors());
app.use("/user", users);
app.use("/room", rooms);
app.use(fallbacks);

/*---------------------------------------------------------------------------------------------------------- */


import { getRooms } from './mongo/mongo-functions';
import WebSocket from 'ws';
import { ImessageBox } from "./ws/interfaces";

const wsServer = new WebSocket.Server({ server });


//  connection listener
wsServer.on('connection', async (clientSocket: any) => {
    console.log("connected!");
    
    const rooms = await getRooms();
    clientSocket.send(JSON.stringify({type: "rooms", message: rooms }));
    //connection is up, let's add a simple simple event
    clientSocket.on('message', (messageBoxEvent: MessageEvent<string>) => {
      console.log('received:', messageBoxEvent.data);
      const messageData: ImessageBox = JSON.parse(messageBoxEvent.data);
      switch (messageData.type) {
        case "creating new room":
        
         wsServer.clients.forEach((client)=>{
           client.send(JSON.stringify({type: "new room was created" , message: messageData }))
         })
        break;
      
        default:
          break;
      }
        //log the received message and send it back to the client
    });
});
wsServer.on('close', () => {
    "connection closed"
})

mongoose
  .connect(`mongodb://${MONGO_SERVER}:27017/${DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected To MongodDB " + DB);
    server.listen(PORT, () => console.log("Listening On Port", PORT , "and" , server.address()));
  })
  .catch((e) => console.log(e));