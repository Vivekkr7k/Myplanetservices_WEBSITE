import { getClientsCollection, isMongoConfigured, ClientRecordDoc } from './_lib/mongodb';

interface ApiRequest {
  method?: string;
  headers?: Record<string, string | string[] | undefined>;
  body?: any;
  query?: Record<string, string>;
  url?: string;
}

interface ApiResponse {
  status: (code: number) => ApiResponse;
  json: (data: any) => ApiResponse;
  setHeader: (k: string, v: string) => ApiResponse;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Content-Type', 'application/json');

  const method = req.method?.toUpperCase() || 'GET';

  // Check if MongoDB is configured
  if (!isMongoConfigured()) {
    if (method === 'GET') {
      return res.status(200).json({
        success: true,
        configured: false,
        source: 'local_storage_fallback',
        message: 'MongoDB is not configured. Set MONGODB_URI to persist client records in cloud database.',
        data: [],
      });
    }
    return res.status(200).json({
      success: false,
      configured: false,
      error: 'MongoDB is not configured. Add MONGODB_URI to your environment variables.',
    });
  }

  const collection = await getClientsCollection();
  if (!collection) {
    return res.status(500).json({
      success: false,
      configured: true,
      error: 'Failed to connect to MongoDB client_records collection',
    });
  }

  try {
    // -------------------------------------------------------------
    // GET: List all client records
    // -------------------------------------------------------------
    if (method === 'GET') {
      const docs = await collection
        .find({})
        .sort({ updatedAt: -1, createdAt: -1 })
        .toArray();

      // Normalize documents: strip MongoDB internal _id or convert to string id
      const normalized = docs.map(({ _id, ...rest }) => ({
        ...rest,
        id: rest.id || _id?.toString(),
      }));

      return res.status(200).json({
        success: true,
        configured: true,
        source: 'mongodb',
        count: normalized.length,
        data: normalized,
      });
    }

    // -------------------------------------------------------------
    // POST / PUT / PATCH: Upsert client record or bulk seed
    // -------------------------------------------------------------
    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
      const body = req.body || {};
      const action = req.query?.action || body.action;

      // Handle bulk seeding of demo records
      if (action === 'seed') {
        const seedData: ClientRecordDoc[] = Array.isArray(body.clients) ? body.clients : [];
        if (!seedData.length) {
          return res.status(400).json({
            success: false,
            error: 'No seed clients provided in body.clients',
          });
        }

        let insertedCount = 0;
        let updatedCount = 0;

        for (const item of seedData) {
          if (!item.id) continue;
          const { _id, ...cleanDoc } = item;
          const result = await collection.updateOne(
            { id: item.id },
            { $set: cleanDoc },
            { upsert: true }
          );
          if (result.upsertedCount > 0) insertedCount++;
          else if (result.modifiedCount > 0) updatedCount++;
        }

        return res.status(200).json({
          success: true,
          action: 'seed',
          insertedCount,
          updatedCount,
          totalSeed: seedData.length,
        });
      }

      // Handle single client record upsert
      const client = body.client || body;
      if (!client || typeof client !== 'object') {
        return res.status(400).json({
          success: false,
          error: 'Invalid client record payload',
        });
      }

      const now = new Date().toISOString();
      const id = client.id || `cli-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

      const { _id, ...docWithoutMongoId } = client;
      const recordToSave: ClientRecordDoc = {
        ...docWithoutMongoId,
        id,
        updatedAt: now,
        createdAt: client.createdAt || now,
      };

      await collection.updateOne(
        { id },
        { $set: recordToSave },
        { upsert: true }
      );

      return res.status(200).json({
        success: true,
        configured: true,
        source: 'mongodb',
        data: recordToSave,
      });
    }

    // -------------------------------------------------------------
    // DELETE: Remove client record
    // -------------------------------------------------------------
    if (method === 'DELETE') {
      const id = req.query?.id || req.body?.id;
      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'Missing client id for deletion',
        });
      }

      const result = await collection.deleteOne({ id });
      return res.status(200).json({
        success: true,
        configured: true,
        deletedId: id,
        deletedCount: result.deletedCount,
      });
    }

    return res.status(405).json({
      success: false,
      error: `Method ${method} Not Allowed`,
    });
  } catch (err: any) {
    console.error('[API /api/clients] Error processing request:', err);
    return res.status(500).json({
      success: false,
      error: err?.message || 'Internal server error processing client record',
    });
  }
}
