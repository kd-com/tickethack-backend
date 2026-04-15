require('dotenv').config();
require('./models/connection');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');


var tripRouter = require('./routes/trips');
var indexRouter = require('./routes/index');
var indexCart = require('./routes/cart')
//var indexBooking = require('./routes/booking')

var app = express();
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', tripRouter);
app.use('/', indexRouter);
app.use('/cart', indexCart);
//app.use('/booking', indexBooking)

module.exports = app;
