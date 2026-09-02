import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, ArrowUpRight, Play, Pause, RotateCcw, Sun, Zap, Sunset, Moon } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MILESTONE_SERVICES } from './road-services-signboard';
import { SystemTourModal } from './system-tour-modal';
import { useSmoothScroll } from '../../lib/lenis-scroll';
import { toast } from 'sonner';
import { sendLeadCapture } from '../../lib/send-email';

gsap.registerPlugin(ScrollTrigger);

// Pixels of scroll distance allocated per second of video.
// At 120 px/s for a 10s video, total scroll runway is 1200px (approx 1.5 - 2 viewports)
const PIXELS_PER_SECOND = 130;

const TRUST_LOGOS = [
  'Meridian',
  'STELLER',
  'Luminar',
  'OVERLAND',
  'Kinetic',
];

const SCROLL_PHASES = [
  { time: 0, label: '0s · Day Start', phase: 'Daylight Architecture', icon: Sun },
  { time: 3, label: '3s · AI Build', phase: 'Multi-Agent Sprints', icon: Zap },
  { time: 6, label: '6s · Sunset Scale', phase: 'SaaS Platform Scale', icon: Sunset },
  { time: 9.5, label: '10s · Night Ops', phase: 'Global 24/7 Autonomy', icon: Moon },
];

