const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./dbconnection')
require('dotenv').config();

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy({
  clientID: process.env.clientID,
  clientSecret: process.env.clientSecret,
  callbackURL: "auth/google/callback",
  passReqToCallback: true
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const query = {googleId: profile.id}
      const collection = db.collection('users')

      let user = await collection.findOne(query);
      if(!user){
        user = {
          googleId: profile.id,
          displayName: profile.displayName,
          email: profile.emails[0].value
        }
        await collection.insertOne(user);
      }
      
      
    } catch(e) {
      console.log(e)
      done(e, null);
    }
  }
))

console.log('passport initialized')

