export type InquiryType = 'brief' | 'lead' | 'booking';
export type InquiryStatus = 'new' | 'contacted' | 'converted' | 'archived';

export interface InquiryRecord {
  id: string;
  type: InquiryType;
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
  quote?: {
    total?: number;
    timeline?: string;
    bundled?: string[];
    [key: string]: any;
  };
  teamEmailStatus?: string;
  clientEmailStatus?: string;
  resendId?: string;
  status: InquiryStatus;
  notes?: string;
  convertedClientId?: string;
  createdAt: string;
  updatedAt: string;
}

const INQUIRIES_STORAGE_KEY = 'mps_inquiries_cache_v1';

export const DEMO_INQUIRIES: InquiryRecord[] = [
  {
    id: 'inq-demo-01',
    type: 'brief',
    name: 'Aarav Mehta',
    email: 'aarav@finflow.sg',
    company: 'FinFlow Global (Singapore)',
    service: 'AI Agents & Copilots, Custom Web Applications',
    budget: '$15,000 – $30,000',
    message: 'We are seeking an engineering squad to architect an autonomous financial reconciliation copilot with bank-grade audit logs and sub-second anomaly detection.',
    source: 'Project Brief Modal',
    pageUrl: 'https://myplanetservices.com/#contact',
    region: 'APAC',
    timeZone: 'Asia/Singapore',
    currency: 'USD',
    quote: {
      total: 24500,
      timeline: '8-10 Weeks',
      bundled: ['AI Copilot Core', 'Multi-tenant Dashboard', 'Real-time WebSocket Alerts'],
    },
    teamEmailStatus: 'Sent',
    clientEmailStatus: 'Sent',
    status: 'new',
    notes: 'High priority enterprise prospect. Booked initial discovery review.',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'inq-demo-02',
    type: 'booking',
    name: 'Sarah Jenkins',
    email: 'sarah.j@luminahealth.co',
    company: 'Lumina Health Technologies',
    service: 'Mobile App Development',
    slot: 'Tomorrow, 4:30 PM (IST) / 7:00 AM (EST)',
    message: 'Need React Native + Swift health metrics telemetry app syncing with wearable devices.',
    source: 'Discovery Call Scheduler',
    pageUrl: 'https://myplanetservices.com/#book-call',
    region: 'US-East',
    timeZone: 'America/New_York',
    currency: 'USD',
    teamEmailStatus: 'Sent',
    clientEmailStatus: 'Sent',
    status: 'contacted',
    notes: 'Calendar invite confirmed. Discovery deck sent.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: 'inq-demo-03',
    type: 'lead',
    email: 'marcus@nordicsynth.io',
    source: 'Homepage Instant Estimate Bar',
    pageUrl: 'https://myplanetservices.com/',
    region: 'EU-North',
    timeZone: 'Europe/Stockholm',
    currency: 'USD',
    teamEmailStatus: 'Sent',
    clientEmailStatus: 'Sent',
    status: 'new',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), // 18 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
  },
  {
    id: 'inq-demo-04',
    type: 'brief',
    name: 'Devendra Patel',
    email: 'd.patel@omnicloud.in',
    company: 'OmniCloud Logistics',
    service: 'Cloud & Multi-Tenant SaaS',
    budget: '₹12,00,000 – ₹18,00,000',
    message: 'Fleet dispatch route optimization portal with GPS live tracking across 400+ hubs.',
    source: 'Interactive Estimate Calculator',
    pageUrl: 'https://myplanetservices.com/pricing',
    region: 'IN-West',
    timeZone: 'Asia/Kolkata',
    currency: 'INR',
    quote: {
      total: 1450000,
      timeline: '12 Weeks',
      bundled: ['Route Engine', 'Driver PWA', 'Fleet Dispatch Telemetry'],
    },
    teamEmailStatus: 'Sent',
    clientEmailStatus: 'Sent',
    status: 'converted',
    notes: 'Converted to active client record (ARiqA / OmniCloud).',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

export function getLocalInquiries(): InquiryRecord[] {
  try {
    const raw = localStorage.getItem(INQUIRIES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(DEMO_INQUIRIES));
      return DEMO_INQUIRIES;
    }
    return JSON.parse(raw);
  } catch {
    return DEMO_INQUIRIES;
  }
}

export function saveLocalInquiries(inquiries: InquiryRecord[]): void {
  try {
    localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(inquiries));
  } catch (err) {
    console.error('Failed to cache inquiries locally:', err);
  }
}

/**
 * Fetches inquiries from `/api/inquiries`.
 * Gracefully falls back to local cache if offline or unconfigured.
 */
export async function fetchInquiries(filter?: {
  type?: string;
  status?: string;
}): Promise<{
  configured: boolean;
  source: 'mongodb' | 'cache' | 'demo';
  count: number;
  data: InquiryRecord[];
}> {
  try {
    const params = new URLSearchParams();
    if (filter?.type && filter.type !== 'all') params.append('type', filter.type);
    if (filter?.status && filter.status !== 'all') params.append('status', filter.status);

    const res = await fetch(`/api/inquiries?${params.toString()}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const body = await res.json();

    if (body.configured && Array.isArray(body.data)) {
      // If MongoDB is connected and has records, cache them locally as well
      saveLocalInquiries(body.data);
      return {
        configured: true,
        source: 'mongodb',
        count: body.data.length,
        data: body.data,
      };
    }

    // Unconfigured or empty
    const local = getLocalInquiries();
    let filtered = local;
    if (filter?.type && filter.type !== 'all') {
      filtered = filtered.filter((i) => i.type === filter.type);
    }
    if (filter?.status && filter.status !== 'all') {
      filtered = filtered.filter((i) => i.status === filter.status);
    }

    return {
      configured: Boolean(body.configured),
      source: body.configured ? 'mongodb' : 'demo',
      count: filtered.length,
      data: filtered,
    };
  } catch (err) {
    console.warn('[Inquiries] Network fetch failed, falling back to local storage cache:', err);
    const local = getLocalInquiries();
    return {
      configured: false,
      source: 'cache',
      count: local.length,
      data: local,
    };
  }
}

/**
 * Updates status, notes, or converted client link of an inquiry.
 */
export async function updateInquiryStatus(
  id: string,
  status: InquiryStatus,
  notes?: string,
  convertedClientId?: string
): Promise<boolean> {
  // Update local cache immediately
  const local = getLocalInquiries();
  const index = local.findIndex((i) => i.id === id);
  const now = new Date().toISOString();
  if (index >= 0) {
    local[index] = {
      ...local[index],
      status,
      ...(notes !== undefined ? { notes } : {}),
      ...(convertedClientId ? { convertedClientId } : {}),
      updatedAt: now,
    };
    saveLocalInquiries(local);
  }

  // Attempt backend API sync
  try {
    const res = await fetch(`/api/inquiries?id=${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, notes, convertedClientId }),
    });
    return res.ok;
  } catch (err) {
    console.warn('[Inquiries] Backend patch failed, local cache updated:', err);
    return true;
  }
}

/**
 * Deletes an inquiry by ID.
 */
export async function deleteInquiry(id: string): Promise<boolean> {
  const local = getLocalInquiries();
  const updated = local.filter((i) => i.id !== id);
  saveLocalInquiries(updated);

  try {
    const res = await fetch(`/api/inquiries?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (err) {
    console.warn('[Inquiries] Backend delete failed, local cache removed:', err);
    return true;
  }
}
