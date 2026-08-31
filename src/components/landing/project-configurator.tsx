import { useMemo, useState } from 'react';
import { Calculator, Check, ArrowRight, ChevronDown, Clock, Plus, Gift } from 'lucide-react';
import { toast } from 'sonner';
import {
  SERVICE_PRICING,
  SCALE_TIERS,
  BUNDLED_PERKS,
  calculateEstimate,
  formatINR,
  currentQuarterLabel,
  nextKickoffDate,
  qualifiesForBundle,
} from '../../lib/service-pricing';
import { setQuoteDraft } from '../../lib/quote-draft';

const defaultAddonsFor = (serviceId: string) =>
  SERVICE_PRICING.find((s) => s.id === serviceId)
    ?.addons.filter((a) => a.recommended)
    .map((a) => a.id) ?? [];

export function ProjectConfigurator() {
  const [serviceId, setServiceId] = useState('ecommerce');
  const [tierId, setTierId] = useState('growth');
  const [addonIds, setAddonIds] = useState<string[]>(() => defaultAddonsFor('ecommerce'));

  const service = SERVICE_PRICING.find((s) => s.id === serviceId) ?? SERVICE_PRICING[0];
  const tier = SCALE_TIERS.find((t) => t.id === tierId) ?? SCALE_TIERS[1];

  const estimate = useMemo(
    () => calculateEstimate(service, tier, addonIds),
    [service, tier, addonIds]
  );

  const quarter = useMemo(() => currentQuarterLabel(), []);
  const kickoff = useMemo(() => nextKickoffDate(), []);

  const handleServiceChange = (id: string) => {
    setServiceId(id);
    // Add-ons are service-specific — carry over the new service's recommended set.
    setAddonIds(defaultAddonsFor(id));
  };

  const toggleAddon = (id: string) => {
    setAddonIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleGetQuote = () => {
    const chosen = service.addons
      .filter((a) => addonIds.includes(a.id))
      .map((a) => a.label);

    const message = [
      `Estimate request — ${service.title} (${tier.label} scale)`,
      chosen.length ? `Add-ons: ${chosen.join(', ')}` : 'Add-ons: core scope only',
      `Estimated range: ${formatINR(estimate.low)} – ${formatINR(estimate.high)}${
        estimate.recurring ? ' per month' : ''
      }`,
      `Timeline: ${estimate.weeksLabel} · earliest kickoff ${kickoff}`,
      ...(qualifiesForBundle(service)
        ? [`Included free: ${BUNDLED_PERKS.map((p) => p.label).join(' + ')}`]
        : []),
      '',
      'My goals for this project: ',
    ].join('\n');

    setQuoteDraft({ serviceId: service.id, message });

    toast.success('Estimate ready', {
      description: 'Your scope is filled into the brief below — add your details to get a fixed quote.',
    });

    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative rounded-[32px] sm:rounded-[36px] bg-card border border-border p-6 sm:p-8 shadow-float text-foreground overflow-hidden">
      {/* Ambient warm glow */}
      <div
        className="absolute -top-24 -right-24 w-64 h-64 bg-butter/30 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Header */}
      <div className="relative flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pb-5 mb-6 border-b border-border">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-semibold text-butter-foreground uppercase tracking-wider mb-1">
            <Calculator className="w-3.5 h-3.5 shrink-0" />
            <span>Instant Estimate</span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-medium text-foreground tracking-tight">
            Build your scope
          </h3>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-600/30 text-emerald-700 text-[11px] sm:text-xs font-medium shrink-0 whitespace-nowrap">
          {quarter} slots open
        </span>
      </div>

      {/* 1. Service */}
      <div className="relative mb-5">
        <label
          htmlFor="estimator-service"
          className="text-xs font-medium text-muted-foreground block mb-2"
        >
          1. What are you building?
        </label>
        <div className="relative">
          <select
            id="estimator-service"
            value={serviceId}
            onChange={(e) => handleServiceChange(e.target.value)}
            className="w-full appearance-none rounded-2xl bg-secondary border border-border px-4 py-3.5 pr-11 text-sm font-medium text-foreground focus:border-butter-foreground/40 focus:outline-hidden transition-colors cursor-pointer"
          >
            {SERVICE_PRICING.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
          <ChevronDown
            className="w-4 h-4 text-muted-foreground absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* 2. Scale */}
      <div className="relative mb-5">
        <label className="text-xs font-medium text-muted-foreground block mb-2">2. Scale</label>
        <div className="grid grid-cols-3 gap-2 p-1 rounded-2xl bg-secondary border border-border">
          {SCALE_TIERS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTierId(t.id)}
              aria-pressed={tierId === t.id}
              className={`py-2.5 px-2 rounded-xl text-xs font-medium transition-all text-center cursor-pointer ${
                tierId === t.id
                  ? 'bg-butter text-butter-foreground font-semibold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-card'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground mt-2">{tier.note}</p>
      </div>

      {/* 3. Add-ons */}
      <div className="relative mb-6">
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-medium text-muted-foreground">3. Add-ons</label>
          <span className="text-[11px] text-butter-foreground font-semibold">
            {addonIds.length} selected
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {service.addons.map((addon) => {
            const isSelected = addonIds.includes(addon.id);
            return (
              <button
                key={addon.id}
                type="button"
                onClick={() => toggleAddon(addon.id)}
                aria-pressed={isSelected}
                className={`px-3 py-2.5 rounded-2xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                  isSelected
                    ? 'bg-butter/45 border-butter shadow-xs'
                    : 'bg-secondary/60 border-border hover:border-foreground/25'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 ${
                    isSelected
                      ? 'bg-butter text-butter-foreground'
                      : 'bg-card border border-border text-muted-foreground'
                  }`}
                >
                  {isSelected ? (
                    <Check className="w-3 h-3 stroke-[3]" />
                  ) : (
                    <Plus className="w-3 h-3 stroke-[3]" />
                  )}
                </div>
                <span
                  className={`text-[11px] sm:text-xs font-medium leading-tight flex-1 min-w-0 ${
                    isSelected ? 'text-foreground' : 'text-foreground/75'
                  }`}
                >
                  {addon.label}
                </span>
                <span
                  className={`text-[11px] font-mono font-medium shrink-0 ${
                    isSelected ? 'text-butter-foreground' : 'text-muted-foreground'
                  }`}
                >
                  +{formatINR(addon.price)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bundled year-one cover */}
      {qualifiesForBundle(service) && (
        <div className="relative rounded-2xl bg-butter/30 border border-butter px-4 py-3 flex items-center gap-3 mb-5">
          <div className="w-7 h-7 rounded-lg bg-butter-foreground text-butter flex items-center justify-center shrink-0">
            <Gift className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-semibold text-butter-foreground leading-tight">
              Free with this build
            </div>
            <div className="text-[11px] text-foreground/70 leading-snug">
              {BUNDLED_PERKS.map((p) => p.label).join(' · ')}
            </div>
          </div>
        </div>
      )}

      {/* Live total */}
      <div className="relative pt-5 border-t border-border flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">
            Estimated investment
          </div>
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="font-display text-2xl sm:text-3xl font-semibold text-foreground tabular-nums">
              {formatINR(estimate.low)}
            </span>
            <span className="text-muted-foreground text-lg">–</span>
            <span className="font-display text-2xl sm:text-3xl font-semibold text-foreground tabular-nums">
              {formatINR(estimate.high)}
            </span>
            {estimate.recurring && (
              <span className="text-xs text-muted-foreground font-medium">/month</span>
            )}
          </div>
          <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1.5">
            <Clock className="w-3 h-3 shrink-0" />
            <span>
              {estimate.weeksLabel} · kickoff from {kickoff} · excl. GST
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGetQuote}
          className="bg-ink text-ink-foreground hover:bg-butter hover:text-butter-foreground px-6 py-3.5 rounded-full text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 hover:scale-[1.03] active:scale-[0.98] transition-all shadow-soft cursor-pointer shrink-0"
        >
          <span>Get this quote</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
