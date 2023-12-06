var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const authentif = require('../middleware/usersMiddleware');
const userRoute = require('../api/routes/users');
var indexRouter = require('../api/routes/index');
const geolocRoute = require('../api/routes/geoloc');  
const connectDB = require('../config/database');

var app = express();

// Connexion à la base de données en utilisant le module de configuration
connectDB();

// view engine setup

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());                                
app.use('/api/user', userRoute);
// Utiliser le middleware au niveau de l'application pour toutes les routes
app.use(authentif);
app.use('/api/V1', indexRouter);
app.use('/api/V1', geolocRoute); 


  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500).end();
  });
  
  // catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
  });
  
  module.exports = app;
  