import { useState } from 'react';
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
} from 'lucide-react';
import { toast } from 'sonner';
import { sendProjectBrief, sendCallRequest } from '../lib/send-email';
import { BookingCalendar } from '../components/common/booking-calendar';
import { useCurrency } from '../lib/currency-context';
import { describeSlot, type Slot } from '../lib/booking-slots';
import { SERVICE_OPTIONS } from '../lib/service-options';

/**
 * Budget bands in INR, converted to the visitor's currency for display.
 *
 * The lowest band starts at ₹5,000 on purpose: our own entry price is ₹8,000,
 * so a range that opened at ₹25,000 left every small-project enquiry with
 * nothing truthful to pick.
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
  const { timeZone, price } = useCurrency();
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(false);
  const [slot, setSlot] = useState<Slot | null>(null);

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

    // Report what actually happened. Claiming success on a failed send loses the
    // lead silently and leaves the visitor expecting a reply that never comes.
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
    // Pull whatever the visitor has already typed into the brief form above, so
    // the request isn't an anonymous time slot with no way to reply.
    const form = document.querySelector<HTMLFormElement>('#contact-brief-form');
    const fd = form ? new FormData(form) : null;

    const result = await sendCallRequest({
      // Carries both readings so the request is unambiguous across timezones.
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
    <div className="pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pt-36 lg:pb-32 overflow-hidden">
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

      <div className="site-container-narrow">
        {/* Header */}
        <div className="max-w-3xl text-left mb-16">
          <div className="bg-butter text-butter-foreground rounded-full px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] inline-flex items-center gap-2 shadow-sm mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Start a Conversation</span>
          </div>
          <h1 className="font-display text-display-xl font-medium text-foreground mb-6">
            Let's build something <br />
            worth scaling.
          </h1>
          <p className="text-[16px] sm:text-[18px] leading-relaxed text-muted-foreground max-w-2xl">
            Tell us about your product, timeline, and architectural targets. You'll get a scoped technical plan and fixed quote within two working days.
          </p>
        </div>

        {/* Dual-Column Main Form + Booking Card */}
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 items-start mb-20">
          {/* Left Column: Project Brief Form */}
          <div className="rounded-[32px] bg-card border border-border p-8 sm:p-12 shadow-soft text-left">
            <h2 className="font-display text-2xl font-medium text-foreground mb-2">
              Send a Project Brief
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mb-8 max-w-md">
              Fill in what you know. We'll handle the scoping, technical architecture, and milestones.
            </p>

            <form id="contact-brief-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs uppercase tracking-wider text-muted-foreground mb-2 font-medium"
                  >
                    Your Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Jane Doe"
                    className="w-full rounded-2xl bg-secondary/50 border border-border px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground focus:bg-card focus:outline-hidden transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs uppercase tracking-wider text-muted-foreground mb-2 font-medium"
                  >
                    Work Email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="jane@company.com"
                    className="w-full rounded-2xl bg-secondary/50 border border-border px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground focus:bg-card focus:outline-hidden transition-all"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="service"
                    className="block text-xs uppercase tracking-wider text-muted-foreground mb-2 font-medium"
                  >
                    Primary Discipline *
                  </label>
                  <select
                    id="service"
                    name="service"
                    required
                    defaultValue=""
                    className="w-full rounded-2xl bg-secondary/50 border border-border px-4 py-3.5 text-sm text-foreground focus:border-foreground focus:bg-card focus:outline-hidden transition-all appearance-none cursor-pointer"
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
                    className="block text-xs uppercase tracking-wider text-muted-foreground mb-2 font-medium"
                  >
                    Target Budget
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    className="w-full rounded-2xl bg-secondary/50 border border-border px-4 py-3.5 text-sm text-foreground focus:border-foreground focus:bg-card focus:outline-hidden transition-all appearance-none cursor-pointer"
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
                  className="block text-xs uppercase tracking-wider text-muted-foreground mb-2 font-medium"
                >
                  Project Details & Goals *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  placeholder="Tell us about the target audience, existing codebase/stack, desired launch window, or key metrics..."
                  className="w-full rounded-2xl bg-secondary/50 border border-border px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground focus:bg-card focus:outline-hidden transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-ink text-ink-foreground rounded-full py-4 text-sm font-semibold hover:scale-[1.02] transition-transform duration-200 mt-2 flex items-center justify-center gap-2 cursor-pointer shadow-soft disabled:opacity-70"
              >
                <span>{loading ? 'Sending brief...' : 'Send project brief'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right Column: Direct Booking & Contacts */}
          <div className="flex flex-col gap-6 text-left">
            {/* Quick 30-min Call Card */}
            <div className="rounded-[32px] bg-ink text-ink-foreground p-8 border border-white/10 shadow-float">
              <div className="w-10 h-10 rounded-2xl bg-butter text-butter-foreground flex items-center justify-center mb-4 shadow-xs">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-display text-2xl font-medium text-ink-foreground mb-2">
                Book a 30-Min Discovery Call
              </h3>
              <p className="text-xs sm:text-sm text-ink-muted leading-relaxed mb-6">
                Pick any weekday that suits you. Times are shown in your own
                timezone — we handle the conversion.
              </p>

              <div className="bg-ink-soft rounded-2xl p-4 sm:p-5 border border-white/10 mb-5">
                <BookingCalendar
                  timeZone={timeZone}
                  selectedIso={slot?.iso ?? null}
                  onSelect={setSlot}
                />
              </div>

              {slot && (
                <div className="flex items-start gap-2.5 rounded-2xl bg-butter/15 border border-butter/40 px-4 py-3 mb-5">
                  <CheckCircle2 className="w-4 h-4 text-butter shrink-0 mt-0.5" />
                  <p className="text-xs text-ink-foreground leading-snug">
                    {describeSlot(slot.iso, timeZone)}
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={handleBooking}
                disabled={booking || !slot}
                className="w-full bg-butter text-butter-foreground rounded-full py-3.5 text-sm font-semibold hover:scale-[1.02] transition-transform cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {booking ? 'Sending request…' : slot ? 'Request this slot' : 'Pick a time above'}
              </button>
            </div>

            {/* Direct Studio Details */}
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
              <h4 className="font-display font-medium text-base text-foreground mb-4">
                Direct Contact & Hubs
              </h4>
              <div className="flex flex-col gap-4 text-xs sm:text-sm">
                <a
                  href="mailto:vivek@myplanetservices.com"
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-foreground group-hover:bg-butter group-hover:text-butter-foreground transition-colors animate-icon-float animate-icon-glow">
                    <Mail className="w-4 h-4 animate-icon-wiggle group-hover:scale-120 transition-transform" />
                  </div>
                  <span>vivek@myplanetservices.com</span>
                </a>
                <div className="flex items-start gap-3 text-muted-foreground group">
                  <div style={{ animationDelay: '0.3s' }} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-foreground group-hover:bg-butter group-hover:text-butter-foreground transition-colors animate-icon-float animate-icon-glow shrink-0 mt-0.5">
                    <Phone className="w-4 h-4 animate-icon-sway group-hover:scale-120 transition-transform" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] font-medium text-foreground/80 uppercase tracking-wider">Vivek · Founder & CEO</span>
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
                <div className="flex items-center gap-3 text-muted-foreground group">
                  <div style={{ animationDelay: '0.6s' }} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-foreground animate-icon-float">
                    <MapPin className="w-4 h-4 animate-icon-bob group-hover:scale-120 transition-transform" />
                  </div>
                  <span>Bengaluru, India</span>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-border/60 flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 animate-icon-pulse" />
                <span>100% Mutual NDA guaranteed before technical review.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
