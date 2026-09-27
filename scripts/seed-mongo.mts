import dns from 'node:dns';
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {}

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { MongoClient } from 'mongodb';
import { DEMO_CLIENTS } from '../src/lib/client-records.ts';
import { DEMO_INQUIRIES } from '../src/lib/inquiries.ts';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'myplanet_admin';

if (!uri) {
  console.error('MONGODB_URI is not set in .env.local');
  process.exit(1);
}

async function seed() {
  console.log('Connecting to MongoDB Atlas...');
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000,
  });

  try {
    await client.connect();
    console.log(`Connected successfully! Database: "${dbName}"`);
    const db = client.db(dbName);

    // 1. Client Records Collection
    const clientsCol = db.collection('client_records');
    await clientsCol.createIndex({ id: 1 }, { unique: true });
    await clientsCol.createIndex({ email: 1 });
    await clientsCol.createIndex({ status: 1 });

    let clientsUpserted = 0;
    for (const client of DEMO_CLIENTS) {
      const { id, ...rest } = client;
      await clientsCol.updateOne(
        { id },
        { $set: { id, ...rest } },
        { upsert: true }
      );
      clientsUpserted++;
    }
    console.log(`Seeded ${clientsUpserted} client records.`);

    // 2. Inquiries Collection
    const inquiriesCol = db.collection('inquiries');
    await inquiriesCol.createIndex({ id: 1 }, { unique: true });
    await inquiriesCol.createIndex({ email: 1 });
    await inquiriesCol.createIndex({ status: 1 });
    await inquiriesCol.createIndex({ type: 1 });
    await inquiriesCol.createIndex({ createdAt: -1 });

    let inqUpserted = 0;
    for (const inq of DEMO_INQUIRIES) {
      const { id, ...rest } = inq;
      await inquiriesCol.updateOne(
        { id },
        { $set: { id, ...rest } },
        { upsert: true }
      );
      inqUpserted++;
    }
    console.log(`Seeded ${inqUpserted} inquiries/leads.`);

    // Verification
    const finalClientsCount = await clientsCol.countDocuments();
    const finalInquiriesCount = await inquiriesCol.countDocuments();
    console.log('\n--- MongoDB Verification ---');
    console.log(`Database: ${dbName}`);
    console.log(`Total client_records: ${finalClientsCount}`);
    console.log(`Total inquiries: ${finalInquiriesCount}`);

    const sampleClient = await clientsCol.findOne({}, { projection: { id: 1, companyName: 1, clientName: 1, status: 1 } });
    const sampleInquiry = await inquiriesCol.findOne({}, { projection: { id: 1, type: 1, email: 1, status: 1 } });
    console.log('Sample client record:', sampleClient);
    console.log('Sample inquiry record:', sampleInquiry);
    console.log('\nAtlas MongoDB data setup complete!');
  } finally {
    await client.close();
  }
}

seed().catch((err) => {
  console.error('Error seeding MongoDB:', err);
  process.exit(1);
});
