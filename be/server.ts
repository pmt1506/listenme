import express from "express";
import { configDotenv } from "dotenv";
import accountRouter from "./routes/account";
import googleAuthRouter from "./routes/googleAuth";
import spotifyAuthRouter from "./routes/spotifyAuth";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import "./utils/google";
import "./utils/spotify";

configDotenv();

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // set true if HTTPS
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use("/account", accountRouter);
app.use("/auth/google", googleAuthRouter);
app.use("/auth/spotify", spotifyAuthRouter); // Use the Spotify routes

const PORT = process.env.PORT || 9999;
const MONGO_URI = process.env.DATABASE_URL!;

const startApp = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
};

startApp();
