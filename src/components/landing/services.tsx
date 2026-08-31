import { Link } from 'react-router-dom';
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
    <section className="bg-zinc-950 py-10 overflow-hidden border-y border-white/10 relative select-none">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 mb-6 text-center">
        <p className="text-xs uppercase font-mono tracking-[0.28em] text-zinc-400">
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
              className="text-2xl sm:text-3xl font-display font-semibold tracking-tight text-zinc-500 hover:text-white transition-colors cursor-default whitespace-nowrap"
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
              className="text-2xl sm:text-3xl font-display font-semibold tracking-tight text-zinc-500 hover:text-white transition-colors cursor-default whitespace-nowrap"
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
  return (
    <section id="services" className="py-24 sm:py-32 scroll-mt-12 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div data-reveal className="max-w-3xl mb-16 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-butter text-butter-foreground text-[11px] font-semibold uppercase tracking-[0.14em] shadow-xs mb-5">
            <span>Specialized Capabilities</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-medium leading-[1.05] tracking-tight text-foreground mb-6">
            Engineered disciplines. <br />
            One accountable squad.
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            We operate as an integrated product unit: strategy, UI/UX architecture, full-stack engineering, and AI automation working in seamless weekly cadence.
          </p>
        </div>

        {/* 6-Card Bento Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES_DATA.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                data-reveal
                data-reveal-delay={`${index * 70}`}
                className={`rounded-[32px] p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl border group relative overflow-hidden ${
                  service.highlight
                    ? 'bg-zinc-950 text-white border-butter/30 shadow-xl'
                    : 'bg-card text-foreground border-border/80 shadow-soft'
                }`}
              >
                {/* Highlight Glow for Feature Card */}
                {service.highlight && (
                  <div
                    className="absolute -top-16 -right-16 w-40 h-40 bg-butter/15 rounded-full blur-2xl pointer-events-none"
                    aria-hidden="true"
                  />
                )}

                <div>
                  {/* Top Bar: Animated Icon + Category Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div
                      style={{ animationDelay: `${index * 0.3}s` }}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xs animate-icon-float ${
                        service.highlight
                          ? 'bg-butter text-butter-foreground animate-icon-glow'
                          : 'bg-secondary text-foreground group-hover:bg-butter group-hover:text-butter-foreground animate-icon-glow-dark'
                      }`}
                    >
                      <Icon
                        style={{ animationDelay: `${index * 0.2}s` }}
                        className={`w-6 h-6 transition-transform duration-300 group-hover:scale-120 ${
                          index === 0
                            ? 'animate-icon-spin'
                            : index === 1
                            ? 'animate-icon-wiggle'
                            : index === 2
                            ? 'animate-icon-bob'
                            : index === 3
                            ? 'animate-icon-wiggle'
                            : index === 4
                            ? 'animate-icon-pulse'
                            : 'animate-icon-sway'
                        }`}
                      />
                    </div>

                    <span
                      className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        service.highlight
                          ? 'bg-white/10 text-butter border border-white/10'
                          : 'bg-secondary text-muted-foreground'
                      }`}
                    >
                      {service.category}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3
                    className={`font-display text-xl sm:text-2xl font-medium tracking-tight mb-3 ${
                      service.highlight ? 'text-white' : 'text-foreground'
                    }`}
                  >
                    {service.title}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed mb-6 ${
                      service.highlight ? 'text-zinc-300' : 'text-muted-foreground'
                    }`}
                  >
                    {service.description}
                  </p>
                </div>

                {/* Bullets List */}
                <div
                  className={`pt-5 border-t flex flex-col gap-2.5 ${
                    service.highlight ? 'border-white/10' : 'border-border/60'
                  }`}
                >
                  {service.bullets.map((bullet) => (
                    <div
                      key={bullet}
                      className={`flex items-center gap-2 text-xs font-medium ${
                        service.highlight ? 'text-zinc-200' : 'text-foreground/80'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                          service.highlight ? 'bg-butter/20 text-butter' : 'bg-butter/30 text-butter-foreground'
                        }`}
                      >
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 mt-2">
                  <Link
                    to={`/services?tab=${service.id}`}
                    className={`inline-flex items-center gap-1 text-xs font-semibold transition-colors ${
                      service.highlight
                        ? 'text-butter hover:text-white'
                        : 'text-zinc-900 hover:text-black dark:text-zinc-200'
                    }`}
                  >
                    <span>Explore capability</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
