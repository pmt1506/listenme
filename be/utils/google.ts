import { configDotenv } from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import {
  createAccountFromGoogle,
  findAccountByEmail,
} from "../services/account";

configDotenv();

// passport config
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email)
          return done(new Error("Email not provided by Google"), false);

        let account = await findAccountByEmail(email).catch(() => null);

        if (!account) {
          account = await createAccountFromGoogle({
            username: `user-${profile.id}`,
            email: email,
            displayName: profile.displayName,
            avatar: profile.photos?.[0].value || "",
          });
        }

        done(null, {
          id: account.id,
          username: account.username,
        });
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
