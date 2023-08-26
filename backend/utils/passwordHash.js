const bcrypt = require('bcrypt');
const saltRounds = 10;
const appHelper = require('../helpers/appHelper')
let passwordHash = new Object();

passwordHash.getHashedPassword = async (plaintextPassword) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(plaintextPassword, salt);
        return { status: true, data: hash };
    } catch (err) {
        console.log(err);
        return { status: false, message: err.message ? err.message : err };
    }
};

passwordHash.verifyPasswordwithHash = async (userProvidedPassword, storedHashedPassword) => {
    return new Promise((resolve, reject) => {
      bcrypt.compare(userProvidedPassword, storedHashedPassword, (err, result) => {
            if (err) {
            console.log(err);
            resolve({ status: false, message: err.message ? err.message : err });
            } else if (result === true) {
            console.log('Authentication successful');
            resolve({ status: true, data: result });
            } else {
            console.log('Authentication failed');
            resolve({ status: false, data: result });
            }
      });
    });
};

module.exports = passwordHash;
