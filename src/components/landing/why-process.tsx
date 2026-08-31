import { Gauge, Users, Sparkles, ShieldCheck } from 'lucide-react';

const WHY_BENEFITS = [
  {
    icon: Gauge,
    title: 'Ship in weeks, not quarters',
    description:
      'Fixed-scope sprints with live staging builds in your hands every single Friday.',
  },
  {
    icon: Users,
    title: 'One senior squad, end to end',
    description:
      'Product strategy, Figma design, AI architecture, and full-stack engineering in one room.',
  },
  {
    icon: Sparkles,
    title: 'AI woven into the architecture',
    description:
      "Automation isn't an afterthought — it is engineered into the core data schema from day one.",
  },
  {
    icon: ShieldCheck,
    title: 'Engineered to scale securely',
    description:
      'Strict TypeScript, automated testing suites, SOC2 observability, and global edge infra.',
  },
];

const STATS_DATA = [
  { value: '140+', label: 'Digital Products Shipped' },
  { value: '91%', label: 'Founders Who Re-engage' },
  { value: '3.4k', label: 'Hours Automated / Month' },
  { value: '16', label: 'Countries Represented' },
];

const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Discover & Architect',
    progress: 'w-1/4',
    percent: '25%',
    description:
      'Intensive alignment workshop mapping user journeys, technical constraints, and key revenue metrics.',
  },
  {
    step: '02',
    title: 'Design System & UX',
    progress: 'w-2/4',
    percent: '50%',
    description:
      'Figma component tokens and responsive prototypes ready for instant engineering translation.',
  },
  {
    step: '03',
    title: 'Engine & AI Build',
    progress: 'w-3/4',
    percent: '75%',
    description:
      'Two-week sprints, live staging deployments, and weekly demos ensuring zero surprises.',
  },
  {
    step: '04',
    title: 'Launch & Compound',
    progress: 'w-full',
    percent: '100%',
    description:
      'Production release, instrumentation, SEO/AEO indexing, and AI agent workflow optimization.',
  },
];

