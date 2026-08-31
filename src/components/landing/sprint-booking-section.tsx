import { Star, ShieldCheck, Zap, MessageSquare } from 'lucide-react';
import { ProjectConfigurator } from './project-configurator';

export function SprintBookingSection() {
  return (
    <section id="configurator" className="py-24 sm:py-32 bg-zinc-950 text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div
        className="absolute top-1/2 -left-48 -translate-y-1/2 w-96 h-96 bg-butter/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-terracotta/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        <div className="grid lg:grid-cols-[1fr_1.15fr] gap-12 lg:gap-16 items-center">
          {/* Left Column: Value Prop & Atmospheric Details (WoodNest Style) */}
          <div data-reveal className="flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-butter text-xs font-mono tracking-wider uppercase mb-6">
              <span>/ Studio Availability & Scope /</span>
            </div>

            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.04] text-white mb-6">
              Transparent scope. <br />
              Guaranteed velocity.
            </h2>

            <p className="text-base sm:text-lg leading-relaxed text-zinc-400 max-w-lg mb-8 font-light">
              Skip endless proposal rounds. Choose a sprint format that matches your stage, configure your software stack, and lock in your delivery sprint.
            </p>

            {/* Value Highlights */}
            <div className="space-y-4 mb-10 w-full max-w-md">
              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/5 border border-white/10 group hover:border-butter/30 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-butter/20 text-butter flex items-center justify-center shrink-0 animate-icon-float animate-icon-glow">
                  <Zap className="w-4 h-4 animate-icon-wiggle group-hover:scale-125 transition-transform" />
                </div>
                <div className="text-xs text-zinc-300">
                  <span className="font-semibold text-white">Weekly Working Demos</span> — Test staging builds on your own phone every Friday.
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/5 border border-white/10 group hover:border-butter/30 transition-colors">
                <div style={{ animationDelay: '0.3s' }} className="w-8 h-8 rounded-xl bg-butter/20 text-butter flex items-center justify-center shrink-0 animate-icon-float animate-icon-glow">
                  <MessageSquare className="w-4 h-4 animate-icon-sway group-hover:scale-125 transition-transform" />
                </div>
                <div className="text-xs text-zinc-300">
                  <span className="font-semibold text-white">Direct Slack Channel</span> — Talk directly to lead engineers and designers, no account managers.
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/5 border border-white/10 group hover:border-butter/30 transition-colors">
                <div style={{ animationDelay: '0.6s' }} className="w-8 h-8 rounded-xl bg-butter/20 text-butter flex items-center justify-center shrink-0 animate-icon-float animate-icon-glow">
                  <ShieldCheck className="w-4 h-4 animate-icon-pulse group-hover:scale-125 transition-transform" />
                </div>
                <div className="text-xs text-zinc-300">
                  <span className="font-semibold text-white">Full IP Ownership</span> — Clean typed codebases and Figma design files handed over 100% to you.
                </div>
              </div>
            </div>

            {/* Social Proof Star Rating Badge (WoodNest Inspired) */}
            <div className="flex items-center gap-3.5 pt-4 border-t border-white/10">
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-5 h-5 fill-current animate-icon-sparkle" />
                <span className="text-lg font-bold text-white">4.9</span>
              </div>
              <div className="text-xs text-zinc-400">
                Average client satisfaction across <span className="text-white font-medium">140+ builds</span>
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
