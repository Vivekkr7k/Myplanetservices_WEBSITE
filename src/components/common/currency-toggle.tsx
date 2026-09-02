import { useCurrency } from '../../lib/currency-context';
import { CURRENCY_LABEL } from '../../lib/locale-pricing';

/**
 * Manual currency override.
 *
 * Detection reads the browser timezone, which a VPN or a trip abroad will get
 * wrong. This is the escape hatch, and the choice is remembered.
 */
export function CurrencyToggle({ className = '' }: { className?: string }) {
  const { currency, setCurrency } = useCurrency();

  return (
    <div
      role="group"
      aria-label="Display currency"
      className={`inline-flex items-center gap-0.5 p-0.5 rounded-full bg-secondary border border-border ${className}`}
    >
      {(['INR', 'USD'] as const).map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => setCurrency(c)}
          aria-pressed={currency === c}
          className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
            currency === c
              ? 'bg-butter text-butter-foreground font-semibold'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {CURRENCY_LABEL[c]}
        </button>
      ))}
    </div>
  );
}

export default CurrencyToggle;
