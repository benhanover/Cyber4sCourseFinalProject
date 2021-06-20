// environment
require('dotenv').config();

// libraries
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// routes
import users from './routes/userRoute';
import rooms from './routes/roomRoute';
import { saveAccessToken } from './mongo/mongo-functions';

// declarations
const app = express();
const { PORT, DB } = process.env;

// middlewares
app.use(express.json());
app.use(cors());
app.use('/user', users);
app.use('/room', rooms);
app.use((req) => {
  console.log('trying to go in:', req.url, req.path);
});
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
