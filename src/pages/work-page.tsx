import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'SaaS Platforms',
  'AI Automation',
  'Web & Mobile',
  'SEO & Growth',
];

const CASE_STUDIES = [
  {
    client: 'Fleetly',
    category: 'SaaS Platforms',
    metric: '9 wks',
    metricLabel: 'From Day 0 to Production MVP',
    headline: 'Multi-tenant dispatch platform raising $1.2M seed round',
    description:
      'We designed and engineered Fleetly’s end-to-end logistics platform: multi-tenant architecture, real-time vehicle dispatch telemetry, automated Stripe billing, and driver portals.',
    highlights: [
      'Engineered in 9 weeks flat with 100% typed code',
      'Handled 25,000+ monthly route dispatches at launch',
      'Enabled founder to secure $1.2M institutional seed round',
    ],
    tech: ['React 19', 'Node.js', 'PostgreSQL', 'Tailwind v4', 'Stripe'],
  },
  {
    client: 'Northwind Ops',
    category: 'AI Automation',
    metric: '-62%',
    metricLabel: 'Support Resolution Latency',
    headline: 'Autonomous RAG copilot handling 14,000+ support tickets monthly',
    description:
      'Replaced a bloated 3-vendor support pipeline with a custom AI agent trained on internal documentation and historical ticket databases, slashing human review workload by 62%.',
    highlights: [
      'Sub-2 second response time with zero hallucination guardrails',
      'Full integration with Zendesk, Slack, and internal CRM',
      'Estimated $180,000 annual operational cost savings',
    ],
    tech: ['Python', 'LangChain', 'OpenAI', 'Pinecone', 'FastAPI'],
  },
  {
    client: 'Glossy Retail',
    category: 'SEO & Growth',
    metric: '14×',
    metricLabel: 'Organic Traffic Growth (12k to 178k)',
    headline: 'Programmatic SEO & Answer Engine entity dominance in 8 months',
    description:
      'Engineered a high-velocity programmatic SEO system with structured JSON-LD entity schemas, capturing top ranking in Google search and generative AI citations in ChatGPT and Perplexity.',
    highlights: [
      'Scaled from 12k to 178k organic sessions in 8 months',
      '#1 citation source in conversational AI search results',
      'Direct 340% increase in inbound qualified revenue',
    ],
    tech: ['Next.js', 'Schema.org', 'Algolia', 'Tailwind', 'PostgreSQL'],
  },
  {
    client: 'Proline Logistics',
    category: 'Web & Mobile',
    metric: '99.98%',
    metricLabel: 'Fleet App Telemetry Uptime',
    headline: 'Offline-first mobile driver application & live operations console',
    description:
      'Built a fluid React Native mobile application for 400+ commercial truck drivers with seamless offline-first SQLite sync and an interactive React dispatcher dashboard.',
    highlights: [
      'Sub-second offline data syncing when cellular signal is restored',
      '120fps fluid map animations and turn-by-turn routing',
      'Biometric authentication and automated digital BOL signatures',
    ],
    tech: ['React Native', 'Expo', 'SQLite', 'Supabase', 'TypeScript'],
  },
  {
    client: 'Vantage Health',
    category: 'AI Automation',
    metric: '85%',
    metricLabel: 'Faster Patient Onboarding',
    headline: 'HIPAA-compliant AI medical intake & document processing portal',
    description:
      'Constructed a high-security patient onboarding portal with automated insurance card OCR extraction and physician review workflow, reducing clinical intake friction by 85%.',
    highlights: [
      'SOC2 and HIPAA compliant end-to-end encryption',
      'Automated medical history synthesis for clinicians',
      'Zero downtime across 50,000+ patient admissions',
    ],
    tech: ['React', 'Python', 'AWS GovCloud', 'PostgreSQL', 'Docker'],
  },
  {
    client: 'Greenish Market',
    category: 'SEO & Growth',
    metric: '4.2×',
    metricLabel: 'Return on Ad Spend (ROAS)',
    headline: 'Ultra-fast headless commerce platform with custom growth loops',
    description:
      'Rebuilt Greenish Market from a sluggish legacy theme into an ultra-fast headless storefront with Core Web Vitals score of 98, paired with a full-funnel retention marketing engine.',
    highlights: [
      'Sub-600ms page load speeds across all product pages',
      '28% increase in mobile checkout conversion rate',
      '4.2x ROAS on primary acquisition campaigns',
    ],
    tech: ['Remix', 'Tailwind', 'Klaviyo', 'Shopify Storefront API', 'Stripe'],
  },
];

