export interface ClientDocument {
  id: string;
  title: string;
  type: 'quotation' | 'contract' | 'sow' | 'invoice';
  dateAdded: string;
  fileSize?: string;
  fileUrl?: string;
  notes?: string;
}

export interface Milestone {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  status: 'completed' | 'in_progress' | 'pending';
}

export interface ClientRecord {
  id: string;
  clientName: string;
  companyName: string;
  email: string;
  phone: string;
  status: 'active' | 'onboarding' | 'completed' | 'paused';
  services: string[];
  engagementType: 'fixed' | 'retainer';
  currency: 'USD' | 'INR';

  // --- Fixed / Limited Time Project Fields ---
  projectStartDate?: string;
  projectEndDate?: string;
  totalQuoted?: number;
  advancePaid?: number;
  advancePaidDate?: string;
  currentPhase?: string;
  milestones?: Milestone[];

  // --- Retainer Specific Fields ---
  monthlyFee?: number;
  durationMonths?: number; // e.g. 3, 6, 12, or 0 for ongoing
  startDate?: string;
  renewalDate?: string;
  advanceDepositPaid?: number;
  billingCycleDay?: number; // Day of month, e.g. 1st
  monthsCompleted?: number;

  documents: ClientDocument[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'mps_client_records_v1';

export const DEMO_CLIENTS: ClientRecord[] = [
  {
    id: 'cli-001',
    clientName: 'Vikram Singhania',
    companyName: 'ARiqA Technologies',
    email: 'vikram@ariqa.in',
    phone: '+91 98201 44552',
    status: 'active',
    engagementType: 'retainer',
    currency: 'USD',
    services: ['AI Agents & Copilots', 'Mobile App Development', 'DevOps & Cloud Infrastructure'],
    monthlyFee: 5500,
    durationMonths: 6,
    startDate: '2026-06-01',
    renewalDate: '2026-10-01',
    advanceDepositPaid: 5500,
    billingCycleDay: 1,
    monthsCompleted: 3,
    documents: [
      {
        id: 'doc-001',
        title: 'Quotation Q-2026-081 (Growth Studio Retainer)',
        type: 'quotation',
        dateAdded: '2026-05-28',
        fileSize: '245 KB',
        notes: 'Signed 6-month squad retainer for AR/AI beauty try-on sub-second engine.',
      },
      {
        id: 'doc-002',
        title: 'Master Services Agreement (MSA)',
        type: 'contract',
        dateAdded: '2026-05-30',
        fileSize: '512 KB',
      },
      {
        id: 'doc-003',
        title: 'Sprint Deliverables SOW Phase 1-3',
        type: 'sow',
        dateAdded: '2026-06-05',
        fileSize: '320 KB',
      },
    ],
    notes: 'Key Stakeholder: Vikram. Dedicated squad: Vivek + Mayank + Bishnu. Delivering <50ms real-time face mesh tracking and iOS SDK.',
    createdAt: '2026-05-28T10:00:00.000Z',
    updatedAt: '2026-09-01T09:30:00.000Z',
  },
  {
    id: 'cli-002',
    clientName: 'Rajesh Chawla',
    companyName: 'Wintek Digital Media',
    email: 'r.chawla@wintekdigital.com',
    phone: '+91 98112 88764',
    status: 'active',
    engagementType: 'fixed',
    currency: 'USD',
    services: ['Custom Web Applications', 'Cloud & Multi-Tenant SaaS', 'DevOps & Cloud Infrastructure'],
    projectStartDate: '2026-07-15',
    projectEndDate: '2026-10-30',
    totalQuoted: 18500,
    advancePaid: 9250,
    advancePaidDate: '2026-07-14',
    currentPhase: 'Phase 3: Nationwide Edge WebSocket Kiosk Sync Engine',
    milestones: [
      {
        id: 'ms-01',
        title: 'Sprint 1: Schema architecture & WebSocket protocol spec',
        amount: 4625,
        dueDate: '2026-08-05',
        status: 'completed',
      },
      {
        id: 'ms-02',
        title: 'Sprint 2: Multi-screen layout designer & CMS manager',
        amount: 4625,
        dueDate: '2026-08-30',
        status: 'completed',
      },
      {
        id: 'ms-03',
        title: 'Sprint 3: Offline heartbeat telemetry & Android player daemon',
        amount: 4625,
        dueDate: '2026-09-30',
        status: 'in_progress',
      },
      {
        id: 'ms-04',
        title: 'Sprint 4: 1000+ display load stress test & final handoff',
        amount: 4625,
        dueDate: '2026-10-30',
        status: 'pending',
      },
    ],
    documents: [
      {
        id: 'doc-004',
        title: 'Quotation Q-2026-064 (Digital Signage CMS Architecture)',
        type: 'quotation',
        dateAdded: '2026-07-10',
        fileSize: '290 KB',
        notes: 'Total fixed quote $18,500. 50% upfront cleared.',
      },
      {
        id: 'doc-005',
        title: 'Hardware & Android Kiosk Specification SOW',
        type: 'sow',
        dateAdded: '2026-07-12',
        fileSize: '410 KB',
      },
      {
        id: 'doc-006',
        title: 'Advance Payment Receipt INV-2026-041',
        type: 'invoice',
        dateAdded: '2026-07-14',
        fileSize: '180 KB',
      },
    ],
    notes: '50% advance ($9,250) received. Balance of $9,250 due on milestone 3 & 4 sign-off.',
    createdAt: '2026-07-10T12:00:00.000Z',
    updatedAt: '2026-09-02T15:00:00.000Z',
  },
  {
    id: 'cli-003',
    clientName: 'Ananya Deshmukh',
    companyName: 'Fortune India Supplies',
    email: 'ananya@fortune-india.co.in',
    phone: '+91 97410 22339',
    status: 'active',
    engagementType: 'fixed',
    currency: 'INR',
    services: ['E-Commerce Development', 'SEO, AEO & GEO Search Dominance', 'Performance Marketing'],
    projectStartDate: '2026-08-01',
    projectEndDate: '2026-11-15',
    totalQuoted: 1250000,
    advancePaid: 625000,
    advancePaidDate: '2026-07-30',
    currentPhase: 'Phase 2: 500+ Carbon Fiber SKU Catalog & B2B Volume Quoting',
    milestones: [
      {
        id: 'ms-11',
        title: 'Phase 1: Headless Medusa.js & sub-second checkout architecture',
        amount: 400000,
        dueDate: '2026-08-25',
        status: 'completed',
      },
      {
        id: 'ms-12',
        title: 'Phase 2: Custom wholesale quote builder & ERP inventory bridge',
        amount: 450000,
        dueDate: '2026-09-28',
        status: 'in_progress',
      },
      {
        id: 'ms-13',
        title: 'Phase 3: B2B Search schema graph, Google AEO & GTM launch',
        amount: 400000,
        dueDate: '2026-11-15',
        status: 'pending',
      },
    ],
    documents: [
      {
        id: 'doc-007',
        title: 'Quotation Q-2026-077 (B2B Drone Parts E-Commerce)',
        type: 'quotation',
        dateAdded: '2026-07-26',
        fileSize: '315 KB',
        notes: 'Commercial quotation for ₹12,50,000 + GST.',
      },
      {
        id: 'doc-008',
        title: 'Advance Tax Invoice INV-2026-059',
        type: 'invoice',
        dateAdded: '2026-07-30',
        fileSize: '195 KB',
      },
    ],
    notes: 'Advance of ₹6,25,000 received via RTGS. Milestone 2 due Sept 28.',
    createdAt: '2026-07-25T11:00:00.000Z',
    updatedAt: '2026-09-04T16:20:00.000Z',
  },
  {
    id: 'cli-004',
    clientName: 'David Marcus',
    companyName: 'NexoPay FinTech Ltd',
    email: 'd.marcus@nexopay.io',
    phone: '+1 (415) 890-3321',
    status: 'active',
    engagementType: 'retainer',
    currency: 'USD',
    services: ['Custom Web Applications', 'AI Agents & Copilots', 'Cloud & Multi-Tenant SaaS'],
    monthlyFee: 8000,
    durationMonths: 12,
    startDate: '2026-04-01',
    renewalDate: '2026-09-30',
    advanceDepositPaid: 8000,
    billingCycleDay: 1,
    monthsCompleted: 5,
    documents: [
      {
        id: 'doc-009',
        title: 'Quotation Q-2026-049 (Enterprise Engineering Retainer)',
        type: 'quotation',
        dateAdded: '2026-03-25',
        fileSize: '350 KB',
      },
      {
        id: 'doc-010',
        title: 'Enterprise Master Retainer Agreement & SOC2 NDA',
        type: 'contract',
        dateAdded: '2026-03-28',
        fileSize: '620 KB',
      },
    ],
    notes: 'Enterprise dedicated unit. High concurrency financial ledger & automated settlement bots. Monthly invoicing on 1st of every month.',
    createdAt: '2026-03-25T14:00:00.000Z',
    updatedAt: '2026-09-01T08:00:00.000Z',
  },
  {
    id: 'cli-005',
    clientName: 'Sarah Jenkins',
    companyName: 'CloudMorph Systems',
    email: 's.jenkins@cloudmorph.com',
    phone: '+44 20 7946 0912',
    status: 'completed',
    engagementType: 'fixed',
    currency: 'USD',
    services: ['Corporate Websites', 'Website Redesign & Modernization', 'SEO, AEO & GEO Search Dominance'],
    projectStartDate: '2026-05-10',
    projectEndDate: '2026-07-20',
    totalQuoted: 9500,
    advancePaid: 9500,
    advancePaidDate: '2026-05-09',
    currentPhase: 'Project Successfully Completed & Handoff Signed',
    milestones: [
      {
        id: 'ms-21',
        title: 'Sprint 1: Complete luxury redesign & interactive 3D hero',
        amount: 4750,
        dueDate: '2026-06-05',
        status: 'completed',
      },
      {
        id: 'ms-22',
        title: 'Sprint 2: CMS integration & SEO 301 migration with 99 PageSpeed',
        amount: 4750,
        dueDate: '2026-07-20',
        status: 'completed',
      },
    ],
    documents: [
      {
        id: 'doc-011',
        title: 'Quotation Q-2026-033 (Corporate Redesign & SEO)',
        type: 'quotation',
        dateAdded: '2026-05-05',
        fileSize: '210 KB',
      },
      {
        id: 'doc-012',
        title: 'Final Delivery Sign-off & Transfer of IP',
        type: 'contract',
        dateAdded: '2026-07-20',
        fileSize: '340 KB',
      },
    ],
    notes: 'Project 100% finished. Client thrilled with 99 Lighthouse performance. 100% payments settled.',
    createdAt: '2026-05-05T09:00:00.000Z',
    updatedAt: '2026-07-20T18:00:00.000Z',
  },
];

export function getClientRecords(): ClientRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_CLIENTS));
      return DEMO_CLIENTS;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to parse client records from localStorage:', err);
    return DEMO_CLIENTS;
  }
}

