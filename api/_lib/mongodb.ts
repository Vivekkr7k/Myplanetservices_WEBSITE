import { MongoClient, Db, Collection, ObjectId } from 'mongodb';

/**
 * MongoDB Serverless Connection Manager
 *
 * Uses the global singleton pattern recommended for Vercel / Next.js serverless functions.
 * In development and warm serverless containers, caches the client promise so that subsequent
 * invocations reuse the established connection pool without exceeding Atlas limits.
 */

const uri = process.env.MONGODB_URI?.trim();
const dbName = process.env.MONGODB_DB_NAME?.trim() || 'myplanet_admin';

interface GlobalMongo {
  _mongoClientPromise?: Promise<MongoClient>;
}

const globalWithMongo = global as typeof globalThis & GlobalMongo;

let clientPromise: Promise<MongoClient> | null = null;

if (uri) {
  if (process.env.NODE_ENV === 'development') {
    if (!globalWithMongo._mongoClientPromise) {
      const client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
      });
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    // In production container lifecycle
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    clientPromise = client.connect();
  }
}

/** Check if MONGODB_URI is provided in environment */
export function isMongoConfigured(): boolean {
  return Boolean(process.env.MONGODB_URI && process.env.MONGODB_URI.trim().length > 0);
}

/** Get connected MongoDB Database instance (returns null if unconfigured or unreachable) */
export async function getDb(): Promise<Db | null> {
  const currentUri = process.env.MONGODB_URI?.trim();
  if (!currentUri) return null;

  // If clientPromise was not initialized (e.g. env var added after initial module load), initialize it now
  if (!clientPromise) {
    const client = new MongoClient(currentUri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    clientPromise = client.connect();
    if (process.env.NODE_ENV === 'development') {
      globalWithMongo._mongoClientPromise = clientPromise;
    }
  }

  try {
    const client = await clientPromise;
    return client.db(dbName);
  } catch (err) {
    console.error('[MongoDB] Connection error:', err);
    // Reset so subsequent attempts can retry if connection parameters changed
    clientPromise = null;
    if (globalWithMongo._mongoClientPromise) {
      delete globalWithMongo._mongoClientPromise;
    }
    return null;
  }
}

/** Inquiries Collection Type */
export interface InquiryDoc {
  _id?: ObjectId;
  id?: string;
  type: 'brief' | 'lead' | 'booking';
  name?: string;
  email: string;
  company?: string;
  service?: string;
  budget?: string;
  message?: string;
  slot?: string;
  source?: string;
  pageUrl?: string;
  region?: string;
  timeZone?: string;
  currency?: string;
  quote?: Record<string, unknown>;
  teamEmailStatus?: string;
  clientEmailStatus?: string;
  resendId?: string;
  status: 'new' | 'contacted' | 'converted' | 'archived';
  createdAt: string;
  updatedAt: string;
}

/** Client Record Collection Type */
export interface ClientRecordDoc {
  _id?: ObjectId;
  id: string;
  clientName: string;
  companyName: string;
  email: string;
  phone: string;
  status: 'active' | 'onboarding' | 'completed' | 'paused';
  services: string[];
  engagementType: 'fixed' | 'retainer';
  currency: 'USD' | 'INR';
  projectStartDate?: string;
  projectEndDate?: string;
  totalQuoted?: number;
  advancePaid?: number;
  advancePaidDate?: string;
  currentPhase?: string;
  milestones?: Array<{
    id: string;
    title: string;
    amount: number;
    dueDate: string;
    status: 'completed' | 'in_progress' | 'pending';
  }>;
  monthlyFee?: number;
  durationMonths?: number;
  startDate?: string;
  renewalDate?: string;
  advanceDepositPaid?: number;
  billingCycleDay?: number;
  monthsCompleted?: number;
  documents: Array<{
    id: string;
    title: string;
    type: 'quotation' | 'contract' | 'sow' | 'invoice';
    dateAdded: string;
    fileSize?: string;
    fileUrl?: string;
    notes?: string;
  }>;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export async function getInquiriesCollection(): Promise<Collection<InquiryDoc> | null> {
  const db = await getDb();
  if (!db) return null;
  return db.collection<InquiryDoc>('inquiries');
}

export async function getClientsCollection(): Promise<Collection<ClientRecordDoc> | null> {
  const db = await getDb();
  if (!db) return null;
  return db.collection<ClientRecordDoc>('client_records');
}

/**
 * Persists any website form submission (brief, lead, booking) into MongoDB inquiries collection.
 * Designed to never throw or block outbound user confirmation emails.
 */
export async function saveInquiryToMongo(payload: {
  type: 'brief' | 'lead' | 'booking';
  name?: string;
  email: string;
  company?: string;
  service?: string;
  budget?: string;
  message?: string;
  slot?: string;
  source?: string;
  pageUrl?: string;
  region?: string;
  timeZone?: string;
  currency?: string;
  quote?: Record<string, unknown>;
  teamEmailStatus?: string;
  clientEmailStatus?: string;
  resendId?: string;
}): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const col = await getInquiriesCollection();
    if (!col) {
      return { success: false, error: 'MongoDB is not configured' };
    }

    const now = new Date().toISOString();
    const doc: InquiryDoc = {
      id: `inq-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      type: payload.type,
      name: payload.name || '',
      email: payload.email,
      company: payload.company || '',
      service: payload.service || '',
      budget: payload.budget || '',
      message: payload.message || '',
      slot: payload.slot || '',
      source: payload.source || 'Website',
      pageUrl: payload.pageUrl || '',
      region: payload.region || '',
      timeZone: payload.timeZone || '',
      currency: payload.currency || '',
      quote: payload.quote,
      teamEmailStatus: payload.teamEmailStatus || 'Pending',
      clientEmailStatus: payload.clientEmailStatus || 'Not applicable',
      resendId: payload.resendId || '',
      status: 'new',
      createdAt: now,
      updatedAt: now,
    };

    const res = await col.insertOne(doc);
    return { success: true, id: doc.id || res.insertedId.toString() };
  } catch (err: any) {
    console.error('[MongoDB] Failed to save inquiry to database:', err);
    return { success: false, error: err?.message || 'Database write error' };
  }
}

/** Check health and connectivity of MongoDB backend */
export async function checkMongoHealth(): Promise<{
  configured: boolean;
  connected: boolean;
  dbName: string;
  latencyMs?: number;
  clientsCount?: number;
  inquiriesCount?: number;
  error?: string;
}> {
  if (!isMongoConfigured()) {
    return {
      configured: false,
      connected: false,
      dbName,
      error: 'MONGODB_URI environment variable is not configured',
    };
  }

  const start = Date.now();
  try {
    const db = await getDb();
    if (!db) {
      return {
        configured: true,
        connected: false,
        dbName,
        error: 'Failed to obtain database handle',
      };
    }

    // Ping the admin or current database
    await db.command({ ping: 1 });
    const latencyMs = Date.now() - start;

    const clientsCol = db.collection('client_records');
    const inquiriesCol = db.collection('inquiries');

    const [clientsCount, inquiriesCount] = await Promise.all([
      clientsCol.countDocuments().catch(() => 0),
      inquiriesCol.countDocuments().catch(() => 0),
    ]);

    return {
      configured: true,
      connected: true,
      dbName,
      latencyMs,
      clientsCount,
      inquiriesCount,
    };
  } catch (err: any) {
    return {
      configured: true,
      connected: false,
      dbName,
      error: err?.message || 'Connection ping failed',
    };
  }
}
