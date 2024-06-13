var express = require('express');
var router = express.Router();
const user_controller = require('../controllers/userController');
const dailyUser_controller = require('../controllers/dailyUserController')
const dailyPuzzle_controller = require('../controllers/daillyPuzzleController')
const isAuth = require('./authMiddleware').isAuth;  
/* GET home page. */

// CREATE USER
router.get('/signup',function(req,res){
  console.log('Signup route hit');
  res.send('GET signup');
});

router.post('/signup', user_controller.userCreate);

//LOGIN VERIFICATION
router.post('/login', user_controller.userCheck);

//logout
router.get('/logout', user_controller.userLogout);

//Print Leaderboard
router.get('/leaderboard', isAuth, dailyUser_controller.list);

//Add your name to leaderboard
router.post('/leaderboard/:id',isAuth, dailyUser_controller.userAdd);

//Check for a particular user
router.get('/leaderboard/:id', dailyUser_controller.alreadySolved);

router.get('/',isAuth, dailyPuzzle_controller.puzzle);

module.exports = router;