export function saveClientRecord(record: ClientRecord): ClientRecord[] {
  const current = getClientRecords();
  const existingIdx = current.findIndex((c) => c.id === record.id);
  let updated: ClientRecord[];

  const now = new Date().toISOString();
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = { ...record, updatedAt: now };
  } else {
    updated = [
      {
        ...record,
        id: record.id || `cli-${Date.now().toString().slice(-4)}`,
        createdAt: now,
        updatedAt: now,
      },
      ...current,
    ];
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save client record:', err);
  }
  return updated;
}

export function deleteClientRecord(id: string): ClientRecord[] {
  const current = getClientRecords();
  const updated = current.filter((c) => c.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to delete client record:', err);
  }
  return updated;
}

export function resetToDemoClients(): ClientRecord[] {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_CLIENTS));
  } catch (err) {
    console.error('Failed to reset demo clients:', err);
  }
  return DEMO_CLIENTS;
}

/**
 * Asynchronously synchronizes client records with the backend MongoDB database.
 * If MongoDB is connected and returns records, updates localStorage and returns them.
 * If MongoDB is connected but collection is empty, seeds the demo clients so it's populated.
 * If MongoDB is not configured or network fails, gracefully falls back to localStorage.
 */
export async function syncClientsWithBackend(): Promise<{
  configured: boolean;
  source: 'mongodb' | 'localStorage';
  clients: ClientRecord[];
}> {
  try {
    const res = await fetch('/api/clients');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (data.configured) {
      if (Array.isArray(data.data) && data.data.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.data));
        return {
          configured: true,
          source: 'mongodb',
          clients: data.data,
        };
      } else if (Array.isArray(data.data) && data.data.length === 0) {
        // Connected to MongoDB, but collection is empty! Seed with demo clients
        await seedClientsToBackendAsync();
        return {
          configured: true,
          source: 'mongodb',
          clients: DEMO_CLIENTS,
        };
      }
    }

    return {
      configured: false,
      source: 'localStorage',
      clients: getClientRecords(),
    };
  } catch (err) {
    console.warn('[Clients] Backend sync failed, using localStorage:', err);
    return {
      configured: false,
      source: 'localStorage',
      clients: getClientRecords(),
    };
  }
}