export function Hero() {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [videoTime, setVideoTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(10);
  const [isPlayingAuto, setIsPlayingAuto] = useState(false);
  const [activeMilestoneIdx, setActiveMilestoneIdx] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isSafariUnlockedRef = useRef(false);
  const autoPlayAnimRef = useRef<number | null>(null);

  const { scrollTo } = useSmoothScroll();

  // 1. Detect Prefers Reduced Motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // 2. iOS Safari Interaction Unlock:
  // On first user interaction, perform a muted play() & pause() so Safari allows arbitrary frame seeking
  useEffect(() => {
    const unlockSafari = () => {
      if (isSafariUnlockedRef.current) return;
      const video = videoRef.current;
      if (video) {
        video.muted = true;
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              video.pause();
              isSafariUnlockedRef.current = true;
            })
            .catch(() => {
              // Ignore unlock error
            });
        }
      }
    };

    window.addEventListener('pointerdown', unlockSafari, { passive: true, once: true });
    window.addEventListener('touchstart', unlockSafari, { passive: true, once: true });
    window.addEventListener('scroll', unlockSafari, { passive: true, once: true });
    window.addEventListener('keydown', unlockSafari, { passive: true, once: true });

    return () => {
      window.removeEventListener('pointerdown', unlockSafari);
      window.removeEventListener('touchstart', unlockSafari);
      window.removeEventListener('scroll', unlockSafari);
      window.removeEventListener('keydown', unlockSafari);
    };
  }, []);

  // 3. GSAP + ScrollTrigger Scrub Bridge
  useEffect(() => {
    if (prefersReducedMotion) return;

    const section = sectionRef.current;
    const pinContainer = pinContainerRef.current;
    const video = videoRef.current;
    if (!section || !pinContainer || !video) return;

    const dur = videoDuration && !isNaN(videoDuration) && videoDuration > 0 ? videoDuration : 10;
    const totalScrollDistance = dur * PIXELS_PER_SECOND;

    // Proxy object tweened by ScrollTrigger - never directly write raw scroll listeners
    const proxy = { t: 0 };

    const ctx = gsap.context(() => {
      gsap.to(proxy, {
        t: dur,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${totalScrollDistance}`,
          pin: pinContainer,
          pinSpacing: true,
          scrub: 1.0, // Numeric scrub (1.0s easing) for silky smooth inertia
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (isPlayingAuto) return;
            const curTime = Math.min(Math.max(self.progress * dur, 0), dur);
            setVideoTime(curTime);

            // Sync milestone index (0 to 5)
            const milestoneIndex = Math.min(
              Math.floor(self.progress * MILESTONE_SERVICES.length),
              MILESTONE_SERVICES.length - 1
            );
            setActiveMilestoneIdx(milestoneIndex);
          },
        },
        onUpdate: () => {
          if (isPlayingAuto) return;
          // Apply proxy time directly to video element frame-by-frame
          if (video.readyState >= 2 && !isNaN(proxy.t) && isFinite(proxy.t)) {
            video.currentTime = Math.min(Math.max(proxy.t, 0), dur);
          }
        },
      });
    }, section);

    // Refresh ScrollTrigger after initializing
    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
    };
  }, [videoDuration, prefersReducedMotion, isPlayingAuto]);

  // 4. Handle Video Metadata Loaded & Error Fallbacks
  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.duration && !isNaN(video.duration) && isFinite(video.duration)) {
      setVideoDuration(video.duration);
    }
    setVideoLoaded(true);
    // Refresh ScrollTrigger once metadata (duration) is known
    ScrollTrigger.refresh();
  };

  const handleVideoError = () => {
    setVideoError(true);
  };

  // 5. Jump to specific timestamp / scroll position
  const jumpToTime = useCallback(
    (targetSeconds: number) => {
      const section = sectionRef.current;
      if (!section) return;

      const dur = videoDuration || 10;
      const progress = Math.min(Math.max(targetSeconds / dur, 0), 1);
      const totalScrollDistance = dur * PIXELS_PER_SECOND;
      const targetScrollY = section.offsetTop + progress * totalScrollDistance;

      scrollTo(targetScrollY, { duration: 1.0 });
    },
    [videoDuration, scrollTo]
  );

  const handleSelectMilestone = (idx: number) => {
    setActiveMilestoneIdx(idx);
    const dur = videoDuration || 10;
    const targetSec = (idx / (MILESTONE_SERVICES.length - 1)) * dur;
    jumpToTime(targetSec);
  };

  // 6. Optional Autoplay Preview Loop
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlayingAuto) {
      video.playbackRate = 1.0;
      video.play().catch(() => {});

      const trackProgress = () => {
        if (!video.paused) {
          setVideoTime(video.currentTime);
          const dur = videoDuration || 10;
          const progress = video.currentTime / dur;
          const milestoneIndex = Math.min(
            Math.floor(progress * MILESTONE_SERVICES.length),
            MILESTONE_SERVICES.length - 1
          );
          setActiveMilestoneIdx(milestoneIndex);
        }
        autoPlayAnimRef.current = requestAnimationFrame(trackProgress);
      };
      autoPlayAnimRef.current = requestAnimationFrame(trackProgress);
    } else {
      video.pause();
      if (autoPlayAnimRef.current) {
        cancelAnimationFrame(autoPlayAnimRef.current);
      }
    }

    return () => {
      if (autoPlayAnimRef.current) cancelAnimationFrame(autoPlayAnimRef.current);
    };
  }, [isPlayingAuto, videoDuration]);

  // Lead capture email state
  const [emailInput, setEmailInput] = useState('');

  const [emailSending, setEmailSending] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setEmailSending(true);
    const result = await sendLeadCapture({ email: emailInput, source: 'Homepage hero' });
    setEmailSending(false);

    if (result.success) {
      toast.success('Thanks — check your inbox', {
        description: `We sent a confirmation to ${result.confirmationSentTo ?? emailInput}.`,
      });
      setEmailInput('');
    } else {
      toast.error("Couldn't save your email", {
        description: `${result.error ?? 'Please try again'} — or email vivek@myplanetservices.com directly.`,
      });
    }
  };

  // Determine current active milestone and phase name
  const currentMilestone = MILESTONE_SERVICES[activeMilestoneIdx] || MILESTONE_SERVICES[0];
  const currentPhase = `Milestone ${currentMilestone.mile} · ${currentMilestone.timeRange}`;

  return (
    <>
      {/* Scroll Runway Section (Derived directly from video duration * PIXELS_PER_SECOND) */}
      <section
        ref={sectionRef}
        id="hero-track"
        className="relative w-full"
        style={{
          // Allocate exact scroll distance so pin releases with zero dead zone
          minHeight: prefersReducedMotion ? '100dvh' : `calc(100dvh + ${(videoDuration || 10) * PIXELS_PER_SECOND}px)`,
        }}
      >
        {/* Pinned 100vh Viewport Container */}
        <div
          ref={pinContainerRef}
          className="w-full h-[100dvh] overflow-hidden relative will-change-transform transform-gpu flex flex-col justify-between"
          style={{
            paddingTop: 'clamp(6rem, 14vh, 7.5rem)',
            paddingBottom: 'clamp(0.5rem, 1.8vh, 1.25rem)',
          }}
        >
          {/* Background Video Player with Frame-by-Frame Scrubbing */}
          <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none bg-zinc-950">
            {/* Fallback Poster Image */}
            <img
              src="/assets/hero-scrub-poster.jpg"
              alt="My Planet Services Architecture Visual"
              className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-700 ${
                videoLoaded && !videoError ? 'opacity-0' : 'opacity-100'
              }`}
            />

            {/* Video Element for Hardware-Decoded Frame Scrubbing */}
            {!videoError && (
              <video
                ref={videoRef}
                src="/assets/hero-scrub.mp4"
                poster="/assets/hero-scrub-poster.jpg"
                playsInline
                muted
                preload="auto"
                onLoadedMetadata={handleLoadedMetadata}
                onError={handleVideoError}
                className={`absolute inset-0 w-full h-full object-cover object-top brightness-[0.97] contrast-[1.02] transform-gpu will-change-transform transition-opacity duration-500 ${
                  videoLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden',
                }}
              />
            )}

            {/* High-Performance Luminous Sky Protection Scrim for 100% Black Typography Contrast */}
            <div className="absolute inset-x-0 top-0 h-[62%] bg-gradient-to-b from-white/90 via-white/45 to-transparent dark:from-zinc-950/92 dark:via-zinc-950/55 pointer-events-none z-[1]" />
            <div className="absolute inset-x-0 bottom-0 h-[28%] bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none z-[1]" />
          </div>

          {/* Main 3-Zone Content Container Guaranteed to Fit 100dvh */}
          <div className="relative z-10 w-full max-w-7xl 2xl:max-w-[90rem] min-[120rem]:max-w-[100rem] mx-auto px-3.5 sm:px-8 h-full flex flex-col justify-between">
            {/* Zone 1: Top Sky Area (Eyebrow + Responsive Headline + Logo Capsule) */}
            <div className="w-full flex flex-col items-start text-left shrink-0">
              {/* Pill Eyebrow with Live Scroll-Time Phase Indicator */}
              <button
                type="button"
                onClick={() => handleSelectMilestone((activeMilestoneIdx + 1) % MILESTONE_SERVICES.length)}
                className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 hover:bg-white dark:bg-zinc-900/90 dark:hover:bg-zinc-900 backdrop-blur-md border border-black/10 dark:border-white/15 text-zinc-950 dark:text-white text-[10px] sm:text-[11.5px] font-semibold mb-1.5 shadow-xs transition-all duration-300 cursor-pointer group"
                title="Click to advance to next phase"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-emerald-800 uppercase tracking-wider font-mono">
                  {currentPhase}
                </span>
                <span className="text-zinc-300 dark:text-zinc-600">·</span>
                <span className="text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors">Scroll to scrub</span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Main Headline (Scaled bigger and bolder for perfect visibility) */}
              <h1
                className="font-display font-medium tracking-tight text-zinc-950 dark:text-white drop-shadow-xs max-w-3xl mb-1.5"
                style={{
                  fontSize: 'clamp(1.75rem, 2.7vw + 1.2vh, 3.5rem)',
                  lineHeight: 1.08,
                  letterSpacing: '-0.035em',
                }}
              >
                One unified system to build, <br className="hidden sm:inline" />
                test, ship, and scale software
              </h1>

              {/* Floating Logo Ribbon in Crisp Protective Glass Capsule */}
              <div className="inline-flex flex-wrap items-center gap-3.5 sm:gap-6 px-4 py-1 rounded-full bg-white/75 dark:bg-zinc-900/75 backdrop-blur-md border border-black/10 dark:border-white/15 shadow-xs">
                {TRUST_LOGOS.map((logo) => (
                  <span
                    key={logo}
                    className="font-display font-bold text-[9.5px] sm:text-[11px] lg:text-[12px] tracking-widest text-zinc-800 dark:text-zinc-300 uppercase hover:text-zinc-950 dark:hover:text-white transition-colors cursor-default"
                  >
                    {logo}
                  </span>
                ))}
              </div>
            </div>

            {/* Zone 2: Lower Ground Area (Clean, Unobstructed Landscape) */}
            <div className="w-full flex items-end justify-between my-auto shrink-0">
              {/* Left: Email Lead Capture Pill (Matches Image 2 & Website Theme) */}
              <form
                onSubmit={handleEmailSubmit}
                className="rounded-full bg-white/90 hover:bg-white/95 focus-within:bg-white dark:bg-zinc-900/90 dark:hover:bg-zinc-900/95 dark:focus-within:bg-zinc-900 backdrop-blur-xl border border-black/10 dark:border-white/15 shadow-xl pl-4 pr-1.5 py-1.5 flex items-center gap-2 max-w-[320px] sm:max-w-[360px] w-full transition-all duration-300 focus-within:ring-2 focus-within:ring-zinc-950/20"
              >
                <div className="flex flex-col flex-1 text-left min-w-0">
                  <label
                    htmlFor="hero-email"
                    className="text-[8px] sm:text-[8.5px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider leading-none mb-0.5"
                  >
                    Your email address
                  </label>
                  <input
                    id="hero-email"
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="samantha@email.com"
                    className="bg-transparent border-none outline-none text-xs sm:text-[12.5px] font-medium text-zinc-950 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 p-0 leading-tight w-full"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={emailSending}
                  className="bg-zinc-950 hover:bg-black text-white dark:bg-butter dark:text-butter-foreground dark:hover:bg-butter/90 px-3.5 py-1.5 sm:px-4.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-semibold tracking-wide inline-flex items-center gap-1 transition-all duration-300 shadow-md hover:scale-102 active:scale-95 cursor-pointer shrink-0 disabled:opacity-60"
                >
                  <span>{emailSending ? 'Sending…' : 'Get Started'}</span>
                  <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
              </form>
            </div>

            {/* Zone 3: Bottom Grounded Video Scrubber HUD Bar */}
            <div className="w-full shrink-0 pb-1.5 sm:pb-2">
              <div className="rounded-[18px] sm:rounded-[24px] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-black/10 dark:border-white/15 px-3.5 py-2 sm:px-5 sm:py-2.5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-2.5 text-zinc-900 dark:text-zinc-100 text-xs">
                {/* Left: Playhead Time & Autoplay Controls */}
                <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsPlayingAuto(!isPlayingAuto)}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-zinc-950 text-white dark:bg-butter dark:text-butter-foreground flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
                    aria-label={isPlayingAuto ? 'Pause preview' : 'Play preview continuous'}
                  >
                    {isPlayingAuto ? <Pause className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current ml-0.5" />}
                  </button>

                  <div className="text-left font-mono">
                    <div className="font-bold text-zinc-950 dark:text-white text-[10.5px] sm:text-[11.5px] flex items-center gap-1.5">
                      <span>⏱️ {videoTime.toFixed(1)}s / {(videoDuration || 10).toFixed(1)}s</span>
                      <span className="text-[9.5px] sm:text-[10px] text-zinc-500 dark:text-zinc-400 font-normal">
                        ({Math.round((videoTime / (videoDuration || 10)) * 100)}% Scrubbed)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Scroll Milestone Quick Jump Buttons */}
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap shrink-0">
                  {SCROLL_PHASES.map((phase) => {
                    const Icon = phase.icon;
                    const isActive =
                      (phase.time === 0 && videoTime < 3.0) ||
                      (phase.time === 3 && videoTime >= 3.0 && videoTime < 6.0) ||
                      (phase.time === 6 && videoTime >= 6.0 && videoTime < 9.0) ||
                      (phase.time >= 9 && videoTime >= 9.0);

                    return (
                      <button
                        key={phase.label}
                        type="button"
                        onClick={() => jumpToTime(phase.time)}
                        className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-[9.5px] sm:text-[10.5px] font-medium inline-flex items-center gap-1.5 transition-all duration-300 cursor-pointer ${
                          isActive
                            ? 'bg-zinc-950 text-white dark:bg-butter dark:text-butter-foreground shadow-xs scale-102 font-semibold'
                            : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-white/10 dark:hover:bg-white/20 dark:text-zinc-300'
                        }`}
                      >
                        <Icon className="w-3 h-3" />
                        <span>{phase.label}</span>
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => jumpToTime(0)}
                    className="p-1 sm:p-1.5 rounded-lg text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 dark:hover:text-white dark:hover:bg-white/10 transition-colors cursor-pointer ml-0.5"
                    title="Reset to 0s"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive System Tour Modal */}
      <SystemTourModal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
      />
    </>
  );
}

export default Hero;
