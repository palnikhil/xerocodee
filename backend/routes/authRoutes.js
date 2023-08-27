const express = require('express');
const config = require('../config/config');
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');
const dbController = require('../db/dbController');
const router = express.Router();
const passport = require('passport');
const dbHandler = require('../controllers/dbHandler');
const { getRepos } = require('../controllers/githubController');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;

passport.use(new GoogleStrategy({
    // Google OAuth options
    clientID: config.app.GOOGLE_CLIENT_ID,
    clientSecret: config.app.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

passport.use(new GitHubStrategy({
    // GitHub OAuth options
    clientID: config.app.GITHUB_CLIENT_ID,
    clientSecret: config.app.GITHUB_SECRET,
    callbackURL: '/auth/github/callback',
    scope: 'repo'
}, (accessToken, refreshToken, profile, done) => {
    console.log('accessToken:',accessToken);
    console.log(profile)
    return done(null, profile);
}));


router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    async (req, res) => {
        let result = await authController.GoogleAuth(req);
        console.log(result);
        if(result.code === 201){
            res.cookie('token',result.data.token).status(result.code).redirect('https://xerocodee-assignment-o79u.onrender.com/login');
        }else if(result.code === 200){
            res.cookie('token',result.data.token).status(result.code).redirect('https://xerocodee-assignment-o79u.onrender.com/dashboard');
        }
        else{
            res.cookie('result', result).status(result.code).redirect('https://xerocodee-assignment-o79u.onrender.com/login');
        }
    }
);

router.get('/auth/github', passport.authenticate('github'));

router.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/' }),
    async(req, res) => {
        console.log(req.user);
        let result = await authController.GithubAuth(req)
        if(result.code === 201){
            res.cookie('token',result.data.token).status(result.code).redirect('https://xerocodee-assignment-o79u.onrender.com/login');
        }else if(result.code === 200){
            res.cookie('token',result.data.token).status(result.code).redirect('https://xerocodee-assignment-o79u.onrender.com/dashboard');
        }
        else{
            res.cookie('result', result).status(result.code).redirect('https://xerocodee-assignment-o79u.onrender.com/login');
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

router.put('/update',verifyToken, async(req,res) => {
    let result = await dbHandler.updateRecord(req);
    res.status(result.code).send(result);
});

router.get('/logout', verifyToken, authController.logout);

router.get('/user-info', verifyToken, async(req,res)=>{
    let result = await authController.getUserInfo(req);
    console.log(result)
    res.status(result.code).send(result);
});

router.get('/getGithubrepos/:username', verifyToken, async(req,res)=>{
    let result = await getRepos(req.params.username);
    res.status(result.code).send(result);

})
module.exports = router;