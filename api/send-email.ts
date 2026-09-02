import { Resend } from 'resend';
import {
  internalBriefEmail,
  internalLeadEmail,
  internalBookingEmail,
  clientBriefReceiptEmail,
  clientBookingReceiptEmail,
  clientLeadWelcomeEmail,
  type BriefData,
  type LeadData,
  type BookingData,
  type QuoteSnapshot,
  serviceLabel,
} from './_lib/email-templates';
import { appendLeadRow, sheetTimestamp, type LeadRow } from './_lib/sheets';

/**
 * Serverless handler for every outbound email the site sends.
 *
 * Two messages go out per submission: a detailed notification to the team, and
 * an acknowledgement to the visitor. The visitor's copy is best-effort — if it
 * fails we still report success, because the lead itself was captured and
 * that's what the visitor actually cares about.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;

/**
 * Fixed sender on the verified myplanetservices.com domain. Do not point this at
 * a visitor's address: sending "from" a domain you don't control is what SPF and
 * DKIM exist to stop, and it lands the mail in spam.
 */
const FROM = process.env.MAIL_FROM || 'My Planet Services <vivek@myplanetservices.com>';

/**
 * Where the team notification lands. The VISITOR-facing copy does not use this —
 * its recipient is whatever address the visitor submitted (see `clientCopy`).
 */
const TEAM_INBOX = process.env.MAIL_TO || 'vivek@myplanetservices.com';

const MAX = { name: 120, email: 200, company: 160, service: 80, budget: 60, message: 5000, slot: 120 };

type Json = Record<string, unknown>;

const str = (v: unknown, max: number): string =>
  typeof v === 'string' ? v.trim().slice(0, max) : '';

/**
 * Rejects anything that isn't a plausible single address. Beyond validity this
 * blocks CR/LF, which is what header-injection attempts rely on when the value
 * is passed through to replyTo.
 */