/**
 * Saves a client record locally and persists it to the backend MongoDB collection.
 */
export async function saveClientRecordAsync(record: ClientRecord): Promise<{
  success: boolean;
  persistedToMongo: boolean;
  data: ClientRecord;
}> {
  const localList = saveClientRecord(record);
  const savedRecord = localList.find((c) => c.id === record.id) || record;

  try {
    const res = await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client: savedRecord }),
    });
    if (res.ok) {
      const result = await res.json();
      return {
        success: true,
        persistedToMongo: Boolean(result.configured),
        data: result.data || savedRecord,
      };
    }
  } catch (err) {
    console.warn('[Clients] Failed to persist to backend API, saved locally:', err);
  }

  return {
    success: true,
    persistedToMongo: false,
    data: savedRecord,
  };
}

/**
 * Deletes a client record locally and removes it from backend MongoDB collection.
 */
export async function deleteClientRecordAsync(id: string): Promise<boolean> {
  deleteClientRecord(id);

  try {
    const res = await fetch(`/api/clients?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (err) {
    console.warn('[Clients] Failed to delete from backend API, removed locally:', err);
    return true;
  }
}

/**
 * Seeds DEMO_CLIENTS to backend MongoDB collection.
 */
export async function seedClientsToBackendAsync(): Promise<boolean> {
  try {
    const res = await fetch('/api/clients?action=seed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'seed', clients: DEMO_CLIENTS }),
    });
    return res.ok;
  } catch (err) {
    console.warn('[Clients] Failed to seed clients to backend:', err);
    return false;
  }
}

