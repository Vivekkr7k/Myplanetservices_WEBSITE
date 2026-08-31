import { Link } from 'react-router-dom';
import {
  Gauge,
  Users,
  Sparkles,
  ShieldCheck,
  Check,
  X,
  ArrowRight,
  TrendingUp,
  Award,
} from 'lucide-react';

const PILLARS = [
  {
    icon: Gauge,
    title: 'Ship in weeks, not quarters',
    description:
      'We run fixed-scope two-week sprints with a working, staging-tested preview in your hands every single Friday. No month-long dark periods or surprise delivery delays.',
    points: [
      'Weekly Friday live staging builds',
      'Transparent Linear / GitHub boards',
      'Fixed milestones and no scope drift',
    ],
  },
  {
    icon: Users,
    title: 'One senior team, end to end',
    description:
      'Strategy, visual design, full-stack engineering, and growth sit in the same room. You talk directly with senior operators who understand both software architecture and business revenue.',
    points: [
      'Zero junior bench bait-and-switch',
      'Direct Slack channel with core engineers',
      'Decisions driven by ARR metrics, not vanity hours',
    ],
  },
  {
    icon: Sparkles,
    title: 'AI woven into the product',
    description:
      "Automation isn't an afterthought or marketing gimmick. We architect intelligent agents, automated triage, and RAG knowledge bases directly into the core user flows from Day 1.",
    points: [
      'Domain-tuned LLM agents',
      'Automated customer & ops workflows',
      'Zero-data-retention enterprise privacy',
    ],
  },
  {
    icon: ShieldCheck,
    title: 'Built to scale safely',
    description:
      'We build on strongly-typed codebases, thorough automated test suites, and observable cloud infrastructure that scales effortlessly without needing costly rewrites later.',
    points: [
      '100% TypeScript with strict typing',
      'Automated CI/CD and unit/E2E test coverage',
      'Complete IP and repository transfer',
    ],
  },
];

const COMPARISON = [
  {
    feature: 'Team Composition',
    traditional: 'Pitched by partners, handed off to junior devs',
    myplanetservices: 'Dedicated senior squad of designers & engineers',
  },
  {
    feature: 'Delivery Velocity',
    traditional: 'Slow 4–6 month waterfall cycles with bloated specs',
    myplanetservices: '6–10 week production MVP with weekly Friday builds',
  },
  {
    feature: 'AI Capabilities',
    traditional: 'Bolted-on wrapper widgets or superficial chat tabs',
    myplanetservices: 'AI-native architecture, custom agents & automated ops',
  },
  {
    feature: 'Communication & Transparency',
    traditional: 'Layered account managers and email ticket threads',
    myplanetservices: 'Direct shared Slack channel and weekly live demos',
  },
  {
    feature: 'Code & IP Ownership',
    traditional: 'Proprietary platforms with vendor lock-in',
    myplanetservices: '100% intellectual property & repo transfer at handover',
  },
  {
    feature: 'Pricing Model',
    traditional: 'Hourly billable overages and unpredictable invoices',
    myplanetservices: 'Transparent fixed-scope sprints or monthly squad retainer',
  },
];

const STATS = [
  { value: '120+', label: 'Products delivered worldwide', sub: 'Across 14 countries' },
  { value: '89%', label: 'Clients who re-engage', sub: 'Long-term product partners' },
  { value: '2.9k', label: 'Hours automated monthly', sub: 'Per client average' },
  { value: '3.4×', label: 'Average 1st-year ROI', sub: 'Measured across 40 engagements' },
];

