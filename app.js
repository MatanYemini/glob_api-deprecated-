const express =require('express');
const feedRoutes = require('./routes/feed');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'jpg' ||
        file.mimetype === 'jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const MONGODB_URI = 'mongodb+srv://Yemini:316386366@clusternode-gbgoy.mongodb.net/messages';
const ACCESS_ORIGIN = 'Access-Control-Allow-Origin';
const ACCESS_METHODS = 'Access-Control-Allow-Methods';
const ACCESS_HEADERS = 'Access-Control-Allow-Headers';

app.use(bodyParser.json()); // application/json
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
    res.setHeader(ACCESS_ORIGIN, '*');
    res.setHeader(ACCESS_METHODS, 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader(ACCESS_HEADERS, 'Content-Type, Authorization');
    next();
});

app.use('/feed', feedRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({message: message});
});

mongoose.connect(MONGODB_URI)
    .then(res => {
        app.listen(8080);
        console.log('connected!');
    })
    .catch(err => {
        console.log(err);
    });
