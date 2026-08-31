import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  Sparkles,
  ArrowRight,
  Shield,
  HelpCircle,
  Calculator,
  Layers,
} from 'lucide-react';

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
      '2 weeks post-launch warranty & bug fixes',
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
    <div className="pt-28 pb-20 sm:pt-36 sm:pb-32 overflow-hidden">
      {/* Aurora Glow */}
      <div
        className="aurora absolute inset-x-0 -top-24 h-[620px] opacity-90 blur-[2px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-5">
        {/* Header */}
        <div className="max-w-3xl text-left mb-16">
          <div className="bg-butter text-butter-foreground rounded-full px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] inline-flex items-center gap-2 shadow-sm mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Investment & Tiers</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-medium leading-[1.05] tracking-tight text-foreground mb-6">
            Structured engagements. <br />
            Predictable outcomes.
          </h1>
          <p className="text-[16px] sm:text-[18px] leading-relaxed text-muted-foreground max-w-2xl">
            No hidden fees, surprise hourly invoices, or bloated agency overhead. You get fixed-scope sprint deliverables or a dedicated product squad.
          </p>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-6 items-stretch mb-24">
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

        {/* Interactive Scope Estimator */}
        <div className="rounded-[32px] bg-ink text-ink-foreground p-8 sm:p-14 text-left border border-white/5 shadow-float mb-24">
          <div className="max-w-2xl mb-10">
            <div className="text-xs uppercase tracking-wider text-butter font-semibold mb-3 flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              <span>Scope & Add-on Estimator</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-ink-foreground mb-4">
              Customize your squad scope in real-time.
            </h2>
            <p className="text-sm text-ink-muted leading-relaxed">
              Select your foundation tier and layer on specialized modules to see estimated investment.
            </p>
          </div>

          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 items-start">
            {/* Left Options */}
            <div>
              <div className="text-xs uppercase tracking-wider text-ink-muted font-semibold mb-3">
                1. Select Foundation Tier
              </div>
              <div className="grid grid-cols-3 gap-3 mb-8">
                {['Launch', 'Scale', 'Enterprise'].map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setSelectedPlan(tier)}
                    className={`py-3 px-4 rounded-2xl text-xs sm:text-sm font-medium border cursor-pointer transition-colors ${
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
                      className={`p-4 rounded-2xl border flex items-center justify-between text-left cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-ink-soft border-butter/50 text-ink-foreground'
                          : 'bg-ink-soft/50 border-white/5 text-ink-muted hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center ${
                            isChecked ? 'bg-butter text-butter-foreground' : 'border border-white/20'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-ink-foreground">
                          {addon.name}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-medium text-butter bg-butter/10 px-2.5 py-0.5 rounded-full shrink-0 ml-3">
                        {addon.tag}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Summary */}
            <div className="bg-ink-soft rounded-3xl p-8 border border-white/10">
              <h3 className="font-display text-xl font-medium text-ink-foreground mb-4">
                Configured Squad Blueprint
              </h3>

              <div className="flex items-center justify-between py-3 border-b border-white/5 text-sm">
                <span className="text-ink-muted">Selected Model</span>
                <span className="font-semibold text-butter">
                  {selectedPlan === 'Launch' ? 'Fixed Sprint Scope' : selectedPlan === 'Scale' ? 'Monthly Dedicated Squad' : 'Custom Enterprise Pod'}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-white/5 text-sm">
                <span className="text-ink-muted">Specialized Modules</span>
                <span className="font-semibold text-ink-foreground">
                  {selectedAddons.length === 0 ? 'Core Foundation Only' : `${selectedAddons.length} Selected`}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-white/5 text-sm">
                <span className="text-ink-muted">Cadence & Review</span>
                <span className="font-semibold text-ink-foreground">
                  Weekly Friday Builds
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-white/5 text-sm mb-8">
                <span className="text-ink-muted">IP Ownership</span>
                <span className="font-semibold text-emerald-400">
                  100% Repository Transfer
                </span>
              </div>

              <Link
                to="/contact"
                className="w-full bg-butter text-butter-foreground rounded-full py-4 text-sm font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
              >
                <span>Request formal proposal for this scope</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Feature Comparison Matrix */}
        <div className="mb-24 text-left">
          <div className="max-w-2xl mb-10">
            <h2 className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-foreground mb-3">
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
          <div className="grid sm:grid-cols-3 gap-8">
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
                <HelpCircle className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <h4 className="font-display font-medium text-base text-foreground mb-1">
                  Post-Launch Warranty
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Includes dedicated post-launch support and bug fixes to ensure flawless operational stability.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-3xl bg-butter text-butter-foreground p-8 sm:p-12 text-center shadow-soft">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl font-medium tracking-tight mb-4">
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
