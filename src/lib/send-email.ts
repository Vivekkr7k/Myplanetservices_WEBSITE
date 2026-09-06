import {
  CURRENCY_STORAGE_KEY,
  currencyForRegion,
  detectRegion,
  type Region,
} from './locale-pricing';

/**
 * Client for the /api/send-email endpoint.
 *
 * Every function resolves with { success } rather than throwing, so callers must
 * check the flag. The previous version resolved successfully on failure too,
 * which meant a form could report "brief received" while nothing was sent.
 */

export interface QuoteSnapshot {
  serviceTitle: string;
  scale: string;
  addons: string[];
  low: number;
  high: number;
  recurring: boolean;
  timeline: string;
  bundled?: string[];
}

export interface BriefPayload {
  name: string;
  email: string;
  company?: string;
  service?: string;
  budget?: string;
  message?: string;
  /** Configuration carried over from the instant estimator, when present. */
  quote?: QuoteSnapshot;
  source?: string;
}

export interface LeadPayload {
  email: string;
  source?: string;
}

export interface BookingPayload {
  slot: string;
  name?: string;
  email?: string;
  source?: string;
}

export interface SendResult {
  success: boolean;
  error?: string;
  /** Address the visitor's confirmation was sent to, echoed back by the API. */
  confirmationSentTo?: string;
}

/**
 * Context attached to every submission. Region and timezone are already known
 * client-side and cost nothing to send — in the lead sheet they answer "is this
 * an India or an overseas enquiry?" without anyone having to guess.
 */
function submissionContext() {
  if (typeof window === 'undefined') return {};
  let timeZone = '';
  let region = '';
  let currency = '';
  try {
    timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    region = detectRegion();
    currency = storedCurrency() ?? currencyForRegion(region as Region);
  } catch {
    // Context is a nice-to-have; never let it block a submission.
  }
  return { pageUrl: window.location.href, timeZone, region, currency };
}

/** Mirrors CurrencyProvider: a manual override lasts the session only. */
function storedCurrency(): string | null {
  try {
    const raw = sessionStorage.getItem(CURRENCY_STORAGE_KEY);
    return raw === 'INR' || raw === 'USD' ? raw : null;
  } catch {
    return null;
  }
}

async function post(body: Record<string, unknown>): Promise<SendResult> {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, ...submissionContext() }),
    });

    const data = await response.json().catch(() => ({} as Record<string, unknown>));

    if (!response.ok) {
      return {
        success: false,
        error: (data as { error?: string })?.error || `Request failed (${response.status})`,
      };
    }

    return {
      success: true,
      confirmationSentTo: (data as { confirmationSentTo?: string })?.confirmationSentTo,
    };
  } catch (err) {
    console.error('send-email request failed:', err);
    return { success: false, error: 'Network error — please check your connection.' };
  }
}

/** Full project brief. Sends a team notification plus a receipt to the sender. */
export const sendProjectBrief = (payload: BriefPayload) => post({ type: 'brief', ...payload });

/** Hero email capture. Team notification only — no unsolicited auto-reply. */
export const sendLeadCapture = (payload: LeadPayload) => post({ type: 'lead', ...payload });

/** Discovery call slot request. Notifies the team and acknowledges the visitor. */
export const sendCallRequest = (payload: BookingPayload) => post({ type: 'booking', ...payload });

/** @deprecated Use sendProjectBrief. Kept so existing call sites keep compiling. */
export const sendContactEmail = sendProjectBrief;
export type EmailPayload = BriefPayload;
