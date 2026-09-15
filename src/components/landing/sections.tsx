import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Clock,
  Gift,
  Mail,
  MapPin,
  Minus,
  Phone,
  Plus,
  ShieldCheck,
  Sparkles,
  Star,
  Zap,
  Lock,
} from 'lucide-react';
import { toast } from 'sonner';
import { BrandLogo } from '../common/brand-logo';
import { SocialLinks } from '../common/social-icons';
import { SERVICE_PRICING, currentQuarterLabel } from '../../lib/service-pricing';

import {
  QUOTE_DRAFT_EVENT,
  clearQuoteDraft,
  getQuoteDraft,
  type QuoteDraft,
} from '../../lib/quote-draft';
import { sendProjectBrief, type QuoteSnapshot } from '../../lib/send-email';
import { SERVICE_OPTIONS } from '../../lib/service-options';
import { useCurrency } from '../../lib/currency-context';

/* -------------------------------------------------------------------------- */
/*                                TESTIMONIALS                                */
/* -------------------------------------------------------------------------- */

const TESTIMONIALS_DATA = [
  {
    quote:
      'The team did an excellent job translating our vision for Wintek Digital into a modern, professional website. They understood our digital signage solutions well and created a website that presents our products and capabilities in a clear and engaging way.',
    author: 'Prasanna R Goudar',
    role: 'Co-founder & CEO',
    company: 'Wintek Digital',
    avatar: 'PG',
    rating: 5,
  },
  {
    quote:
      'We are very happy with the work done on Ariqa.in. The team was creative, responsive and open to our ideas throughout the development process. They delivered a visually appealing website that gives Ariqa a strong and professional digital presence.',
    author: 'Sunil',
    role: 'Founder & Leadership',
    company: 'ARiqA (ariqa.in)',
    avatar: 'SU',
    rating: 5,
  },
  {
    quote:
      'Outstanding component build quality, consistent specifications, and dependable engineering. The B2B digital catalog and quotation workflows significantly streamlined procurement across our commercial operations.',
    author: 'AeroVanguard Technologies',
    role: 'Engineering & Procurement',
    company: 'Fortune India Client Partner',
    avatar: 'AV',
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="bg-secondary/60 py-16 sm:py-24 lg:py-32 relative overflow-hidden">
      <div className="site-container">
        {/* Header */}
        <div data-reveal className="max-w-3xl mb-16 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-butter text-butter-foreground text-[11px] font-semibold uppercase tracking-[0.14em] shadow-xs mb-5">
            <span>Founder Testimonials</span>
          </div>
          <h2 className="font-display text-display-lg font-medium text-foreground">
            Partnerships that compound.
          </h2>
        </div>

        {/* 3 Alternating Testimonial Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS_DATA.map((item, idx) => {
            const isDark = idx % 2 === 1; // Alternating: Center card (1) is Black
            return (
              <div
                key={item.author}
                data-reveal
                data-reveal-delay={`${idx * 80}`}
                className={`rounded-[32px] p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 border relative overflow-hidden ${
                  isDark
                    ? 'bg-ink text-ink-foreground border-white/10 shadow-2xl hover:border-butter/30 hover:shadow-2xl'
                    : 'bg-card text-foreground border-border shadow-soft hover:shadow-xl'
                }`}
              >
                {/* Subtle Glow for Black Card */}
                {isDark && (
                  <div
                    className="absolute -top-12 -right-12 w-32 h-32 bg-butter/10 rounded-full blur-2xl pointer-events-none"
                    aria-hidden="true"
                  />
                )}

                <div>
                  {/* 5 Stars */}
                  <div className="flex items-center gap-1 text-amber-400 mb-6">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star
                        key={i}
                        style={{ animationDelay: `${(idx * 5 + i) * 0.15}s` }}
                        className="w-4 h-4 fill-current animate-icon-sparkle"
                      />
                    ))}
                  </div>

                  <blockquote
                    className={`font-display text-lg font-light leading-relaxed mb-8 ${
                      isDark ? 'text-ink-foreground' : 'text-foreground'
                    }`}
                  >
                    “{item.quote}”
                  </blockquote>
                </div>

                <div
                  className={`flex items-center gap-3.5 pt-6 border-t ${
                    isDark ? 'border-white/10' : 'border-border/60'
                  }`}
                >
                  <div
                    style={{ animationDelay: `${idx * 0.3}s` }}
                    className={`w-11 h-11 rounded-2xl text-xs font-semibold flex items-center justify-center shadow-xs animate-icon-float ${
                      isDark
                        ? 'bg-butter text-butter-foreground font-bold animate-icon-glow'
                        : 'bg-ink text-ink-foreground animate-icon-glow-dark'
                    }`}
                  >
                    {item.avatar}
                  </div>
                  <div>
                    <div
                      className={`font-semibold text-sm ${
                        isDark ? 'text-ink-foreground' : 'text-foreground'
                      }`}
                    >
                      {item.author}
                    </div>
                    <div
                      className={`text-xs ${
                        isDark ? 'text-ink-muted' : 'text-muted-foreground'
                      }`}
                    >
                      {item.role},{' '}
                      <span
                        className={`font-medium ${
                          isDark ? 'text-butter' : 'text-foreground/80'
                        }`}
                      >
                        {item.company}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   PRICING                                  */
