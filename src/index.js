const dotenv = require('dotenv');
const express = require('express');
const app = express();
dotenv.config();

const { db } = require('./db');
const errorHandler = require('./middleware/error.middleware');
const teamRouter = require('./routes/teams');
const userRouter = require('./routes/users');

app.use(express.json());
app.use('/teams', teamRouter);

app.use('/users', userRouter);

app.use(errorHandler);

db.authenticate().then(() => {
  app.listen(process.env.PORT, function () {
    console.log('application started');
  });
});
