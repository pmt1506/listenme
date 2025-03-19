import { Router } from "express";
import passport from "passport";
import User from "../models/user";
import { verifyAccessToken } from "../utils/jwt"; // Your JWT verification function
import { JwtPayload } from "jsonwebtoken";

const router = Router();

// Step 1: Redirect the user to Spotify's authentication page
router.get("/", (req, res, next) => {
  const { accessToken } = req.query;
  if (!accessToken) {
    return res.redirect("/login?error=NoAccessToken");
  }

  // Pass JWT as state to Spotify
  passport.authenticate("spotify", {
    scope: ["user-library-read", "user-read-email"],
    state: accessToken as string, // casting to string if needed
  })(req, res, next);
});

// Step 2: Handle the callback from Spotify
router.get(
  "/callback",
  passport.authenticate("spotify", {
    session: false,
    failureRedirect: "/login",
  }),
  async (req: any, res) => {
    try {
      const { state } = req.query; // state = JWT token
      if (!state) {
        return res.redirect("/login?error=NotLoggedIn");
      }

      const decoded = verifyAccessToken(state as string);

      if (!decoded || typeof decoded === "string" || !("userId" in decoded)) {
        return res.redirect("/login?error=InvalidToken");
      }

      const userId = decoded.userId;

      const user = await User.findById(userId);
      if (!user) return res.redirect("/login?error=UserNotFound");

      // Spotify data from passport strategy
      const { spotifyProfile, accessToken, refreshToken, expiresAt } = req.user;

      // Save tokens to User document
      user.spotify = {
        id: spotifyProfile.id,
        displayName: spotifyProfile.displayName,
        accessToken,
        refreshToken,
        expiresAt,
      };

      await user.save();

      return res.redirect("/dashboard?success=SpotifyConnected");
    } catch (err) {
      console.error(err);
      return res.redirect("/dashboard?error=OAuthFailed");
    }
  }
);

// Logout route to clear session
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

export default router;