export function WhyUs() {
  return (
    <section
      id="why"
      className="bg-ink text-ink-foreground py-16 sm:py-24 lg:py-32 scroll-mt-12 relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div
        className="absolute top-0 right-1/4 w-96 h-96 bg-butter/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="site-container relative z-10">
        {/* Section Header */}
        <div data-reveal className="max-w-3xl mb-16 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-butter text-butter-foreground text-[11px] font-semibold uppercase tracking-[0.14em] shadow-xs mb-5">
            <span>Competitive Advantage</span>
          </div>
          <h2 className="font-display text-display-lg font-medium text-ink-foreground mb-6">
            Why visionary founders choose <br />
            My Planet Services as their build partner
          </h2>
          <p className="text-base leading-relaxed text-ink-muted">
            We are built for teams that demand velocity, architectural excellence, and compounding outcomes. You partner directly with senior operators who care about the business metric behind every line of code.
          </p>
        </div>

        {/* 2-Column Content */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Column — 4 Benefits */}
          <div className="flex flex-col gap-4">
            {WHY_BENEFITS.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  data-reveal
                  data-reveal-delay={`${idx * 70}`}
                  className="bg-ink-soft/90 rounded-[28px] p-6 sm:p-7 border border-white/10 flex gap-4 items-start transition-all duration-300 hover:-translate-y-1 hover:border-white/20 shadow-lg group"
                >
                  <div
                    style={{ animationDelay: `${idx * 0.35}s` }}
                    className="w-12 h-12 rounded-2xl bg-butter text-butter-foreground flex items-center justify-center shrink-0 shadow-xs animate-icon-float animate-icon-glow group-hover:scale-110 transition-transform duration-300"
                  >
                    <Icon
                      style={{ animationDelay: `${idx * 0.25}s` }}
                      className={`w-6 h-6 transition-transform duration-300 group-hover:scale-120 ${
                        idx === 0
                          ? 'animate-icon-wiggle'
                          : idx === 1
                          ? 'animate-icon-bob'
                          : idx === 2
                          ? 'animate-icon-sparkle'
                          : 'animate-icon-pulse'
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="font-display text-lg sm:text-xl font-medium tracking-tight text-ink-foreground mb-1.5">
                      {benefit.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-ink-muted">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column — 2x2 Stats + Butter Card */}
          <div data-reveal data-reveal-delay="150" className="flex flex-col gap-4">
            {/* 2x2 Stats Grid */}
            <div className="bg-ink-soft/90 rounded-[32px] p-6 sm:p-8 border border-white/10 grid grid-cols-2 gap-5 sm:gap-8 shadow-lg">
              {STATS_DATA.map((stat) => (
                <div key={stat.label}>
                  <div className="font-display text-display-lg font-medium text-ink-foreground mb-2">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-ink-muted font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Butter ROI Card */}
            <div className="bg-butter text-butter-foreground rounded-[32px] p-8 shadow-xl transition-transform duration-300 hover:-translate-y-1">
              <div className="text-[11px] font-mono uppercase tracking-wider opacity-80 mb-2">
                Proven Track Record
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight leading-snug mb-3">
                Average 3.6× return on investment in the first year.
              </h3>
              <p className="text-xs sm:text-sm text-butter-foreground/90 font-medium">
                Audited across 50+ client product engagements, 2023–2026.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Process() {
  return (
    <section id="process" className="py-16 sm:py-24 lg:py-32 scroll-mt-12 bg-background relative overflow-hidden">
      <div className="site-container">
        {/* Header */}
        <div data-reveal className="max-w-3xl mb-16 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-butter text-butter-foreground text-[11px] font-semibold uppercase tracking-[0.14em] shadow-xs mb-5">
            <span>Execution Framework</span>
          </div>
          <h2 className="font-display text-display-lg font-medium text-foreground mb-4">
            A battle-tested process that removes guesswork.
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            From initial requirements to post-launch scaling, every sprint is engineered for transparency and measurable outcomes.
          </p>
        </div>

        {/* 4 Process Cards with Alternating Black & Light Design */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {PROCESS_STEPS.map((item, index) => {
            const isDark = index % 2 === 1; // Alternating black cards (02, 04)
            return (
              <div
                key={item.step}
                data-reveal
                data-reveal-delay={`${index * 80}`}
                className={`rounded-[32px] p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 border group relative overflow-hidden ${
                  isDark
                    ? 'bg-ink text-ink-foreground border-white/10 shadow-xl hover:border-butter/30 hover:shadow-2xl'
                    : 'bg-card text-foreground border-border shadow-soft hover:shadow-xl'
                }`}
              >
                {/* Subtle Glow for Black Cards */}
                {isDark && (
                  <div
                    className="absolute -top-12 -right-12 w-32 h-32 bg-butter/10 rounded-full blur-2xl pointer-events-none"
                    aria-hidden="true"
                  />
                )}

                <div>
                  {/* Step number & label */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`font-display text-3xl font-semibold transition-colors ${
                        isDark ? 'text-butter/80 group-hover:text-butter' : 'text-foreground/30 group-hover:text-butter'
                      }`}
                    >
                      {item.step}
                    </span>
                    <span
                      className={`text-xs font-mono font-semibold ${
                        isDark ? 'text-ink-muted' : 'text-muted-foreground'
                      }`}
                    >
                      {item.percent}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div
                    className={`w-full h-1.5 rounded-full overflow-hidden mb-6 ${
                      isDark ? 'bg-white/10' : 'bg-secondary'
                    }`}
                  >
                    <div
                      className={`h-full bg-butter rounded-full transition-all duration-500 ${item.progress}`}
                    />
                  </div>

                  {/* Step Title */}
                  <h3
                    className={`font-display text-xl font-medium tracking-tight mb-3 ${
                      isDark ? 'text-ink-foreground' : 'text-foreground'
                    }`}
                  >
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p
                    className={`text-sm leading-relaxed ${
                      isDark ? 'text-ink-muted' : 'text-muted-foreground'
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
