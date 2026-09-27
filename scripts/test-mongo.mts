import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { checkMongoHealth } from '../api/_lib/mongodb.ts';

async function main() {
  console.log('Testing MongoDB connection with URI:', process.env.MONGODB_URI ? 'URI is set' : 'URI missing');
  const health = await checkMongoHealth();
  console.log('Health check result:', JSON.stringify(health, null, 2));
  process.exit(0);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
