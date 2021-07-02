// // //initialize the WebSocket server instance
// import mongoose from 'mongoose';
// import { getRooms } from '../mongo/mongo-functions';
// import server from '../server'
// import * as WebSocket from 'ws';
// require("dotenv").config();

// const wsServer = new WebSocket.Server({ server });

// const { PORT, DB } = process.env;
// const MONGO_SERVER = DB === 'together_dev' ? '192.168.1.111' : 'mongo'

// console.log(DB, "from the server");

// //  connection listener
// wsServer.on('connection', (clientSocket: any) => {
//     console.log("connected!");
    
//     // const rooms = await getRooms();
//     clientSocket.send({type: "rooms", message: "rooms" });
//     //connection is up, let's add a simple simple event
//     clientSocket.on('message', (message: string) => {

//         //log the received message and send it back to the client
//         console.log('received: %s', message);
//         clientSocket.send(`Hello, you sent -> ${message}`);
//     });

//     //send immediatly a feedback to the incoming connection    
//     clientSocket.send('Hi there, I am a WebSocket server');
// });
// wsServer.on('close', () => {
//     "connection closed"
// })

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