import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ShoppingCart,
  Building2,
  RefreshCw,
  Database,
  Smartphone,
  Bot,
  Search,
  Megaphone,
  Layers,
  Check,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

/**
 * Work we're asked for that doesn't map to any of the nine disciplines above.
 * Each one has to be clearly outside the list, or the section reads as padding.
 */
const BEYOND_THE_LIST = [
  'Marketplaces & multi-vendor platforms',
  'Booking & scheduling systems',
  'Data pipelines & BI dashboards',
  'Legacy system integration',
  'No-code migration (Bubble, Webflow → React)',
  'API productisation & developer portals',
];

import { CASE_STUDIES } from '../../pages/work-page';

/**
 * Work project company names showcased in the trusted marquee banner
 */
const WORK_CLIENT_NAMES = CASE_STUDIES.map((study) => study.client);

// Repeat client names across the marquee track for a full, continuous loop
const PARTNER_LOGOS = [
  ...WORK_CLIENT_NAMES,
  ...WORK_CLIENT_NAMES,
  ...WORK_CLIENT_NAMES,
];

const SERVICES_DATA = [
  {
    id: 'ecommerce',
    icon: ShoppingCart,
    category: 'Storefronts & Commerce',
    title: 'E-Commerce Development',
    description:
      'Custom headless storefronts, Shopify Plus architectures & Medusa.js engines built for sub-second checkout, custom 3D configurators, and 30%+ cart conversion lift.',
    bullets: [
      'Headless Shopify Plus & Medusa',
      'Sub-second checkout & Shop Pay',
      'ERP & real-time inventory sync',
    ],
    highlight: true, // Black Card
  },
  {
    id: 'corporate',
    icon: Building2,
    category: 'Brand & Flagship Web',
    title: 'Company & Corporate Websites',
    description:
      'Modern corporate websites crafted for market leaders. High-touch editorial design, 60fps micro-animations, multi-language localization, and headless CMS control.',
    bullets: [
      'Editorial brand motion & design',
      'Sanity & Strapi headless CMS',
      'Enterprise security & SOC2 ready',
    ],
    highlight: false,
  },
  {
    id: 'redesign',
    icon: RefreshCw,
    category: 'Modernization & Speed',
    title: 'Website Redesign & Modernization',
    description:
      'Transform outdated legacy WordPress or bloated theme sites into blazing-fast modern React platforms with 100% 301 SEO protection and 98+ PageSpeed scores.',
    bullets: [
      'Zero SEO ranking equity loss',
      '5× to 10× load speed boost',
      'Mobile ergonomics & modern UI/UX',
    ],
    highlight: true, // Black Card
  },
  {
    id: 'crm-erp',
    icon: Database,
    category: 'Enterprise Systems',
    title: 'Custom CRM & ERP Systems',
    description:
      'Tailored business operating engines, automated lead scoring pipelines, inventory tracking, role-based dashboards, and live multi-channel synchronization.',
    bullets: [
      'Tailored sales & ops pipelines',
      'Granular RBAC & SSO security',
      'Automated invoicing & reporting',
    ],
    highlight: false,
  },
  {
    id: 'ai',
    icon: Bot,
    category: 'AI & Autonomous Swarms',
    title: 'AI Agents & Copilots',
    description:
      'Autonomous multi-agent workflows, hybrid vector knowledge bases (RAG), and reasoning copilots that eliminate manual operational bottlenecks with 14ms response.',
    bullets: [
      'Autonomous agent swarms',
      'Hybrid Vector RAG embeddings',
      'Operations & support bots',
    ],
    highlight: true, // Black Card
  },
  {
    id: 'saas',
    icon: Layers,
    category: 'Product Engineering',
    title: 'SaaS Platform Engineering',
    description:
      'End-to-end MVP in 6–10 weeks: multi-tenant schema, Stripe subscription tiers, authentication pipelines, and resilient cloud edge infrastructure.',
    bullets: [
      'MVP in 6–10 weeks',
      'Multi-tenant DB & auth',
      'Stripe usage billing & portals',
    ],
    highlight: false,
  },
  {
    id: 'app',
    icon: Smartphone,
    category: 'Mobile Systems',
    title: 'Mobile App Development',
    description:
      'High-polish native iOS and Android apps with 60fps gesture physics, unified design tokens, offline sync, and App Store submission support.',
    bullets: [
      'React Native & Flutter',
      'Offline sync & local SQLite',
      'Biometric auth & push engine',
    ],
    highlight: true, // Black Card
  },
  {
    id: 'seo',
    icon: Search,
    category: 'Search & LLM Indexing',
    title: 'SEO, AEO & GEO Program',
    description:
      'Rank #1 in traditional search engines while dominating AI answer engines (ChatGPT, Perplexity, Claude) through rich entity schema graphs.',
    bullets: [
      'Generative engine optimization',
      'Knowledge entity schema graphs',
      'Technical SEO telemetry',
    ],
    highlight: false,
  },
  {
    id: 'marketing',
    icon: Megaphone,
    category: 'Growth Architecture',
    title: 'Performance Marketing',
    description:
      'Paid acquisition, automated retention funnels, and attribution pipelines engineered directly against bottom-line revenue, not vanity metrics.',
    bullets: [
      'Multi-channel ad funnels',
      'Lifecycle email automation',
      'Real-time revenue attribution',
    ],
    highlight: false,
  },
];

