import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import * as dns from 'node:dns';
if (typeof process !== 'undefined' && process.platform === 'win32') {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch {}
}
import { MongoClient } from 'mongodb';

async function main() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || 'myplanet_admin';
  if (!uri) {
    console.error('MONGODB_URI not found');
    process.exit(1);
  }

  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });
  await client.connect();
  console.log('Connected to MongoDB Atlas...');
  const db = client.db(dbName);
  const col = db.collection('inquiries');

  const all = await col.find({}).toArray();
  console.log(`Total inquiries found in MongoDB (${dbName}.inquiries):`, all.length);
  console.log('Documents:', JSON.stringify(all, null, 2));

  await client.close();
  process.exit(0);
}

main().catch((err) => {
  console.error('Check failed:', err);
  process.exit(1);
});
