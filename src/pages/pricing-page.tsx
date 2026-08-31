import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  Sparkles,
  ArrowRight,
  Shield,
  Calculator,
  Layers,
  Clock,
  Plus,
  Gift,
  IndianRupee,
} from 'lucide-react';
import {
  SERVICE_PRICING,
  BUNDLED_PERKS,
  formatINR,
  qualifiesForBundle,
} from '../lib/service-pricing';

const PLANS = [
  {
    name: 'Launch Sprint',
    model: 'Fixed Sprint Scope',
    cadence: 'Milestone-based delivery',
    description:
      'For founders validating an idea with a sharp, high-converting marketing site or landing system.',
    features: [
      'Up to 6 custom designed pages',
      'Sub-second Core Web Vitals 95+ guarantee',
      'SEO foundations, OpenGraph & analytics setup',
      'Headless CMS handover + video training',
      'Free 1 year hosting + maintenance',
    ],
    featured: false,
    cta: 'Get Launch Proposal',
  },
  {
    name: 'Scale Platform',
    model: 'Monthly Dedicated Squad',
    cadence: 'Dedicated engineering pod',
    description:
      'A dedicated senior squad building your core software and compounding growth engine in parallel.',
    features: [
      'Full web or mobile application engineering',
      'Custom AI automation & RAG agent workflows',
      'SEO, AEO & GEO entity visibility program',
      'Weekly Friday live staging demos & Loom videos',
      'Direct shared Slack channel with senior squad',
      'Priority ticket response (under 2 hours)',
    ],
    featured: true,
    badge: 'Most Picked',
    cta: 'Reserve a Squad',
  },
  {
    name: 'Enterprise Engine',
    model: 'Custom Architecture Pod',
    cadence: 'Tailored enterprise scope',
    description:
      'Multi-team delivery, compliance requirements (SOC2/HIPAA), and legacy cloud modernization.',
    features: [
      'Dedicated multi-disciplinary pod (4+ engineers)',
      'SOC2, HIPAA & enterprise security audits',
      'Cloud infrastructure & SRE architecture (AWS/GCP)',
      'Quarterly executive roadmap planning',
      '24/7 critical uptime SLA guarantee',
    ],
    featured: false,
    cta: 'Contact Enterprise Team',
  },
];

const ADDONS = [
  { id: 'ai', name: 'Custom AI Agent / RAG Knowledge Pipeline', tag: 'AI Swarm' },
  { id: 'mobile', name: 'Native-feel Mobile App (iOS & Android)', tag: 'Cross-Platform' },
  { id: 'geo', name: 'AEO & Generative AI Citation Schema Sprint', tag: 'Search & LLM' },
  { id: 'sla', name: '24/7 Dedicated SRE & Incident SLA', tag: 'Enterprise SLA' },
];

const COMPARISON_MATRIX = [
  { feature: 'Dedicated Senior Engineers', launch: '1 Lead', scale: 'Full Squad (2–3)', enterprise: 'Multi-Pod (4+)' },
  { feature: 'Free Hosting + Maintenance', launch: '1 Year Included', scale: '1 Year Included', enterprise: '1 Year + Uptime SLA' },
  { feature: 'Weekly Friday Staging Demos', launch: 'Yes', scale: 'Yes', enterprise: 'Yes' },
  { feature: 'Core Web Vitals 95+ Guarantee', launch: 'Yes', scale: 'Yes', enterprise: 'Yes' },
  { feature: 'Full SaaS / App Backend', launch: '—', scale: 'Included', enterprise: 'Included' },
  { feature: 'Custom AI Agents & RAG', launch: '—', scale: 'Included', enterprise: 'Custom Enterprise' },
  { feature: 'SEO, AEO & GEO Program', launch: 'Foundations', scale: 'Comprehensive', enterprise: 'Enterprise Global' },
  { feature: 'Direct Shared Slack Channel', launch: 'Email/Loom', scale: 'Real-Time Slack', enterprise: 'Dedicated Slack + Phone' },
  { feature: 'Turnaround Sprint Velocity', launch: '2–3 weeks', scale: 'Ongoing 2-wk sprints', enterprise: 'Custom roadmap' },
  { feature: 'SOC2 / HIPAA Compliance', launch: '—', scale: 'Available add-on', enterprise: 'Included' },
  { feature: '100% IP Transfer & Repos', launch: 'Yes', scale: 'Yes', enterprise: 'Yes' },
];