export function WhyUsPage() {
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
            <Award className="w-3.5 h-3.5" />
            <span>The My Planet Services Advantage</span>
          </div>
          <h1 className="font-display text-display-xl font-medium text-foreground mb-6">
            Engineered for speed. <br />
            Built for compounding <br />
            outcomes.
          </h1>
          <p className="text-[16px] sm:text-[18px] leading-relaxed text-muted-foreground max-w-2xl">
            We are built for founders and scaling teams who value speed, technical excellence, and measurable growth. We eliminate agency theatre and focus on what moves the needle.
          </p>
        </div>

        {/* 4 Pillars Deep Dive */}
        <div className="grid md:grid-cols-2 gap-6 mb-24">
          {PILLARS.map((pillar, pIdx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="rounded-3xl border border-border bg-card p-8 text-left flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-soft group"
              >
                <div>
                  <div
                    style={{ animationDelay: `${pIdx * 0.3}s` }}
                    className="w-12 h-12 rounded-2xl bg-butter text-butter-foreground flex items-center justify-center mb-6 shadow-xs animate-icon-float animate-icon-glow group-hover:scale-110 transition-transform duration-300"
                  >
                    <Icon
                      style={{ animationDelay: `${pIdx * 0.2}s` }}
                      className={`w-6 h-6 transition-transform duration-300 group-hover:scale-120 ${
                        pIdx === 0
                          ? 'animate-icon-wiggle'
                          : pIdx === 1
                          ? 'animate-icon-bob'
                          : pIdx === 2
                          ? 'animate-icon-sparkle'
                          : 'animate-icon-pulse'
                      }`}
                    />
                  </div>
                  <h2 className="font-display text-2xl font-medium tracking-tight text-foreground mb-3">
                    {pillar.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-muted-foreground mb-6">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-border/60 flex flex-col gap-2.5">
                  {pillar.points.map((pt) => (
                    <div key={pt} className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-foreground/90">
                      <div className="w-4 h-4 rounded-full bg-butter/30 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 text-butter-foreground stroke-[3]" />
                      </div>
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats Grid Banner */}
        <div className="rounded-[32px] bg-ink text-ink-foreground p-8 sm:p-14 border border-white/5 shadow-float mb-24 text-left">
          <div className="max-w-2xl mb-12">
            <div className="text-xs uppercase tracking-wider text-butter font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>Proven Track Record</span>
            </div>
            <h2 className="font-display text-display-md font-medium text-ink-foreground mb-4">
              Real metrics from real engagements.
            </h2>
            <p className="text-sm text-ink-muted leading-relaxed">
              We hold ourselves accountable to business metrics — revenue lift, hours automated, and time-to-market.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="bg-ink-soft rounded-3xl p-6 sm:p-8 border border-white/5 flex flex-col justify-between hover:border-butter/30 transition-colors"
              >
                <div>
                  <div className="font-display text-display-lg font-medium text-butter mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-ink-foreground mb-1">
                    {stat.label}
                  </div>
                </div>
                <div className="text-xs text-ink-muted pt-3 border-t border-white/5">
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traditional Agency vs. My Planet Services Table */}
        <div className="mb-24 text-left">
          <div className="max-w-2xl mb-10">
            <div className="bg-butter text-butter-foreground rounded-full px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] inline-block shadow-sm mb-4">
              Direct Comparison
            </div>
            <h2 className="font-display text-display-md font-medium text-foreground mb-3">
              How My Planet Services compares to traditional agencies.
            </h2>
            <p className="text-sm text-muted-foreground">
              See why high-growth startups replace multi-agency fragmentation with our integrated studio pod.
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[640px]">
                <thead>
                  <tr className="border-b border-border bg-secondary/40">
                    <th className="p-5 font-display text-sm font-medium text-foreground w-1/4">
                      Dimension
                    </th>
                    <th className="p-5 font-display text-sm font-medium text-muted-foreground w-3/8">
                      Traditional Agency
                    </th>
                    <th className="p-5 font-display text-sm font-medium text-butter-foreground bg-butter/20 w-3/8">
                      My Planet Services
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-xs sm:text-sm">
                  {COMPARISON.map((row) => (
                    <tr key={row.feature} className="hover:bg-secondary/20 transition-colors">
                      <td className="p-5 font-medium text-foreground">
                        {row.feature}
                      </td>
                      <td className="p-5 text-muted-foreground">
                        <div className="flex items-start gap-2">
                          <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                          <span>{row.traditional}</span>
                        </div>
                      </td>
                      <td className="p-5 text-foreground bg-butter/5 font-medium">
                        <div className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 stroke-[2.5]" />
                          <span>{row.myplanetservices}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* CTA Card */}
        <div className="rounded-3xl bg-butter text-butter-foreground p-8 sm:p-12 text-center shadow-soft">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-display text-display-md font-medium mb-4">
              Work with an accountable partner.
            </h2>
            <p className="text-sm text-butter-foreground/80 leading-relaxed mb-8">
              Let's schedule a 30-minute discovery call to discuss your roadmap, timeline, and architectural targets.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/contact"
                className="bg-ink text-ink-foreground rounded-full px-8 py-3.5 text-sm font-semibold hover:scale-105 transition-transform inline-flex items-center gap-2"
              >
                <span>Book discovery call</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/work"
                className="bg-white/40 text-butter-foreground rounded-full px-8 py-3.5 text-sm font-semibold hover:bg-white/60 transition-colors"
              >
                View our client work
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WhyUsPage;
