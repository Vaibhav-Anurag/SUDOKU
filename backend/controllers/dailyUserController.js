
const Users = require("../models/user");
const dailyUser = require('../models/dailyUser');
const asyncHandler = require('express-async-handler');



exports.list = asyncHandler(async(req,res,next)=>{
    const userList = await dailyUser.find({}).populate('user', 'name')
    .sort({time:1}).exec();
    res.json(userList);
});


exports.userAdd = asyncHandler(async(req,res,next)=>{
    const newUser = new dailyUser({
        user: req.params.id
    })
    const result = await newUser.save();
    res.status(201).json({
        message: "Puzzle solved successfully",
        user: { id: result._id, user: result.user}
      });
});


exports.alreadySolved = asyncHandler(async(req,res,next)=>{
    const userId = req.params.id;

    const userExists = await dailyUser.exists({ user: userId });
  
    res.status(200).json({
      exists: userExists
    });
});