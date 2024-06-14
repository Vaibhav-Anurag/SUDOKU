const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoose = require('mongoose');
const Users = require("../models/user");
const validPassword = require("../lib/passwordUtils").validPassword;


const customFields = {
  usernameField: 'email',
  passwordField:'password'
};
const verifyCallback = (username, password, done) => {
  console.log(username);
    Users.findOne({email: username})
        .then(async (user)=>{
            if(!user){
                console.log('no user');
                return done(null, false);
            }

            const isValid = await validPassword(password, user.password);
            console.log(user.password);
            console.log(isValid);

            if(isValid){
              console.log('pass');
              return done(null, user);
            }
            else{
              console.log('fail');
              return done(null, false);
            }
        })
        .catch((err) => {
          done(err);
        });
};

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user,done) =>{
  console.log('serialise: ', user.id);
  done(null,user.id);
});

passport.deserializeUser((userId, done) => {
  Users.findById(userId)
  .then((user) =>{
    console.log("deserialise : ", user);
    done(null, user);
  })
  .catch(err => done(err));
})


module.exports = passport;