const isEmail = (v: string): boolean =>
  /^[^\s@<>,;:"'\\]+@[^\s@<>,;:"'\\]+\.[A-Za-z]{2,}$/.test(v) && !/[\r\n]/.test(v);

function parseQuote(raw: unknown): QuoteSnapshot | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const q = raw as Json;
  const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);
  const title = str(q.serviceTitle, 120);
  if (!title) return undefined;
  return {
    serviceTitle: title,
    scale: str(q.scale, 40),
    addons: Array.isArray(q.addons) ? q.addons.slice(0, 12).map((a) => str(a, 120)).filter(Boolean) : [],
    low: num(q.low),
    high: num(q.high),
    recurring: Boolean(q.recurring),
    timeline: str(q.timeline, 80),
    bundled: Array.isArray(q.bundled) ? q.bundled.slice(0, 6).map((b) => str(b, 80)).filter(Boolean) : [],
  };
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  // Fail loudly rather than silently pretending to send.
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set — refusing to send.');
    return res.status(500).json({ error: 'Email service is not configured.' });
  }

  const resend = new Resend(RESEND_API_KEY);

  try {
    const raw: Json =
      typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};

    const type = str(raw.type, 20) || 'brief';
    const source = str(raw.source, 80);
    const pageUrl = str(raw.pageUrl, 300);

    /** Notification to the team, plus an optional acknowledgement to the visitor. */
    let internal: { subject: string; html: string };
    let clientCopy: { to: string; subject: string; html: string } | null = null;
    let replyTo: string | undefined;

    // Collected for the lead sheet; the email branches below fill these in.
    const sheet: Partial<LeadRow> = {
      timestamp: sheetTimestamp(),
      formType: type,
      region: str(raw.region, 12),
      timezone: str(raw.timeZone, 60),
      source: source || 'Website',
      pageUrl,
    };

    if (type === 'lead') {
      const email = str(raw.email, MAX.email);
      if (!isEmail(email)) return res.status(400).json({ error: 'A valid email address is required.' });

      const data: LeadData = { email, source: source || 'Homepage hero', pageUrl };
      sheet.email = email;
      internal = internalLeadEmail(data);
      const c = clientLeadWelcomeEmail(data);
      clientCopy = { to: email, subject: c.subject, html: c.html };
      replyTo = email;
    } else if (type === 'booking') {
      const slot = str(raw.slot, MAX.slot);
      const email = str(raw.email, MAX.email);
      const name = str(raw.name, MAX.name);
      if (!slot) return res.status(400).json({ error: 'A time slot is required.' });

      const data: BookingData = { slot, name, email, source: source || 'Contact page', pageUrl };
      Object.assign(sheet, { name, email, callSlot: slot });
      internal = internalBookingEmail(data);
      if (email && isEmail(email)) {
        const c = clientBookingReceiptEmail(data);
        clientCopy = { to: email, subject: c.subject, html: c.html };
        replyTo = email;
      }
    } else {
      const name = str(raw.name, MAX.name);
      const email = str(raw.email, MAX.email);
      const message = str(raw.message, MAX.message);
      if (!name) return res.status(400).json({ error: 'Name is required.' });
      if (!isEmail(email)) return res.status(400).json({ error: 'A valid email address is required.' });

      const data: BriefData = {
        name,
        email,
        company: str(raw.company, MAX.company),
        service: str(raw.service, MAX.service),
        budget: str(raw.budget, MAX.budget),
        message,
        quote: parseQuote(raw.quote),
        source: source || 'Website',
        pageUrl,
      };

      Object.assign(sheet, {
        name,
        email,
        company: data.company,
        service: serviceLabel(data.service),
        budget: data.budget,
        message,
        estScale: data.quote?.scale ?? '',
        estLow: data.quote?.low ? String(data.quote.low) : '',
        estHigh: data.quote?.high ? String(data.quote.high) : '',
        estCurrency: str(raw.currency, 8),
        estTimeline: data.quote?.timeline ?? '',
        estAddons: data.quote?.addons.join(' · ') ?? '',
        estIncluded: data.quote?.bundled?.join(' · ') ?? '',
      });

      internal = internalBriefEmail(data);
      const c = clientBriefReceiptEmail(data);
      clientCopy = { to: email, subject: c.subject, html: c.html };
      replyTo = email;
    }

    // The team notification is the one that must land.
    const { data: sent, error } = await resend.emails.send({
      from: FROM,
      to: TEAM_INBOX,
      replyTo,
      subject: internal.subject,
      html: internal.html,
    });

    if (error) {
      console.error('Resend error (team notification):', error);
      // Log the attempt before bailing, so a delivery outage still leaves a
      // record of who tried to reach us.
      await appendLeadRow({
        ...(sheet as LeadRow),
        teamEmailStatus: `Failed: ${error.message ?? 'unknown'}`,
        clientEmailStatus: 'Not attempted',
        clientEmailTo: '',
        resendId: '',
      });
      return res.status(502).json({ error: 'Could not deliver your message. Please email us directly.' });
    }

    // Visitor-facing copy. `clientCopy.to` is the address THEY submitted — this is
    // the dynamic recipient; only the sender is fixed.
    let clientEmailStatus = 'Not applicable';
    if (clientCopy) {
      // Best-effort: a failed acknowledgement must not fail the submission.
      try {
        const ack = await resend.emails.send({
          from: FROM,
          to: clientCopy.to,
          replyTo: TEAM_INBOX,
          subject: clientCopy.subject,
          html: clientCopy.html,
        });
        if (ack.error) {
          console.error('Resend error (visitor acknowledgement):', ack.error);
          clientEmailStatus = `Failed: ${ack.error.message ?? 'unknown'}`;
        } else {
          clientEmailStatus = 'Sent';
        }
      } catch (ackErr) {
        console.error('Visitor acknowledgement threw:', ackErr);
        clientEmailStatus = 'Failed: exception';
      }
    }

    // Logged last so the row carries the real outcome of both emails. Awaited,
    // but appendLeadRow swallows its own errors — the response never depends on
    // the spreadsheet being reachable.
    await appendLeadRow({
      ...(sheet as LeadRow),
      teamEmailStatus: 'Sent',
      clientEmailStatus,
      clientEmailTo: clientCopy?.to ?? '',
      resendId: sent?.id ?? '',
    });

    return res.status(200).json({
      success: true,
      id: sent?.id,
      // Lets the form say "confirmation sent to <address>" rather than guessing.
      confirmationSentTo: clientCopy?.to,
    });
  } catch (err: any) {
    console.error('send-email failed:', err);
    return res.status(500).json({ error: 'Something went wrong sending your message.' });
  }
}
