/**
 * Email templates for My Planet Services.
 *
 * Written as table-based HTML with inline styles on purpose: Outlook, Gmail's
 * clipper and most mobile clients strip <style> blocks, flexbox and grid, so
 * anything cleverer than this renders as an unstyled column of text.
 */

const BRAND = {
  butter: '#F6E05E',
  butterInk: '#2B2513',
  ink: '#1F1E1C',
  inkSoft: '#2E2C29',
  cream: '#F7F5EF',
  card: '#FFFFFF',
  border: '#E4E1D8',
  text: '#1F1E1C',
  muted: '#6B6862',
  green: '#0F7B4F',
} as const;

const SITE = 'https://myplanetservices.com';
const TEAM_EMAIL = 'vivek@myplanetservices.com';

/**
 * Everything a visitor types is interpolated into HTML, so it must be escaped.
 * Without this, a submitted message containing markup would render as live HTML
 * (or a working link) inside the inbox of whoever reads the brief.
 */
/**
 * The forms submit discipline IDs ("crm-erp"), not labels. Emails must show the
 * readable name or the team reads slugs in their inbox.
 */
const SERVICE_LABELS: Record<string, string> = {
  ecommerce: 'E-Commerce Development',
  corporate: 'Company & Corporate Websites',
  redesign: 'Website Redesign & Modernization',
  'crm-erp': 'Custom CRM & ERP Systems',
  website: 'Website Development',
  app: 'Mobile App Development',
  ai: 'AI Automation & Agents',
  saas: 'SaaS Product Engineering',
  seo: 'SEO / AEO / GEO Strategy',
  marketing: 'Digital Marketing & Growth',
};

export const serviceLabel = (id?: string): string =>
  (id && SERVICE_LABELS[id]) || id || 'Not specified';

export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Preserves the line breaks a visitor typed, after escaping. */
function escapeMultiline(value: unknown): string {
  return escapeHtml(value).replace(/\r?\n/g, '<br />');
}

/** IST, because the team reads these in India. */
export function formatTimestamp(date = new Date()): string {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  }).format(date) + ' IST';
}

interface LayoutOptions {
  /** Short line above the heading, e.g. "New project brief". */
  eyebrow: string;
  heading: string;
  /** Hidden preview line shown in the inbox list next to the subject. */
  preheader: string;
  body: string;
  footerNote?: string;
}

function layout({ eyebrow, heading, preheader, body, footerNote }: LayoutOptions): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light" />
<title>${escapeHtml(heading)}</title>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.cream};">
  <!-- Inbox preview text, then whitespace so the client doesn't pull body copy in after it -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}${'&#8203;&nbsp;'.repeat(60)}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${BRAND.cream};padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background-color:${BRAND.card};border:1px solid ${BRAND.border};border-radius:16px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background-color:${BRAND.ink};padding:24px 28px;">
              <p style="margin:0 0 6px;font-family:'Courier New',Courier,monospace;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${BRAND.butter};">${escapeHtml(eyebrow)}</p>
              <h1 style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:21px;line-height:1.3;font-weight:600;color:#FFFFFF;">${escapeHtml(heading)}</h1>
            </td>
          </tr>

          <!-- Butter rule -->
          <tr><td style="height:4px;background-color:${BRAND.butter};font-size:0;line-height:0;">&nbsp;</td></tr>

          <!-- Body -->
          <tr>
            <td style="padding:28px;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:${BRAND.text};">
${body}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:18px 28px 24px;border-top:1px solid ${BRAND.border};font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:${BRAND.muted};">
              ${footerNote ? `<p style="margin:0 0 10px;">${footerNote}</p>` : ''}
              <p style="margin:0;">
                <strong style="color:${BRAND.text};">My Planet Services</strong><br />
                <a href="mailto:${TEAM_EMAIL}" style="color:${BRAND.muted};">${TEAM_EMAIL}</a> &nbsp;·&nbsp;
                <a href="${SITE}" style="color:${BRAND.muted};">myplanetservices.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Label/value row for the detail tables. */
