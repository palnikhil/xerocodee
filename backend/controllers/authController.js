const jwt = require('jsonwebtoken');
const config = require('../config/config');
const redisClient = require('../utils/redisUtils');
const hashPassword = require('../utils/passwordHash');
const appHelper = require('../helpers/appHelper');
const JWT_SECRET = config.app.JWT_SECRET;
const dbController = require('../db/dbController');
const { v4: uuidv4 } = require('uuid');
let authController = new Object();

const createToken = (user) => {
  const payload = {
    user_id: user.user_id,
    username: user.username,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

authController.GoogleAuth = async(req) => {
  try{
    let email = req.user._json.email;
    let name = req.user._json.name;
    let user_id = req.user._json.sub;
    let username = email.split('@')[0];
    let users = await dbController.queryTable(email);
    if(users.data.length > 0){
        if(users.data[0].provider !== "GOOGLE"){
          return appHelper.apiResponse(401, false, 'Not Authorized with Google Sign In!');
        }
        const token = createToken(users.data[0]);
        console.log(token);
        try{
          redisClient.setEx(users.data[0].username, 3600, token);
        }catch(err){
          console.log(err)
        }
        users.data[0].token = token
        return appHelper.apiResponse(200, true, 'Auth Success',users.data[0]);
    }
    else{
        let provider = 'GOOGLE';
        let item =  {
                    user_id,
                    name,
                    username,
                    email,
                    provider
                  }
        let user = await dbController.addRecord(item);
        if(user.success === false){
          return appHelper.apiResponse(500, false, 'Error in DB operation');
        }
        const token = createToken(item);
        console.log(token);
        try{
          redisClient.setEx(item.username, 3600, token);
        }catch(err){
          console.log(err)
        }
        item.token = token
        return appHelper.apiResponse(201, true, 'Auth Success',item);
        //return appHelper.apiResponse(201, true, 'Registeration Success',user.user);
      }
  }catch(err){
    console.log(err.message?err.message:err);
    appHelper.apiResponse(500, false, "Internal Server Error");
  }
}

authController.GithubAuth = async(req) => {
  try{
    let username = req.user.username;
    let user_id = req.user.id;
    let users = await dbController.queryTableFromUsername(username);
    if(users.data.length > 0){
        if(users.data[0].provider !== "GITHUB"){
          return appHelper.apiResponse(401, false, 'Sign In with Github Provider');
        }
        const token = createToken(users.data[0]);
        console.log(token);
        try{
          redisClient.setEx(users.data[0].username, 3600, token);
        }catch(err){
          console.log(err)
        }
        users.data[0].token = token
        return appHelper.apiResponse(200, true, 'Auth Success',users.data[0]);
    }
    else{
        let provider = 'GITHUB';
        let item =  {
                    user_id,
                    username,
                    provider
                  }
        let user = await dbController.addRecord(item);
        if(user.success === false){
          return appHelper.apiResponse(500, false, 'Error in DB operation');
        }
        return appHelper.apiResponse(201, true, 'Registeration Success',user.user);
    }
  }catch(err){
    console.log(err.message?err.message:err);
    appHelper.apiResponse(500, false, "Internal Server Error");
  }
}

authController.signUp = async (req) => {
  try{
    const {name,email,password} = req.body;
    console.log(name,email,password)
    let userCheck = await dbController.queryTable(email);
    if (userCheck.success && userCheck.data.length > 0){
      return appHelper.apiResponse(401, false, "Email Id already Exists");
    }
    let hash = await hashPassword.getHashedPassword(password);
    if(!name || !email || !password){
      return appHelper.apiResponse(401, false, "Fields are missing");
    }
    console.log(hash)
    if(hash.status === false){
      return appHelper.apiResponse(500, false, "Something Went Wrong!");
    }
    hash = hash.data;
    const randomUUID = uuidv4();
    let username = email.split('@')[0];
    let provider = 'EMAIL';
    let item =  {
                user_id:randomUUID,
                name,
                username,
                email,
                password:hash,
                provider
               }
    let user = await dbController.addRecord(item);
    if(user.success === false){
      return appHelper.apiResponse(500, false, 'Error in DB operation');
    }
    return appHelper.apiResponse(201, true, 'Registeration Success',user.user);
  }catch(err){
      console.log( err.message ? err.message : err);
      return appHelper.apiResponse( 500, false,err.message ? err.message : err );
  }
};

authController.login = async (req) => {
  try{
    const {email, password} = req.body;
    if(!email || !password){
      return appHelper.apiResponse(401, false, "Fields are missing");
    }
    const userData = await dbController.queryTable(email);
    if(userData.success === false){
      return appHelper.apiResponse(500, false, "Database Retrieval Issue");
    }
    if(userData.data.length === 0){
      return appHelper.apiResponse(401, false, "Email ID do not exist");
    }
    let hashedPassword = userData.data[0].password;
    console.log(hashedPassword)
    let passwordVerify = await hashPassword.verifyPasswordwithHash(password,hashedPassword);
    console.log(passwordVerify)
    if(passwordVerify.data === false){
      return appHelper.apiResponse(401, false, "Wrong Password");
    }
    console.log(userData.data[0])
    const token = createToken(userData.data[0]);
    console.log(token);
    try{
      redisClient.setEx(userData.data[0].username, 3600, token);
    }catch(err){
      console.log(err)
    }
    userData.data[0].password = undefined
    userData.data[0].token = token
    return appHelper.apiResponse(200, true, 'Auth Success',userData.data[0]);
  }catch(err){
    console.log( err.message ? err.message : err);
    return appHelper.apiResponse( 500, false,err.message ? err.message : err );
  }
};

authController.logout = (req, res) => {
  redisClient.del(req.user.username);
  res.json({ message: 'Logged out successfully' });
};

authController.getUserInfo = async (req) => {
  try{
    const userData = req.user;
    let userInfo = await dbController.queryTableFromUsername(userData.username);
    if(userInfo.data.length === 0){
      return appHelper.apiResponse(400, false, "User Not found");
    }
    let tokenInRedis = await redisClient.get(userData.username)
    if (!tokenInRedis) {
        return appHelper.apiResponse(400, false, "Token not in Redis");
    }
    
    if (tokenInRedis !== req.headers.authorization.split(' ')[1]) {
        return appHelper.apiResponse(401, false, 'Unauthorized');
    }
    userInfo.data[0].password = undefined
    return appHelper.apiResponse(200, true,"User Retrieved" ,userInfo.data[0])
  }catch(err){
    console.log(err);
    return appHelper.apiResponse(500, false, 'Internal Server Error')
  }
};

module.exports = authController;
