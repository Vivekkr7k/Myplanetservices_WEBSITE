/**
 * Region, currency and timezone detection — without asking permission.
 *
 * Method: `Intl.DateTimeFormat().resolvedOptions().timeZone`, cross-checked
 * against `navigator.language`.
 *
 * Chosen over IP geolocation deliberately. An IP lookup needs a third-party
 * request on every page load, which costs latency, adds a key to manage, adds a
 * failure mode, and sends the visitor's address to someone else. The timezone is
 * already in the browser, resolves synchronously, works offline, and triggers no
 * permission prompt. The Geolocation API is worse still — it shows a scary
 * browser dialog most people decline.
 *
 * Its one weakness is a VPN or a traveller, so `CurrencyProvider` exposes a
 * manual override and remembers it.
 */

export type Region = 'IN' | 'INTL';
export type Currency = 'INR' | 'USD';

/**
 * International pricing is 3× the India rate, then shown in dollars.
 * Change this one number to re-price every international quote.
 */
export const INTERNATIONAL_MULTIPLIER = 3;

/**
 * Internal conversion rate, not a live market rate. Quotes should be stable
 * between page loads and across a sales conversation, so this is deliberately a
 * fixed number you control rather than an FX feed. Review it periodically.
 */
export const INR_PER_USD = 88;

const IN_TIMEZONES = new Set(['Asia/Kolkata', 'Asia/Calcutta']);

/** The visitor's IANA timezone, e.g. "Europe/Berlin". */
export function detectTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';
  } catch {
    return 'Asia/Kolkata';
  }
}

export function detectRegion(): Region {
  try {
    if (IN_TIMEZONES.has(detectTimeZone())) return 'IN';

    // Secondary signal: someone on an Indian locale but travelling still prices
    // in INR, which is the friendlier default of the two mistakes.
    const langs = [
      ...(navigator.languages || []),
      navigator.language || '',
    ].filter(Boolean);
    if (langs.some((l) => /-IN$/i.test(l))) return 'IN';
  } catch {
    // Fall through to the default below.
  }
  return 'INTL';
}

export const currencyForRegion = (region: Region): Currency =>
  region === 'IN' ? 'INR' : 'USD';

/** Dollar amounts land on clean numbers; nobody quotes $511. */
function roundUsd(amount: number): number {
  const step = amount >= 10000 ? 100 : amount >= 1000 ? 50 : 10;
  return Math.round(amount / step) * step;
}

/** INR is the source of truth; every other currency is derived from it. */
export function convertFromInr(inr: number, currency: Currency): number {
  if (currency === 'INR') return inr;
  return roundUsd((inr * INTERNATIONAL_MULTIPLIER) / INR_PER_USD);
}

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

/** Formats an INR source amount in the visitor's currency. */
export function formatPrice(inr: number, currency: Currency): string {
  return currency === 'INR'
    ? inrFormatter.format(inr)
    : usdFormatter.format(convertFromInr(inr, 'USD'));
}

export const CURRENCY_LABEL: Record<Currency, string> = {
  INR: '₹ INR',
  USD: '$ USD',
};

export const CURRENCY_STORAGE_KEY = 'mps:currency';
