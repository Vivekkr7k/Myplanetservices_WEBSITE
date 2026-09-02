import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SEOHead } from '../components/common/seo-head';
import { getBreadcrumbSchema, getServicesSchema } from '../lib/seo-schemas';
import {
  Globe,
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
  Code,
  Shield,
  Zap,
} from 'lucide-react';

const DISCIPLINES = [
  {
    id: 'ecommerce',
    icon: ShoppingCart,
    title: 'E-Commerce Development',
    tagline: 'High-converting custom storefronts, headless Shopify, & sub-second checkout',
    description:
      'We architect custom e-commerce engines, headless Shopify Plus setups, and bespoke Medusa / WooCommerce platforms engineered for extreme load velocity, custom product configurators, and 30%+ higher cart conversion rates.',
    deliverables: [
      'Headless Shopify Plus & Medusa.js custom architectures',
      'Sub-second checkout flows & multi-currency payment routing',
      'Interactive 3D product visualizers & custom bundle builders',
      'Automated ERP, CRM, inventory & logistics synchronization',
      'Abandoned cart recovery & automated dynamic upsell funnels',
      'Ultra-fast Core Web Vitals (98+ mobile speed score guarantee)',
    ],
    tech: ['Shopify Plus', 'Medusa.js', 'Next.js', 'Stripe', 'Sanity', 'Tailwind CSS'],
  },
  {
    id: 'corporate',
    icon: Building2,
    title: 'Company & Corporate Websites',
    tagline: 'Flagship corporate digital presences that build enterprise trust and pipeline',
    description:
      'Modern corporate websites crafted for market leaders, venture-backed startups, and scaling enterprises. High-touch editorial design, 60fps micro-animations, multi-language localization, and autonomous headless CMS control.',
    deliverables: [
      'Bespoke brand identity translation into interactive digital experiences',
      'Headless CMS with visual component block builders (Sanity, Strapi)',
      'Enterprise security, SOC2 compliance & WCAG AAA accessibility',
      'Multi-language localization (i18n) & multi-region edge delivery',
      'Interactive investor relations, case studies & team hubs',
      'Integrated lead qualification & marketing automation webhooks',
    ],
    tech: ['React 19', 'Next.js', 'Sanity CMS', 'Framer Motion', 'Tailwind v4', 'Vercel Edge'],
  },
  {
    id: 'redesign',
    icon: RefreshCw,
    title: 'Website Redesign & Modernization',
    tagline: 'Transform outdated legacy websites into modern, high-converting platforms',
    description:
      'Upgrade legacy WordPress sites, bloated theme builders, or outdated tech stacks into blazing-fast modern React architectures. We preserve 100% of your existing SEO equity while completely revamping visual aesthetics and mobile responsiveness.',
    deliverables: [
      '100% 301 redirect mapping guaranteeing zero loss in SEO rankings',
      'Complete visual overhaul with modern luxury glassmorphism typography',
      '5× to 10× speed increase (lifting Google PageSpeed scores to 95+)',
      'Legacy code refactoring, eliminating fragile plugins & security holes',
      'Mobile-first responsive optimization with intuitive touch ergonomics',
      'Seamless database, blog post archive, and asset migration',
    ],
    tech: ['React 19', 'Vite', 'Tailwind v4', 'Google PageSpeed', 'Next.js', 'Lighthouse'],
  },
  {
    id: 'crm-erp',
    icon: Database,
    title: 'Custom CRM & ERP Systems',
    tagline: 'Tailored business operating engines, automated pipelines, & custom dashboards',
    description:
      'Stop wrestling with inflexible off-the-shelf software. We engineer tailored internal tools, automated CRM pipelines, ERP resource planners, and live analytics hubs built around your exact operational workflows.',
    deliverables: [
      'Custom sales pipeline management & lead scoring copilots',
      'Real-time inventory tracking, warehouse management & logistics dashboards',
      'Role-based granular permissions (RBAC) & SSO enterprise security',
      'Automated billing, quote generation & PDF invoicing engines',
      'Two-way synchronization with Slack, WhatsApp, email, and SQL databases',
      'Instant vector search, customer history timeline, and live activity streams',
    ],
    tech: ['PostgreSQL', 'Supabase', 'Node.js', 'React 19', 'Tailwind v4', 'Redis'],
  },
  {
    id: 'web',
    icon: Globe,
    title: 'Website Development',
    tagline: 'High-converting marketing sites & platforms built on modern React stacks',
    description:
      'We design and engineer bespoke web platforms optimized for speed, accessibility, and autonomous content editing. No sluggish themes or fragile site builders — pure production-grade engineering.',
    deliverables: [
      'Next-generation React & Vite / Next.js architecture',
      'Headless CMS integration (Sanity, Strapi, Contentful)',
      'Sub-second Core Web Vitals (95+ score guarantee)',
      'Interactive 3D & custom micro-animations',
      'Full responsive design across all viewports',
      'Automated CI/CD deployment pipelines',
    ],
    tech: ['React 19', 'TypeScript', 'Tailwind v4', 'Next.js', 'Vite', 'Sanity'],
  },
  {
    id: 'ai',
    icon: Bot,
    title: 'AI Automation & Agents',
    tagline: 'Custom copilots and smart workflows that remove manual work',
    description:
      'We build domain-specific AI agents, Retrieval-Augmented Generation (RAG) knowledge systems, and automated data pipelines that accelerate operations and customer support.',
    deliverables: [
      'Custom LLM agents tailored to proprietary company docs',
      'RAG knowledge retrieval with vector embeddings',
      'Automated sales qualification & customer triage',
      'Internal operations workflow automations',
      'Real-time streaming chat & voice interfaces',
      'Enterprise data privacy & zero-retention guardrails',
    ],
    tech: ['OpenAI', 'Anthropic', 'LangChain', 'LlamaIndex', 'Pinecone', 'Python'],
  },
  {
    id: 'saas',
    icon: Layers,
    title: 'SaaS Product Engineering',
    tagline: 'End-to-end product builds: auth, multi-tenancy, billing & cloud infra',
    description:
      'From Day 0 whiteboard to production-ready MVP in 6 to 10 weeks. We handle database schema design, multi-tenant tenancy, Stripe checkout, role-based access, and autoscaling infrastructure.',
    deliverables: [
      'Scalable multi-tenant architecture',
      'Stripe / LemonSqueezy subscription billing integration',
      'Role-based permissions & SSO authentication',
      'High-performance analytics & admin dashboards',
      'Automated test suites & security auditing',
      'Autoscaling cloud infrastructure (AWS / Supabase)',
    ],
    tech: ['PostgreSQL', 'Supabase', 'Node.js', 'Stripe', 'Docker', 'AWS'],
  },
  {
    id: 'app',
    icon: Smartphone,
    title: 'App Development',
    tagline: 'Fluid cross-platform iOS & Android apps with native performance',
    description:
      'Crafted mobile applications that look gorgeous, feel responsive at 120fps, and provide offline capability with instant cloud synchronization.',
    deliverables: [
      'React Native & Flutter cross-platform architecture',
      'Consistent design system components',
      'Offline-first data sync & local caching',
      'Biometric authentication & secure keychain',
      'Push notification automation & deep linking',
      'End-to-end App Store & Google Play submission',
    ],
    tech: ['React Native', 'Flutter', 'Expo', 'Swift', 'Kotlin', 'Firebase'],
  },
  {
    id: 'seo',
    icon: Search,
    title: 'SEO, AEO & GEO Strategy',
    tagline: 'Rank in classic search, answer engines, and generative AI results',
    description:
      'Modern search is no longer just keywords. We optimize your brand to dominate Google rankings, perplexity answer boxes, and ChatGPT citation responses.',
    deliverables: [
      'Full technical SEO audit & performance crawl fixes',
      'Answer Engine Optimization (AEO) entity schema',
      'Generative Engine Optimization (GEO) citation strategy',
      'Programmatic SEO architecture & landing hubs',
      'High-authority editorial content strategy',
      'Weekly ranking & attribution intelligence',
    ],
    tech: ['Schema.org', 'JSON-LD', 'Google Search Console', 'Ahrefs', 'Semrush'],
  },
  {
    id: 'marketing',
    icon: Megaphone,
    title: 'Digital Marketing & Growth',
    tagline: 'Paid, lifecycle, and acquisition funnels measured against revenue',
    description:
      'Stop burning cash on vanity impressions. We build targeted performance advertising, retention lifecycle loops, and conversion rate optimizations tied to bottom-line ARR.',
    deliverables: [
      'Multi-channel performance campaigns (Meta, Google, LinkedIn)',
      'Automated onboarding & churn-reduction lifecycle emails',
      'A/B testing & landing page conversion optimization',
      'Multi-touch revenue attribution modeling',
      'Viral referral & growth loop mechanics',
      'Transparent real-time analytics dashboards',
    ],
    tech: ['Meta Ads', 'Google Ads', 'Klaviyo', 'Customer.io', 'PostHog', 'Segment'],
  },
];

