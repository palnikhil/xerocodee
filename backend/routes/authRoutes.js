const express = require('express');
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');
const dbController = require('../db/dbController');
const router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;

passport.use(new GoogleStrategy({
    // Google OAuth options
    clientID: "944067594272-3c2lvee7qq83ehi4bj6gahjog0elkqn3.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

passport.use(new GitHubStrategy({
    // GitHub OAuth options
    clientID: "0685a1f04f9742a9c9d6",
    clientSecret: "66381a2d8fa2ebbe7b63a391668ab9fa476f7d20",
    callbackURL: '/auth/github/callback'
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));


router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    async (req, res) => {
        let result = await authController.GoogleAuth(req);
        if(result.code === 201){
            res.cookie('result',result.data.token).status(result.code).send(result).redirect('http://localhost:3000/login');
        }
        else{
            res.redirect('http://localhost:3000/login');
        }
    }
);

router.get('/auth/github', passport.authenticate('github'));

router.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/' }),
    async(req, res) => {
        let result = await authController.GoogleAuth(req)
        if(result.code === 201){
            res.cookie(result);
            res.status(result.code).send(result)
        }
        else{
            res.status(result.code).send(result)
        }
    }
);

passport.serializeUser((user, done) => {
    done(null, user);
  });
  
passport.deserializeUser((user, done) => {
    done(null, user);
  });

router.route('/signup').post(async (req,res)=>{
    let result = await authController.signUp(req);
    res.status(result.code).send(result);
})

router.route('/login').post(async (req,res) => {
    let result = await authController.login(req);
    res.status(result.code).send(result);
})
router.get('/logout', verifyToken, authController.logout);

router.get('/user-info', verifyToken, async(req,res)=>{
    let result = await authController.getUserInfo(req);
    console.log(result)
    res.status(result.code).send(result);
});

module.exports = router;