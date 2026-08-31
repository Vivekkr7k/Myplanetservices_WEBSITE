import {
  ShoppingCart,
  Building2,
  RefreshCw,
  Database,
  Bot,
  Layers,
  Smartphone,
  Search,
  Server,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

export interface BundledPerk {
  id: string;
  icon: LucideIcon;
  label: string;
  short: string;
  detail: string;
}

/**
 * Shipped free with every one-time build (not with monthly retainers — see
 * `qualifiesForBundle`). Quoted prices already contain these.
 */
export const BUNDLED_PERKS: BundledPerk[] = [
  {
    id: 'hosting',
    icon: Server,
    label: '1 year of Hostinger hosting',
    short: '1 yr hosting',
    detail:
      'Business-tier plan with SSL, CDN and daily backups — provisioned and configured on an account that stays in your name.',
  },
  {
    id: 'maintenance',
    icon: Wrench,
    label: '1 year of maintenance',
    short: '1 yr maintenance',
    detail:
      'Security patches, dependency updates, uptime monitoring, and bug fixes on delivered scope — plus up to 2 hours of content edits each month.',
  },
];

export interface ServiceAddon {
  id: string;
  label: string;
  /** Flat INR amount added to the subtotal when selected. */
  price: number;
  /** Pre-selected when the service is first chosen in the estimator. */
  recommended?: boolean;
}

export interface ServicePricing {
  id: string;
  icon: LucideIcon;
  category: string;
  title: string;
  shortTitle: string;
  summary: string;
  /** Entry price in INR for the smallest production-ready scope. */
  startsAt: number;
  unit: string;
  timeline: string;
  /** Delivery window for a Starter-scale build; absent for retainers. */
  baseWeeks?: { min: number; max: number };
  /** True for monthly retainers rather than one-time builds. */
  recurring?: boolean;
  includes: string[];
  extra: string;
  popular?: boolean;
  addons: ServiceAddon[];
}

/**
 * Per-service entry pricing (INR) — single source of truth for the pricing
 * page grid, the home page starting-price strip, and the instant estimator.
 *
 * `startsAt` is the floor for the smallest production-ready scope of that
 * service. Edit the numbers here to re-price everywhere at once.
 */
export const SERVICE_PRICING: ServicePricing[] = [
  {
    id: 'ecommerce',
    icon: ShoppingCart,
    category: 'Web & Storefronts',
    title: 'E-Commerce + Admin Panel',
    shortTitle: 'E-Commerce + Admin',
    summary:
      'Custom storefront with a full merchant back-office: stock, orders, payments and revenue insight in one system.',
    startsAt: 15000,
    unit: 'one-time build',
    timeline: '3–5 weeks',
    baseWeeks: { min: 3, max: 5 },
    includes: [
      'Custom storefront with sub-second checkout',
      'Inventory & order management admin',
      'Live analytics & revenue dashboard',
      'Payment integration (Razorpay, Stripe, UPI)',
    ],
    extra: '5 more enterprise features',
    popular: true,
    addons: [
      { id: 'marketplace', label: 'Multi-vendor marketplace', price: 9000 },
      { id: 'reco', label: 'AI product recommendations', price: 8000, recommended: true },
      { id: 'erp-sync', label: 'ERP / Tally / Zoho sync', price: 7000 },
      { id: 'subscriptions', label: 'Subscriptions & loyalty engine', price: 6000 },
      { id: 'intl', label: 'Multi-language & multi-currency', price: 5000 },
    ],
  },
  {
    id: 'corporate',
    icon: Building2,
    category: 'Web & Storefronts',
    title: 'Company & Corporate Website',
    shortTitle: 'Corporate Website',
    summary:
      'Flagship brand presence with headless CMS control, motion design and lead capture wired to your CRM.',
    startsAt: 8000,
    unit: 'one-time build',
    timeline: '2–3 weeks',
    baseWeeks: { min: 2, max: 3 },
    includes: [
      'Up to 6 custom designed pages',
      'Headless CMS you edit yourself',
      'SEO, OpenGraph & analytics setup',
      'Lead forms with CRM / email routing',
    ],
    extra: '4 more growth features',
    addons: [
      { id: 'careers', label: 'Careers portal + ATS pipeline', price: 5000 },
      { id: 'i18n', label: 'Multi-language (i18n) rollout', price: 4500 },
      { id: 'blog', label: 'Blog & resource hub', price: 3500, recommended: true },
      { id: 'whatsapp', label: 'WhatsApp & CRM lead routing', price: 3000 },
    ],
  },
  {
    id: 'redesign',
    icon: RefreshCw,
    category: 'Web & Storefronts',
    title: 'Website Redesign & Modernization',
    shortTitle: 'Website Redesign',
    summary:
      'Legacy WordPress or theme-builder site rebuilt on a modern React stack without losing a single ranking.',
    startsAt: 10000,
    unit: 'one-time build',
    timeline: '2–4 weeks',
    baseWeeks: { min: 2, max: 4 },
    includes: [
      'Complete UI/UX visual overhaul',
      '95+ PageSpeed performance rebuild',
      '100% 301 redirect & SEO equity mapping',
      'Content, blog & asset migration',
    ],
    extra: '4 more modernization features',
    addons: [
      { id: 'wp-rebuild', label: 'Full WordPress → React rebuild', price: 8000, recommended: true },
      { id: 'design-system', label: 'New design system & brand kit', price: 7000 },
      { id: 'migration', label: 'Content migration (50+ pages)', price: 5000 },
      { id: 'a11y', label: 'Accessibility (WCAG AA) remediation', price: 4000 },
    ],
  },
  {
    id: 'seo',
    icon: Search,
    category: 'Growth & Visibility',
    title: 'SEO, AEO & GEO Program',
    shortTitle: 'SEO, AEO & GEO',
    summary:
      'Rank in Google, answer engines and generative AI results with a monthly compounding visibility program.',
    startsAt: 9000,
    unit: 'per month',
    timeline: 'Monthly retainer',
    recurring: true,
    includes: [
      'Full technical SEO audit & crawl fixes',
      'Answer Engine (AEO) entity schema',
      'ChatGPT & Perplexity citation strategy',
      'Monthly ranking & attribution reporting',
    ],
    extra: '4 more growth deliverables',
    addons: [
      { id: 'programmatic', label: 'Programmatic SEO landing pages', price: 8000 },
      { id: 'backlinks', label: 'Authority backlink outreach', price: 7000 },
      { id: 'content', label: 'Content writing (4 articles / month)', price: 6000, recommended: true },
      { id: 'local', label: 'Local SEO & Google Business', price: 3500 },
    ],
  },
  {
    id: 'ai',
    icon: Bot,
    category: 'Autonomous Systems',
    title: 'AI Automation & Agents',
    shortTitle: 'AI Agents',
    summary:
      'Domain-trained copilots and RAG knowledge systems that take repetitive operations off your team entirely.',
    startsAt: 20000,
    unit: 'one-time build',
    timeline: '3–6 weeks',
    baseWeeks: { min: 3, max: 6 },
    includes: [
      'Custom LLM agent trained on your docs',
      'Vector RAG knowledge retrieval pipeline',
      'WhatsApp, Slack & email automation hooks',
      'Streaming chat / voice interface',
    ],
    extra: '5 more automation features',
    addons: [
      { id: 'finetune', label: 'Custom fine-tune on your data', price: 15000 },
      { id: 'voice', label: 'WhatsApp & voice channel agent', price: 9000, recommended: true },
      { id: 'crm-hook', label: 'CRM + ticketing integration', price: 8000 },
      { id: 'handoff', label: 'Human handoff & analytics console', price: 6000 },
    ],
  },
  {
    id: 'app',
    icon: Smartphone,
    category: 'Mobile & Product',
    title: 'Mobile App Development',
    shortTitle: 'Mobile App',
    summary:
      'Cross-platform iOS and Android apps with native feel, offline sync and full store submission handled.',
    startsAt: 25000,
    unit: 'one-time build',
    timeline: '5–8 weeks',
    baseWeeks: { min: 5, max: 8 },
    includes: [
      'React Native / Flutter cross-platform build',
      'Offline-first sync & local caching',
      'Push notifications & deep linking',
      'App Store & Play Store submission',
    ],
    extra: '5 more product features',
    addons: [
      { id: 'admin-web', label: 'Companion admin web dashboard', price: 12000, recommended: true },
      { id: 'payments', label: 'In-app payments & subscriptions', price: 9000 },
      { id: 'offline', label: 'Advanced offline sync engine', price: 8000 },
      { id: 'campaigns', label: 'Push & deep-link campaign tooling', price: 5000 },
    ],
  },
  {
    id: 'crm-erp',
    icon: Database,
    category: 'Autonomous Systems',
    title: 'Custom CRM & ERP Systems',
    shortTitle: 'CRM & ERP',
    summary:
      'Your operations modelled exactly as you run them — pipelines, inventory, invoicing and role-based access.',
    startsAt: 30000,
    unit: 'one-time build',
    timeline: '6–10 weeks',
    baseWeeks: { min: 6, max: 10 },
    includes: [
      'Custom sales pipeline & lead scoring',
      'Real-time inventory & logistics dashboards',
      'Role-based permissions (RBAC) & SSO',
      'Automated billing, quotes & PDF invoicing',
    ],
    extra: '6 more operational modules',
    addons: [
      { id: 'field-app', label: 'Field-staff mobile app', price: 15000 },
      { id: 'inventory', label: 'Inventory & warehouse module', price: 12000, recommended: true },
      { id: 'bi', label: 'BI dashboards & report builder', price: 10000 },
      { id: 'gst', label: 'GST invoicing & Tally export', price: 9000 },
    ],
  },
  {
    id: 'saas',
    icon: Layers,
    category: 'Mobile & Product',
    title: 'SaaS Platform Engineering',
    shortTitle: 'SaaS Platform',
    summary:
      'Whiteboard to production MVP: multi-tenancy, subscription billing, admin analytics and autoscaling infra.',
    startsAt: 35000,
    unit: 'one-time build',
    timeline: '6–10 weeks',
    baseWeeks: { min: 6, max: 10 },
    includes: [
      'Multi-tenant architecture & database schema',
      'Stripe / Razorpay subscription billing',
      'Auth, SSO & role-based permissions',
      'Admin analytics & customer dashboards',
    ],
    extra: '6 more platform features',
    addons: [
      { id: 'soc2', label: 'SOC2-ready audit logging & controls', price: 14000 },
      { id: 'teams', label: 'Multi-tenant orgs & team seats', price: 12000, recommended: true },
      { id: 'metering', label: 'Usage-based metered billing', price: 10000 },
      { id: 'api', label: 'Public API + webhooks', price: 9000 },
    ],
  },
];

export interface ScaleTier {
  id: string;
  label: string;
  note: string;
  /** Applied to the service base price. */
  multiplier: number;
  /** Stretches the delivery window for the extra depth. */
  weeksFactor: number;
}

/**
 * Scale bands. `multiplier` applies to the service base price, `weeksFactor`
 * stretches the delivery window for the extra depth.
 */
export const SCALE_TIERS: ScaleTier[] = [
  {
    id: 'starter',
    label: 'Starter',
    note: 'Core scope, single brand',
    multiplier: 1,
    weeksFactor: 1,
  },
  {
    id: 'growth',
    label: 'Growth',
    note: 'Deeper features, integrations',
    multiplier: 1.8,
    weeksFactor: 1.5,
  },
  {
    id: 'enterprise',
    label: 'Enterprise',
    note: 'Compliance, scale, multi-team',
    multiplier: 3.2,
    weeksFactor: 2.2,
  },
];



const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export const formatINR = (amount: number) => inrFormatter.format(amount);

/**
 * Quote granularity scales with magnitude.
 *
 * A flat ₹500 step is right for a ₹15,000 line but wrong for a ₹2,00,000 one:
 * six-figure numbers ending in 500 read as raw calculator output, and a client
 * reads that as a machine guess rather than a considered price.
 *
 * Every component is rounded individually and the total is their exact sum, so
 * the per-add-on figures shown in the estimator always add up to the number the
 * visitor is quoted. That arithmetic is checkable on screen, and it has to hold.
 */
/** Upper bound of a quote as a multiple of the low. See calculateEstimate. */
const QUOTE_BAND = 1.2;

const roundQuote = (amount: number) => {
  const step = amount >= 100000 ? 2500 : amount >= 20000 ? 1000 : 500;
  return Math.round(amount / step) * step;
};

export interface EstimateResult {
  low: number;
  high: number;
  recurring: boolean;
  weeksLabel: string;
}

/**
 * Live estimate for a service + scale band + chosen add-ons.
 * The upper bound carries a 25% band for integration and content unknowns.
 */
/**
 * How much an add-on grows with the scale band.
 *
 * Add-ons DO get more expensive at larger scale — an Enterprise CRM integration
 * means more systems, SSO and audit trails than a Starter one — but not in full
 * proportion to the core build, because a chunk of each add-on is fixed work.
 * So the tier multiplier is damped to 60% of its effect:
 *
 *   Starter    x1.0    Growth  x1.48    Enterprise  x2.32
 */
const ADDON_SCALE_DAMPING = 0.6;

export const addonMultiplier = (tier: ScaleTier) =>
  1 + (tier.multiplier - 1) * ADDON_SCALE_DAMPING;

/**
 * Price of one add-on at a given scale. The estimator UI and the total are both
 * driven by THIS function, so the per-add-on figures a visitor reads always sum
 * to the total they are quoted — no rounding drift between the two.
 */
export const scaledAddonPrice = (addon: ServiceAddon, tier: ScaleTier) =>
  roundQuote(addon.price * addonMultiplier(tier));

export function calculateEstimate(
  service: ServicePricing,
  tier: ScaleTier,
  addonIds: string[]
): EstimateResult {
  const addonTotal = service.addons
    .filter((addon) => addonIds.includes(addon.id))
    .reduce((sum, addon) => sum + scaledAddonPrice(addon, tier), 0);

  // Base is rounded before summing so low === base + the add-on figures shown.
  const subtotal = roundQuote(service.startsAt * tier.multiplier) + addonTotal;
  const low = subtotal;
  // A 20% band. Wide enough to absorb integration and content unknowns before
  // detailed scoping, tight enough to read as a considered figure rather than a
  // guess — and a round number you can state plainly if a client asks.
  const high = roundQuote(subtotal * QUOTE_BAND);

  let weeksLabel = 'Ongoing · 3-month minimum';
  if (service.baseWeeks) {
    const min = Math.ceil(service.baseWeeks.min * tier.weeksFactor);
    const max = Math.ceil(service.baseWeeks.max * tier.weeksFactor);
    weeksLabel = `approx. ${min}–${max} weeks`;
  }

  return { low, high, recurring: Boolean(service.recurring), weeksLabel };
}

/**
 * Free hosting + maintenance ships with builds, not with monthly retainers —
 * there is no site to host on an SEO engagement.
 */
export const qualifiesForBundle = (service: ServicePricing) => !service.recurring;

/** e.g. "Q3 2026" — keeps the availability badge from going stale. */
export function currentQuarterLabel(now = new Date()) {
  return `Q${Math.floor(now.getMonth() / 3) + 1} ${now.getFullYear()}`;
}

/** Next Monday at least 7 days out, e.g. "Sep 07, 2026". */
export function nextKickoffDate(now = new Date()) {
  const date = new Date(now);
  date.setDate(date.getDate() + 7);
  const daysUntilMonday = (8 - date.getDay()) % 7;
  date.setDate(date.getDate() + daysUntilMonday);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}
