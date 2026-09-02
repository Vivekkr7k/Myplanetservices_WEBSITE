/**
 * Carries a configured estimate from the home page estimator into the contact
 * intake form, so a visitor never has to retype the scope they just built.
 *
 * Deliberately event-based rather than a context provider: the two components
 * are siblings under different sections and neither owns the other's state.
 */

import type { QuoteSnapshot } from './send-email';

export interface QuoteDraft {
  /** Matches the `value` of the contact form's discipline <select>. */
  serviceId: string;
  /** Pre-written project brief describing the configured scope. */
  message: string;
  /**
   * The same configuration as structured data. The prose is for the visitor to
   * read and edit; this is what the notification email renders as a table, so
   * the team gets clean fields even if the visitor rewrites the message.
   */
  quote?: QuoteSnapshot;
}

const STORAGE_KEY = 'mps:quote-draft';
export const QUOTE_DRAFT_EVENT = 'mps:quote-draft';

export function setQuoteDraft(draft: QuoteDraft) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // Private mode / storage disabled — the event below still delivers it.
  }
  window.dispatchEvent(new CustomEvent<QuoteDraft>(QUOTE_DRAFT_EVENT, { detail: draft }));
}

export function getQuoteDraft(): QuoteDraft | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as QuoteDraft) : null;
  } catch {
    return null;
  }
}

export function clearQuoteDraft() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to clear.
  }
}
