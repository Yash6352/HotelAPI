const express = require('express')
const bodyParser = require("body-parser");
const cors = require('cors');
const db = require('./database/db');
const app = express()
const path = require("path");

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions));
app.use(bodyParser.json({limit: '50mb'}));
app.use('/Hotelapi/images', express.static('images'));

db()

app.use('/Hotelapi', require('./indexRoutes/routes'));
app.get("/Hotelapi/images", express.static(path.join(__dirname, "./images")));
app.listen(5500, console.log(`Server is Running on Port No 5500`),)