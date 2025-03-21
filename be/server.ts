import express from "express";
import cookieParser from "cookie-parser";
import { configDotenv } from "dotenv";
import accountRouter from "./routes/account";
import userRouter from "./routes/user";
import authRouter from "./routes/auth";
import playlistRouter from "./routes/playlist";
import googleAuthRouter from "./routes/googleAuth";
import spotifyAuthRouter from "./routes/spotifyAuth";
import spotifyPublicRouter from "./routes/spotifyPublic";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import "./utils/google";
import "./utils/spotify";
import { setupSwagger } from "./utils/swagger";

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

setupSwagger(app);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/auth/google", googleAuthRouter);
app.use("/auth/spotify", spotifyAuthRouter); // Use the Spotify routes

// Spotify routes
app.use("/spotify/public", spotifyPublicRouter);

app.use("/account", accountRouter);
app.use("/user", userRouter);
app.use('/playlist', playlistRouter)

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
