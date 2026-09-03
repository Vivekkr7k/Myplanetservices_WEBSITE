import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { CASE_STUDIES } from '../../pages/work-page';

export function WorkSection() {
  // Show top 4 featured case studies on the homepage
  const featuredStudies = CASE_STUDIES.slice(0, 4);

  return (
    <section id="work" className="py-24 sm:py-32 relative overflow-hidden">
      <div className="site-container-narrow">
        {/* Section Header */}
        <div className="max-w-3xl text-left mb-16" data-reveal>
          <div className="bg-butter text-butter-foreground rounded-full px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] inline-flex items-center gap-2 shadow-xs mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Selected Work & Case Studies</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-foreground mb-4">
            Proof over promises. <br />
            Engineered outcomes that moved real metrics.
          </h2>

          <p className="text-base sm:text-lg leading-relaxed text-muted-foreground max-w-2xl">
            From venture-backed SaaS platforms and autonomous RAG agents to headless e-commerce and programmatic search dominance—explore how our senior squad delivers.
          </p>
        </div>

        {/* Featured Case Studies Grid (2x2) */}
        <div className="grid md:grid-cols-2 gap-7 sm:gap-8 items-stretch mb-14">
          {featuredStudies.map((study, idx) => (
            <div
              key={study.client}
              data-reveal
              data-reveal-delay={idx * 80}
              className="rounded-[32px] border border-border bg-card p-7 sm:p-9 text-left flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-soft group"
            >
              <div>
                {/* Header: Category Badge & Client Name */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground bg-secondary px-3 py-1 rounded-full border border-border/70">
                    {study.category}
                  </span>
                  <span className="font-display text-xl font-medium text-foreground">
                    {study.client}
                  </span>
                </div>

                {/* Big Metric Display */}
                <div className="mb-6 bg-ink text-ink-foreground rounded-2xl sm:rounded-3xl p-6 border border-white/10 shadow-sm relative overflow-hidden">
                  <div className="font-display text-4xl sm:text-5xl font-medium text-butter mb-1 tracking-tight">
                    {study.metric}
                  </div>
                  <div className="text-xs text-ink-muted uppercase tracking-wider font-mono">
                    {study.metricLabel}
                  </div>
                </div>

                {/* Headline & Description */}
                <h3 className="font-display text-xl sm:text-2xl font-medium tracking-tight text-foreground mb-3 leading-snug">
                  {study.headline}
                </h3>
                <p className="text-[13.5px] leading-relaxed text-muted-foreground mb-6">
                  {study.description}
                </p>

                {/* Highlights */}
                <div className="flex flex-col gap-2 mb-6">
                  {study.highlights.map((h) => (
                    <div key={h} className="flex items-start gap-2.5 text-xs text-foreground/90">
                      <CheckCircle2 className="w-3.5 h-3.5 text-butter-foreground shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack Chips & Link */}
              <div className="pt-5 border-t border-border/60 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1.5">
                  {study.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-0.5 rounded-md bg-secondary text-foreground text-[11px] font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <Link
                  to="/work"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-foreground hover:text-butter-foreground transition-colors group/link"
                >
                  <span>Details</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Section Footer: View All Work CTA Bar */}
        <div
          data-reveal
          className="rounded-3xl bg-secondary/80 border border-border p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left"
        >
          <div>
            <h4 className="font-display font-medium text-lg text-foreground mb-1">
              Looking for a specific industry or architecture?
            </h4>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Browse our complete catalog of case studies, code highlights, and metrics.
            </p>
          </div>

          <Link
            to="/work"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-ink text-ink-foreground text-xs sm:text-sm font-semibold hover:scale-105 transition-transform shrink-0 shadow-sm"
          >
            <span>View all 6 case studies</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default WorkSection;
