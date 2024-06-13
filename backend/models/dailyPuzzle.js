const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dailyPuzzleSchema = new Schema({
    puzzle:{type:Schema.Types.Mixed},
    solution:{type:Schema.Types.Mixed},
});

module.exports = mongoose.model('dailyPuzzle', dailyPuzzleSchema);