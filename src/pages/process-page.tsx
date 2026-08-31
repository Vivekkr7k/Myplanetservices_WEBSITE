import { Link } from 'react-router-dom';
import {
  Compass,
  Layout,
  Cpu,
  Rocket,
  Check,
  ArrowRight,
  Clock,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

const PHASES = [
  {
    step: '01',
    icon: Compass,
    title: 'Discover & Map',
    duration: 'Week 1',
    progress: '25%',
    tagline: 'Aligning on business goals, constraints, and architecture blueprints',
    description:
      'We start with an intensive workshop to unpick your product vision, map user personas, evaluate existing codebases, and define the single metric that determines success.',
    deliverables: [
      'Comprehensive product scope document & roadmap',
      'Technical architecture blueprint & database schema',
      'User journey flowcharts & wireframe sketches',
      'Risk assessment and compliance review',
    ],
  },
  {
    step: '02',
    icon: Layout,
    title: 'Design & Prototype',
    duration: 'Weeks 2–3',
    progress: '50%',
    tagline: 'High-fidelity clickable Figma prototypes and complete design systems',
    description:
      'We translate user journeys into polished, responsive design interfaces. You test interactive prototypes before any code is written, ensuring alignment on visual aesthetics and usability.',
    deliverables: [
      'Clickable desktop & mobile interactive prototypes',
      'Component design system (tokens, colors, typography)',
      'Custom iconography and motion animation specs',
      'Engineering handoff specs with zero ambiguity',
    ],
  },
  {
    step: '03',
    icon: Cpu,
    title: 'Agile Build & Sprints',
    duration: 'Weeks 4–8+',
    progress: '75%',
    tagline: 'Two-week sprints with staging builds delivered every Friday',
    description:
      'We write clean, typed TypeScript and deploy automated CI/CD pipelines. Every Friday afternoon, you receive a working build URL and walkthrough demo so you can test real features.',
    deliverables: [
      'Production-grade TypeScript / React / Node codebase',
      'Weekly Friday live staging environment updates',
      'Unit, integration, and end-to-end automated test suites',
      'Observability, logging, and error tracking instrumentation',
    ],
  },
  {
    step: '04',
    icon: Rocket,
    title: 'Launch & Compound',
    duration: 'Post-Launch',
    progress: '100%',
    tagline: 'Production cutover, search-first indexing, and growth optimization',
    description:
      'Launch is day one of growth. We handle zero-downtime DNS deployment, verify Core Web Vitals, implement Answer Engine Schema (AEO), and activate conversion loops.',
    deliverables: [
      'Zero-downtime production deployment & DNS cutover',
      'Complete repository and account transfer to your team',
      'SEO / AEO / GEO search indexing & schema injection',
      'Post-launch telemetry, CRO analytics, and ongoing sprint support',
    ],
  },
];

const CADENCE_DAYS = [
  {
    day: 'Monday',
    title: 'Sprint Planning & Kickoff',
    desc: 'Review backlog in Linear, lock milestone goals for the sprint, and assign deliverables.',
  },
  {
    day: 'Wednesday',
    title: 'Mid-Sprint Sync & Checkpoint',
    desc: 'Quick async Slack check-in to clear blockers and review in-progress PRs.',
  },
  {
    day: 'Friday',
    title: 'Live Staging Demo & Review',
    desc: 'Working preview build deployed to staging with recorded Loom walkthrough and live feedback session.',
  },
];

const TOOLS = [
  { name: 'Linear', category: 'Project Tracking' },
  { name: 'Figma', category: 'Design & Prototyping' },
  { name: 'GitHub', category: 'Code & CI/CD' },
  { name: 'Slack', category: 'Real-Time Communication' },
  { name: 'Vercel / AWS', category: 'Staging & Production' },
  { name: 'Loom', category: 'Async Video Walkthroughs' },
];

export function ProcessPage() {
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
            <span>Our Methodology</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-medium leading-[1.05] tracking-tight text-foreground mb-6">
            A disciplined process <br />
            that removes guesswork <br />
            at every step.
          </h1>
          <p className="text-[16px] sm:text-[18px] leading-relaxed text-muted-foreground max-w-2xl">
            We follow a structured 4-phase agile cycle engineered for predictability, transparency, and rapid delivery. You always know what is being built, when it will ship, and who is accountable.
          </p>
        </div>

        {/* 4 Phases Timeline */}
        <div className="flex flex-col gap-8 mb-24">
          {PHASES.map((phase, pIdx) => {
            const Icon = phase.icon;
            return (
              <div
                key={phase.step}
                className="rounded-[32px] border border-border bg-card p-8 sm:p-12 shadow-sm transition-all duration-300 hover:shadow-soft text-left"
              >
                <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 items-start">
                  {/* Left info */}
                  <div>
                    {/* Header bar */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <span className="font-display text-3xl sm:text-4xl font-semibold text-foreground/40">
                          {phase.step}
                        </span>
                        <div
                          style={{ animationDelay: `${pIdx * 0.3}s` }}
                          className="w-10 h-10 rounded-2xl bg-butter text-butter-foreground flex items-center justify-center shadow-xs animate-icon-float animate-icon-glow"
                        >
                          <Icon
                            style={{ animationDelay: `${pIdx * 0.2}s` }}
                            className={`w-5 h-5 transition-transform duration-300 ${
                              pIdx === 0
                                ? 'animate-icon-spin'
                                : pIdx === 1
                                ? 'animate-icon-bob'
                                : pIdx === 2
                                ? 'animate-icon-pulse'
                                : 'animate-icon-wiggle'
                            }`}
                          />
                        </div>
                        <h2 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-foreground">
                          {phase.title}
                        </h2>
                      </div>
                      <span className="bg-secondary text-foreground text-xs font-semibold px-3 py-1 rounded-full border border-border">
                        {phase.duration}
                      </span>
                    </div>

                    {/* Tagline */}
                    <div className="text-xs sm:text-sm font-medium text-butter-foreground bg-butter/30 px-3.5 py-1 rounded-full inline-block mb-4">
                      {phase.tagline}
                    </div>

                    <p className="text-[15px] leading-relaxed text-muted-foreground mb-6">
                      {phase.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-butter rounded-full transition-all duration-500"
                        style={{ width: phase.progress }}
                      />
                    </div>
                  </div>

                  {/* Right Deliverables Card */}
                  <div className="bg-secondary/60 rounded-3xl p-6 sm:p-8 border border-border/80">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-4 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-butter-foreground" />
                      <span>Phase Deliverables</span>
                    </div>
                    <div className="flex flex-col gap-3">
                      {phase.deliverables.map((item) => (
                        <div key={item} className="flex items-start gap-3 text-xs sm:text-sm text-foreground/90">
                          <div className="w-4 h-4 rounded-full bg-butter/40 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-2.5 h-2.5 text-butter-foreground stroke-[3]" />
                          </div>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* The Weekly Cadence */}
        <div className="rounded-[32px] bg-ink text-ink-foreground p-8 sm:p-14 text-left border border-white/5 shadow-float mb-24">
          <div className="max-w-2xl mb-12">
            <div className="text-xs uppercase tracking-wider text-butter font-semibold mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span>Predictable Delivery Rhythm</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-ink-foreground mb-4">
              Our weekly sprint operating rhythm.
            </h2>
            <p className="text-sm text-ink-muted leading-relaxed">
              No guesswork. Every week follows the exact same cadence so your team and stakeholders can test progress in real-time.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {CADENCE_DAYS.map((cadence) => (
              <div
                key={cadence.day}
                className="bg-ink-soft rounded-3xl p-7 border border-white/5 flex flex-col justify-between hover:border-butter/30 transition-colors"
              >
                <div>
                  <div className="bg-butter text-butter-foreground text-xs font-semibold px-3 py-1 rounded-full inline-block mb-4">
                    {cadence.day}
                  </div>
                  <h3 className="font-display text-xl font-medium text-ink-foreground mb-2">
                    {cadence.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                    {cadence.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tooling Stack */}
        <div className="mb-24 text-left">
          <div className="max-w-2xl mb-8">
            <h2 className="font-display text-3xl font-medium tracking-tight text-foreground mb-2">
              Integrated Collaboration Stack
            </h2>
            <p className="text-sm text-muted-foreground">
              We plug directly into your preferred workspace with full access to our project boards.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {TOOLS.map((tool) => (
              <div
                key={tool.name}
                className="rounded-2xl border border-border bg-card p-5 flex flex-col justify-center items-start shadow-xs hover:border-foreground/20 transition-colors"
              >
                <span className="font-display font-medium text-base text-foreground mb-1">
                  {tool.name}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {tool.category}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Process CTA */}
        <div className="rounded-3xl bg-butter text-butter-foreground p-8 sm:p-12 text-center shadow-soft">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl font-medium tracking-tight mb-4">
              Ready to kick off Phase 01?
            </h2>
            <p className="text-sm text-butter-foreground/80 leading-relaxed mb-8">
              Book a 30-minute discovery workshop to map your user requirements and get a fixed-scope roadmap within 48 hours.
            </p>
            <Link
              to="/contact"
              className="bg-ink text-ink-foreground rounded-full px-8 py-3.5 text-sm font-semibold hover:scale-105 transition-transform inline-flex items-center gap-2"
            >
              <span>Schedule discovery workshop</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProcessPage;
