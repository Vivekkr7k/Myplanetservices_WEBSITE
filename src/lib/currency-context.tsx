import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  CURRENCY_STORAGE_KEY,
  currencyForRegion,
  detectRegion,
  detectTimeZone,
  formatPrice,
  type Currency,
  type Region,
} from './locale-pricing';

interface CurrencyContextValue {
  currency: Currency;
  region: Region;
  timeZone: string;
  /** True when the visitor picked the currency rather than us detecting it. */
  isManual: boolean;
  setCurrency: (next: Currency) => void;
  /** Formats an INR source amount in the active currency. */
  price: (inr: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: 'INR',
  region: 'IN',
  timeZone: 'Asia/Kolkata',
  isManual: false,
  setCurrency: () => {},
  price: (inr) => formatPrice(inr, 'INR'),
});

function readStored(): Currency | null {
  try {
    const raw = localStorage.getItem(CURRENCY_STORAGE_KEY);
    return raw === 'INR' || raw === 'USD' ? raw : null;
  } catch {
    return null;
  }
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  // Detection is synchronous, so the first paint already shows the right
  // currency — no flash of ₹ before switching to $.
  const [region] = useState<Region>(() =>
    typeof window === 'undefined' ? 'IN' : detectRegion()
  );
  const [timeZone] = useState<string>(() =>
    typeof window === 'undefined' ? 'Asia/Kolkata' : detectTimeZone()
  );

  const [stored, setStored] = useState<Currency | null>(() =>
    typeof window === 'undefined' ? null : readStored()
  );

  const currency = stored ?? currencyForRegion(region);

  const setCurrency = useCallback((next: Currency) => {
    setStored(next);
    try {
      localStorage.setItem(CURRENCY_STORAGE_KEY, next);
    } catch {
      // Preference won't persist; the session still honours it.
    }
  }, []);

  useEffect(() => {
    // Keep the document language hint aligned with the pricing region.
    document.documentElement.setAttribute('data-region', region);
  }, [region]);

  const value = useMemo<CurrencyContextValue>(
    () => ({
      currency,
      region,
      timeZone,
      isManual: stored !== null,
      setCurrency,
      price: (inr: number) => formatPrice(inr, currency),
    }),
    [currency, region, timeZone, stored, setCurrency]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
