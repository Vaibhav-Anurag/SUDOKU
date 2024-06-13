var express = require('express');
const {body, validationResult} = require('express-validator');
//const passport = require('passport');
var router = express.Router();
const passport = require('../config/passport');
const genPassword = require('../lib/passwordUtils').genPassword;
const validPassword = require('../lib/passwordUtils').validPassword;
const Users = require("../models/user");
const asyncHandler = require('express-async-handler');
const DailyPuzzle = require('../models/dailyPuzzle');



const finalCount = () => {
    const res = Math.floor(Math.random()*(81-17-10))+17;
    console.log(res);
    return res;
}


// exports.puzzle = asyncHandler(async(req,res,next) => {
//     const count = finalCount();
//     dailyPuzzle.genPuzzle(count);
// });


exports.puzzle = asyncHandler(async(req,res,next) => {
    const newPuzz = await DailyPuzzle.find({}).exec();
    console.log('dailyPuzzle route hit');
    res.json(newPuzz);
})