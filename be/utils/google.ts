import { configDotenv } from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import { findAccountByEmail } from "../services";

configDotenv();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const userData = {
          googleId: profile.id,
          displayName: profile.displayName,
          email: profile.emails?.[0].value,
          avatar: profile.photos?.[0].value,
        };
        const existedAccount = await findAccountByEmail(userData.email!);
        if (existedAccount) {
          done(null, {
            id: profile.id,
            username: existedAccount.username,
          });
        }
      } catch (err) {
        done(err, false);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user: any, done) => {
  done(null, user);
});

export default passport;
