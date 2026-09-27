import { checkMongoHealth } from './_lib/mongodb.js';

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

export default async function handler(_req: ApiRequest, res: ApiResponse) {
  res.setHeader('Content-Type', 'application/json');

  try {
    const health = await checkMongoHealth();
    return res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      database: health,
    });
  } catch (err: any) {
    console.error('status check error:', err);
    return res.status(200).json({
      success: false,
      timestamp: new Date().toISOString(),
      database: {
        configured: Boolean(process.env.MONGODB_URI),
        connected: false,
        error: err?.message || 'Database check failed',
      },
    });
  }
}
