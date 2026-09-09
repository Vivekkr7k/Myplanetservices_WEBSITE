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
        <div className="flex flex-col gap-10 sm:gap-14 mb-14">
          {CASE_STUDIES.map((study, idx) => (
            <article
              key={study.client}
              data-reveal
              data-reveal-delay={idx * 80}
              className="rounded-3xl sm:rounded-[36px] border border-border/80 bg-card/95 shadow-soft hover:shadow-xl transition-all duration-500 overflow-hidden text-left relative group"
            >
              {/* Header & Status Bar */}
              <div className="px-5 sm:px-8 py-3.5 sm:py-4 border-b border-border/70 bg-secondary/30 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    {study.client}
                  </span>
                  <span className="text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground bg-secondary px-2.5 py-0.5 rounded-full border border-border">
                    {study.category}
                  </span>
                  <span className="hidden sm:inline-flex text-[10.5px] font-semibold text-butter-foreground bg-butter/30 px-2.5 py-0.5 rounded-full border border-butter/40">
                    {study.badge}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
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
                    className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-ink text-ink-foreground text-xs font-semibold hover:bg-butter hover:text-butter-foreground hover:scale-105 transition-all duration-200 shadow-xs group/btn"
                  >
                    <span>Launch Live Site</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>

              {/* 2-Column Responsive Body: Content on Left, Visual Mockup on Right */}
              <div className="p-5 sm:p-7 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                {/* Column 1: Core Scope, Tech & Testimonial */}
                <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-between order-2 lg:order-1">
                  <div>
                    <h3 className="font-display text-lg sm:text-xl font-semibold tracking-tight text-foreground mb-1.5 leading-snug">
                      {study.headline}
                    </h3>
                    <p className="text-xs font-medium text-butter-foreground mb-2">
                      {study.tagline}
                    </p>
                    <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground mb-3.5 line-clamp-3">
                      {study.overview}
                    </p>

                    {/* Tech Stack Chips */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {study.tech.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-md bg-secondary text-foreground text-[10.5px] font-medium border border-border/60"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Compact Verified Endorsement Box */}
                  <div className="rounded-xl sm:rounded-2xl bg-butter/20 border border-butter/35 p-3 sm:p-3.5 shadow-2xs">
                    <div className="flex items-center gap-1 text-amber-500 mb-1.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>

                    <blockquote className="font-display text-xs italic leading-relaxed text-foreground mb-2.5 line-clamp-2">
                      “{study.testimonial.quote}”
                    </blockquote>

                    <div className="flex items-center gap-2.5 pt-2 border-t border-butter/30">
                      <div className="w-7 h-7 rounded-lg bg-ink text-ink-foreground text-[10px] font-bold flex items-center justify-center shrink-0 shadow-2xs">
                        {study.testimonial.avatar}
                      </div>
                      <div className="min-w-0">
                        <div className="font-display font-semibold text-xs text-foreground truncate">
                          {study.testimonial.author}
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate">
                          {study.testimonial.role}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2: Realistic Browser Preview */}
                <div className="lg:col-span-6 xl:col-span-7 order-1 lg:order-2">
                  <div className="rounded-2xl border border-border/90 bg-ink/95 shadow-xl overflow-hidden relative group/browser">
                    {/* Browser Chrome Controls */}
                    <div className="bg-ink px-3.5 py-2 flex items-center justify-between border-b border-white/10 gap-2">
                      <div className="flex items-center gap-1.5 shrink-0">
                        <div className="w-2 h-2 rounded-full bg-[#ff5f56]" />
                        <div className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
                        <div className="w-2 h-2 rounded-full bg-[#27c93f]" />
                      </div>

                      <div className="flex-1 max-w-[190px] sm:max-w-xs mx-auto flex items-center justify-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/70 font-mono">
                        <Lock className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                        <span className="truncate">https://{study.displayUrl}/</span>
                      </div>

                      <a
                        href={study.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/60 hover:text-white transition-colors p-0.5"
                        title="Open website"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    {/* Image Preview Container */}
                    <a
                      href={study.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block relative overflow-hidden bg-black/40 group/view"
                    >
                      <img
                        src={study.image}
                        alt={`${study.client} production preview`}
                        className="w-full h-auto max-h-[240px] sm:max-h-[290px] lg:max-h-[310px] aspect-[16/10] object-cover object-top transition-transform duration-700 ease-out group-hover/view:scale-[1.02]"
                        loading={idx === 0 ? 'eager' : 'lazy'}
                      />

                      {/* Floating Glass Metric Badge (Neatly docked in corner on desktop) */}
                      <div className="hidden sm:flex absolute bottom-3.5 right-3.5 backdrop-blur-xl bg-ink/90 text-ink-foreground border border-white/20 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl shadow-xl items-center gap-2.5 transition-transform duration-300 group-hover/view:scale-105">
                        <div className="w-8 h-8 rounded-lg bg-butter text-butter-foreground flex items-center justify-center font-display text-sm font-bold shrink-0 shadow-2xs">
                          <Zap className="w-4 h-4 fill-current text-butter-foreground" />
                        </div>
                        <div>
                          <div className="font-display text-lg font-bold text-butter leading-none mb-0.5">
                            {study.metric}
                          </div>
                          <div className="text-[10.5px] text-white font-medium">
                            {study.metricLabel}
                          </div>
                          <div className="text-[9px] text-ink-muted uppercase tracking-wider font-mono">
                            {study.metricSub}
                          </div>
                        </div>
                      </div>
                    </a>

                    {/* Mobile Metric Bar */}
                    <div className="sm:hidden bg-ink/95 border-t border-white/10 px-3 py-2 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded-md bg-butter text-butter-foreground flex items-center justify-center font-display text-xs font-bold shrink-0">
                          <Zap className="w-3 h-3 fill-current text-butter-foreground" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-display text-xs font-semibold text-butter leading-none truncate">
                            {study.metric}
                          </div>
                          <div className="text-[10px] text-white/80 font-medium truncate">
                            {study.metricLabel}
                          </div>
                        </div>
                      </div>
                      <div className="text-[8.5px] text-ink-muted uppercase tracking-wider font-mono shrink-0">
                        {study.metricSub}
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