/* -------------------------------------------------------------------------- */

const PRICING_PLANS = [
  {
    name: 'Launch Sprint',
    model: 'Fixed Sprint Scope',
    cadence: 'Milestone-based delivery',
    description:
      'For founders validating an idea with a high-converting web platform or launch system.',
    features: [
      'Up to 6 pages custom UI/UX design',
      'Next.js 15 & React 19 stack',
      'SEO & Answer Engine foundations',
      'Headless CMS integration',
      'Free 1 year hosting + maintenance',
    ],
    featured: false,
    cta: 'Request Sprint Proposal',
  },
  {
    name: 'Scale Platform',
    model: 'Monthly Dedicated Squad',
    cadence: 'Dedicated engineering pod',
    description:
      'A dedicated full-stack squad engineering your SaaS product and AI automation in parallel.',
    features: [
      'Full-stack SaaS or Mobile App build',
      'Autonomous AI agent workflows',
      'Multi-tenant DB, Stripe auth & billing',
      'SEO, AEO & GEO indexing program',
      'Weekly Friday staging demos',
      'Direct Slack channel with senior architects',
    ],
    featured: true,
    badge: 'Founder Favorite',
    cta: 'Reserve Dedicated Squad',
  },
  {
    name: 'Enterprise Engine',
    model: 'Custom Architecture Pod',
    cadence: 'Multi-team tailored scope',
    description:
      'Multi-team architecture, custom LLM fine-tuning, SOC2 security, and legacy modernization.',
    features: [
      'Dedicated multi-pod engineering squad',
      'Custom LLM & Private RAG deployment',
      'SOC2 compliance & security audit',
      'Distributed multi-region cloud infra',
      'Executive roadmap quarterly planning',
    ],
    featured: false,
    cta: 'Inquire for Enterprise Scope',
  },
];

