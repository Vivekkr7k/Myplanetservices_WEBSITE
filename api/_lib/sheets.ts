/**
 * Appends each lead to a Google Sheet via an Apps Script web app.
 *
 * Apps Script rather than the Sheets API on purpose: no service account, no
 * OAuth dance, no googleapis dependency, and the sheet owner can read the code
 * that writes to their own sheet. The trade-off is a public endpoint URL, which
 * is why every request carries a shared token.
 *
 * Logging is ALWAYS best-effort. A lead that emailed successfully but failed to
 * reach the sheet is still a captured lead; a submission must never fail because
 * a spreadsheet was unreachable.
 */

const SHEETS_WEBHOOK_URL = process.env.SHEETS_WEBHOOK_URL;
const SHEETS_WEBHOOK_TOKEN = process.env.SHEETS_WEBHOOK_TOKEN || '';

/** Column order is fixed by the Apps Script; keys here match its HEADERS. */
export interface LeadRow {
  timestamp: string;
  formType: string;
  name: string;
  email: string;
  company: string;
  service: string;
  budget: string;
  message: string;
  callSlot: string;
  estScale: string;
  estLow: string;
  estHigh: string;
  estCurrency: string;
  estTimeline: string;
  estAddons: string;
  estIncluded: string;
  region: string;
  timezone: string;
  source: string;
  pageUrl: string;
  teamEmailStatus: string;
  clientEmailStatus: string;
  clientEmailTo: string;
  resendId: string;
}

export async function appendLeadRow(row: LeadRow): Promise<void> {
  if (!SHEETS_WEBHOOK_URL) return; // Not configured — silently skip.

  try {
    // Apps Script web apps 302 to script.googleusercontent.com; fetch follows it.
    const res = await fetch(SHEETS_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ token: SHEETS_WEBHOOK_TOKEN, row }),
      redirect: 'follow',
    });

    if (!res.ok) {
      console.error('Sheets append failed:', res.status, await res.text().catch(() => ''));
    }
  } catch (err) {
    console.error('Sheets append threw:', err);
  }
}

/** IST timestamp, matching the format used in the notification emails. */
export function sheetTimestamp(date = new Date()): string {
  return (
    new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'medium',
      timeZone: 'Asia/Kolkata',
    }).format(date) + ' IST'
  );
}
