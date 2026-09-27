import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SEOHead } from '../components/common/seo-head';
import { getBreadcrumbSchema, getContactPageSchema } from '../lib/seo-schemas';
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Calendar,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { sendProjectBrief, sendCallRequest } from '../lib/send-email';
import { BookingCalendar } from '../components/common/booking-calendar';
import { SocialLinks } from '../components/common/social-icons';
import { useCurrency } from '../lib/currency-context';
import { describeSlot, type Slot } from '../lib/booking-slots';
import { SERVICE_OPTIONS } from '../lib/service-options';
import { useSubmissionProgress } from '../hooks/use-submission-progress';

/**
 * Budget bands in INR, converted to the visitor's currency for display.
 */
const BUDGET_BANDS: { min: number; max?: number }[] = [
  { min: 5000, max: 10000 },
  { min: 10000, max: 25000 },
  { min: 25000, max: 50000 },
  { min: 50000, max: 100000 },
  { min: 100000, max: 250000 },
  { min: 250000, max: 500000 },
  { min: 500000 },
];

export function ContactPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialMode =
    searchParams.get('mode') === 'call' || searchParams.get('tab') === 'call'
      ? 'call'
      : 'brief';
  const [activeTab, setActiveTab] = useState<'brief' | 'call'>(initialMode);
  const { timeZone, price } = useCurrency();
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(false);
  const [slot, setSlot] = useState<Slot | null>(null);

  const briefProgress = useSubmissionProgress(loading, {
    steps: [
      'Sending project brief...',
      'Delivering confirmation emails...',
      'Securing inquiry in database...',
    ],
    intervalMs: 1100,
  });

  const bookingProgress = useSubmissionProgress(booking, {
    steps: [
      'Reserving calendar slot...',
      'Sending calendar invite & emails...',
      'Securing booking in database...',
    ],
    intervalMs: 1100,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const company = formData.get('company') as string;
    const service = formData.get('service') as string;
    const budget = formData.get('budget') as string;
    const message = formData.get('message') as string;

    const result = await sendProjectBrief({
      name,
      email,
      company,
      service,
      budget,
      message,
      source: 'Contact page',
    });

    setLoading(false);

    if (result.success) {
      toast.success('Project brief received', {
        description: `A confirmation is on its way to ${result.confirmationSentTo ?? email}. We reply within one working day.`,
      });
      form.reset();
    } else {
      toast.error("Couldn't send your brief", {
        description: `${result.error ?? 'Please try again'} — or email vivek@myplanetservices.com directly.`,
      });
    }
  };

  const handleBooking = async () => {
    if (!slot) {
      toast.error('Pick a time first', {
        description: 'Choose a date and an available slot to request a call.',
      });
      return;
    }

    setBooking(true);
    const form = document.querySelector<HTMLFormElement>('#contact-brief-form');
    const fd = form ? new FormData(form) : null;

    const result = await sendCallRequest({
      slot: describeSlot(slot.iso, timeZone),
      name: (fd?.get('name') as string) || undefined,
      email: (fd?.get('email') as string) || undefined,
      source: 'Contact page',
    });

    setBooking(false);

    if (result.success) {
      toast.success('Call request sent', {
        description: `We'll confirm ${describeSlot(slot.iso, timeZone)} by email and send the calendar invite.`,
      });
    } else {
      toast.error("Couldn't send your request", {
        description: `${result.error ?? 'Please try again'} — or email vivek@myplanetservices.com directly.`,
      });
    }
  };

  const contactSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      getBreadcrumbSchema([{ name: 'Contact', path: '/contact' }]),
      getContactPageSchema(),
    ],
  };

  return (
    <div className="pt-24 pb-14 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-20 overflow-hidden">
      <SEOHead
        title="Contact & Project Brief Scoping — My Planet Services"
        description="Start your project brief, schedule an architecture discovery call, and receive a scoped technical plan and fixed quote within 48 hours."
        canonicalPath="/contact"
        keywords="contact software agency, hire SaaS developers, project brief quote, discovery call software, NDA software development"
        schema={contactSchema}
      />
      {/* Aurora Glow */}
      <div
        className="aurora absolute inset-x-0 -top-24 h-[620px] opacity-90 blur-[2px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="site-container">
        {/* Header: Compact & High Impact */}
        <div className="max-w-3xl text-left mb-8 sm:mb-10">
          <div className="bg-butter text-butter-foreground rounded-full px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] inline-flex items-center gap-2 shadow-sm mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Start a Conversation</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-foreground tracking-tight mb-3">
            Let's build something worth scaling.
          </h1>
          <p className="text-sm sm:text-base leading-relaxed text-muted-foreground max-w-2xl">
            Tell us about your product, timeline, and architectural targets. You'll get a scoped technical plan and fixed quote within two working days.
          </p>
        </div>

        {/* Dual-Column Main Layout: Left = Action Card (Brief / Call Tabs), Right = Direct Hubs & Socials */}
        <div className="grid lg:grid-cols-[1.18fr_1fr] gap-8 items-start mb-14">
          {/* Left Column: Interactive Project Brief Form OR Discovery Call Calendar */}
          <div className="rounded-[32px] bg-card border border-border p-5 sm:p-8 lg:p-10 shadow-soft text-left">
            {/* Segmented Mode Switcher */}
            <div className="flex items-center p-1 rounded-2xl bg-secondary border border-border/80 mb-6 sm:mb-7">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('brief');
                  setSearchParams({ tab: 'brief' });
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 px-2 sm:px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'brief'
                    ? 'bg-card text-foreground shadow-sm border border-border/60'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-butter-foreground shrink-0" />
                <span><span className="hidden sm:inline">Send </span>Project Brief</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('call');
                  setSearchParams({ tab: 'call' });
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 px-2 sm:px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'call'
                    ? 'bg-card text-foreground shadow-sm border border-border/60'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-butter-foreground shrink-0" />
                <span>Book 30-Min Call</span>
              </button>
            </div>

            {/* Tab 1: Project Brief Form */}
            {activeTab === 'brief' && (
              <div className="animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 mb-2">
                  <h2 className="font-display text-xl sm:text-2xl font-medium text-foreground tracking-tight">
                    Send a Project Brief
                  </h2>
                  <span className="self-start sm:self-auto text-[10px] sm:text-[11px] font-mono text-muted-foreground bg-secondary/80 border border-border/60 px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                    Fixed Quote in 48h
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-6 max-w-md">
                  Fill in what you know. We'll handle the scoping, technical architecture, and milestones.
                </p>

                <form id="contact-brief-form" onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-medium"
                      >
                        Your Name *
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder="Jane Doe"
                        className="w-full rounded-2xl bg-secondary/50 border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground focus:bg-card focus:outline-hidden transition-all"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-medium"
                      >
                        Work Email *
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="jane@company.com"
                        className="w-full rounded-2xl bg-secondary/50 border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground focus:bg-card focus:outline-hidden transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label
                        htmlFor="service"
                        className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-medium"
                      >
                        Primary Discipline *
                      </label>
                      <select
                        id="service"
                        name="service"
                        required
                        defaultValue=""
                        className="w-full rounded-2xl bg-secondary/50 border border-border px-4 py-3 text-sm text-foreground focus:border-foreground focus:bg-card focus:outline-hidden transition-all appearance-none cursor-pointer"
                      >
                        <option value="" disabled>
                          Select primary service
                        </option>
                        {SERVICE_OPTIONS.map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="budget"
                        className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-medium"
                      >
                        Target Budget
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        className="w-full rounded-2xl bg-secondary/50 border border-border px-4 py-3 text-sm text-foreground focus:border-foreground focus:bg-card focus:outline-hidden transition-all appearance-none cursor-pointer"
                        defaultValue=""
                      >
                        <option value="">Select a range</option>
                        {BUDGET_BANDS.map((band) => {
                          const label = band.max
                            ? `${price(band.min)} – ${price(band.max)}`
                            : `${price(band.min)}+`;
                          return (
                            <option key={band.min} value={label}>
                              {label}
                            </option>
                          );
                        })}
                        <option value="Not sure yet">Not sure yet</option>
                        <option value="Prefer to discuss">Prefer to discuss</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-medium"
                    >
                      Project Details & Goals *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={3}
                      required
                      placeholder="Tell us about the target audience, existing codebase/stack, desired launch window, or key metrics..."
                      className="w-full rounded-2xl bg-secondary/50 border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground focus:bg-card focus:outline-hidden transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    aria-busy={loading}
                    className={`w-full bg-ink text-ink-foreground rounded-full py-3.5 px-6 text-sm font-semibold transition-all duration-200 mt-1 relative overflow-hidden flex items-center justify-center gap-2.5 shadow-soft ${
                      loading
                        ? 'opacity-95 cursor-wait scale-[0.99] ring-2 ring-butter/50'
                        : 'hover:scale-[1.02] cursor-pointer'
                    }`}
                  >
                    {/* Animated indeterminate progress sweep along the bottom */}
                    {loading && (
                      <div className="absolute bottom-0 inset-x-0 h-1 bg-white/15 overflow-hidden">
                        <div
                          className="h-full bg-butter animate-submit-sweep transition-all duration-500 rounded-full"
                          style={{ width: `${briefProgress.progressPercent}%` }}
                        />
                      </div>
                    )}

                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-butter shrink-0" />
                        <span className="font-medium tracking-wide animate-pulse">
                          {briefProgress.currentStep}
                        </span>
                        <span className="text-[11px] font-mono text-butter/90 font-semibold shrink-0">
                          {briefProgress.progressPercent}%
                        </span>
                      </>
                    ) : (
                      <>
                        <span>Send project brief</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('call');
                        setSearchParams({ tab: 'call' });
                      }}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      Prefer a direct discussion? <span className="underline font-medium">Switch to 30-Min Discovery Call →</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Tab 2: Discovery Call Booking Calendar */}
            {activeTab === 'call' && (
              <div className="animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 mb-2">
                  <h2 className="font-display text-xl sm:text-2xl font-medium text-foreground tracking-tight">
                    Book a 30-Min Discovery Call
                  </h2>
                  <span className="self-start sm:self-auto text-[10px] sm:text-[11px] font-mono text-butter-foreground font-semibold bg-butter/30 border border-butter/40 px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                    Instant Slot
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-5">
                  Pick any weekday that suits you. Times are shown in your own timezone (<span className="font-mono">{timeZone}</span>).
                </p>

                <div className="bg-secondary/60 rounded-2xl p-3.5 sm:p-5 border border-border mb-4">
                  <BookingCalendar
                    timeZone={timeZone}
                    selectedIso={slot?.iso ?? null}
                    onSelect={setSlot}
                  />
                </div>

                {slot && (
                  <div className="flex items-start gap-2.5 rounded-2xl bg-butter/20 border border-butter/50 px-4 py-3 mb-4">
                    <CheckCircle2 className="w-4 h-4 text-butter-foreground shrink-0 mt-0.5" />
                    <p className="text-xs text-foreground font-medium leading-snug">
                      {describeSlot(slot.iso, timeZone)}
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleBooking}
                  disabled={booking || !slot}
                  aria-busy={booking}
                  className={`w-full bg-butter text-butter-foreground rounded-full py-3.5 px-6 text-sm font-semibold transition-all relative overflow-hidden flex items-center justify-center gap-2.5 shadow-sm ${
                    booking
                      ? 'opacity-95 cursor-wait scale-[0.99] ring-2 ring-ink/30'
                      : slot
                      ? 'hover:scale-[1.02] cursor-pointer'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  {/* Animated indeterminate progress sweep along the bottom */}
                  {booking && (
                    <div className="absolute bottom-0 inset-x-0 h-1 bg-black/15 overflow-hidden">
                      <div
                        className="h-full bg-ink animate-submit-sweep transition-all duration-500 rounded-full"
                        style={{ width: `${bookingProgress.progressPercent}%` }}
                      />
                    </div>
                  )}

                  {booking ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-butter-foreground shrink-0" />
                      <span className="font-medium tracking-wide animate-pulse">
                        {bookingProgress.currentStep}
                      </span>
                      <span className="text-[11px] font-mono text-butter-foreground/90 font-semibold shrink-0">
                        {bookingProgress.progressPercent}%
                      </span>
                    </>
                  ) : (
                    <span>{slot ? 'Request this slot' : 'Pick a time slot above'}</span>
                  )}
                </button>

                <div className="text-center pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('brief');
                      setSearchParams({ tab: 'brief' });
                    }}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    Prefer to write your requirements? <span className="underline font-medium">Switch to Brief Form →</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Direct Studio Line & Official Social Channels */}
          <div className="flex flex-col gap-6 text-left">
            {/* Direct Studio Details Card */}
            <div className="rounded-[32px] border border-border bg-card p-6 sm:p-7 shadow-soft">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-medium text-base sm:text-lg text-foreground">
                  Direct Studio Line
                </h3>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Responds &lt; 24h</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 text-xs sm:text-sm">
                <a
                  href="mailto:vivek@myplanetservices.com"
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group p-1.5 -mx-1.5 rounded-xl hover:bg-secondary/60"
                >
                  <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center text-foreground group-hover:bg-butter group-hover:text-butter-foreground transition-colors shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="font-mono text-xs sm:text-sm">vivek@myplanetservices.com</span>
                </a>

                <div className="flex items-start gap-3 text-muted-foreground group p-1.5 -mx-1.5 rounded-xl hover:bg-secondary/60 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center text-foreground group-hover:bg-butter group-hover:text-butter-foreground transition-colors shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] font-medium text-foreground/80 uppercase tracking-wider">
                      Vivek · Founder & CEO
                    </span>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-xs sm:text-sm">
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

                <div className="flex items-center gap-3 text-muted-foreground p-1.5 -mx-1.5">
                  <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center text-foreground shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span>Bengaluru, India (HQ Studio)</span>
                </div>
              </div>

              <div className="mt-4 pt-3.5 border-t border-border/60 flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>100% Mutual NDA guaranteed before technical review.</span>
              </div>
            </div>

            {/* Official Social Channels Card */}
            <div className="rounded-[32px] border border-border bg-card p-6 sm:p-7 shadow-soft text-left">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display font-medium text-base sm:text-lg text-foreground">
                  Official Social Channels
                </h3>
                <span className="text-[11px] font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded-full uppercase tracking-wider">
                  5 Channels
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                Connect with our founders, explore tech teardowns, sprint drops & AI systems.
              </p>
              <SocialLinks variant="cards" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
