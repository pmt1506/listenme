import express from "express";
import prisma from "./config/prisma";
import { configDotenv } from "dotenv";
import { accountRouter } from "./routes";

configDotenv();

const app = express();

app.use(express.json());

app.use("/account", accountRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await prisma.$connect();
  console.log(`Server running on http://localhost:${PORT}`);
});
