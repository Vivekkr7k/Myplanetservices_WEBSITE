import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  ExternalLink,
  ArrowUpRight,
  Quote,
  Star,
  Lock,
  RotateCw,
  Layers,
  Zap,
} from 'lucide-react';
import { SEOHead } from '../components/common/seo-head';
import { getBreadcrumbSchema, SITE_URL } from '../lib/seo-schemas';

export interface Deliverable {
  title: string;
  desc: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  avatar: string;
}

export interface CaseStudy {
  client: string;
  url: string;
  displayUrl: string;
  category: string;
  badge: string;
  metric: string;
  metricLabel: string;
  metricSub: string;
  headline: string;
  tagline: string;
  overview: string;
  deliverables: Deliverable[];
  testimonial: Testimonial;
  image: string;
  tech: string[];
}

const CATEGORIES = [
  'All',
  'Architectural Lighting & 3D Storefront',
  'AI & Augmented Reality',
  'Digital Signage & Display CMS',
  'B2B E-Commerce & Drone Supplies',
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    client: 'Edison Lighting',
    url: 'https://edisonlighting.in/',
    displayUrl: 'edisonlighting.in',
    category: 'Architectural Lighting & 3D Storefront',
    badge: '3D Studio & WebGL Storefront',
    metric: '3D + AR',
    metricLabel: 'Interactive Studio & Visualiser',
    metricSub: 'Next.js 15 & Razorpay PWA',
    headline: 'Architectural Lighting, Made with Precision — Custom LED Storefront & 3D Studio',
    tagline: "Bangalore architectural, decorative & custom LED manufacturer's storefront & PWA",
    overview:
      "Edison Lighting is a premier Bangalore-based architectural, decorative, and custom LED manufacturer. We engineered an immersive digital flagship and e-commerce platform featuring an extensive product catalogue, Razorpay checkout, cart and wishlist, express quote and lead capture, interactive Design Studio, AR visualiser, smart-home 3D lock viewer, journal, project gallery, customer accounts, order tracking, and an admin portal for analytics, leads, and catalogues — all packaged as a high-performance installable PWA.",
    deliverables: [
      {
        title: 'Interactive 3D Design Studio & AR Visualiser',
        desc: 'Custom Three.js / React Three Fiber engine with real-time lighting customizers, room AR preview, and interactive smart-home 3D lock viewer.',
      },
      {
        title: 'Full E-Commerce with Razorpay Checkout',
        desc: 'Comprehensive architectural fixture catalogue, cart & wishlist, sub-second search, express quoting workflows, and integrated Razorpay payments.',
      },
      {
        title: 'Customer Accounts & Order Lifecycle Tracking',
        desc: 'Self-service customer portal with order status tracking, saved project configurations, design journals, and architectural project gallery.',
      },
      {
        title: 'Admin Operations Hub & Installable PWA',
        desc: 'Complete administrative back-office for catalogue management, lead pipelines, and sales analytics, engineered as an offline-ready Next.js 15 PWA.',
      },
    ],
    testimonial: {
      quote:
        'Working with Vivek has been truly amazing, he genuinely converted my creativity into something beautiful. He was always ready to help with anything that I needed, be it a change in website, design or to even come up with ideas. I highly recommend Vivek if you need a great website.',
      author: 'Sahil Sogi',
      role: 'Founder, Edison Lighting',
      avatar: 'SS',
    },
    image: '/assets/works/edison-preview.png',
    tech: ['Next.js 15', 'React 19', 'Three.js / R3F', 'Tailwind v4', 'MongoDB', 'GSAP', 'Lenis', 'Zustand', 'Razorpay'],
  },
  {
    client: 'ARiqA',
    url: 'https://ariqa.in/',
    displayUrl: 'ariqa.in',
    category: 'AI & Augmented Reality',
    badge: 'Computer Vision & WebGL',
    metric: '< 50ms',
    metricLabel: 'Real-Time AR Latency',
    metricSub: 'Sub-frame facial mesh tracking',
    headline: 'The Art of Augmented Reflection — AI & AR Virtual Try-On for Retail',
    tagline: 'Precision AR for virtual beauty, eyewear, jewellery & apparel try-ons',
    overview:
      'ARiqA combines AI computer vision and WebGL 3D reflection to deliver precise, real-time virtual try-ons across eyewear, jewellery, cosmetics, and apparel. We engineered an ultra-fast engine so shoppers experiment with confidence, bridging imagination and reality while cutting retail return rates.',
    deliverables: [
      {
        title: '68-Point Facial Landmark Tracking',
        desc: 'Sub-50ms continuous facial mesh tracking with photorealistic specular reflection lighting.',
      },
      {
        title: 'Multi-Category Try-On Modules',
        desc: 'Custom 3D rendering pipelines for eyewear, necklaces, earrings, lip cosmetics, and outfits.',
      },
      {
        title: 'Headless E-Commerce Embed SDK',
        desc: 'Lightweight drop-in JavaScript SDK for Shopify, WooCommerce, and custom web applications.',
      },
      {
        title: 'Smart Mirror In-Store Kiosk Mode',
        desc: 'Hardware-accelerated kiosk application engineered for luxury brick-and-mortar retail flagships.',
      },
    ],
    testimonial: {
      quote:
        'We are very happy with the work done on Ariqa.in. The team was creative, responsive and open to our ideas throughout the development process. They delivered a visually appealing website that gives Ariqa a strong and professional digital presence.',
      author: 'Sunil',
      role: 'Founder & Leadership, Ariqa.in',
      avatar: 'SU',
    },
    image: '/assets/works/ariqa-preview.png',
    tech: ['Three.js', 'WebAssembly', 'Python', 'React 19', 'WebGL', 'Tailwind CSS'],
  },
  {
    client: 'Wintek Digital',
    url: 'https://www.wintekdigital.com/',
    displayUrl: 'wintekdigital.com',
    category: 'Digital Signage & Display CMS',
    badge: 'Enterprise Cloud Network',
    metric: '1,000+',
    metricLabel: 'Connected Enterprise Displays',
    metricSub: 'Nationwide commercial screens',
    headline: 'Turning Footfall into Revenue with Intelligent Display Solutions',
    tagline: "India's End-to-End Digital Signage Partner & Touch Screen Kiosks",
    overview:
      'End-to-end digital signage, interactive floor kiosks, and commercial LED display network engineered for retail enterprises, transit hubs, and healthcare. Backed by a centralized cloud CMS platform enabling multi-zone canvas scheduling, offline-first playback, and nationwide SLA support.',
    deliverables: [
      {
        title: 'Centralized Multi-Screen Cloud CMS',
        desc: 'Real-time content scheduling, emergency broadcast overrides, and multi-tenant canvas layout control.',
      },
      {
        title: 'Touch-Screen Kiosk OS & Software',
        desc: 'Interactive kiosk software engineered with offline-first playback caching and remote telemetry.',
      },
      {
        title: 'High-Impact Commercial LED Walls',
        desc: 'Ultra-bright indoor and outdoor display configurations optimized to transform footfall into revenue.',
      },
      {
        title: 'Nationwide Hardware Support & SLA',
        desc: 'End-to-end hardware provisioning, field installation, and 24/7 remote device monitoring.',
      },
    ],
    testimonial: {
      quote:
        'The team did an excellent job translating our vision for Wintek Digital into a modern, professional website. They understood our digital signage solutions well and created a website that presents our products and capabilities in a clear and engaging way.',
      author: 'Prasanna R Goudar',
      role: 'Co-founder, CEO for Wintek Digital.com',
      avatar: 'PG',
    },
    image: '/assets/works/wintek-preview.png',
    tech: ['React 19', 'Node.js', 'AWS IoT', 'Electron', 'PostgreSQL', 'Tailwind v4'],
  },
  {
    client: 'Fortune India',
    url: 'https://fortune-india.co.in/',
    displayUrl: 'fortune-india.co.in',
    category: 'B2B E-Commerce & Drone Supplies',
    badge: 'High-Concurrency Storefront',
    metric: '500+',
    metricLabel: 'Drone Parts & B2B Components',
    metricSub: 'Worldwide delivery from Bangalore',
    headline: 'Transforming Your Vision into Reality — B2B Electronics & Drone Parts',
    tagline: 'Commercial drone motors, carbon fiber structurals & industrial supplies',
    overview:
      'High-velocity B2B e-commerce platform and inventory system for commercial drone components, brushless motors, carbon fiber CNC sheets, sensors, and development boards. Built with wholesale volume quotation workflows, GST tax invoicing, and instant spec-based catalog search.',
    deliverables: [
      {
        title: 'Tiered Wholesale B2B Engine',
        desc: 'Dynamic volume-based pricing tiers, custom bulk quotation workflows, and automated GST invoicing.',
      },
      {
        title: '500+ SKU Instant Search Catalog',
        desc: 'High-speed headless catalog with sub-second faceted filtering across technical drone specifications.',
      },
      {
        title: 'Integrated Payments & Logistics',
        desc: 'Razorpay payment gateways, automated live shipping calculation, and worldwide order dispatch tracking.',
      },
      {
        title: 'Sub-Second Core Web Vitals Speed',
        desc: 'Engineered with Next.js/React achieving 98+ PageSpeed performance across mobile and desktop devices.',
      },
    ],
    testimonial: {
      quote:
        'Outstanding component build quality, consistent specifications, and dependable engineering. The B2B digital catalog and quotation workflows significantly streamlined procurement across our commercial operations.',
      author: 'AeroVanguard Technologies',
      role: 'B2B Client Desk & Engineering Partner',
      avatar: 'AV',
    },
    image: '/assets/works/fortune-india-preview.png',
    tech: ['Next.js / React', 'Tailwind CSS', 'Razorpay API', 'PostgreSQL', 'Algolia Search'],
  },
];

