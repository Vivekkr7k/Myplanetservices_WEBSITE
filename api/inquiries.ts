import { getInquiriesCollection, isMongoConfigured } from './_lib/mongodb';

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
    return res.status(500).json({
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

      if (body.status) updates.status = body.status;
      if (body.notes !== undefined) updates.notes = body.notes;
      if (body.convertedClientId) updates.convertedClientId = body.convertedClientId;

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
