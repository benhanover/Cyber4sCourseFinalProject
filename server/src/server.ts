// environment
require('dotenv').config();

// libraries
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

console.log(process.env.NODE_ENV, "testing");

// routes

import {users, rooms, fallbacks} from './routes/index'
// declarations
const app = express();
const {PORT, DB} = process.env;
// const PORT = process.env.PORT;
// const DB = process.env.NODE_ENV === 'test' ? process.env.DB_TEST : process.env.DB

// middlewares
app.use(express.json());
app.use(cors());
app.use('/user', users);
app.use('/room', rooms);
app.use(fallbacks);


/*---------------------------------------------------------------------------------------------------------- */
mongoose
  .connect(`mongodb://localhost:27017/${DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected To MongodDB ' + DB);
    app.listen(PORT, () => console.log('Listening On Port', PORT));
  })
  .catch((e) => console.log(e));