function row(label: string, valueHtml: string, opts: { strong?: boolean } = {}): string {
  return `
              <tr>
                <td style="padding:9px 0;vertical-align:top;width:150px;font-size:13px;color:${BRAND.muted};">${escapeHtml(label)}</td>
                <td style="padding:9px 0;vertical-align:top;font-size:14px;color:${BRAND.text};${opts.strong ? 'font-weight:600;' : ''}">${valueHtml}</td>
              </tr>`;
}

function detailTable(rows: string): string {
  return `
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
              ${rows}
            </table>`;
}

function calloutBox(title: string, innerHtml: string, accent = BRAND.butter): string {
  return `
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:20px;background-color:${BRAND.cream};border-left:3px solid ${accent};border-radius:8px;">
              <tr>
                <td style="padding:16px 18px;">
                  <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;color:${BRAND.muted};">${escapeHtml(title)}</p>
                  ${innerHtml}
                </td>
              </tr>
            </table>`;
}

function button(label: string, href: string): string {
  return `
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:24px;">
              <tr>
                <td style="background-color:${BRAND.butter};border-radius:999px;">
                  <a href="${escapeHtml(href)}" style="display:inline-block;padding:13px 26px;font-family:Helvetica,Arial,sans-serif;font-size:14px;font-weight:700;color:${BRAND.butterInk};text-decoration:none;">${escapeHtml(label)}</a>
                </td>
              </tr>
            </table>`;
}

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

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

export interface BriefData {
  name: string;
  email: string;
  company?: string;
  service?: string;
  budget?: string;
  message?: string;
  quote?: QuoteSnapshot;
  /** Which form it came from, e.g. "Contact page". */
  source?: string;
  /** URL the visitor submitted from. */
  pageUrl?: string;
}

export interface LeadData {
  email: string;
  source?: string;
  pageUrl?: string;
}

export interface BookingData {
  slot: string;
  name?: string;
  email?: string;
  source?: string;
  pageUrl?: string;
}

const inr = (n: number) =>
  '₹' + new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n);