const TECH_STACK = [
  { name: 'React 19', category: 'Frontend' },
  { name: 'TypeScript', category: 'Language' },
  { name: 'Next.js', category: 'Framework' },
  { name: 'Shopify Plus', category: 'E-Commerce' },
  { name: 'Medusa.js', category: 'Headless Store' },
  { name: 'Tailwind CSS v4', category: 'Styling' },
  { name: 'React Native', category: 'Mobile' },
  { name: 'Python', category: 'Backend / AI' },
  { name: 'OpenAI / Claude', category: 'AI Models' },
  { name: 'PostgreSQL', category: 'Database' },
  { name: 'Supabase', category: 'Backend' },
  { name: 'Redis', category: 'Cache / Queues' },
  { name: 'Docker', category: 'DevOps' },
  { name: 'Stripe', category: 'Payments' },
  { name: 'AWS Cloud', category: 'Infra' },
];

export function ServicesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || 'ecommerce');

  useEffect(() => {
    if (tabParam && DISCIPLINES.some((d) => d.id === tabParam)) {
      setActiveTab(tabParam);
      const el = document.getElementById('capabilities-spotlight');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [tabParam]);

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    setSearchParams({ tab: id });
  };

  const activeDiscipline = DISCIPLINES.find((d) => d.id === activeTab) || DISCIPLINES[0];
  const Icon = activeDiscipline.icon;

  const servicesSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      getBreadcrumbSchema([{ name: 'Services', path: '/services' }]),
      getServicesSchema(
        DISCIPLINES.map((d) => ({
          id: d.id,
          title: d.title,
          description: d.description,
          deliverables: d.deliverables,
        }))
      ),
    ],
  };

  return (
    <div className="pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pt-36 lg:pb-32 overflow-hidden">
      <SEOHead
        title="Engineered Services & Product Capabilities — My Planet Services"
        description="Explore our 9 specialized engineering disciplines: Headless E-Commerce, Corporate Websites, Website Redesign, Custom CRM & ERP, SaaS Platforms, Mobile Apps, AI Automation, SEO/AEO/GEO, and Digital Marketing."
        canonicalPath="/services"
        keywords="headless commerce, Shopify Plus development, enterprise SaaS development, AI automation workflows, React 19, Next.js, mobile app development, SEO AEO GEO optimization"
        schema={servicesSchema}
      />
      {/* Aurora Glow */}
      <div
        className="aurora absolute inset-x-0 -top-24 h-[620px] opacity-90 blur-[2px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="site-container-narrow">
        {/* Header */}
        <div className="max-w-3xl text-left mb-16">
          <div className="bg-butter text-butter-foreground rounded-full px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] inline-flex items-center gap-2 shadow-sm mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Capabilities</span>
          </div>
          <h1 className="font-display text-display-xl font-medium text-foreground mb-6">
            Complete disciplines. <br />
            One senior studio. <br />
            Zero friction.
          </h1>
          <p className="text-[16px] sm:text-[18px] leading-relaxed text-muted-foreground max-w-2xl">
            From bespoke E-Commerce engines and corporate flagships to custom CRM/ERP operating systems, AI swarms, and high-velocity SaaS engineering — our senior pod delivers with zero junior handoffs.
          </p>
        </div>

        {/* Interactive Discipline Navigator */}
        <div id="capabilities-spotlight" className="mb-20 scroll-mt-24">
          {/* Tab Selector — Flex Wrap for visibility of all tabs */}
          <div className="flex flex-wrap items-center gap-2.5 mb-8">
            {DISCIPLINES.map((item) => {
              const TabIcon = item.icon;
              const isSelected = item.id === activeTab;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-2.5 cursor-pointer border ${
                    isSelected
                      ? 'bg-ink text-ink-foreground border-ink shadow-soft scale-[1.02]'
                      : 'bg-card text-muted-foreground border-border hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-butter text-butter-foreground' : 'bg-secondary text-foreground'
                    }`}
                  >
                    <TabIcon className="w-3.5 h-3.5" />
                  </div>
                  <span>{item.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Detail Spotlight Card */}
          <div className="rounded-[32px] bg-card border border-border p-8 sm:p-12 shadow-soft transition-all duration-300">
            <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 items-start">
              {/* Left Details */}
              <div className="text-left">
                <div className="w-14 h-14 rounded-2xl bg-butter text-butter-foreground flex items-center justify-center mb-6 shadow-sm animate-icon-float animate-icon-glow">
                  <Icon className="w-7 h-7 animate-icon-pulse group-hover:scale-120 transition-transform" />
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-foreground mb-3">
                  {activeDiscipline.title}
                </h2>
                <p className="text-sm font-medium text-butter-foreground bg-butter/30 px-3 py-1 rounded-full inline-block mb-6">
                  {activeDiscipline.tagline}
                </p>
                <p className="text-[15px] leading-relaxed text-muted-foreground mb-8">
                  {activeDiscipline.description}
                </p>

                {/* Tech Pills */}
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">
                    Technologies & Stacks
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeDiscipline.tech.map((t) => (
                      <span
                        key={t}
                        className="px-3 py-1 rounded-lg bg-secondary text-foreground text-xs font-medium border border-border/60"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Deliverables Checklist */}
              <div className="bg-secondary/60 rounded-3xl p-6 sm:p-8 border border-border/80 text-left">
                <h3 className="font-display text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-butter-foreground" />
                  <span>Key Deliverables & Standards</span>
                </h3>
                <div className="flex flex-col gap-3">
                  {activeDiscipline.deliverables.map((del) => (
                    <div key={del} className="flex items-start gap-3 text-xs sm:text-sm text-foreground/90">
                      <div className="w-4 h-4 rounded-full bg-butter/40 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 text-butter-foreground stroke-[3]" />
                      </div>
                      <span>{del}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-border/60">
                  <Link
                    to="/contact"
                    className="w-full bg-ink text-ink-foreground rounded-full py-3.5 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                  >
                    <span>Request proposal for this discipline</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* All 6 Disciplines Grid Overview */}
        <div className="mb-24">
          <div className="text-left mb-10">
            <h2 className="font-display text-3xl font-medium tracking-tight text-foreground mb-3">
              Comprehensive Service Suite
            </h2>
            <p className="text-sm text-muted-foreground">
              Explore our full ecosystem of capabilities designed to work independently or as an integrated pod.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
            {DISCIPLINES.map((d, dIdx) => {
              const CardIcon = d.icon;
              return (
                <div
                  key={d.id}
                  className="rounded-3xl border border-border bg-card p-7 text-left flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-soft group"
                >
                  <div>
                    <div
                      style={{ animationDelay: `${dIdx * 0.3}s` }}
                      className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mb-6 text-foreground group-hover:bg-butter group-hover:text-butter-foreground transition-colors animate-icon-float"
                    >
                      <CardIcon
                        style={{ animationDelay: `${dIdx * 0.2}s` }}
                        className={`w-6 h-6 transition-transform duration-300 group-hover:scale-120 ${
                          dIdx === 0
                            ? 'animate-icon-spin'
                            : dIdx === 1
                            ? 'animate-icon-wiggle'
                            : dIdx === 2
                            ? 'animate-icon-wiggle'
                            : dIdx === 3
                            ? 'animate-icon-pulse'
                            : dIdx === 4
                            ? 'animate-icon-sway'
                            : 'animate-icon-bob'
                        }`}
                      />
                    </div>
                    <h3 className="font-display text-xl font-medium tracking-tight text-foreground mb-2">
                      {d.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                      {d.description}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      handleTabChange(d.id);
                      const el = document.getElementById('capabilities-spotlight');
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className="text-xs font-semibold text-foreground flex items-center gap-1.5 hover:text-butter-foreground transition-colors cursor-pointer pt-4 border-t border-border/60"
                  >
                    <span>Explore details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tech Stack Cloud */}
        <div className="rounded-[32px] bg-ink text-ink-foreground p-8 sm:p-14 text-left border border-white/5 shadow-float mb-20">
          <div className="max-w-2xl mb-10">
            <div className="text-xs uppercase tracking-wider text-butter font-semibold mb-3 flex items-center gap-2">
              <Code className="w-4 h-4" />
              <span>Modern Engineering Arsenal</span>
            </div>
            <h2 className="font-display text-display-md font-medium text-ink-foreground mb-4">
              Built on battle-tested, high-performance technology.
            </h2>
            <p className="text-sm text-ink-muted leading-relaxed">
              We do not use cookie-cutter templates or bloated frameworks. Every project runs on modern, typed, and observable codebases built for enterprise scale.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {TECH_STACK.map((item) => (
              <div
                key={item.name}
                className="bg-ink-soft rounded-2xl p-4 border border-white/5 flex flex-col items-start justify-center hover:border-butter/30 transition-colors"
              >
                <span className="font-display font-medium text-sm text-ink-foreground mb-1">
                  {item.name}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-ink-muted">
                  {item.category}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Ready CTA */}
        <div className="rounded-3xl bg-butter text-butter-foreground p-8 sm:p-12 text-center shadow-soft">
          <div className="max-w-2xl mx-auto">
            <div className="w-12 h-12 rounded-full bg-ink text-butter flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="font-display text-display-md font-medium mb-4">
              Ready to accelerate your delivery?
            </h2>
            <p className="text-sm text-butter-foreground/80 leading-relaxed mb-8">
              Whether you need an MVP in 8 weeks, an AI automation copilot, or full growth infrastructure — our team is ready to deploy.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/contact"
                className="bg-ink text-ink-foreground rounded-full px-8 py-3.5 text-sm font-semibold hover:scale-105 transition-transform"
              >
                Start your project brief
              </Link>
              <Link
                to="/pricing"
                className="bg-white/40 text-butter-foreground rounded-full px-8 py-3.5 text-sm font-semibold hover:bg-white/60 transition-colors"
              >
                View pricing plans
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServicesPage;
