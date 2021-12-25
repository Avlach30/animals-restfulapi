const path = require('path');
const fs = require('fs');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const authRouter = require('./router/auth');
const postRouter = require('./router/post');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  next();
});

app.set('view engine', 'ejs');
app.set('views');

app.use(express.static(path.join(__dirname, 'public')));

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  {flags: 'a'}
)

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan('combined', { stream: accessLogStream }));

app.use('/auth', authRouter);
app.use(postRouter);

app.use('/', (req, res, next) => {
  res.render('documentation.ejs');
});

app.use((error, req, res, next) => {
  console.log(error);
  const statusCode = error.statusCode || 500;
  const message = error.message;
  const data = error.data;

  res.status(statusCode).json({message: message, data: data});
});

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.g6m6p.mongodb.net/${process.env.MONGO_DEFAULT_DB}?retryWrites=true&w=majority`;

mongoose.connect(MONGODB_URI)
  .then(result => {
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server connected at http://localhost:${port}`);
    });
  })
  .catch(error => { 
    console.log(error);
  });