function quoteBlock(quote: QuoteSnapshot): string {
  const addons = quote.addons.length
    ? quote.addons.map((a) => `<li style="margin:0 0 4px;">${escapeHtml(a)}</li>`).join('')
    : `<li style="margin:0;">Core scope only</li>`;

  return calloutBox(
    'Estimator configuration',
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    ${row('Service', escapeHtml(quote.serviceTitle), { strong: true })}
                    ${row('Scale', escapeHtml(quote.scale))}
                    ${row('Estimate', `<strong>${inr(quote.low)} – ${inr(quote.high)}</strong>${quote.recurring ? ' per month' : ''}`)}
                    ${row('Timeline', escapeHtml(quote.timeline))}
                    ${row('Add-ons', `<ul style="margin:0;padding-left:18px;font-size:14px;">${addons}</ul>`)}
                    ${quote.bundled?.length ? row('Included free', escapeHtml(quote.bundled.join(' · '))) : ''}
                  </table>`
  );
}

/* -------------------------------------------------------------------------- */
/*                          INTERNAL — TO THE TEAM                            */
/* -------------------------------------------------------------------------- */

export function internalBriefEmail(data: BriefData) {
  const rows = [
    row('Name', escapeHtml(data.name), { strong: true }),
    row('Email', `<a href="mailto:${escapeHtml(data.email)}" style="color:${BRAND.text};">${escapeHtml(data.email)}</a>`),
    data.company ? row('Company', escapeHtml(data.company)) : '',
    row('Discipline', escapeHtml(serviceLabel(data.service)), { strong: true }),
    data.budget ? row('Budget', escapeHtml(data.budget)) : '',
    row('Source', escapeHtml(data.source || 'Website')),
    row('Received', escapeHtml(formatTimestamp())),
  ].join('');

  const body = `
            <p style="margin:0 0 20px;font-size:15px;">
              A new project brief just came in. Reply directly to this email to reach
              <strong>${escapeHtml(data.name)}</strong>.
            </p>
            ${detailTable(rows)}
            ${data.message ? calloutBox('Project brief', `<p style="margin:0;font-size:14px;line-height:1.65;">${escapeMultiline(data.message)}</p>`) : ''}
            ${data.quote ? quoteBlock(data.quote) : ''}
            ${button('Reply to ' + data.name.split(' ')[0], `mailto:${data.email}`)}`;

  return {
    subject: `New project brief — ${data.name}${data.service ? ` · ${serviceLabel(data.service)}` : ''}`,
    html: layout({
      eyebrow: 'Inbound lead',
      heading: 'New project brief received',
      preheader: `${data.name} · ${serviceLabel(data.service)}${data.budget ? ` · ${data.budget}` : ''}`,
      body,
      footerNote: data.pageUrl ? `Submitted from ${escapeHtml(data.pageUrl)}` : undefined,
    }),
  };
}

export function internalLeadEmail(data: LeadData) {
  const body = `
            <p style="margin:0 0 20px;font-size:15px;">
              Someone dropped their email into the hero capture. No brief yet — worth a
              short intro reply while the visit is fresh.
            </p>
            ${detailTable([
              row('Email', `<a href="mailto:${escapeHtml(data.email)}" style="color:${BRAND.text};">${escapeHtml(data.email)}</a>`, { strong: true }),
              row('Source', escapeHtml(data.source || 'Hero capture')),
              row('Received', escapeHtml(formatTimestamp())),
            ].join(''))}
            ${button('Reply now', `mailto:${data.email}`)}`;

  return {
    subject: `New lead — ${data.email}`,
    html: layout({
      eyebrow: 'Quick lead',
      heading: 'New email captured',
      preheader: `${data.email} joined from the homepage hero`,
      body,
      footerNote: data.pageUrl ? `Submitted from ${escapeHtml(data.pageUrl)}` : undefined,
    }),
  };
}

export function internalBookingEmail(data: BookingData) {
  const body = `
            <p style="margin:0 0 20px;font-size:15px;">
              A discovery call slot was requested from the site. <strong>This is a request,
              not a confirmed booking</strong> — send the calendar invite to lock it in.
            </p>
            ${detailTable([
              row('Requested slot', escapeHtml(data.slot), { strong: true }),
              data.name ? row('Name', escapeHtml(data.name)) : '',
              data.email ? row('Email', `<a href="mailto:${escapeHtml(data.email)}" style="color:${BRAND.text};">${escapeHtml(data.email)}</a>`) : '',
              row('Received', escapeHtml(formatTimestamp())),
            ].join(''))}
            ${data.email ? button('Send the invite', `mailto:${data.email}`) : ''}`;

  return {
    subject: `Discovery call requested — ${data.slot}`,
    html: layout({
      eyebrow: 'Call request',
      heading: 'Discovery call slot requested',
      preheader: `${data.slot}${data.email ? ` · ${data.email}` : ''}`,
      body,
      footerNote: data.pageUrl ? `Submitted from ${escapeHtml(data.pageUrl)}` : undefined,
    }),
  };
}

/* -------------------------------------------------------------------------- */
/*                        CLIENT-FACING — AUTO REPLIES                        */
/* -------------------------------------------------------------------------- */

export function clientBriefReceiptEmail(data: BriefData) {
  const firstName = escapeHtml(data.name.split(' ')[0] || 'there');

  const body = `
            <p style="margin:0 0 16px;font-size:16px;">Hi ${firstName},</p>
            <p style="margin:0 0 16px;">
              Thanks for the brief — it landed with me directly, not a shared inbox.
              I read every one personally.
            </p>
            <p style="margin:0 0 20px;">
              <strong>What happens next:</strong> I'll review your requirements and reply
              within one working day with either a scoped proposal or a couple of
              questions if anything needs clarifying first. No sales sequence, no
              chasing — just a straight answer.
            </p>

            ${calloutBox('What you sent us', detailTable([
              data.service ? row('Discipline', escapeHtml(serviceLabel(data.service)), { strong: true }) : '',
              data.company ? row('Company', escapeHtml(data.company)) : '',
              data.budget ? row('Budget', escapeHtml(data.budget)) : '',
              data.message ? row('Your brief', escapeMultiline(data.message)) : '',
            ].join('')))}
            ${data.quote ? quoteBlock(data.quote) : ''}

            <p style="margin:24px 0 0;">
              If anything's changed or you want to add detail, just reply to this email.
            </p>
            <p style="margin:20px 0 0;font-size:15px;">
              — Vivek Kumar<br />
              <span style="color:${BRAND.muted};font-size:13px;">Partner &amp; Technology Lead, My Planet Services</span>
            </p>`;

  return {
    subject: 'We received your project brief — My Planet Services',
    html: layout({
      eyebrow: 'Brief received',
      heading: "Thanks — we've got your brief",
      preheader: "We'll reply within one working day with a scoped response.",
      body,
      footerNote: 'You received this because you submitted a project brief on our website.',
    }),
  };
}

export function clientBookingReceiptEmail(data: BookingData) {
  const firstName = data.name ? escapeHtml(data.name.split(' ')[0]) : 'there';

  const body = `
            <p style="margin:0 0 16px;font-size:16px;">Hi ${firstName},</p>
            <p style="margin:0 0 16px;">
              Thanks for requesting a discovery call. We've noted your preferred slot and
              will confirm it by email shortly with a calendar invite.
            </p>
            ${calloutBox('Requested slot', `<p style="margin:0;font-size:16px;font-weight:600;">${escapeHtml(data.slot)}</p>`)}
            <p style="margin:20px 0 0;">
              The call is 20–30 minutes with an engineer, not a salesperson. Come with
              your goals and constraints; you'll leave with a straight read on scope,
              timeline and cost.
            </p>
            <p style="margin:16px 0 0;">
              If that time no longer works, reply to this email and we'll find another.
            </p>
            <p style="margin:20px 0 0;font-size:15px;">
              — Vivek Kumar<br />
              <span style="color:${BRAND.muted};font-size:13px;">Partner &amp; Technology Lead, My Planet Services</span>
            </p>`;

  return {
    subject: `Discovery call requested — ${data.slot}`,
    html: layout({
      eyebrow: 'Call requested',
      heading: 'We have your call request',
      preheader: `${data.slot} — we'll confirm with a calendar invite shortly.`,
      body,
      footerNote: 'You received this because you requested a call on our website.',
    }),
  };
}

