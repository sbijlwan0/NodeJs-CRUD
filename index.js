const express = require('express');
path = require('path'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// Created express server
const app = express();
mongoose.Promise = global.Promise;

// Connect Mongodb Database
mongoose.connect(process.env.DATABASE_URL + process.env.DATABASE_NAME, {
    useNewUrlParser: true
}).then(
    () => {
        console.log('Database is connected')
    },
    err => {
        console.log('There is problem while connecting database ' + err)
    }
);

const api = require('./Routes/api.router');

// Conver incoming data to JSON format
app.use(bodyParser.json());

// Enabled CORS
app.use(cors());

// Setup for the server port number
const port = process.env.PORT;

app.use(api);
app.use((err, req, res, next) => {
    res.status(400).json({
        msg: err
    });
});

// Staring our express server
const server = app.listen(port, function () {
    console.log('Server Lisening On Port : ' + port);
});