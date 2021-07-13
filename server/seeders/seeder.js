const mongoose = require('mongoose');
require('dotenv').config();
const { DB, MONGO_SERVER } = process.env;
const users = require('./mockUsers.json');
const rooms = require('./mockRooms.json');
const { User, Room } = require('../dist/js/mongo/models');
mongoose
    // .connect(`mongodb://${MONGO_SERVER}:27017/${DB}`, {
    .connect(`mongodb://localhost:27017/${DB}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
// User.create(users).then(() => console.log("users seeded successfully"))
Room.create(rooms).then(() => console.log("rooms seeded successfully"))
setTimeout(() => { mongoose.disconnect() }, 2000);