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
} from 'lucide-react';

const PARTNER_LOGOS = [
  'Vantage',
  'Greenish',
  'Glossy',
  'Ebooks',
  'Proline',
  'Flash',
  'Northwind',
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
        <div className="flex shrink-0 items-center gap-16 sm:gap-20 animate-marquee py-2">
          {PARTNER_LOGOS.map((logo, idx) => (
            <span
              key={`logo-1-${idx}`}
              className="text-2xl sm:text-3xl font-display font-semibold tracking-tight text-ink-muted hover:text-ink-foreground transition-colors cursor-default whitespace-nowrap"
            >
              {logo}
            </span>
          ))}
        </div>
        <div
          className="flex shrink-0 items-center gap-16 sm:gap-20 animate-marquee py-2"
          aria-hidden="true"
        >
          {PARTNER_LOGOS.map((logo, idx) => (
            <span
              key={`logo-2-${idx}`}
              className="text-2xl sm:text-3xl font-display font-semibold tracking-tight text-ink-muted hover:text-ink-foreground transition-colors cursor-default whitespace-nowrap"
            >
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}


export function Services() {
  const listRef = useRef<HTMLDivElement>(null);

  /**
   * Scroll focus — the row nearest the vertical centre of the viewport sits at
   * full size while rows further away recede. Peak scale is 1.0 and never above,
   * so a focused row can't overflow the container on a wide screen.
   *
   * Large pointer screens only: on a phone a row already fills most of the
   * viewport, so scaling it just reads as jitter.
   */
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const cards = gsap.utils.toArray<HTMLElement>('[data-focus-card]', list);
      if (!cards.length) return;

      // quickSetter writes straight to the style without per-frame tween overhead.
      const setters = cards.map((el) => ({
        setScale: gsap.quickSetter(el, 'scale') as (v: number) => void,
        setOpacity: gsap.quickSetter(el, 'opacity') as (v: number) => void,
        el,
      }));

      const update = () => {
        const vh = window.innerHeight;
        const viewportCentre = vh / 2;
        // How far from centre a row must travel before it has fully receded.
        const falloff = vh * 0.58;

        for (const { el, setScale, setOpacity } of setters) {
          const rect = el.getBoundingClientRect();
          const cardCentre = rect.top + rect.height / 2;
          const distance = Math.min(Math.abs(cardCentre - viewportCentre) / falloff, 1);
          const proximity = 1 - distance;
          // smoothstep, so size eases in near the centre instead of tracking linearly
          const eased = proximity * proximity * (3 - 2 * proximity);

          setScale(0.945 + 0.055 * eased);
          setOpacity(0.68 + 0.32 * eased);
        }
      };

      // Lenis already bridges its scroll into ScrollTrigger.update(), so this
      // stays in sync with the smooth-scroll loop rather than fighting it.
      const trigger = ScrollTrigger.create({
        trigger: list,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: update,
        onRefresh: update,
      });

      update();

      return () => {
        trigger.kill();
        // quickSetter writes inline styles that matchMedia won't revert for us.
        gsap.set(cards, { clearProps: 'transform,opacity' });
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="services"
      className="py-16 sm:py-24 lg:py-32 scroll-mt-12 bg-background relative overflow-hidden"
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

        {/* Single column of full-width capability rows */}
        <div ref={listRef} className="flex flex-col gap-4 sm:gap-5">
          {SERVICES_DATA.map((service, index) => {
            const Icon = service.icon;
            const dark = service.highlight;

            return (
              /* Layer 1 — reveal owns the entry translate */
              <div
                key={service.title}
                data-reveal
              >
                {/* Layer 2 — GSAP owns this transform (scroll focus) */}
                <div data-focus-card className="will-change-transform transform-gpu">
                  {/* Layer 3 — CSS owns this transform (hover) */}
                  <article
                    className={`group/card block rounded-[28px] sm:rounded-[32px] border overflow-hidden relative transition-[transform,box-shadow] duration-500 ease-out lg:hover:scale-[1.018] ${
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

                    <div className="relative p-6 sm:p-8 lg:p-10 grid gap-6 sm:gap-8 lg:gap-12 lg:grid-cols-[auto_minmax(0,1.45fr)_minmax(0,1fr)] lg:items-center">
                      {/* Zone 1 — icon + index */}
                      <div className="flex lg:flex-col items-center lg:items-start gap-4 shrink-0">
                        <div
                          style={{ animationDelay: `${index * 0.3}s` }}
                          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-xs animate-icon-float ${
                            dark
                              ? 'bg-butter text-butter-foreground animate-icon-glow'
                              : 'bg-secondary text-foreground group-hover/card:bg-butter group-hover/card:text-butter-foreground transition-colors duration-300 animate-icon-glow-dark'
                          }`}
                        >
                          <Icon
                            style={{ animationDelay: `${index * 0.2}s` }}
                            className={`w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-300 group-hover/card:scale-110 ${
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
                          className={`inline-block text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full mb-3 ${
                            dark
                              ? 'bg-white/10 text-butter border border-white/10'
                              : 'bg-secondary text-muted-foreground'
                          }`}
                        >
                          {service.category}
                        </span>

                        <h3
                          className={`font-display text-xl sm:text-2xl lg:text-[1.75rem] font-medium tracking-tight leading-snug mb-2.5 ${
                            dark ? 'text-ink-foreground' : 'text-foreground'
                          }`}
                        >
                          {service.title}
                        </h3>

                        <p
                          className={`text-sm leading-relaxed mb-5 ${
                            dark ? 'text-ink-muted' : 'text-muted-foreground'
                          }`}
                        >
                          {service.description}
                        </p>

                        <Link
                          to={`/services?tab=${service.id}`}
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                            dark
                              ? 'text-butter hover:text-ink-foreground'
                              : 'text-foreground hover:text-butter-foreground'
                          }`}
                        >
                          <span>Explore capability</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/card:translate-x-1" />
                        </Link>
                      </div>

                      {/* Zone 3 — bullets */}
                      <div
                        className={`flex flex-col gap-3 pt-5 border-t lg:pt-0 lg:border-t-0 lg:pl-10 lg:border-l ${
                          dark ? 'border-white/10' : 'border-border/60'
                        }`}
                      >
                        {service.bullets.map((bullet) => (
                          <div
                            key={bullet}
                            className={`flex items-center gap-2.5 text-xs sm:text-[13px] font-medium ${
                              dark ? 'text-ink-foreground' : 'text-foreground/80'
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                                dark
                                  ? 'bg-butter/20 text-butter'
                                  : 'bg-butter/30 text-butter-foreground'
                              }`}
                            >
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                            <span>{bullet}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