export function Pricing() {
  const { price } = useCurrency();

  return (
    <section id="pricing" className="py-16 sm:py-24 lg:py-32 scroll-mt-12 bg-background relative overflow-hidden">
      <div className="site-container">
        {/* Header */}
        <div data-reveal className="max-w-3xl mb-16 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-butter text-butter-foreground text-[11px] font-semibold uppercase tracking-[0.14em] shadow-xs mb-5">
            <span>Engagement Models</span>
          </div>
          <h2 className="font-display text-display-lg font-medium text-foreground mb-4">
            Flexible engagement models. Zero surprises.
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            No hourly billable traps. Pick a fixed sprint milestone or dedicated monthly squad capacity with guaranteed deliverables.
          </p>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {PRICING_PLANS.map((plan, idx) => (
            <div
              key={plan.name}
              data-reveal
              data-reveal-delay={`${idx * 80}`}
              className={`rounded-[36px] p-8 sm:p-9 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 relative ${
                plan.featured
                  ? 'bg-ink text-ink-foreground border border-butter/30 shadow-2xl'
                  : 'bg-card text-foreground border border-border hover:shadow-xl'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-8 bg-butter text-butter-foreground text-[11px] font-semibold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  <span>{plan.badge}</span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-2xl font-semibold tracking-tight">
                    {plan.name}
                  </h3>
                </div>

                <div className="mb-6">
                  <div
                    className={`font-display text-2xl sm:text-3xl font-semibold tracking-tight ${
                      plan.featured ? 'text-butter' : 'text-foreground'
                    }`}
                  >
                    {plan.model}
                  </div>
                  <span
                    className={`text-xs inline-block mt-1 font-medium ${
                      plan.featured ? 'text-ink-muted' : 'text-muted-foreground'
                    }`}
                  >
                    {plan.cadence}
                  </span>
                </div>

                <p
                  className={`text-sm leading-relaxed mb-8 ${
                    plan.featured ? 'text-ink-muted' : 'text-muted-foreground'
                  }`}
                >
                  {plan.description}
                </p>

                {/* Features */}
                <div
                  className={`pt-6 border-t flex flex-col gap-3.5 mb-8 ${
                    plan.featured ? 'border-white/10' : 'border-border/60'
                  }`}
                >
                  {plan.features.map((feat) => (
                    <div
                      key={feat}
                      className="flex items-center gap-2.5 text-xs sm:text-sm font-medium"
                    >
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                          plan.featured
                            ? 'bg-butter/20 text-butter'
                            : 'bg-secondary text-foreground'
                        }`}
                      >
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span className={plan.featured ? 'text-ink-foreground' : 'text-foreground'}>
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href="#contact"
                className={`w-full rounded-full py-4 text-center text-sm font-semibold transition-all duration-200 block shadow-md cursor-pointer ${
                  plan.featured
                    ? 'bg-butter text-butter-foreground hover:scale-[1.02]'
                    : 'bg-ink text-ink-foreground hover:bg-butter hover:text-butter-foreground hover:scale-[1.02]'
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        {/* Per-service starting prices */}
        <div data-reveal className="mt-6 rounded-[36px] bg-card border border-border p-7 sm:p-9">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
            <div>
              <h3 className="font-display text-xl sm:text-2xl font-medium tracking-tight text-foreground mb-1.5">
                Or start with a single service.
              </h3>
              <p className="text-sm text-muted-foreground">
                Entry pricing per discipline — final quote confirmed in writing after scoping.
              </p>
              <div className="inline-flex items-center gap-2 mt-3 rounded-full bg-butter/20 border border-butter/40 px-3 py-1">
                <Gift className="w-3.5 h-3.5 text-butter-foreground shrink-0" />
                <span className="text-[11px] font-semibold text-butter-foreground">
                  Every build includes 1 year hosting + maintenance, free
                </span>
              </div>
            </div>
            <Link
              to="/pricing#service-pricing"
              className="text-xs font-semibold text-foreground flex items-center gap-1.5 hover:text-butter-foreground transition-colors shrink-0"
            >
              <span>See what each price includes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {SERVICE_PRICING.map((service) => {
              const ServiceIcon = service.icon;
              return (
                <Link
                  key={service.id}
                  to={`/services?tab=${service.id}`}
                  className="rounded-2xl border border-border bg-secondary/40 p-4 flex flex-col gap-2 hover:bg-secondary hover:border-butter/40 transition-colors group"
                >
                  <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
                    <ServiceIcon className="w-4 h-4 shrink-0" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider leading-tight">
                      {service.shortTitle}
                    </span>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                      Starts from
                    </div>
                    <div className="font-display text-xl font-semibold tracking-tight text-foreground">
                      {price(service.startsAt)}
                      {service.unit === 'per month' && (
                        <span className="text-[11px] font-medium text-muted-foreground ml-1">
                          /mo
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                                     FAQ                                    */
/* -------------------------------------------------------------------------- */

const FAQ_ITEMS = [
  {
    q: 'How quickly can we start our sprint?',
    a: 'Most sprint builds kick off within 5–7 days following the architectural discovery session. Urgent builds can start sooner when a squad slot is open.',
  },
  {
    q: 'Do you work with existing codebases or only new builds?',
    a: 'We work with both. We audit existing repositories, identify bottlenecks, stabilize critical user flows, and incrementally deploy improvements without requiring a risky ground-up rewrite.',
  },
  {
    q: 'What does AI automation mean in our project scope?',
    a: 'Production-ready intelligence: autonomous customer support and sales agents, real-time vector search (RAG) over your internal knowledge base, and automated workflow pipelines that eliminate hours of manual operational overhead.',
  },
  {
    q: 'How does SEO differ from AEO and GEO?',
    a: 'SEO targets classic search engines (Google), AEO optimizes structured data for answer engines (Siri, Google Voice, Featured Snippets), and GEO ensures your brand is indexed and accurately cited within generative AI models (ChatGPT, Perplexity, Claude). We engineer all three into your codebase.',
  },
  {
    q: 'Who owns the intellectual property and code repositories?',
    a: 'You own 100% of all intellectual property, Figma design files, source repositories, and cloud infrastructure keys upon sprint completion and handover.',
  },
];

export function Faq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-16 sm:py-24 lg:py-32 scroll-mt-12 bg-background">
      <div className="site-container-narrow">
        {/* Header */}
        <div data-reveal className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-butter text-butter-foreground text-[11px] font-semibold uppercase tracking-[0.14em] shadow-xs mb-5">
            <span>Frequently Asked</span>
          </div>
          <h2 className="font-display text-display-lg font-medium text-foreground">
            Clear answers to common questions.
          </h2>
        </div>

        {/* Accordion Container */}
        <div
          data-reveal
          className="rounded-[32px] border border-border bg-card p-6 sm:p-8 shadow-sm divide-y divide-border"
        >
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={item.q} className="py-5 first:pt-0 last:pb-0">
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between text-left gap-4 group focus:outline-hidden cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-lg sm:text-xl font-medium text-foreground group-hover:text-primary transition-colors">
                    {item.q}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0 transition-transform duration-300">
                    {isOpen ? (
                      <Minus className="w-4 h-4 text-foreground" />
                    ) : (
                      <Plus className="w-4 h-4 text-foreground" />
                    )}
                  </div>
                </button>

                {/* Smooth CSS Grid Accordion */}
                <div
                  className="grid transition-all duration-300 ease-out"
                  style={{
                    gridTemplateRows: isOpen ? '1fr' : '0fr',
                  }}
                >
                  <div className="overflow-hidden">
                    <p className="pt-3 text-[15px] leading-relaxed text-muted-foreground max-w-3xl">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 CONTACT CTA                                */
/* -------------------------------------------------------------------------- */

export function ContactCta() {
  const [loading, setLoading] = useState(false);
  const [service, setService] = useState('');
  const [message, setMessage] = useState('');
  const [quote, setQuote] = useState<QuoteSnapshot | undefined>(undefined);

  // Receive a scope configured in the estimator above, so the visitor never
  // retypes it. Reads any draft left from an earlier scroll, then stays live.
  useEffect(() => {
    const existing = getQuoteDraft();
    if (existing) {
      setService(existing.serviceId);
      setMessage(existing.message);
      setQuote(existing.quote);
    }

    const handleDraft = (event: Event) => {
      const draft = (event as CustomEvent<QuoteDraft>).detail;
      setService(draft.serviceId);
      setMessage(draft.message);
      setQuote(draft.quote);
    };

    window.addEventListener(QUOTE_DRAFT_EVENT, handleDraft);
    return () => window.removeEventListener(QUOTE_DRAFT_EVENT, handleDraft);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const serviceVal = formData.get('service') as string;
    const messageVal = formData.get('message') as string;

    const result = await sendProjectBrief({
      name,
      email,
      service: serviceVal || service,
      message: messageVal || message,
      quote,
      source: quote ? 'Homepage — estimator' : 'Homepage — contact form',
    });

    setLoading(false);

    if (result.success) {
      toast.success('Project brief received', {
        description: `A confirmation is on its way to ${result.confirmationSentTo ?? email}. We reply within one working day.`,
      });
      form.reset();
      setService('');
      setMessage('');
      setQuote(undefined);
      clearQuoteDraft();
    } else {
      toast.error("Couldn't send your brief", {
        description: `${result.error ?? 'Please try again'} — or email vivek@myplanetservices.com directly.`,
      });
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-24 scroll-mt-12 bg-background">
      <div className="site-container">
        <div
          data-reveal
          className="rounded-[36px] bg-ink text-ink-foreground p-8 sm:p-14 relative overflow-hidden border border-white/10 shadow-2xl"
        >
          {/* Ambient lighting glows */}
          <div
            className="absolute -right-20 -top-20 w-96 h-96 bg-butter/10 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute -left-20 -bottom-20 w-96 h-96 bg-terracotta/10 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 items-start relative z-10">
            {/* Left Info */}
            <div className="text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-butter text-[11px] font-semibold uppercase tracking-[0.14em] shadow-xs mb-6 border border-white/10">
                <span>Start a Project</span>
              </div>
              <h2 className="font-display text-display-lg font-medium text-ink-foreground mb-6">
                Let's engineer something <br />
                extraordinary together.
              </h2>
              <p className="text-base leading-relaxed text-ink-muted max-w-md mb-10 font-light">
                Tell us about your product goals, timeline, and ideal stack. You will receive a scoped architecture proposal and fixed quote within one business day.
              </p>

              {/* Direct Contact Links */}
              <div className="flex flex-col gap-4">
                <a
                  href="mailto:vivek@myplanetservices.com"
                  className="flex items-center gap-3.5 text-sm text-ink-muted hover:text-ink-foreground transition-colors group"
                >
                  <div className="w-11 h-11 rounded-2xl bg-white/5 text-butter flex items-center justify-center shrink-0 border border-white/10 group-hover:border-butter/40 transition-colors animate-icon-float animate-icon-glow">
                    <Mail className="w-4 h-4 animate-icon-wiggle group-hover:scale-120 transition-transform" />
                  </div>
                  <span className="font-mono">vivek@myplanetservices.com</span>
                </a>
                <div className="flex items-start gap-3.5 text-sm text-ink-muted group">
                  <div style={{ animationDelay: '0.3s' }} className="w-11 h-11 rounded-2xl bg-white/5 text-butter flex items-center justify-center shrink-0 border border-white/10 group-hover:border-butter/40 transition-colors animate-icon-float animate-icon-glow mt-0.5">
                    <Phone className="w-4 h-4 animate-icon-sway group-hover:scale-120 transition-transform" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-ink-muted/80">Vivek (Founder & CEO)</span>
                    <div className="flex flex-wrap items-center gap-x-2 font-mono text-ink-foreground">
                      <a href="tel:+917808158221" className="hover:text-butter transition-colors">
                        +91 78081 58221
                      </a>
                      <span className="text-ink-muted/40">·</span>
                      <a href="tel:+9162076548506" className="hover:text-butter transition-colors">
                        +91 62076 548506
                      </a>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3.5 text-sm text-ink-muted group">
                  <div style={{ animationDelay: '0.6s' }} className="w-11 h-11 rounded-2xl bg-white/5 text-butter flex items-center justify-center shrink-0 border border-white/10 animate-icon-float animate-icon-glow">
                    <MapPin className="w-4 h-4 animate-icon-bob group-hover:scale-120 transition-transform" />
                  </div>
                  <span>Bengaluru, India</span>
                </div>
              </div>
            </div>

            {/* Right Intake Form */}
            <div className="bg-ink-soft/90 rounded-[32px] p-7 sm:p-9 border border-white/10 shadow-xl">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-2"
                  >
                    Your name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Alex Morgan"
                    className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3.5 text-sm text-ink-foreground placeholder:text-ink-muted focus:border-butter focus:outline-hidden transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-2"
                  >
                    Work email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="alex@company.com"
                    className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3.5 text-sm text-ink-foreground placeholder:text-ink-muted focus:border-butter focus:outline-hidden transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="service"
                    className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-2"
                  >
                    Primary discipline
                  </label>
                  <select
                    id="service"
                    name="service"
                    required
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full rounded-2xl bg-ink-soft border border-white/10 px-4 py-3.5 text-sm text-ink-foreground focus:border-butter focus:outline-hidden transition-colors appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-ink-soft text-ink-muted">
                      Select primary build requirement
                    </option>
                    {SERVICE_OPTIONS.map((opt) => (
                      <option
                        key={opt.id}
                        value={opt.id}
                        className="bg-ink-soft text-ink-foreground"
                      >
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-2"
                  >
                    Project brief & timeline
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={message ? 6 : 3}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about the product goals, target launch date, or current stack..."
                    className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3.5 text-sm text-ink-foreground placeholder:text-ink-muted focus:border-butter focus:outline-hidden transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-butter text-butter-foreground rounded-full py-4 text-sm font-semibold hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200 mt-2 flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-70"
                >
                  <span>{loading ? 'Submitting brief...' : 'Submit project brief'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 SITE FOOTER                                */
/* -------------------------------------------------------------------------- */

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-border bg-background pt-16 pb-12 text-foreground relative overflow-hidden">
      {/* Ambient background glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-butter/5 rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="site-container">
        {/* 1. Top Bento Sprint Scoping Banner */}
        <div
          data-reveal
          className="rounded-[32px] bg-ink text-ink-foreground p-8 sm:p-12 mb-16 relative overflow-hidden border border-white/10 shadow-2xl"
        >
          {/* Subtle Butter Yellow Glow in Corner */}
          <div
            className="absolute -top-24 -right-24 w-80 h-80 bg-butter/15 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 text-left">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-butter text-[11px] font-mono font-semibold uppercase tracking-wider mb-4 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{currentQuarterLabel()} Sprint Slots Available</span>
              </div>
              <h3 className="font-display text-display-md font-medium text-ink-foreground mb-3">
                Ready to build something extraordinary?
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-ink-muted">
                Partner directly with our principal operators to ship custom web platforms, mobile apps, autonomous AI swarms, and scalable SaaS infrastructure in weeks.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to="/contact"
                className="bg-butter hover:bg-butter/90 text-butter-foreground font-semibold px-6 py-3.5 rounded-full text-xs sm:text-sm inline-flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer group"
              >
                <span>Schedule Sprint Scoping</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
              <Link
                to="/services"
                className="bg-white/10 hover:bg-white/20 text-ink-foreground font-medium border border-white/15 px-6 py-3.5 rounded-full text-xs sm:text-sm inline-flex items-center gap-2 hover:scale-102 active:scale-98 transition-all"
              >
                <Zap className="w-4 h-4 text-butter animate-icon-wiggle" />
                <span>Explore Disciplines</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 2. Main Navigation & Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-border text-left">
          {/* Column 1: Brand Hub & Direct Contact (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-6">
            <Link
              to="/"
              className="inline-flex items-center"
              aria-label="My Planet Services Home"
            >
              <BrandLogo variant="auto" size="lg" />
            </Link>

            <p className="text-sm leading-relaxed text-muted-foreground max-w-md">
              My Planet Services is an AI-native engineering and product studio. We partner directly with founders to build high-velocity web platforms, autonomous copilot swarms, and production SaaS architectures with zero junior handoffs.
            </p>

            {/* Direct Contact Badges */}
            <div className="flex flex-col gap-2.5 pt-1 text-xs">
              <a
                href="mailto:vivek@myplanetservices.com"
                className="flex items-center gap-2.5 text-muted-foreground hover:text-foreground transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-foreground group-hover:bg-butter group-hover:text-butter-foreground transition-colors">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <span className="font-mono">vivek@myplanetservices.com</span>
              </a>

              <div className="flex items-start gap-2.5 text-muted-foreground group">
                <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-foreground group-hover:bg-butter group-hover:text-butter-foreground transition-colors shrink-0 mt-0.5">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Vivek · Founder & CEO</span>
                  <div className="flex flex-wrap items-center gap-x-2 font-mono">
                    <a href="tel:+917808158221" className="hover:text-foreground transition-colors">
                      +91 78081 58221
                    </a>
                    <span className="text-muted-foreground/40">·</span>
                    <a href="tel:+9162076548506" className="hover:text-foreground transition-colors">
                      +91 62076 548506
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-muted-foreground">
                <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-foreground">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <span>Bengaluru, India</span>
              </div>
            </div>

            {/* Official Social Channels */}
            <div className="pt-2 space-y-2.5">
              <div className="text-[11px] font-mono font-medium text-muted-foreground uppercase tracking-wider">
                Official Channels
              </div>
              <SocialLinks variant="pills" showLabels={true} />
            </div>
          </div>

          {/* Column 2: Solutions (3 cols on lg) */}
          <div className="lg:col-span-3">
            <h4 className="font-display font-medium text-sm text-foreground mb-4 uppercase tracking-wider text-xs font-mono">
              Engineered Solutions
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-muted-foreground">
              <li>
                <Link to="/services?tab=ecommerce" className="hover:text-foreground transition-colors flex items-center gap-1.5 group">
                  <span className="group-hover:translate-x-1 transition-transform">E-Commerce Development</span>
                </Link>
              </li>
              <li>
                <Link to="/services?tab=corporate" className="hover:text-foreground transition-colors flex items-center gap-1.5 group">
                  <span className="group-hover:translate-x-1 transition-transform">Company & Corporate Websites</span>
                </Link>
              </li>
              <li>
                <Link to="/services?tab=redesign" className="hover:text-foreground transition-colors flex items-center gap-1.5 group">
                  <span className="group-hover:translate-x-1 transition-transform">Website Redesign & Speed</span>
                </Link>
              </li>
              <li>
                <Link to="/services?tab=crm-erp" className="hover:text-foreground transition-colors flex items-center gap-1.5 group">
                  <span className="group-hover:translate-x-1 transition-transform">Custom CRM & ERP Systems</span>
                </Link>
              </li>
              <li>
                <Link to="/services?tab=ai" className="hover:text-foreground transition-colors flex items-center gap-1.5 group">
                  <span className="group-hover:translate-x-1 transition-transform">AI Agents & Copilots</span>
                </Link>
              </li>
              <li>
                <Link to="/services?tab=saas" className="hover:text-foreground transition-colors flex items-center gap-1.5 group">
                  <span className="group-hover:translate-x-1 transition-transform">SaaS Platform Engineering</span>
                </Link>
              </li>
              <li>
                <Link to="/services?tab=app" className="hover:text-foreground transition-colors flex items-center gap-1.5 group">
                  <span className="group-hover:translate-x-1 transition-transform">Mobile App Development</span>
                </Link>
              </li>
              <li>
                <Link to="/services?tab=seo" className="hover:text-foreground transition-colors flex items-center gap-1.5 group">
                  <span className="group-hover:translate-x-1 transition-transform">SEO, AEO & GEO Programs</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Studio & Navigation (2 cols on lg) */}
          <div className="lg:col-span-2">
            <h4 className="font-display font-medium text-sm text-foreground mb-4 uppercase tracking-wider text-xs font-mono">
              Studio & Process
            </h4>
            <ul className="flex flex-col gap-3 text-xs text-muted-foreground">
              <li>
                <Link to="/work" className="hover:text-foreground transition-colors flex items-center gap-1.5 group">
                  <span className="group-hover:translate-x-1 transition-transform">Work & Case Studies</span>
                </Link>
              </li>
              <li>
                <Link to="/#team" className="hover:text-foreground transition-colors flex items-center gap-1.5 group">
                  <span className="group-hover:translate-x-1 transition-transform">Meet The Squad</span>
                </Link>
              </li>
              <li>
                <Link to="/process" className="hover:text-foreground transition-colors flex items-center gap-1.5 group">
                  <span className="group-hover:translate-x-1 transition-transform">4-Phase Sprint Process</span>
                </Link>
              </li>
              <li>
                <Link to="/why-us" className="hover:text-foreground transition-colors flex items-center gap-1.5 group">
                  <span className="group-hover:translate-x-1 transition-transform">Why My Planet</span>
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-foreground transition-colors flex items-center gap-1.5 group">
                  <span className="group-hover:translate-x-1 transition-transform">Engagement Models</span>
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-foreground transition-colors flex items-center gap-1.5 group">
                  <span className="group-hover:translate-x-1 transition-transform">Knowledge Base & FAQ</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Reliability & Operational Guarantees (2 cols on lg) */}
          <div className="lg:col-span-2">
            <h4 className="font-display font-medium text-sm text-foreground mb-4 uppercase tracking-wider text-xs font-mono">
              Reliability & SLA
            </h4>
            <div className="flex flex-col gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-secondary/80 border border-border flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-foreground text-[11px]">99.99% Uptime SLA</div>
                  <div className="text-[10px] text-muted-foreground">Serverless Edge Cloud</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-secondary/80 border border-border flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-butter-foreground shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-foreground text-[11px]">14-Day Delivery</div>
                  <div className="text-[10px] text-muted-foreground">Rapid MVP Cadence</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-secondary/80 border border-border flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-foreground text-[11px]">100% IP Ownership</div>
                  <div className="text-[10px] text-muted-foreground">SOC2 & NDA Protected</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Bottom Bar with Copyright, Socials, Legal & Back-To-Top */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <span>© {currentYear} My Planet Services Inc. All rights reserved.</span>
            <span className="hidden sm:inline text-border">|</span>
            <SocialLinks variant="compact" />
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs">
            <Link to="/faq" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/faq" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link to="/faq" className="hover:text-foreground transition-colors">
              Security & Compliance
            </Link>
            <Link
              to="/admin/login"
              className="hover:text-foreground text-muted-foreground/80 transition-colors inline-flex items-center gap-1 font-mono text-[11px]"
            >
              <Lock className="w-3 h-3 text-butter" />
              <span>Studio Portal</span>
            </Link>

            {/* Back to top smooth button */}
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary hover:bg-secondary/80 text-foreground font-mono text-[11px] transition-colors cursor-pointer ml-2"
              title="Scroll back to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Back to top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