export function clientLeadWelcomeEmail(data: LeadData) {
  const body = `
            <p style="margin:0 0 16px;font-size:16px;">Hi there,</p>
            <p style="margin:0 0 16px;">
              Thanks for getting in touch — your email reached me directly.
            </p>
            <p style="margin:0 0 20px;">
              If you already know what you want to build, reply to this email with a
              line or two about it and I'll come back with a scoped estimate. If you're
              still weighing options, our estimator gives you a real number in about
              thirty seconds — no form wall, no "request a quote" black box.
            </p>

            ${calloutBox('Every build includes', `<p style="margin:0;font-size:14px;line-height:1.7;">
                    1 year of Hostinger hosting<br />
                    1 year of maintenance — patches, monitoring and bug fixes<br />
                    100% code and IP ownership, transferred to you</p>`)}

            ${button('See what your build would cost', `${SITE}/pricing`)}

            <p style="margin:24px 0 0;font-size:15px;">
              — Vivek Kumar<br />
              <span style="color:${BRAND.muted};font-size:13px;">Partner &amp; Technology Lead, My Planet Services</span>
            </p>`;

  return {
    subject: 'Thanks for reaching out — My Planet Services',
    html: layout({
      eyebrow: 'Welcome',
      heading: "Thanks for getting in touch",
      preheader: 'Reply with what you want to build and we will scope it for you.',
      body,
      footerNote: 'You received this because you submitted your email on our website.',
    }),
  };
}
