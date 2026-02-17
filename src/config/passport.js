import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { UserModel } from '../models/user.model.js';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
},
async (_, __, profile, done) => {

  let user = await UserModel.findByGoogleId(profile.id);

  if (!user) {
    user = await UserModel.createSocial({
      email: profile.emails[0].value,
      name: profile.displayName,
      google_id: profile.id
    });
  }

  return done(null, user);
}));
