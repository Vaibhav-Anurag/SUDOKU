var createError = require('http-errors');
var express = require('express');
const session = require('express-session');
var path = require('path');
const passport = require('passport');
const LocalStrategy = require("passport-local").Strategy;
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bcrypt = require('bcryptjs');
let dotenv = require('dotenv').config();
const User = require('./models/user');
const cors = require('cors');
const MongoStore = require('connect-mongo');
const cronJobs = require('./lib/cronJobs');
const fs = require('fs');


const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = process.env.MongoDB;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
  console.log('db connected');
}



var app = express();
app.enable('trust-proxy');

//app.use('/.well-known/pki-validation', express.static(path.join(__dirname, '/.well-known/pki-validation/')));
// Define a route to serve the verification file
app.get('/.well-known/pki-validation/36D0DC5ECCC6F69C4F7D50FDF95B9F84.txt', (req, res) => {
  const filePath = path.join(__dirname, '/.well-known/pki-validation/36D0DC5ECCC6F69C4F7D50FDF95B9F84.txt');
  
  // Check if the file exists
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error(`Error sending file: ${err}`);
        res.status(500).send('Internal Server Error');
      } else {
        console.log('Sent:', filePath);
      }
    });
  } else {
    res.status(404).send('File not found');
  }
});


app.use(cors({
  //origin: process.env.REACT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(session({secret:process.env.SECRET, resave: false,
  saveUninitialized: true ,
 store: MongoStore.create({
   mongoUrl: mongoDB,
   collectionName: 'sessions'
 }),
 cookie: {
   maxAge: 1000 * 60 * 60 * 24, // 1 day
 }
}));
require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

app.use((req,res,next)=>{
  console.log(req.session);
  console.log(req.user);
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());



app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

app.use('/', indexRouter);
app.use('/users', usersRouter);

//Automated stuffs:

cronJobs.refreshLeaderboard.start();
cronJobs.refreshPuzzle.start();
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.listen(3001, () => console.log("app listening on port 3001!"));
module.exports = app;
