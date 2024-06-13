const bcrypt = require('bcryptjs');

async function genPassword(password){
  
    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword;
    }
    catch(err){
        console.error(err);
        throw err;
    }
}   

async function validPassword(password, hash){
    try{
        const match = await bcrypt.compare(password, hash);
        if(!match){
            console.log('not-matched');
        }
        else{
            console.log("matched");
        }
        return match;
    }
    catch(err){
        console.err(err);
        throw err;
    }
}

module.exports = {genPassword, validPassword};