export function WorkPage() {
  const [selectedCat, setSelectedCat] = useState('All');

  const filteredStudies =
    selectedCat === 'All'
      ? CASE_STUDIES
      : CASE_STUDIES.filter((item) => item.category === selectedCat);

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
            <span>Case Studies & Proof</span>
          </div>
          <h1 className="font-display text-display-xl font-medium text-foreground mb-6">
            Proof over promises. <br />
            Selected client outcomes.
          </h1>
          <p className="text-[16px] sm:text-[18px] leading-relaxed text-muted-foreground max-w-2xl">
            A portfolio of high-impact engagements where engineering, design systems, and compounding growth came together to move real metrics.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2.5 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer border ${
                selectedCat === cat
                  ? 'bg-ink text-ink-foreground border-ink shadow-soft'
                  : 'bg-card text-muted-foreground border-border hover:text-foreground hover:bg-secondary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Case Studies Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-24">
          {filteredStudies.map((study) => (
            <div
              key={study.client}
              className="rounded-[32px] border border-border bg-card p-8 sm:p-10 text-left flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-soft group"
            >
              <div>
                {/* Top header */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground bg-secondary px-3 py-1 rounded-full border border-border/60">
                    {study.category}
                  </span>
                  <span className="font-display text-xl font-medium text-foreground">
                    {study.client}
                  </span>
                </div>

                {/* Big Metric Display */}
                <div className="mb-6 bg-ink text-ink-foreground rounded-3xl p-6 border border-white/5 shadow-inner">
                  <div className="font-display text-display-lg font-medium text-butter mb-1">
                    {study.metric}
                  </div>
                  <div className="text-xs text-ink-muted">
                    {study.metricLabel}
                  </div>
                </div>

                <h2 className="font-display text-2xl font-medium tracking-tight text-foreground mb-4">
                  {study.headline}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground mb-6">
                  {study.description}
                </p>

                {/* Key Highlights */}
                <div className="flex flex-col gap-2.5 mb-8">
                  {study.highlights.map((h) => (
                    <div key={h} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground/90">
                      <div className="w-1.5 h-1.5 rounded-full bg-butter-foreground shrink-0 mt-2" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack Footer */}
              <div className="pt-6 border-t border-border/60">
                <div className="flex flex-wrap gap-2">
                  {study.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-md bg-secondary text-foreground text-[11px] font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials Banner */}
        <div className="rounded-[32px] bg-secondary p-8 sm:p-14 mb-20 text-left border border-border">
          <div className="max-w-2xl mb-8">
            <h2 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-foreground">
              What founders say about the speed & quality.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 2xl:grid-cols-3 gap-8">
            <div className="bg-card rounded-3xl p-8 border border-border shadow-xs">
              <p className="font-display text-base sm:text-lg font-light leading-snug text-foreground mb-6">
                “My Planet Services replaced three vendors for us. They delivered our entire SaaS platform in 9 weeks and then immediately layered on AI automations that cut our ops costs in half.”
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-ink text-ink-foreground text-xs font-semibold flex items-center justify-center">
                  AR
                </div>
                <div>
                  <div className="font-medium text-sm text-foreground">Amara Reyes</div>
                  <div className="text-xs text-muted-foreground">COO, Fleetly</div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-3xl p-8 border border-border shadow-xs">
              <p className="font-display text-base sm:text-lg font-light leading-snug text-foreground mb-6">
                “The clearest, most accountable development process I have encountered. The weekly Friday staging builds meant zero surprises on launch day.”
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-ink text-ink-foreground text-xs font-semibold flex items-center justify-center">
                  KJ
                </div>
                <div>
                  <div className="font-medium text-sm text-foreground">Karan Joshi</div>
                  <div className="text-xs text-muted-foreground">Founder, Northwind</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-3xl bg-butter text-butter-foreground p-8 sm:p-12 text-center shadow-soft">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-display text-display-md font-medium mb-4">
              Want similar outcomes for your product?
            </h2>
            <p className="text-sm text-butter-foreground/80 leading-relaxed mb-8">
              Tell us about your target metric and timeline. We'll provide a scoped plan within 48 hours.
            </p>
            <Link
              to="/contact"
              className="bg-ink text-ink-foreground rounded-full px-8 py-3.5 text-sm font-semibold hover:scale-105 transition-transform inline-flex items-center gap-2"
            >
              <span>Submit project brief</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkPage;