export function WorkPage() {
  const [selectedCat, setSelectedCat] = useState('All');

  const workSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      getBreadcrumbSchema([{ name: 'Our Work & Client Platforms', path: '/work' }]),
      {
        '@type': 'CollectionPage',
        '@id': `${SITE_URL}/work#webpage`,
        url: `${SITE_URL}/work`,
        name: 'Our Work — Websites & Platforms Developed by My Planet Services',
        description:
          'Explore production platforms engineered by My Planet Services: Edison Lighting architectural 3D storefront, ARiqA AI/AR virtual try-on, Wintek Digital enterprise signage CMS, and Fortune India B2B drone commerce.',
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: CASE_STUDIES.map((study, idx) => ({
            '@type': 'CreativeWork',
            position: idx + 1,
            name: `${study.client} — ${study.headline}`,
            description: study.overview,
            url: study.url,
          })),
        },
      },
    ],
  };

  const filteredStudies =
    selectedCat === 'All'
      ? CASE_STUDIES
      : CASE_STUDIES.filter((item) => item.category === selectedCat);

  return (
    <div className="pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pt-36 lg:pb-32 overflow-hidden">
      <SEOHead
        title="Our Work — Websites & Platforms Engineered by My Planet Services"
        description="Explore production platforms built by My Planet Services: Edison Lighting architectural 3D storefront, ARiqA AI/AR virtual try-on, Wintek Digital enterprise signage CMS, and Fortune India B2B drone commerce."
        canonicalPath="/work"
        keywords="Edison Lighting, ARiqA virtual try on, Wintek Digital signage, Fortune India drone parts, architectural lighting e-commerce, web development portfolio, SaaS case studies, My Planet Services projects"
        schema={workSchema}
      />

      {/* Ambient Glow */}
      <div
        className="aurora absolute inset-x-0 -top-24 h-[650px] opacity-85 blur-[3px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="site-container-narrow">
        {/* Header */}
        <div className="max-w-3xl text-left mb-14 sm:mb-16">
          <div className="bg-butter text-butter-foreground rounded-full px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] inline-flex items-center gap-2 shadow-xs mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Featured Client Deployments</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-foreground mb-6 leading-[1.08]">
            Real platforms. <br />
            Real businesses. <br />
            Engineered by our squad.
          </h1>

          <p className="text-[16px] sm:text-[18px] leading-relaxed text-muted-foreground max-w-2xl">
            Explore live commercial platforms, custom e-commerce engines, and AI/AR applications designed, engineered, and shipped by My Planet Services.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-14">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer border ${
                selectedCat === cat
                  ? 'bg-ink text-ink-foreground border-ink shadow-soft'
                  : 'bg-card text-muted-foreground border-border hover:text-foreground hover:bg-secondary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Unique Showcase Cards */}
        <div className="flex flex-col gap-16 sm:gap-24 mb-24">
          {filteredStudies.map((study, idx) => (
            <article
              key={study.client}
              className="rounded-[36px] sm:rounded-[44px] border border-border/80 bg-card/95 shadow-soft hover:shadow-2xl transition-all duration-500 overflow-hidden text-left relative group"
            >
              {/* Card Top Identity & Status Bar */}
              <div className="px-6 sm:px-10 py-5 sm:py-6 border-b border-border/70 bg-secondary/40 flex flex-wrap items-center justify-between gap-4">
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

                <div className="flex items-center gap-4">
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
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-ink-foreground text-xs sm:text-sm font-semibold hover:bg-butter hover:text-butter-foreground hover:scale-105 transition-all duration-200 shadow-xs group/btn"
                  >
                    <span>Launch Live Site</span>
                    <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Showcase Centerpiece: Large Immersive Browser Frame */}
              <div className="p-2.5 sm:p-5 lg:p-6 bg-gradient-to-b from-secondary/30 via-background to-card">
                <div className="rounded-2xl sm:rounded-3xl border border-border/90 bg-ink/95 shadow-2xl overflow-hidden relative group/browser">
                  {/* macOS / Modern Browser Chrome Bar */}
                  <div className="bg-ink px-3.5 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between border-b border-white/10 gap-2 sm:gap-3">
                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ff5f56]" />
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ffbd2e]" />
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#27c93f]" />
                    </div>

                    {/* Centered Address Pill with Lock */}
                    <div className="flex-1 max-w-[190px] sm:max-w-md mx-auto flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-0.5 sm:py-1 rounded-full bg-white/5 border border-white/10 text-[10.5px] sm:text-xs text-white/70 font-mono">
                      <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400 shrink-0" />
                      <span className="truncate">https://{study.displayUrl}/</span>
                    </div>

                    <div className="flex items-center gap-2 text-white/40">
                      <RotateCw className="w-3.5 h-3.5 hidden sm:block" />
                      <a
                        href={study.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/60 hover:text-white transition-colors p-1"
                        title="Open in new tab"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Visual Preview Container */}
                  <a
                    href={study.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block relative overflow-hidden bg-black/40 group/view"
                  >
                    <img
                      src={study.image}
                      alt={`${study.client} production preview`}
                      className="w-full h-auto max-h-[360px] lg:max-h-[400px] object-cover object-top transition-transform duration-700 ease-out group-hover/view:scale-[1.015]"
                      loading={idx === 0 ? 'eager' : 'lazy'}
                    />

                    {/* Floating Glass Metric Badge (Desktop only: hidden on mobile so it never obscures the screenshot) */}
                    <div className="hidden sm:flex absolute bottom-6 right-6 backdrop-blur-xl bg-ink/90 text-ink-foreground border border-white/20 p-4 sm:p-5 rounded-2xl sm:rounded-3xl shadow-2xl items-center gap-4 transition-transform duration-300 group-hover/view:scale-105">
                      <div className="w-12 h-12 rounded-2xl bg-butter text-butter-foreground flex items-center justify-center font-display text-xl font-bold shrink-0 shadow-xs">
                        <Zap className="w-6 h-6 fill-current text-butter-foreground" />
                      </div>
                      <div>
                        <div className="font-display text-2xl sm:text-3xl font-semibold text-butter leading-none mb-1">
                          {study.metric}
                        </div>
                        <div className="text-[11px] sm:text-xs text-white font-medium">
                          {study.metricLabel}
                        </div>
                        <div className="text-[10px] text-ink-muted uppercase tracking-wider font-mono">
                          {study.metricSub}
                        </div>
                      </div>
                    </div>
                  </a>

                  {/* Mobile Metric Bar (Cleanly docked below the image on mobile so the preview is 100% unobstructed) */}
                  <div className="sm:hidden bg-ink/95 border-t border-white/10 px-3.5 py-2.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-butter text-butter-foreground flex items-center justify-center font-display text-xs font-bold shrink-0">
                        <Zap className="w-3.5 h-3.5 fill-current text-butter-foreground" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-display text-sm font-semibold text-butter leading-none truncate">
                          {study.metric}
                        </div>
                        <div className="text-[10.5px] text-white/80 font-medium truncate">
                          {study.metricLabel}
                        </div>
                      </div>
                    </div>
                    <div className="text-[9px] text-ink-muted uppercase tracking-wider font-mono shrink-0">
                      {study.metricSub}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Insights Grid: 3 Structured Columns */}
              <div className="p-5 sm:p-7 lg:p-8 border-t border-border/70 grid lg:grid-cols-12 gap-5 lg:gap-6 items-start">
                {/* Column 1: Headline & Product Overview (5 cols) */}
                <div className="lg:col-span-5 flex flex-col justify-between">
                  <div>
                    <h2 className="font-display text-xl sm:text-2xl font-medium tracking-tight text-foreground mb-2 leading-snug">
                      {study.headline}
                    </h2>

                    <p className="text-xs sm:text-sm font-medium text-butter-foreground mb-3">
                      {study.tagline}
                    </p>

                    <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground mb-4">
                      {study.overview}
                    </p>
                  </div>

                  {/* Tech Stack Chips */}
                  <div className="pt-4 border-t border-border/60">
                    <div className="text-[11px] uppercase tracking-wider font-mono text-muted-foreground mb-2.5">
                      Core Technology Architecture
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {study.tech.map((t) => (
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

                {/* Column 2: Key Architecture & Deliverables (4 cols) */}
                <div className="lg:col-span-4">
                  <div className="text-[11px] uppercase tracking-wider font-mono text-muted-foreground mb-4 flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Engineered Deliverables</span>
                  </div>

                  <div className="flex flex-col gap-3.5">
                    {study.deliverables.map((item, dIdx) => (
                      <div
                        key={dIdx}
                        className="rounded-2xl bg-secondary/50 border border-border/70 p-4 transition-colors hover:bg-secondary"
                      >
                        <div className="font-display text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-butter-foreground" />
                          <span>{item.title}</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed pl-3.5">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 3: Verified Client Testimonial (3 cols) */}
                <div className="lg:col-span-3">
                  <div className="text-[11px] uppercase tracking-wider font-mono text-muted-foreground mb-4 flex items-center gap-2">
                    <Quote className="w-3.5 h-3.5" />
                    <span>Client Endorsement</span>
                  </div>

                  <div className="rounded-3xl bg-butter/20 border border-butter/40 p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
                    <div className="flex items-center gap-1 text-amber-500 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>

                    <blockquote className="font-display text-xs sm:text-[13px] font-medium leading-relaxed italic text-foreground mb-6">
                      “{study.testimonial.quote}”
                    </blockquote>

                    <div className="flex items-center gap-3 pt-4 border-t border-butter/30">
                      <div className="w-10 h-10 rounded-2xl bg-ink text-ink-foreground text-xs font-bold flex items-center justify-center shrink-0 shadow-xs">
                        {study.testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-display font-semibold text-xs text-foreground">
                          {study.testimonial.author}
                        </div>
                        <div className="text-[11px] text-muted-foreground leading-tight">
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

        {/* Global CTA Banner */}
        <div className="rounded-[36px] bg-butter text-butter-foreground p-8 sm:p-16 text-center shadow-soft relative overflow-hidden">
          <div className="max-w-2xl mx-auto relative z-10">
            <h2 className="font-display text-3xl sm:text-4xl font-medium tracking-tight mb-4">
              Have a product or platform to build?
            </h2>
            <p className="text-sm sm:text-base text-butter-foreground/85 leading-relaxed mb-8">
              Work directly with our senior full-stack and AI engineers. We take ambitious products from scope to production with weekly staging deployments.
            </p>
            <Link
              to="/contact"
              className="bg-ink text-ink-foreground rounded-full px-8 py-3.5 text-sm font-semibold hover:scale-105 transition-transform inline-flex items-center gap-2 shadow-soft"
            >
              <span>Submit project brief</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkPage;
