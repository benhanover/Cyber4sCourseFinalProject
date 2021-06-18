// enviorment
import './env/environment';

// libraries
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// routes
import users from './routes/userRoute';
import rooms from './routes/roomRoute';

const app = express();

app.use(cors());
app.use('/user', users);
app.use('/room', rooms);

const { PORT, DB } = process.env;
mongoose
  .connect(`mongodb://mongo:27017/${DB}`)
  .then(() => {
    console.log('Connected To MongodDB');
    app.listen(PORT, () => console.log('Listening On Port', PORT));
  })
  .catch((e) => console.log(e));
