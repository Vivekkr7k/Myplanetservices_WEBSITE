/**
 * Verifies automatic currency detection against simulated visitors.
 *
 * Run: npx tsx scripts/test-currency-detection.mts
 *
 * There is no manual override on the contact form any more, so detection has to
 * be correct on its own. This drives the real detectRegion() by swapping the
 * globals it reads — the browser timezone and the locale list — rather than
 * re-implementing the logic, so the test fails if the shipped code changes.
 */

import {
  detectRegion,
  currencyForRegion,
  formatPrice,
  convertFromInr,
  INR_PER_USD,
  INTERNATIONAL_MULTIPLIER,
  type Currency,
} from '../src/lib/locale-pricing.ts';
import { SERVICE_PRICING } from '../src/lib/service-pricing.ts';

interface Visitor {
  label: string;
  timeZone: string;
  languages: string[];
  expect: Currency;
  why: string;
}

const VISITORS: Visitor[] = [
  // --- India: must always be INR -------------------------------------------
  { label: 'Mumbai, English',        timeZone: 'Asia/Kolkata',       languages: ['en-IN', 'en'],  expect: 'INR', why: 'IST timezone' },
  { label: 'Delhi, Hindi',           timeZone: 'Asia/Kolkata',       languages: ['hi-IN', 'en-IN'], expect: 'INR', why: 'IST timezone' },
  { label: 'Old Android (Calcutta)', timeZone: 'Asia/Calcutta',      languages: ['en-IN'],        expect: 'INR', why: 'legacy IANA alias' },
  { label: 'Bengaluru, US English',  timeZone: 'Asia/Kolkata',       languages: ['en-US'],        expect: 'INR', why: 'timezone beats locale' },
  { label: 'Indian abroad (London)', timeZone: 'Europe/London',      languages: ['en-IN', 'en'],  expect: 'INR', why: 'locale fallback' },
  { label: 'Hindi script tag',       timeZone: 'Europe/Berlin',      languages: ['hi-Deva-IN'],   expect: 'INR', why: 'region is 3rd subtag' },

  // --- International: must be USD ------------------------------------------
  { label: 'New York',               timeZone: 'America/New_York',   languages: ['en-US'],        expect: 'USD', why: 'non-IST' },
  { label: 'London',                 timeZone: 'Europe/London',      languages: ['en-GB'],        expect: 'USD', why: 'non-IST' },
  { label: 'Dubai',                  timeZone: 'Asia/Dubai',         languages: ['ar-AE', 'en'],  expect: 'USD', why: 'non-IST' },
  { label: 'Singapore',              timeZone: 'Asia/Singapore',     languages: ['en-SG'],        expect: 'USD', why: 'non-IST' },
  { label: 'Sydney',                 timeZone: 'Australia/Sydney',   languages: ['en-AU'],        expect: 'USD', why: 'non-IST' },
  { label: 'Berlin, German',         timeZone: 'Europe/Berlin',      languages: ['de-DE'],        expect: 'USD', why: 'non-IST' },
  { label: 'Toronto',                timeZone: 'America/Toronto',    languages: ['en-CA', 'fr-CA'], expect: 'USD', why: 'non-IST' },
  { label: 'Nepal (near IST, +5:45)', timeZone: 'Asia/Kathmandu',    languages: ['ne-NP'],        expect: 'USD', why: 'adjacent offset must NOT match' },
  { label: 'Colombo (same +5:30!)',  timeZone: 'Asia/Colombo',       languages: ['si-LK'],        expect: 'USD', why: 'same UTC offset as IST, different country' },

  // --- Degraded environments ------------------------------------------------
  { label: 'No locale reported',     timeZone: 'America/Chicago',    languages: [],               expect: 'USD', why: 'timezone only' },
  { label: 'Bare language, no region', timeZone: 'Europe/Paris',     languages: ['fr'],           expect: 'USD', why: 'no region subtag' },
];

