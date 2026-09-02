import { SERVICE_PRICING } from './service-pricing';

/**
 * Options for every "which service?" dropdown on the site.
 *
 * Built from SERVICE_PRICING so a form can never drift from the pricing page.
 * Labels stay plain: a price beside every option makes the list heavy to scan,
 * and a brief form is where someone says what they want, not what it costs.
 */

/** Value used when nothing in the catalogue fits. */
export const CUSTOM_SERVICE_ID = 'custom';

export interface ServiceOption {
  id: string;
  label: string;
  /** Entry price in INR; absent for the custom option. */
  startsAt?: number;
  unit?: string;
}

/** Disciplines we price, plus a few we quote but don't list a rate for. */
const UNPRICED_EXTRAS: ServiceOption[] = [
  { id: 'website', label: 'Website Development' },
  { id: 'marketing', label: 'Digital Marketing & Growth' },
];

export const SERVICE_OPTIONS: ServiceOption[] = [
  ...SERVICE_PRICING.map((s) => ({
    id: s.id,
    label: s.title,
    startsAt: s.startsAt,
    unit: s.unit,
  })),
  ...UNPRICED_EXTRAS,
  { id: CUSTOM_SERVICE_ID, label: 'Other / Custom service' },
];
