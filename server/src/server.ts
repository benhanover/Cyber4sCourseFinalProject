// environment
require("dotenv").config();

// libraries
import cors from "cors";
import mongoose  from "mongoose";
const { v4: uuid } = require('uuid');
import express from 'express';
import * as http from 'http';


console.log(process.env.NODE_ENV, "testing");

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
// mongoose
//   .connect(`mongodb://${MONGO_SERVER}:27017/${DB}`, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("Connected To MongodDB " + DB);
//     server.listen(PORT, () => console.log("Listening On Port", PORT , "and" , server.address()));
//   })
//   .catch((e) => console.log(e));

// export default server;


// //initialize the WebSocket server instance
// import mongoose from 'mongoose';
// import server from '../server'
// import { getRooms } from './mongo/mongo-functions';
// import * as WebSocket from 'ws';

// const wsServer = new WebSocket.Server({ server });


// //  connection listener
// wsServer.on('connection', (clientSocket: any) => {
//     console.log("connected!");
    
//     // const rooms = await getRooms();
//     clientSocket.send(JSON.stringify({type: "rooms", message: "rooms" }));
//     //connection is up, let's add a simple simple event
//     clientSocket.on('message', (message: string) => {

//         //log the received message and send it back to the client
//         console.log('received: %s', message);
//         clientSocket.send(`Hello, you sent -> ${message}`);
//     });

//     //send immediatly a feedback to the incoming connection    
//     // clientSocket.send('Hi there, I am a WebSocket server');
// });
// wsServer.on('close', () => {
//     "connection closed"
// })

mongoose
  .connect(`mongodb://${MONGO_SERVER}:27017/${DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected To MongodDB " + DB);
    app.listen(PORT, () => console.log("Listening On Port", PORT , "and" , server.address()));
  })
  .catch((e) => console.log(e));