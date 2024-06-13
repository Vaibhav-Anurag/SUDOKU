const { makePuzzle, pluck } = require('./sudokuGenerator');

const DailyPuzzle = require('../models/dailyPuzzle');


exports.genPuzzle = async (f) => {
    //console.log('count is:', f);
    try {
        const solution = makePuzzle();
        const { puzzle } = pluck(solution, f);

        // Create new puzzle without including _id in the replacement document
        const newPuzzleData = {
            puzzle: {puzzle}, // Directly set puzzle instead of wrapping it
            solution: solution
        };

        // Use upsert option and ensure _id is not replaced
        const res = await DailyPuzzle.findOneAndReplace(
            {}, // Empty filter to match any document
            newPuzzleData,
            { upsert: true, returnDocument: 'after' } // Return the document after upsert
        ).exec();

       // console.log('Replaced puzzle:', res);
    } catch (error) {
        console.error('Error generating puzzle:', error);
    }
};

