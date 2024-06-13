const {CronJob} = require('cron');
const DailyUser = require('../models/dailyUser');
const dailyPuzzle = require('../lib/puzzleGen');

const finalCount = () => {
    const res = Math.floor(Math.random()*(81-30-10))+30;
    console.log(res);
    return res;
}

const refreshPuzzle = new CronJob('0 0 0 * * *', ()=>{
    const count = finalCount();
    dailyPuzzle.genPuzzle(count);
});


const refreshLeaderboard = new CronJob('0 0 0 * * *', async() => {
    const res = await DailyUser.deleteMany({}).exec();
    console.log("leaderboard refreshed",res);
});

module.exports = {refreshPuzzle, refreshLeaderboard};