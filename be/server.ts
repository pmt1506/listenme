import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await prisma.$connect();
  console.log(`Server running on http://localhost:${PORT}`);
});