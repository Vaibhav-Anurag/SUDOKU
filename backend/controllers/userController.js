var express = require('express');
const {body, validationResult} = require('express-validator');
//const passport = require('passport');
var router = express.Router();
const passport = require('../config/passport');
const genPassword = require('../lib/passwordUtils').genPassword;
const validPassword = require('../lib/passwordUtils').validPassword;
const Users = require("../models/user");
const asyncHandler = require('express-async-handler');


exports.userCreate = ([
    //GET USERNAme , email and password and store them in db
    body("uname").notEmpty().trim(),
  body('email').isEmail().trim(),
  body('password').notEmpty()
  ],
async(req,res)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()});
  }
  const hash = await genPassword(req.body.password);
  const user = await Users.findOne({email: req.body.email});
  if(user){
    return res.status(409).json({message: 'User Already Exists'});
  }
  else{
  console.log(req.body.name, req.body.email, req.body.password)
  const newUser = new Users({
    name: req.body.name,
    email: req.body.email,
    password: hash,
  });
  const result = newUser.save();
  res.status(201).json({
    message: "User created successfully",
    user: { id: result._id, name: result.name, email: result.email }
  });
}
});

exports.userCheck = asyncHandler((req, res, next) => {
  // Verify if the user is valid or not
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: "Server error", error: err.message });
    }
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Log the user in
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ message: "Login failed", error: err.message });
      }

      // Send session ID and user data
      return res.status(200).json({
        message: "Login successful",
        user: { id: user._id, name: user.name, email: user.email }
      });
    });
  })(req, res, next);
});



exports.userLogout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      console.error("Error during logging out:", err);
      return next(err);
    }

    // Destroy the session
    req.session.destroy((err) => {
      if (err) {
        console.error("Error during session destruction:", err);
        return next(err);
      }
      
      // Clear the session cookie
      res.clearCookie('connect.sid', { path: '/' });

      // Confirm logout success
      return res.status(200).json({ message: 'Logout successful' });
    });
  });
};