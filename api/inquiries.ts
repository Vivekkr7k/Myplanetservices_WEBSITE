import { getInquiriesCollection, isMongoConfigured } from './_lib/mongodb.js';

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

  if (!isMongoConfigured()) {
    if (method === 'GET') {
      return res.status(200).json({
        success: true,
        configured: false,
        source: 'unconfigured',
        message: 'MongoDB is not configured yet. Inquiries will automatically save once MONGODB_URI is provided.',
        data: [],
      });
    }
    return res.status(200).json({
      success: false,
      configured: false,
      error: 'MongoDB is not configured.',
    });
  }

  const collection = await getInquiriesCollection();
  if (!collection) {
    if (method === 'GET') {
      return res.status(200).json({
        success: true,
        configured: true,
        source: 'fallback',
        message: 'MongoDB connection is currently unavailable.',
        data: [],
      });
    }
    return res.status(503).json({
      success: false,
      configured: true,
      error: 'Failed to connect to MongoDB inquiries collection',
    });
  }

  try {
    // -------------------------------------------------------------
    // GET: List all inquiries (with optional filter by type or status)
    // -------------------------------------------------------------
    if (method === 'GET') {
      const query: Record<string, any> = {};
      if (req.query?.type && req.query.type !== 'all') {
        query.type = req.query.type;
      }
      if (req.query?.status && req.query.status !== 'all') {
        query.status = req.query.status;
      }

      const docs = await collection
        .find(query)
        .sort({ createdAt: -1 })
        .toArray();

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
    // POST: Create/Upsert inquiry or bulk seed
    // -------------------------------------------------------------
    if (method === 'POST') {
      const body = req.body || {};
      const action = req.query?.action || body.action;

      if (action === 'seed') {
        const seedData: any[] = Array.isArray(body.inquiries) ? body.inquiries : [];
        if (!seedData.length) {
          return res.status(400).json({
            success: false,
            error: 'No seed inquiries provided in body.inquiries',
          });
        }

        let insertedCount = 0;
        let updatedCount = 0;

        for (const item of seedData) {
          if (!item.id && !item.email) continue;
          const { _id, ...cleanDoc } = item;
          const id = cleanDoc.id || `inq-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
          const result = await collection.updateOne(
            { id },
            { $set: { ...cleanDoc, id } },
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

      // Single inquiry upsert
      const inquiry = body.inquiry || body;
      if (!inquiry || typeof inquiry !== 'object' || (!inquiry.email && !inquiry.id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid inquiry payload',
        });
      }

      const now = new Date().toISOString();
      const id = inquiry.id || `inq-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
      const { _id, ...docWithoutMongoId } = inquiry;
      const recordToSave = {
        ...docWithoutMongoId,
        id,
        status: inquiry.status || 'new',
        updatedAt: now,
        createdAt: inquiry.createdAt || now,
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
    // PATCH / PUT: Update status or notes
    // -------------------------------------------------------------
    if (method === 'PATCH' || method === 'PUT') {
      const body = req.body || {};
      const id = req.query?.id || body.id;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'Missing inquiry id to update',
        });
      }

      const updates: Record<string, any> = {
        updatedAt: new Date().toISOString(),
      };

      const updatableFields = [
        'status', 'notes', 'convertedClientId', 'name', 'email', 'company',
        'service', 'budget', 'message', 'slot', 'source', 'currency', 'region', 'timeZone', 'type'
      ];
      for (const field of updatableFields) {
        if (body[field] !== undefined) {
          updates[field] = body[field];
        }
      }

      const result = await collection.updateOne({ id }, { $set: updates });

      return res.status(200).json({
        success: true,
        configured: true,
        updatedId: id,
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
      });
    }

    // -------------------------------------------------------------
    // DELETE: Delete an inquiry
    // -------------------------------------------------------------
    if (method === 'DELETE') {
      const id = req.query?.id || req.body?.id;
      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'Missing inquiry id to delete',
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
    console.error('[API /api/inquiries] Error processing request:', err);
    return res.status(500).json({
      success: false,
      error: err?.message || 'Internal server error processing inquiries',
    });
  }
}
