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

  // Find all inquiries
  const allBefore = await col.find({}, { projection: { id: 1, name: 1, email: 1 } }).toArray();
  console.log('Total inquiries before cleanup:', allBefore.length);
  console.log('Found records:', allBefore);

  const res = await col.deleteMany({ id: { $regex: '^inq-demo-' } });
  console.log(`Successfully deleted ${res.deletedCount} demo inquiries from MongoDB.`);

  const remaining = await col.countDocuments();
  console.log('Remaining inquiries in MongoDB collection:', remaining);

  await client.close();
  process.exit(0);
}

main().catch((err) => {
  console.error('Failed to clean demo inquiries:', err);
  process.exit(1);
});
