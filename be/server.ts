import express from "express";
import { configDotenv } from "dotenv";
import accountRouter from "./routes/account";
import mongoose from "mongoose";

configDotenv();

const app = express();

app.use(express.json());
app.use("/account", accountRouter);

const PORT = process.env.PORT || 3000;
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
