import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  ArrowUpRight,
  Star,
  Lock,
  Zap,
  ExternalLink,
} from 'lucide-react';
import { CASE_STUDIES } from '../../pages/work-page';

export function WorkSection() {
  return (
    <section id="work" className="py-24 sm:py-32 relative overflow-hidden scroll-mt-24">
      <div className="site-container-narrow">
        {/* Section Header */}
        <div className="max-w-3xl text-left mb-14 sm:mb-16" data-reveal>
          <div className="bg-butter text-butter-foreground rounded-full px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] inline-flex items-center gap-2 shadow-xs mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Works & Client Platforms</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-foreground mb-4">
            Real platforms. <br />
            Engineered & shipped by our squad.
          </h2>

          <p className="text-base sm:text-lg leading-relaxed text-muted-foreground max-w-2xl">
            Explore commercial platforms, custom e-commerce engines, and AI/AR applications built, deployed, and scaled by My Planet Services.
          </p>
        </div>

        {/* Showcase Cards List */}
        <div className="flex flex-col gap-14 sm:gap-20 mb-14">
          {CASE_STUDIES.map((study, idx) => (
            <article
              key={study.client}
              data-reveal
              data-reveal-delay={idx * 80}
              className="rounded-[36px] sm:rounded-[42px] border border-border/80 bg-card/95 shadow-soft hover:shadow-2xl transition-all duration-500 overflow-hidden text-left relative group"
            >
              {/* Header & Status Bar */}
              <div className="px-6 sm:px-9 py-5 border-b border-border/70 bg-secondary/40 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                    {study.client}
                  </span>
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground bg-card px-3 py-1 rounded-full border border-border">
                    {study.category}
                  </span>
                  <span className="hidden sm:inline-flex text-[11px] font-semibold text-butter-foreground bg-butter/30 px-3 py-1 rounded-full border border-butter/40">
                    {study.badge}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="hidden md:flex items-center gap-2 text-xs font-mono text-muted-foreground">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span>Live Production</span>
                  </div>

                  <a
                    href={study.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full bg-ink text-ink-foreground text-xs sm:text-sm font-semibold hover:bg-butter hover:text-butter-foreground hover:scale-105 transition-all duration-200 shadow-xs group/btn"
                  >
                    <span>Launch Live Site</span>
                    <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Centerpiece: Realistic Immersive Browser Frame */}
              <div className="p-4 sm:p-7 lg:p-8 bg-gradient-to-b from-secondary/30 via-background to-card">
                <div className="rounded-2xl sm:rounded-3xl border border-border/90 bg-ink/95 shadow-2xl overflow-hidden relative group/browser">
                  {/* Browser Controls */}
                  <div className="bg-ink px-4 sm:px-6 py-3 flex items-center justify-between border-b border-white/10 gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                    </div>

                    <div className="flex-1 max-w-sm mx-auto hidden sm:flex items-center justify-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/70 font-mono">
                      <Lock className="w-3 h-3 text-emerald-400" />
                      <span className="truncate">https://{study.displayUrl}/</span>
                    </div>

                    <a
                      href={study.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/60 hover:text-white transition-colors"
                      title="Open website"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Visual Preview */}
                  <a
                    href={study.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block relative overflow-hidden bg-black/40 group/view"
                  >
                    <img
                      src={study.image}
                      alt={`${study.client} production preview`}
                      className="w-full h-auto max-h-[500px] object-cover object-top transition-transform duration-700 ease-out group-hover/view:scale-[1.015]"
                      loading={idx === 0 ? 'eager' : 'lazy'}
                    />

                    {/* Floating Glass Metric Badge */}
                    <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 backdrop-blur-xl bg-ink/90 text-ink-foreground border border-white/20 p-3.5 sm:p-4 rounded-2xl shadow-2xl flex items-center gap-3.5 transition-transform duration-300 group-hover/view:scale-105">
                      <div className="w-10 h-10 rounded-xl bg-butter text-butter-foreground flex items-center justify-center font-display text-lg font-bold shrink-0 shadow-xs">
                        <Zap className="w-5 h-5 fill-current text-butter-foreground" />
                      </div>
                      <div>
                        <div className="font-display text-xl sm:text-2xl font-semibold text-butter leading-none mb-0.5">
                          {study.metric}
                        </div>
                        <div className="text-[11px] text-white font-medium">
                          {study.metricLabel}
                        </div>
                        <div className="text-[9.5px] text-ink-muted uppercase tracking-wider font-mono">
                          {study.metricSub}
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Bottom Multi-Column Details Grid */}
              <div className="p-6 sm:p-8 lg:p-10 border-t border-border/70 grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                {/* Column 1: Scope & Tech (7 cols) */}
                <div className="lg:col-span-7 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-xl sm:text-2xl font-medium tracking-tight text-foreground mb-2 leading-snug">
                      {study.headline}
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-butter-foreground mb-3">
                      {study.tagline}
                    </p>
                    <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground mb-5">
                      {study.overview}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border/60 flex flex-wrap gap-1.5">
                    {study.tech.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-md bg-secondary text-foreground text-[11px] font-medium border border-border/60"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Column 2: Client Endorsement Card (5 cols) */}
                <div className="lg:col-span-5">
                  <div className="rounded-2xl sm:rounded-3xl bg-butter/20 border border-butter/40 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                    <div className="flex items-center gap-1 text-amber-500 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>

                    <blockquote className="font-display text-xs sm:text-[13px] font-medium leading-relaxed italic text-foreground mb-4">
                      “{study.testimonial.quote}”
                    </blockquote>

                    <div className="flex items-center gap-3 pt-3 border-t border-butter/30">
                      <div className="w-9 h-9 rounded-xl bg-ink text-ink-foreground text-xs font-bold flex items-center justify-center shrink-0">
                        {study.testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-display font-semibold text-xs text-foreground">
                          {study.testimonial.author}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {study.testimonial.role}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Section Footer: View All Work CTA Bar */}
        <div
          data-reveal
          className="rounded-3xl bg-secondary/80 border border-border p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left"
        >
          <div>
            <h4 className="font-display font-medium text-lg text-foreground mb-1">
              Want to inspect deep technical deliverables & architectural stacks?
            </h4>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Explore our full production portfolio with category filters and case studies.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/work"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-ink text-ink-foreground text-xs sm:text-sm font-semibold hover:scale-105 transition-transform shadow-sm"
            >
              <span>Explore All Our Works</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WorkSection;