export function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState('Scale');
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['ai']);

  const toggleAddon = (id: string) => {
    if (selectedAddons.includes(id)) {
      setSelectedAddons(selectedAddons.filter((a) => a !== id));
    } else {
      setSelectedAddons([...selectedAddons, id]);
    }
  };

  return (
    <div className="pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pt-36 lg:pb-32 overflow-hidden">
      {/* Aurora Glow */}
      <div
        className="aurora absolute inset-x-0 -top-24 h-[620px] opacity-90 blur-[2px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="site-container-narrow">
        {/* Header */}
        <div className="max-w-3xl text-left mb-16">
          <div className="bg-butter text-butter-foreground rounded-full px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] inline-flex items-center gap-2 shadow-sm mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Investment & Tiers</span>
          </div>
          <h1 className="font-display text-display-xl font-medium text-foreground mb-6">
            Structured engagements. <br />
            Predictable outcomes.
          </h1>
          <p className="text-[16px] sm:text-[18px] leading-relaxed text-muted-foreground max-w-2xl">
            No hidden fees, surprise hourly invoices, or bloated agency overhead. You get fixed-scope sprint deliverables or a dedicated product squad.
          </p>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch mb-24">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-[32px] p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 relative text-left ${
                plan.featured
                  ? 'bg-ink text-ink-foreground border border-white/10 shadow-float'
                  : 'bg-card text-foreground border border-border shadow-sm hover:shadow-soft'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-8 bg-butter text-butter-foreground text-[11px] font-semibold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  <span>{plan.badge}</span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-2xl font-medium tracking-tight">
                    {plan.name}
                  </h2>
                </div>

                <div className="mb-6">
                  <div
                    className={`font-display text-2xl sm:text-3xl font-semibold tracking-tight ${
                      plan.featured ? 'text-butter' : 'text-foreground'
                    }`}
                  >
                    {plan.model}
                  </div>
                  <span
                    className={`text-xs inline-block mt-1 font-medium ${
                      plan.featured ? 'text-ink-muted' : 'text-muted-foreground'
                    }`}
                  >
                    {plan.cadence}
                  </span>
                </div>

                <p
                  className={`text-sm leading-relaxed mb-8 ${
                    plan.featured ? 'text-ink-muted' : 'text-muted-foreground'
                  }`}
                >
                  {plan.description}
                </p>

                {/* Features */}
                <div
                  className={`pt-6 border-t flex flex-col gap-3 mb-8 ${
                    plan.featured ? 'border-white/10' : 'border-border/60'
                  }`}
                >
                  {plan.features.map((feat) => (
                    <div
                      key={feat}
                      className="flex items-start gap-2.5 text-xs sm:text-sm font-medium"
                    >
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          plan.featured
                            ? 'bg-butter/20 text-butter'
                            : 'bg-secondary text-foreground'
                        }`}
                      >
                        <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                to="/contact"
                className={`w-full rounded-full py-4 text-center text-sm font-semibold transition-all duration-200 block ${
                  plan.featured
                    ? 'bg-butter text-butter-foreground hover:scale-[1.02] shadow-sm'
                    : 'bg-primary text-primary-foreground hover:scale-[1.02]'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Per-Service Starting Prices */}
        <div id="service-pricing" className="mb-24 text-left scroll-mt-28">
          <div className="max-w-2xl mb-10">
            <div className="bg-secondary text-foreground rounded-full px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] inline-flex items-center gap-2 border border-border mb-5">
              <IndianRupee className="w-3.5 h-3.5" />
              <span>Starting Prices by Service</span>
            </div>
            <h2 className="font-display text-display-md font-medium text-foreground mb-3">
              What each service starts at.
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Entry pricing for the smallest production-ready scope of every discipline we ship — each one including a free year of hosting and maintenance. Final quotes scale with feature depth, integrations and team size, confirmed in writing before a single line of code.
            </p>
          </div>

          {/* Bundled free with every build */}
          <div className="rounded-3xl bg-ink text-ink-foreground p-6 sm:p-8 border border-white/5 shadow-float mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">
              <div className="lg:w-64 shrink-0">
                <div className="inline-flex items-center gap-2 bg-butter text-butter-foreground rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] mb-3">
                  <Gift className="w-3 h-3" />
                  <span>Included Free</span>
                </div>
                <h3 className="font-display text-xl font-medium tracking-tight text-ink-foreground leading-snug">
                  Every build below ships with its first year covered.
                </h3>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 flex-1">
                {BUNDLED_PERKS.map((perk) => {
                  const PerkIcon = perk.icon;
                  return (
                    <div
                      key={perk.id}
                      className="bg-ink-soft rounded-2xl p-5 border border-white/10 flex items-start gap-3.5"
                    >
                      <div className="w-9 h-9 rounded-xl bg-butter/20 text-butter flex items-center justify-center shrink-0">
                        <PerkIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-display text-sm font-medium text-ink-foreground mb-1">
                          {perk.label}
                        </div>
                        <p className="text-xs text-ink-muted leading-relaxed">{perk.detail}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
            {SERVICE_PRICING.map((service) => {
              const ServiceIcon = service.icon;
              return (
                <div
                  key={service.id}
                  className={`rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-soft group relative ${
                    service.popular
                      ? 'bg-card border-2 border-butter shadow-sm'
                      : 'bg-card border border-border shadow-xs'
                  }`}
                >
                  {service.popular && (
                    <div className="absolute -top-3 left-7 bg-butter text-butter-foreground text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" />
                      <span>Most Requested</span>
                    </div>
                  )}

                  <div>
                    <div className="flex items-start justify-between gap-3 mb-5">
                      <div className="w-11 h-11 rounded-2xl bg-secondary text-foreground flex items-center justify-center shrink-0 group-hover:bg-butter group-hover:text-butter-foreground transition-colors">
                        <ServiceIcon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground text-right leading-snug pt-1">
                        {service.category}
                      </span>
                    </div>

                    <h3 className="font-display text-lg font-medium tracking-tight text-foreground mb-2 leading-snug">
                      {service.title}
                    </h3>

                    {/* Price */}
                    <div className="mb-4">
                      <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5">
                        Starts from
                      </div>
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className="font-display text-3xl font-semibold tracking-tight text-foreground">
                          {formatINR(service.startsAt)}
                        </span>
                        <span className="text-xs font-medium text-muted-foreground">
                          {service.unit}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed mb-5">
                      {service.summary}
                    </p>

                    {/* Included */}
                    <div className="pt-5 border-t border-border/60 flex flex-col gap-2.5 mb-5">
                      {service.includes.map((item) => (
                        <div
                          key={item}
                          className="flex items-start gap-2.5 text-xs font-medium text-foreground/90"
                        >
                          <div className="w-4 h-4 rounded-full bg-butter/30 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-2.5 h-2.5 text-butter-foreground stroke-[3]" />
                          </div>
                          <span>{item}</span>
                        </div>
                      ))}
                      <div className="flex items-start gap-2.5 text-xs font-semibold text-butter-foreground">
                        <div className="w-4 h-4 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                          <Plus className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span>{service.extra}</span>
                      </div>
                    </div>

                    {/* Bundled year-one cover */}
                    {qualifiesForBundle(service) && (
                      <div className="rounded-2xl bg-butter/15 border border-butter/40 px-3.5 py-2.5 flex items-center gap-2.5 mb-5">
                        <Gift className="w-3.5 h-3.5 text-butter-foreground shrink-0" />
                        <span className="text-[11px] font-semibold text-butter-foreground leading-snug">
                          Free 1 year hosting + maintenance
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-4 border-t border-border/60">
                    <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{service.timeline}</span>
                    </span>
                    <Link
                      to={`/services?tab=${service.id}`}
                      className="text-xs font-semibold text-foreground flex items-center gap-1.5 hover:text-butter-foreground transition-colors"
                    >
                      <span>See scope</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pricing footnote */}
          <div className="mt-6 rounded-3xl bg-secondary border border-border p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
              All amounts are in INR and exclusive of GST, third-party licences and cloud usage. Starting prices assume a single-brand scope; multi-region, compliance (SOC2 / HIPAA) and multi-team engagements are quoted separately. Free hosting and maintenance run for 12 months from launch and apply to one-time builds — renewal afterwards is optional and billed at cost.
            </p>
            <Link
              to="/contact"
              className="bg-ink text-ink-foreground rounded-full px-6 py-3 text-xs font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shrink-0"
            >
              <span>Get an exact quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Interactive Scope Estimator */}
        <div className="rounded-[28px] sm:rounded-[32px] bg-ink text-ink-foreground p-5 sm:p-8 lg:p-14 text-left border border-white/5 shadow-float mb-16 sm:mb-24">
          <div className="max-w-2xl mb-8 sm:mb-10">
            <div className="text-xs uppercase tracking-wider text-butter font-semibold mb-3 flex items-center gap-2">
              <Calculator className="w-4 h-4 shrink-0" />
              <span>Scope & Add-on Estimator</span>
            </div>
            <h2 className="font-display text-display-md font-medium text-ink-foreground mb-4">
              Customize your squad scope in real-time.
            </h2>
            <p className="text-sm text-ink-muted leading-relaxed">
              Select your foundation tier and layer on specialized modules to see estimated investment.
            </p>
          </div>

          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-10 items-start">
            {/* Left Options */}
            <div>
              <div className="text-xs uppercase tracking-wider text-ink-muted font-semibold mb-3">
                1. Select Foundation Tier
              </div>
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-8">
                {['Launch', 'Scale', 'Enterprise'].map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setSelectedPlan(tier)}
                    className={`py-2.5 sm:py-3 px-1.5 sm:px-4 rounded-xl sm:rounded-2xl text-[11px] sm:text-sm font-medium leading-tight border cursor-pointer transition-colors ${
                      selectedPlan === tier
                        ? 'bg-butter text-butter-foreground border-butter shadow-xs font-semibold'
                        : 'bg-ink-soft text-ink-foreground border-white/10 hover:border-white/20'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>

              <div className="text-xs uppercase tracking-wider text-ink-muted font-semibold mb-3">
                2. Optional Specialized Add-Ons
              </div>
              <div className="flex flex-col gap-3">
                {ADDONS.map((addon) => {
                  const isChecked = selectedAddons.includes(addon.id);
                  return (
                    <button
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-3.5 sm:p-4 rounded-2xl border flex items-start gap-3 text-left cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-ink-soft border-butter/50 text-ink-foreground'
                          : 'bg-ink-soft/50 border-white/5 text-ink-muted hover:border-white/10'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                          isChecked ? 'bg-butter text-butter-foreground' : 'border border-white/20'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      {/* Tag drops below the label on a phone instead of
                          competing with it for the same line. */}
                      <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-3">
                        <span className="text-[13px] sm:text-sm font-medium text-ink-foreground leading-snug">
                          {addon.name}
                        </span>
                        <span className="text-[10px] sm:text-xs font-mono font-medium text-butter bg-butter/10 px-2 sm:px-2.5 py-0.5 rounded-full shrink-0 self-start sm:self-auto whitespace-nowrap">
                          {addon.tag}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Summary */}
            <div className="bg-ink-soft rounded-3xl p-5 sm:p-8 border border-white/10">
              <h3 className="font-display text-xl font-medium text-ink-foreground mb-4">
                Configured Squad Blueprint
              </h3>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-3 py-3 border-b border-white/5 text-sm">
                <span className="text-ink-muted">Selected Model</span>
                <span className="font-semibold text-butter sm:text-right">
                  {selectedPlan === 'Launch' ? 'Fixed Sprint Scope' : selectedPlan === 'Scale' ? 'Monthly Dedicated Squad' : 'Custom Enterprise Pod'}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-3 py-3 border-b border-white/5 text-sm">
                <span className="text-ink-muted">Specialized Modules</span>
                <span className="font-semibold text-ink-foreground sm:text-right">
                  {selectedAddons.length === 0 ? 'Core Foundation Only' : `${selectedAddons.length} Selected`}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-3 py-3 border-b border-white/5 text-sm">
                <span className="text-ink-muted">Cadence & Review</span>
                <span className="font-semibold text-ink-foreground sm:text-right">
                  Weekly Friday Builds
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-3 py-3 border-b border-white/5 text-sm mb-8">
                <span className="text-ink-muted">IP Ownership</span>
                <span className="font-semibold text-emerald-400 sm:text-right">
                  100% Repository Transfer
                </span>
              </div>

              <Link
                to="/contact"
                className="w-full bg-butter text-butter-foreground rounded-full px-5 py-4 text-[13px] sm:text-sm font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
              >
                {/* Full sentence needs ~250px; a 375px phone leaves ~200px
                    inside this pill, so the short form keeps it on one line. */}
                <span className="sm:hidden">Request a proposal</span>
                <span className="hidden sm:inline">Request formal proposal for this scope</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </Link>
            </div>
          </div>
        </div>

        {/* Feature Comparison Matrix */}
        <div className="mb-24 text-left">
          <div className="max-w-2xl mb-10">
            <h2 className="font-display text-display-md font-medium text-foreground mb-3">
              Detailed Feature Matrix
            </h2>
            <p className="text-sm text-muted-foreground">
              Compare deliverables across each plan tier with zero ambiguity.
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[640px]">
                <thead>
                  <tr className="border-b border-border bg-secondary/40">
                    <th className="p-5 font-display text-sm font-medium text-foreground w-2/5">
                      Feature & Capability
                    </th>
                    <th className="p-5 font-display text-sm font-medium text-foreground w-1/5">
                      Launch
                    </th>
                    <th className="p-5 font-display text-sm font-medium text-butter-foreground bg-butter/20 w-1/5">
                      Scale (Featured)
                    </th>
                    <th className="p-5 font-display text-sm font-medium text-foreground w-1/5">
                      Enterprise
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-xs sm:text-sm">
                  {COMPARISON_MATRIX.map((row) => (
                    <tr key={row.feature} className="hover:bg-secondary/20 transition-colors">
                      <td className="p-5 font-medium text-foreground">
                        {row.feature}
                      </td>
                      <td className="p-5 text-muted-foreground">{row.launch}</td>
                      <td className="p-5 text-foreground bg-butter/5 font-semibold">
                        {row.scale}
                      </td>
                      <td className="p-5 text-foreground">{row.enterprise}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Guarantees Card */}
        <div className="rounded-3xl bg-secondary p-8 sm:p-12 text-left border border-border mb-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-card border border-border flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <h4 className="font-display font-medium text-base text-foreground mb-1">
                  100% IP Ownership
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  All codebases, design tokens, repositories, and domain assets transfer to your accounts.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-card border border-border flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <h4 className="font-display font-medium text-base text-foreground mb-1">
                  No Surprise Invoices
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Every milestone has fixed fees agreed in writing beforehand. Zero hidden billing overages.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-card border border-border flex items-center justify-center shrink-0">
                <Gift className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <h4 className="font-display font-medium text-base text-foreground mb-1">
                  Free First Year
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Hostinger hosting and full maintenance covered for 12 months from launch — patches, monitoring and bug fixes included.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-3xl bg-butter text-butter-foreground p-8 sm:p-12 text-center shadow-soft">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-display text-display-md font-medium mb-4">
              Need a tailored proposal?
            </h2>
            <p className="text-sm text-butter-foreground/80 leading-relaxed mb-8">
              Send us your requirements. We'll evaluate your tech stack and provide a custom fixed proposal within 48 hours.
            </p>
            <Link
              to="/contact"
              className="bg-ink text-ink-foreground rounded-full px-8 py-3.5 text-sm font-semibold hover:scale-105 transition-transform inline-flex items-center gap-2"
            >
              <span>Request custom quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PricingPage;
