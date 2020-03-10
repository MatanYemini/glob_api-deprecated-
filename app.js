const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');


// Consts
const MONGODB_URI = 'mongodb+srv://Yemini:316386366@clusternode-gbgoy.mongodb.net/messages';
const ACCESS_ORIGIN = 'Access-Control-Allow-Origin';
const ACCESS_METHODS = 'Access-Control-Allow-Methods';
const ACCESS_HEADERS = 'Access-Control-Allow-Headers';


const app = express();

const uuidv4 = require('uuid/v4')
 
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'images');
    },
    filename: function(req, file, cb) {
        cb(null, uuidv4())
    }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use(
  multer({ storage: storage, fileFilter: fileFilter }).single('image')
);
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.setHeader(ACCESS_ORIGIN, '*');
  res.setHeader(
    ACCESS_METHODS,
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader(ACCESS_HEADERS, 'Content-Type, Authorization');
  next();
});

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    MONGODB_URI
  )
  .then(result => {
    const server = app.listen(8080);
    const io = require('./socket').init(server); // setting up websocket connection
    io.on('connection', socket => { 
      console.log('Client connected'); // will be reached in any new client connection
    });
  })
  .catch(err => console.log(err));
