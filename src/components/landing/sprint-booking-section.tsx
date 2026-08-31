import { Star, ShieldCheck, Zap, MessageSquare, Gift } from 'lucide-react';
import { ProjectConfigurator } from './project-configurator';

export function SprintBookingSection() {
  return (
    <section
      id="configurator"
      className="py-16 sm:py-24 lg:py-32 bg-secondary text-foreground relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div
        className="absolute top-1/2 -left-48 -translate-y-1/2 w-96 h-96 bg-butter/40 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-mint/25 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="site-container relative z-10">
        <div className="grid lg:grid-cols-[1fr_1.15fr] gap-12 lg:gap-16 items-center">
          {/* Left Column: Value Prop & Atmospheric Details */}
          <div data-reveal className="flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-butter text-butter-foreground text-xs font-mono tracking-wider uppercase shadow-xs mb-6">
              <span>/ Know the Price Before You Ask /</span>
            </div>

            <h2 className="font-display text-display-xl font-medium text-foreground mb-6">
              Transparent scope. <br />
              Guaranteed velocity.
            </h2>

            <p className="text-base sm:text-lg leading-relaxed text-muted-foreground max-w-lg mb-8">
              No "request a quote" black box. Pick what you're building, choose the depth you need, and see a real number in seconds — then send us the exact scope you configured.
            </p>

            {/* Value Highlights */}
            <div className="space-y-4 mb-10 w-full max-w-md">
              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-butter/30 border border-butter group hover:shadow-soft transition-shadow">
                <div className="w-8 h-8 rounded-xl bg-butter text-butter-foreground flex items-center justify-center shrink-0 animate-icon-float animate-icon-glow">
                  <Gift className="w-4 h-4 animate-icon-sparkle group-hover:scale-125 transition-transform" />
                </div>
                <div className="text-xs text-foreground/80">
                  <span className="font-semibold text-foreground">Free First Year</span> — 1 year of Hostinger hosting and full maintenance included with every build.
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-card border border-border group hover:border-butter transition-colors">
                <div className="w-8 h-8 rounded-xl bg-butter text-butter-foreground flex items-center justify-center shrink-0 animate-icon-float animate-icon-glow">
                  <Zap className="w-4 h-4 animate-icon-wiggle group-hover:scale-125 transition-transform" />
                </div>
                <div className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">Weekly Working Demos</span> — Test staging builds on your own phone every Friday.
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-card border border-border group hover:border-butter transition-colors">
                <div
                  style={{ animationDelay: '0.3s' }}
                  className="w-8 h-8 rounded-xl bg-butter text-butter-foreground flex items-center justify-center shrink-0 animate-icon-float animate-icon-glow"
                >
                  <MessageSquare className="w-4 h-4 animate-icon-sway group-hover:scale-125 transition-transform" />
                </div>
                <div className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">Direct Slack Channel</span> — Talk directly to lead engineers and designers, no account managers.
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-card border border-border group hover:border-butter transition-colors">
                <div
                  style={{ animationDelay: '0.6s' }}
                  className="w-8 h-8 rounded-xl bg-butter text-butter-foreground flex items-center justify-center shrink-0 animate-icon-float animate-icon-glow"
                >
                  <ShieldCheck className="w-4 h-4 animate-icon-pulse group-hover:scale-125 transition-transform" />
                </div>
                <div className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">Full IP Ownership</span> — Clean typed codebases and Figma design files handed over 100% to you.
                </div>
              </div>
            </div>

            {/* Social Proof Star Rating Badge */}
            <div className="flex items-center gap-3.5 pt-4 border-t border-border">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-5 h-5 fill-current animate-icon-sparkle" />
                <span className="text-lg font-bold text-foreground">4.9</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Average client satisfaction across{' '}
                <span className="text-foreground font-medium">140+ builds</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Configurator Card */}
          <div data-reveal data-reveal-delay="100">
            <ProjectConfigurator />
          </div>
        </div>
      </div>
    </section>
  );
}
