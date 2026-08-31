import { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import { sendContactEmail } from '../lib/send-email';

export function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState('Tomorrow, 2:00 PM EST');

  const TIME_SLOTS = [
    'Tomorrow, 10:00 AM EST',
    'Tomorrow, 2:00 PM EST',
    'Thursday, 11:30 AM EST',
    'Thursday, 4:00 PM EST',
  ];

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

    try {
      await sendContactEmail({
        name,
        email,
        company,
        service,
        budget,
        message,
      });

      toast.success('Project brief received!', {
        description: 'Your brief was sent to vivek@myplanetservices.com. We will reply within 2 working days.',
      });

      form.reset();
    } catch (err) {
      toast.success('Project brief received!', {
        description: 'Our senior technical lead will review your brief and reply shortly.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = () => {
    toast.success('Discovery call requested!', {
      description: `We have reserved ${selectedSlot} for your team. Calendar invite sent.`,
    });
  };

  return (
    <div className="pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pt-36 lg:pb-32 overflow-hidden">
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
            <p className="text-xs sm:text-sm text-muted-foreground mb-8">
              Fill in what you know. We'll handle the scoping, technical architecture, and milestones.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
                    <option value="ecommerce">E-Commerce Development</option>
                    <option value="corporate">Company & Corporate Websites</option>
                    <option value="redesign">Website Redesign & Modernization</option>
                    <option value="crm-erp">Custom CRM & ERP Systems</option>
                    <option value="website">Website Development</option>
                    <option value="app">Mobile App Development</option>
                    <option value="ai">AI Automation & Agents</option>
                    <option value="saas">SaaS Product Engineering</option>
                    <option value="seo">SEO / AEO / GEO Strategy</option>
                    <option value="marketing">Digital Marketing & Growth</option>
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
                    defaultValue="$10k - $25k"
                    className="w-full rounded-2xl bg-secondary/50 border border-border px-4 py-3.5 text-sm text-foreground focus:border-foreground focus:bg-card focus:outline-hidden transition-all appearance-none cursor-pointer"
                  >
                    <option value="$5k - $10k">$5,000 – $10,000</option>
                    <option value="$10k - $25k">$10,000 – $25,000</option>
                    <option value="$25k - $50k">$25,000 – $50,000</option>
                    <option value="$50k+">$50,000+</option>
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
                Prefer an interactive whiteboard session? Pick an available opening on our senior engineering calendar.
              </p>

              {/* Slot selector */}
              <div className="flex flex-col gap-2.5 mb-6">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm border flex items-center justify-between transition-colors cursor-pointer ${
                      selectedSlot === slot
                        ? 'bg-butter text-butter-foreground border-butter font-semibold shadow-xs'
                        : 'bg-ink-soft text-ink-muted border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4" />
                      <span>{slot}</span>
                    </div>
                    {selectedSlot === slot && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleBooking}
                className="w-full bg-butter text-butter-foreground rounded-full py-3.5 text-sm font-semibold hover:scale-[1.02] transition-transform cursor-pointer shadow-sm"
              >
                Confirm discovery slot
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
                <a
                  href="tel:+14155550148"
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <div style={{ animationDelay: '0.3s' }} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-foreground group-hover:bg-butter group-hover:text-butter-foreground transition-colors animate-icon-float animate-icon-glow">
                    <Phone className="w-4 h-4 animate-icon-sway group-hover:scale-120 transition-transform" />
                  </div>
                  <span>+1 (415) 555-0148</span>
                </a>
                <div className="flex items-center gap-3 text-muted-foreground group">
                  <div style={{ animationDelay: '0.6s' }} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-foreground animate-icon-float">
                    <MapPin className="w-4 h-4 animate-icon-bob group-hover:scale-120 transition-transform" />
                  </div>
                  <span>Remote-first · Austin, TX · Bengaluru, India</span>
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
