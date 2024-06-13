const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const dailyUserSchema = new Schema({
    user:[{type: Schema.Types.ObjectId, ref:'User'}],
    time:{type:String, default: () => {
        const now = new Date();
        return now.toLocaleTimeString([], { hour12: false });
    }}
});

module.exports = mongoose.model('dailyUser', dailyUserSchema);