export function LogoMarquee() {
  return (
    <section className="bg-ink py-10 overflow-hidden border-y border-white/10 relative select-none">
      <div className="site-container mb-6 text-center">
        <p className="text-xs uppercase font-mono tracking-[0.28em] text-ink-muted">
          Trusted by fast-growing technology companies
        </p>
      </div>

      {/* Marquee Track with masked gradient edges */}
      <div
        className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]"
        aria-label="Client logos"
      >
        <div className="flex shrink-0 items-center gap-16 sm:gap-20 pr-16 sm:pr-20 animate-marquee py-2">
          {PARTNER_LOGOS.map((logo, idx) => (
            <Link
              key={`logo-1-${idx}`}
              to="/work"
              className="text-2xl sm:text-3xl font-display font-semibold tracking-tight text-ink-muted hover:text-butter transition-colors whitespace-nowrap cursor-pointer"
            >
              {logo}
            </Link>
          ))}
        </div>
        <div
          className="flex shrink-0 items-center gap-16 sm:gap-20 pr-16 sm:pr-20 animate-marquee py-2"
          aria-hidden="true"
        >
          {PARTNER_LOGOS.map((logo, idx) => (
            <Link
              key={`logo-2-${idx}`}
              to="/work"
              tabIndex={-1}
              className="text-2xl sm:text-3xl font-display font-semibold tracking-tight text-ink-muted hover:text-butter transition-colors whitespace-nowrap cursor-pointer"
            >
              {logo}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}


export function Services() {
  const listRef = useRef<HTMLDivElement>(null);

  /**
   * Stacked deck — every row pins a little below the row before it, so the next
   * row scrolls up and covers the one behind it, leaving a sliver of each
   * earlier row visible above the top of the deck.
   *
   * The pinning itself is pure CSS `position: sticky` (one stepped `top` per
   * row) and never depends on JS. GSAP only adds the depth cue: a row shrinks
   * and dims as rows pile on top of it, so the deck tapers back into the page.
   *
   * Large pointer screens only: below lg a row is the tall stacked layout, and
   * burying something that size reads as content going missing, not as depth.
   *
   * Two rules hold this together:
   *   1. A row's depth is never dimmed with opacity. These rows overlap now, so
   *      a translucent row shows the row underneath straight through its own
   *      background. The recede is an opaque scrim laid over the card instead.
   *   2. Depth is read from each row's live rect, not from accumulated offsets.
   *      A rect reports the sticky-resolved position directly, so "has this row
   *      reached its pin" is exact rather than the sum of nine measurements that
   *      only has to be wrong once to bury the whole deck.
   *
   * Reading rects here is safe from feedback: we read the sticky wrapper, which
   * is never transformed, and write to a layer inside it — and every read in a
   * frame happens before any write, so the loop can't thrash layout.
   */
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const items = gsap.utils.toArray<HTMLElement>('[data-stack-item]', list);
      if (items.length < 2) return;

      interface Row {
        /** The sticky element — read, never transformed. */
        item: HTMLElement;
        /** The layer inside it we scale, so the sticky offset stays untouched. */
        card: HTMLElement;
        setScale: (v: number) => void;
        /** Opaque overlay that shades the card as rows pile on top of it. */
        setShade: (v: number) => void;
        /** Viewport y this row pins at — its resolved CSS `top`. */
        pin: number;
        /** Scroll distance this row takes to travel over the row behind it. */
        span: number;
        /** This frame's viewport top, read before any style is written. */
        top: number;
      }

      const rows: Row[] = items.map((item) => {
        const card = item.querySelector<HTMLElement>('[data-stack-card]') ?? item;
        const shade = item.querySelector<HTMLElement>('[data-stack-shade]');
        return {
          item,
          card,
          // quickSetter writes straight to the style, no per-frame tween overhead.
          setScale: gsap.quickSetter(card, 'scale') as (v: number) => void,
          setShade: shade
            ? (gsap.quickSetter(shade, 'opacity') as (v: number) => void)
            : () => {},
          pin: 0,
          span: 1,
          top: 0,
        };
      });

      const measure = () => {
        const gap = parseFloat(getComputedStyle(list).rowGap) || 0;
        for (const row of rows) {
          row.pin = parseFloat(getComputedStyle(row.item).top) || 0;
          // Roughly the pin-to-pin travel. Deliberately local to this row: it
          // only sets how quickly the shading ramps, so being a few pixels out
          // costs nothing, where an accumulated total would compound.
          row.span = Math.max(row.item.offsetHeight + gap, 1);
        }
      };

      /** Rows further down the deck than this stop receding, so the bottom of a
       *  nine-row stack doesn't shrink away to nothing. */
      const MAX_DEPTH = 3;

      const apply = () => {
        // Read phase — every position read before any style write.
        for (const row of rows) row.top = row.item.getBoundingClientRect().top;

        // Write phase. Walking bottom-up lets each row read the depth
        // accumulated by every row in front of it in a single pass.
        let depth = 0;

        for (let i = rows.length - 1; i >= 0; i--) {
          const row = rows[i];
          const d = depth < MAX_DEPTH ? depth : MAX_DEPTH;

          // Scale is kept small on purpose: at this width 1% is ~12px off each
          // edge, so anything heavier fans the slivers out wider than the
          // 1.05rem they step down by.
          row.setScale(1 - 0.022 * d);
          row.setShade(0.07 * d);

          // How far this row has travelled toward covering the row behind it:
          // 0 a full span below its pin, exactly 1 once sticky has parked it
          // there. Read from the rect, so this is the row's true position.
          const travelled = (row.pin + row.span - row.top) / row.span;
          depth += travelled < 0 ? 0 : travelled > 1 ? 1 : travelled;
        }
      };

      let lastScroll = -1;

      // Driven by GSAP's ticker rather than a scroll callback: this runs exactly
      // once per animation frame, in step with Lenis, whether or not a scroll
      // event happened to fire.
      const render = () => {
        const scroll = window.scrollY;
        if (scroll === lastScroll) return;
        lastScroll = scroll;
        apply();
      };

      let disposed = false;
      const remeasure = () => {
        if (disposed) return;
        measure();
        apply();
      };

      remeasure();

      // Card heights move once the display face swaps in, and the deck's whole
      // rhythm is derived from those heights.
      document.fonts?.ready.then(remeasure);

      gsap.ticker.add(render);
      ScrollTrigger.addEventListener('refresh', remeasure);
      window.addEventListener('resize', remeasure);

      return () => {
        disposed = true;
        gsap.ticker.remove(render);
        ScrollTrigger.removeEventListener('refresh', remeasure);
        window.removeEventListener('resize', remeasure);
        // quickSetter writes inline styles that matchMedia won't revert for us.
        gsap.set(
          rows.map((row) => row.card),
          { clearProps: 'transform,scale' }
        );
        gsap.set(list.querySelectorAll('[data-stack-shade]'), {
          clearProps: 'opacity',
        });
      };
    });

    return () => mm.revert();
  }, []);

  return (
    /* overflow-x-clip, not overflow-hidden — `hidden` would make this section a
       scroll container and the stacked rows inside it would never pin.
       `isolate` keeps the deck's z-indexes from leaking into the rest of the page. */
    <section
      id="services"
      className="py-16 sm:py-24 lg:py-32 scroll-mt-12 bg-background relative overflow-x-clip isolate"
    >
      <div className="site-container">
        {/* Section Header */}
        <div data-reveal className="max-w-3xl mb-12 sm:mb-16 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-butter text-butter-foreground text-[11px] font-semibold uppercase tracking-[0.14em] shadow-xs mb-5">
            <span>Specialized Capabilities</span>
          </div>
          <h2 className="font-display text-display-lg font-medium text-foreground mb-6">
            Engineered disciplines. <br />
            One accountable squad.
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            We operate as an integrated product unit: strategy, UI/UX architecture, full-stack engineering, and AI automation working in seamless weekly cadence.
          </p>
        </div>

        {/* Single column of full-width capability rows.
            On lg the rows become a stacked deck: --stack-top clears the fixed
            nav, --stack-step is the sliver of each covered row left showing,
            and the tall gap is the scroll distance one row takes to cover the
            row behind it. The trailing padding holds the finished deck on
            screen for a beat before the whole stack releases. */}
        <div
          ref={listRef}
          className="flex flex-col gap-3 sm:gap-4 lg:gap-[15vh] lg:pb-[15vh] [--stack-step:1.05rem] [--stack-top:7rem]"
        >
          {SERVICES_DATA.map((service, index) => {
            const Icon = service.icon;
            const dark = service.highlight;

            return (
              /* Layer 1 — CSS sticky owns the pin. Deliberately never
                 transformed: a transform here would shift the pinned box. */
              <div
                key={service.title}
                data-stack-item
                style={{
                  top: `calc(var(--stack-top) + ${index} * var(--stack-step))`,
                  zIndex: index + 1,
                }}
                className="lg:sticky"
              >
                {/* Layer 2 — reveal owns the entry translate */}
                <div data-reveal>
                  {/* Layer 3 — GSAP owns this transform (stack depth). Scaling
                      from the top edge keeps each covered row's sliver in place. */}
                  <div
                    data-stack-card
                    className="origin-top will-change-transform transform-gpu"
                  >
                    {/* Layer 4 — CSS owns this transform (hover) */}
                    <article
                      className={`group/card block rounded-[28px] sm:rounded-[32px] border overflow-hidden relative transition-[scale,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hover:scale-[1.018] ${
                        dark
                          ? 'bg-ink text-ink-foreground border-butter/30 shadow-xl hover:shadow-2xl'
                          : 'bg-card text-foreground border-border/80 shadow-soft hover:shadow-xl'
                      }`}
                    >
                      {/* Warm bloom on the ink rows */}
                      {dark && (
                        <div
                          className="absolute -top-20 -right-10 w-72 h-40 bg-butter/15 rounded-full blur-3xl pointer-events-none"
                          aria-hidden="true"
                        />
                      )}

                      {/* Depth cue for the stacked deck. It shades the card
                          from on top instead of fading the card out: the card's
                          own background stays fully opaque, so a covered row
                          can never read through the row sitting over it.
                          Clipped to the rounded corners by the article's
                          own overflow-hidden. */}
                      <div
                        data-stack-shade
                        className="absolute inset-0 z-10 bg-black opacity-0 pointer-events-none"
                        aria-hidden="true"
                      />

                      <div className="relative p-6 sm:p-7 lg:px-9 lg:py-10 min-h-[140px] sm:min-h-[155px] lg:min-h-[175px] grid gap-5 sm:gap-6 lg:gap-8 lg:grid-cols-[auto_minmax(0,1.55fr)_minmax(0,0.95fr)_auto] lg:items-center">
                        {/* Zone 1 — icon + index */}
                        <div className="flex lg:flex-col items-center lg:items-start gap-3 lg:gap-2 shrink-0">
                          <div
                            style={{ animationDelay: `${index * 0.3}s` }}
                            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 shadow-xs animate-icon-float ${
                              dark
                                ? 'bg-butter text-butter-foreground animate-icon-glow'
                                : 'bg-secondary text-foreground group-hover/card:bg-butter group-hover/card:text-butter-foreground transition-colors duration-300 animate-icon-glow-dark'
                            }`}
                          >
                            <Icon
                              style={{ animationDelay: `${index * 0.2}s` }}
                              className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover/card:scale-110 ${
                                index % 6 === 0
                                  ? 'animate-icon-spin'
                                  : index % 6 === 1
                                  ? 'animate-icon-wiggle'
                                  : index % 6 === 2
                                  ? 'animate-icon-bob'
                                  : index % 6 === 3
                                  ? 'animate-icon-wiggle'
                                  : index % 6 === 4
                                  ? 'animate-icon-pulse'
                                  : 'animate-icon-sway'
                              }`}
                            />
                          </div>
                          <span
                            className={`font-mono text-xs font-semibold tracking-widest tabular-nums ${
                              dark ? 'text-butter/70' : 'text-muted-foreground'
                            }`}
                          >
                            {String(index + 1).padStart(2, '0')}
                          </span>
                        </div>

                        {/* Zone 2 — category, title, description, CTA */}
                        <div className="min-w-0">
                          <span
                            className={`inline-block text-[9.5px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full mb-2 ${
                              dark
                                ? 'bg-white/10 text-butter border border-white/10'
                                : 'bg-secondary text-muted-foreground'
                            }`}
                          >
                            {service.category}
                          </span>

                          <h3
                            className={`font-display text-lg sm:text-xl lg:text-[1.35rem] font-medium tracking-tight leading-tight mb-2 ${
                              dark ? 'text-ink-foreground' : 'text-foreground'
                            }`}
                          >
                            {service.title}
                          </h3>

                          <p
                            className={`text-[13px] leading-relaxed ${
                              dark ? 'text-ink-muted' : 'text-muted-foreground'
                            }`}
                          >
                            {service.description}
                          </p>

                        </div>

                        {/* Zone 3 — bullets */}
                        <div
                          className={`flex flex-col gap-2.5 pt-4 border-t lg:pt-0 lg:border-t-0 lg:pl-8 lg:border-l ${
                            dark ? 'border-white/10' : 'border-border/60'
                          }`}
                        >
                          {service.bullets.map((bullet) => (
                            <div
                              key={bullet}
                              className={`flex items-center gap-2 text-[11.5px] sm:text-xs font-medium ${
                                dark ? 'text-ink-foreground' : 'text-foreground/80'
                              }`}
                            >
                              <div
                                className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${
                                  dark
                                    ? 'bg-butter/20 text-butter'
                                    : 'bg-butter/30 text-butter-foreground'
                                }`}
                              >
                                <Check className="w-2 h-2 stroke-[3.5]" />
                              </div>
                              <span>{bullet}</span>
                            </div>
                          ))}
                        </div>

                        {/* Zone 4 — CTA, pulled out of the text column so it
                            adds no height to the row */}
                        <Link
                          to={`/services?tab=${service.id}`}
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                            dark
                              ? 'text-butter hover:text-ink-foreground'
                              : 'text-foreground hover:text-butter-foreground'
                          }`}
                        >
                          <span>Explore capability</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/card:translate-x-1" />
                        </Link>
                      </div>
                    </article>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Closer: the nine rows are the common asks, not the boundary. */}
        <div
          data-reveal
          className="mt-4 sm:mt-5 rounded-[28px] sm:rounded-[32px] bg-ink text-ink-foreground border border-butter/30 shadow-xl relative overflow-hidden"
        >
          <div
            className="absolute -top-24 -right-16 w-80 h-56 bg-butter/15 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative p-7 sm:p-9 lg:p-11 grid gap-8 lg:gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-center">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.16em] text-butter font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5 shrink-0 animate-icon-sparkle" />
                <span>Not seeing yours?</span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl lg:text-[2rem] font-medium tracking-tight leading-tight text-ink-foreground mb-3">
                If you can describe it, we can build it.
              </h3>

              <p className="text-sm sm:text-[15px] leading-relaxed text-ink-muted mb-6 max-w-xl">
                The nine above are simply what we get asked for most. They are not
                the boundary. Tell us what you are trying to build — and if it is
                not something we should take on, we will say so and point you
                somewhere better.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/contact"
                  className="bg-butter text-butter-foreground px-5 py-3 rounded-full text-xs sm:text-sm font-semibold inline-flex items-center gap-2 hover:scale-[1.03] active:scale-95 transition-transform shadow-sm group/cta"
                >
                  <span>Describe your project</span>
                  <ArrowRight className="w-4 h-4 group-hover/cta:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  to="/process"
                  className="bg-white/5 text-ink-foreground border border-white/15 px-5 py-3 rounded-full text-xs sm:text-sm font-medium inline-flex items-center gap-2 hover:bg-white/10 transition-colors"
                >
                  <span>See how we scope</span>
                </Link>
              </div>
            </div>

            {/* Real briefs that fit none of the nine — concrete beats "anything". */}
            <div className="lg:pl-10 lg:border-l border-white/10">
              <div className="text-[10px] font-mono uppercase tracking-wider text-ink-muted font-semibold mb-4">
                Recently asked for, and built
              </div>
              <div className="flex flex-col gap-2.5">
                {BEYOND_THE_LIST.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2.5 text-xs sm:text-[13px] font-medium text-ink-foreground"
                  >
                    <div className="w-4 h-4 rounded-full bg-butter/20 text-butter flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
