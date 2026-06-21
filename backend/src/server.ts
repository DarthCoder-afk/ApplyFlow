import 'dotenv/config';
import app from './app';
import { env } from './config/env';
import { prisma } from './config/database';

const port = env.port;

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

async function shutdown() {
  console.log('Shutting down...');
  server.close();
  await prisma.$disconnect();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
