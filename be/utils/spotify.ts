import passport from "passport";
import { Strategy as SpotifyStrategy } from "passport-spotify";
import User from "../models/user";
import { configDotenv } from "dotenv";
configDotenv();

passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      callbackURL: process.env.SPOTIFY_CALLBACK_URI!,
    },
    async (accessToken, refreshToken, expires_in, profile, done) => {
      try {
        const user = await User.findOne({ spotifyId: profile.id });

        if (user) {
          // Case: Spotify account already linked with someone
          return done(null, user);
        }

        // Case: First time linking, update current logged-in user
        // We expect `req.user` to already exist via session/jwt auth
        done(null, {
          spotifyProfile: profile,
          accessToken,
          refreshToken,
          expiresAt: Date.now() + expires_in * 1000,
        });
      } catch (err) {
        done(err as Error);
      }
    }
  )
);