/** Swap the globals detectRegion() reads, run it, then restore. */
function asVisitor<T>(v: Visitor, run: () => T): T {
  const RealDTF = Intl.DateTimeFormat;
  const realNavigator = (globalThis as any).navigator;

  const Fake = function (this: unknown, ...args: unknown[]) {
    const inst = new (RealDTF as any)(...args);
    const realResolved = inst.resolvedOptions.bind(inst);
    inst.resolvedOptions = () => ({
      ...realResolved(),
      timeZone: v.timeZone,
      locale: v.languages[0] ?? 'en-US',
    });
    return inst;
  } as unknown as typeof Intl.DateTimeFormat;
  Object.setPrototypeOf(Fake, RealDTF);
  (Fake as any).supportedLocalesOf = RealDTF.supportedLocalesOf;

  (Intl as any).DateTimeFormat = Fake;
  // Node exposes `navigator` as a getter-only global, so plain assignment
  // throws; redefine the property instead.
  Object.defineProperty(globalThis, 'navigator', {
    value: { language: v.languages[0] ?? '', languages: v.languages },
    configurable: true,
    writable: true,
  });

  try {
    return run();
  } finally {
    (Intl as any).DateTimeFormat = RealDTF;
    Object.defineProperty(globalThis, 'navigator', {
      value: realNavigator,
      configurable: true,
      writable: true,
    });
  }
}

console.log(`\nRate: 1 USD = ₹${INR_PER_USD}   International = ${INTERNATIONAL_MULTIPLIER}× the India price`);
console.log('E-Commerce entry price used as the sample: ₹15,000\n');

const SAMPLE = SERVICE_PRICING.find((s) => s.id === 'ecommerce')!.startsAt;

console.log(
  '  ' +
    'VISITOR'.padEnd(28) +
    'TIMEZONE'.padEnd(22) +
    'LOCALE'.padEnd(14) +
    'GOT'.padEnd(6) +
    'SAMPLE'.padEnd(11) +
    'RESULT'
);
console.log('  ' + '-'.repeat(94));

let failures = 0;
for (const v of VISITORS) {
  const { currency, price } = asVisitor(v, () => {
    const region = detectRegion();
    const currency = currencyForRegion(region);
    return { currency, price: formatPrice(SAMPLE, currency) };
  });

  const ok = currency === v.expect;
  if (!ok) failures++;

  console.log(
    '  ' +
      v.label.padEnd(28) +
      v.timeZone.padEnd(22) +
      (v.languages[0] || '—').padEnd(14) +
      currency.padEnd(6) +
      price.padEnd(11) +
      (ok ? 'pass' : `FAIL (expected ${v.expect})`)
  );
}

// --- conversion arithmetic ---------------------------------------------------
console.log('\n  Price ladder in both currencies');
console.log('  ' + '-'.repeat(58));
console.log('  ' + 'SERVICE'.padEnd(34) + 'INDIA'.padStart(10) + 'INTERNATIONAL'.padStart(14));
for (const s of SERVICE_PRICING) {
  console.log(
    '  ' +
      s.title.slice(0, 33).padEnd(34) +
      formatPrice(s.startsAt, 'INR').padStart(10) +
      formatPrice(s.startsAt, 'USD').padStart(14)
  );
}

// --- invariants --------------------------------------------------------------
console.log('\n  Invariants');
console.log('  ' + '-'.repeat(58));
const checks: [string, boolean][] = [
  ['INR passes through unchanged', convertFromInr(15000, 'INR') === 15000],
  ['USD applies the 3× multiplier', convertFromInr(15000, 'USD') === Math.round((15000 * 3) / INR_PER_USD / 10) * 10],
  ['USD amounts land on clean steps', SERVICE_PRICING.every((s) => convertFromInr(s.startsAt, 'USD') % 10 === 0)],
  ['USD is never more than INR nominal', SERVICE_PRICING.every((s) => convertFromInr(s.startsAt, 'USD') < s.startsAt)],
  ['larger INR always means larger USD', (() => {
    const sorted = [...SERVICE_PRICING].sort((a, b) => a.startsAt - b.startsAt);
    return sorted.every((s, i) => i === 0 || convertFromInr(s.startsAt, 'USD') >= convertFromInr(sorted[i - 1].startsAt, 'USD'));
  })()],
];
for (const [label, pass] of checks) {
  if (!pass) failures++;
  console.log('  ' + label.padEnd(44) + (pass ? 'pass' : 'FAIL'));
}

console.log(
  failures === 0
    ? `\n  All ${VISITORS.length + checks.length} checks passed.\n`
    : `\n  ${failures} check(s) FAILED.\n`
);
process.exit(failures === 0 ? 0 : 1);
