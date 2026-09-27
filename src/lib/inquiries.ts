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

export const DEMO_INQUIRIES: InquiryRecord[] = [];

export function getLocalInquiries(): InquiryRecord[] {
  try {
    const raw = localStorage.getItem(INQUIRIES_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Strip any mock demo items that may have been cached previously in localStorage
    const clean = parsed.filter((item: InquiryRecord) => !item.id?.startsWith('inq-demo-'));
    if (clean.length !== parsed.length) {
      localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(clean));
    }
    return clean;
  } catch {
    return [];
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
      if (body.data.length > 0) {
        // If MongoDB is connected and has records, cache them locally as well
        saveLocalInquiries(body.data);
        return {
          configured: true,
          source: 'mongodb',
          count: body.data.length,
          data: body.data,
        };
      } else {
        // Connected to MongoDB, but collection is empty! Seed with demo inquiries
        await seedInquiriesToBackendAsync(DEMO_INQUIRIES);
        saveLocalInquiries(DEMO_INQUIRIES);
        return {
          configured: true,
          source: 'mongodb',
          count: DEMO_INQUIRIES.length,
          data: DEMO_INQUIRIES,
        };
      }
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

/**
 * Updates any field(s) of an inquiry record and persists to MongoDB.
 */
export async function updateInquiryRecord(
  id: string,
  updates: Partial<InquiryRecord>
): Promise<boolean> {
  const local = getLocalInquiries();
  const index = local.findIndex((i) => i.id === id);
  const now = new Date().toISOString();
  if (index >= 0) {
    local[index] = {
      ...local[index],
      ...updates,
      updatedAt: now,
    };
    saveLocalInquiries(local);
  }

  try {
    const res = await fetch(`/api/inquiries?id=${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates }),
    });
    return res.ok;
  } catch (err) {
    console.warn('[Inquiries] Backend patch failed, local cache updated:', err);
    return true;
  }
}

/**
 * Seeds inquiries to backend MongoDB collection.
 */
export async function seedInquiriesToBackendAsync(inquiries: InquiryRecord[]): Promise<boolean> {
  try {
    const res = await fetch('/api/inquiries?action=seed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'seed', inquiries }),
    });
    return res.ok;
  } catch (err) {
    console.warn('[Inquiries] Failed to seed inquiries to MongoDB:', err);
    return false;
  }
}

/**
 * Saves a single inquiry to backend MongoDB collection.
 */
export async function saveInquiryAsync(inquiry: Partial<InquiryRecord>): Promise<{
  success: boolean;
  persistedToMongo: boolean;
  data: InquiryRecord;
}> {
  const now = new Date().toISOString();
  const id = inquiry.id || `inq-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const record: InquiryRecord = {
    id,
    type: inquiry.type || 'lead',
    name: inquiry.name || '',
    email: inquiry.email || '',
    company: inquiry.company || '',
    service: inquiry.service || '',
    budget: inquiry.budget || '',
    message: inquiry.message || '',
    slot: inquiry.slot || '',
    source: inquiry.source || 'Admin Lead Entry',
    pageUrl: inquiry.pageUrl || (typeof window !== 'undefined' ? window.location.href : ''),
    region: inquiry.region || 'Global',
    timeZone: inquiry.timeZone || (typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC'),
    currency: inquiry.currency || 'USD',
    status: inquiry.status || 'new',
    notes: inquiry.notes || '',
    createdAt: inquiry.createdAt || now,
    updatedAt: now,
  };

  const local = getLocalInquiries();
  const updated = [record, ...local.filter((i) => i.id !== id)];
  saveLocalInquiries(updated);

  try {
    const res = await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inquiry: record }),
    });
    if (res.ok) {
      const result = await res.json();
      return {
        success: true,
        persistedToMongo: Boolean(result.configured),
        data: result.data || record,
      };
    }
  } catch (err) {
    console.warn('[Inquiries] Failed to persist inquiry to backend API:', err);
  }
  return {
    success: true,
    persistedToMongo: false,
    data: record,
  };
}
