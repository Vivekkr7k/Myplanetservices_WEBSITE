import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Minus,
  Sparkles,
  ArrowRight,
  Mail,
  Phone,
  MessageCircle,
} from 'lucide-react';

const FAQ_CATEGORIES = [
  'All',
  'Engineering & AI',
  'Process & Timelines',
  'Pricing & Billing',
  'Ownership & Security',
];

const ALL_FAQS = [
  {
    category: 'Process & Timelines',
    q: 'How quickly can we start after the discovery call?',
    a: 'Most engagements kick off within 7 to 10 days of our initial discovery workshop. If you have an urgent deadline or critical launch window, we can occasionally fast-track a sprint pod depending on active squad availability.',
  },
  {
    category: 'Engineering & AI',
    q: 'Do you work with existing codebases or only greenfield builds?',
    a: 'Yes, we frequently modernize existing systems. We conduct a thorough technical audit of your architecture, isolate legacy bottlenecks, stabilize critical user paths, and refactor incrementally rather than forcing a risky all-or-nothing rewrite.',
  },
  {
    category: 'Engineering & AI',
    q: 'What does AI automation actually mean in practical terms?',
    a: 'We build pragmatic, revenue-focused AI systems: custom customer support agents trained on proprietary docs with zero-hallucination guardrails, automated lead qualification pipelines, vector RAG search, and internal copilots that remove manual repetitive ops.',
  },
  {
    category: 'Engineering & AI',
    q: 'How is SEO different from AEO and GEO?',
    a: 'SEO targets traditional Google search engine result pages. AEO (Answer Engine Optimization) structures entity schema for featured snippets and voice assistants. GEO (Generative Engine Optimization) ensures your brand is indexed and cited accurately inside conversational AI tools like ChatGPT, Perplexity, and Gemini. We implement all three simultaneously.',
  },
  {
    category: 'Ownership & Security',
    q: 'Who owns the code, design assets, and cloud infrastructure?',
    a: 'You do — 100% from day one. All GitHub repositories, Figma design tokens, custom components, domain setups, and AWS/Supabase cloud configurations belong strictly to your company upon milestone completion.',
  },
  {
    category: 'Process & Timelines',
    q: 'How do you handle scope changes or evolving requirements?',
    a: 'We work in two-week agile sprint cycles. If your business priorities shift, we simply reprioritize the backlog during our Monday sprint planning without bureaucratic change-order penalties. You get full control over what is built next.',
  },
  {
    category: 'Engineering & AI',
    q: 'What tech stacks do you specialize in?',
    a: 'Our primary frontend stack is React 19, TypeScript, Tailwind CSS v4, Next.js, and Vite. For mobile, we use React Native & Flutter. For backend and AI systems, we leverage Node.js, Python, PostgreSQL, Supabase, Pinecone, and OpenAI APIs hosted on AWS or Vercel.',
  },
  {
    category: 'Process & Timelines',
    q: 'How does communication work during active sprints?',
    a: 'You get a private shared Slack channel with your dedicated senior engineers and designers. We hold Monday sprint kickoff calls, send mid-week async updates, and deploy a live staging preview with a recorded Loom demo every single Friday.',
  },
  {
    category: 'Pricing & Billing',
    q: 'What are the payment terms and milestones?',
    a: 'For fixed-scope projects (e.g. Launch tier), payments are structured as 50% upfront deposit and 50% upon final production delivery and acceptance. For dedicated squad retainers (Scale tier), billing is handled monthly in advance with zero long-term lock-in.',
  },
  {
    category: 'Ownership & Security',
    q: 'Can you sign our mutual NDA before we share our product specs?',
    a: 'Absolutely. We regularly sign standard mutual Non-Disclosure Agreements prior to reviewing proprietary product roadmaps, wireframes, or internal data architectures.',
  },
  {
    category: 'Pricing & Billing',
    q: 'What happens after the project launches?',
    a: 'Every build includes a free first year: Hostinger hosting on an account registered in your name, plus full maintenance — security patches, dependency updates, uptime monitoring, bug fixes on delivered scope, and up to 2 hours of content edits each month. After those 12 months you can renew hosting at cost, move to a flexible maintenance retainer, or take the whole thing in-house. Nothing is locked to us.',
  },
  {
    category: 'Process & Timelines',
    q: 'Do you offer technical advisory or fractional CTO services?',
    a: 'Yes. For early-stage founders preparing for institutional fundraising or technical audits, our senior leads provide architectural reviews, hiring assessments, and technical diligence support.',
  },
];

export function FaqPage() {
  const [selectedCat, setSelectedCat] = useState('All');
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const filteredFaqs =
    selectedCat === 'All'
      ? ALL_FAQS
      : ALL_FAQS.filter((f) => f.category === selectedCat);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <div className="pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pt-36 lg:pb-32 overflow-hidden">
      {/* Aurora Glow */}
      <div
        className="aurora absolute inset-x-0 -top-24 h-[620px] opacity-90 blur-[2px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="text-left mb-16">
          <div className="bg-butter text-butter-foreground rounded-full px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] inline-flex items-center gap-2 shadow-sm mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Help Center & FAQ</span>
          </div>
          <h1 className="font-display text-display-xl font-medium text-foreground mb-6">
            Questions, answered <br />
            in plain English.
          </h1>
          <p className="text-[16px] sm:text-[18px] leading-relaxed text-muted-foreground max-w-2xl">
            Everything you need to know about our squad architecture, sprint cadence, intellectual property rights, and billing structure.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2.5 mb-10">
          {FAQ_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCat(cat);
                setOpenIdx(0);
              }}
              className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer border ${
                selectedCat === cat
                  ? 'bg-ink text-ink-foreground border-ink shadow-soft'
                  : 'bg-card text-muted-foreground border-border hover:text-foreground hover:bg-secondary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion Container */}
        <div className="rounded-[32px] border border-border bg-card p-6 sm:p-10 shadow-sm divide-y divide-border mb-20 text-left">
          {filteredFaqs.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={item.q} className="py-5 sm:py-6 first:pt-0 last:pb-0">
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between text-left gap-4 group focus:outline-hidden cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex flex-col gap-1 pr-4">
                    <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                      {item.category}
                    </span>
                    <span className="font-display text-lg sm:text-xl font-medium text-foreground group-hover:text-primary transition-colors">
                      {item.q}
                    </span>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center shrink-0 transition-transform duration-300">
                    {isOpen ? (
                      <Minus className="w-4 h-4 text-foreground" />
                    ) : (
                      <Plus className="w-4 h-4 text-foreground" />
                    )}
                  </div>
                </button>

                {/* CSS Grid Accordion */}
                <div
                  className="grid transition-all duration-400 ease-out"
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

        {/* Direct Help Banner */}
        <div className="rounded-[32px] bg-ink text-ink-foreground p-8 sm:p-12 text-left border border-white/5 shadow-float">
          <div className="grid sm:grid-cols-[1.2fr_1fr] gap-8 items-center">
            <div>
              <div className="text-xs uppercase tracking-wider text-butter font-semibold mb-2 flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <span>Need Direct Clarification?</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-medium text-ink-foreground mb-3">
                Have a specific question about your stack?
              </h2>
              <p className="text-xs sm:text-sm text-ink-muted leading-relaxed mb-6">
                Our senior engineering leads are available to review your technical specs and answer questions over email or a short call.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 text-xs sm:text-sm">
                <a
                  href="mailto:hello@myplanet.services"
                  className="flex items-center gap-2 text-ink-muted hover:text-butter transition-colors"
                >
                  <Mail className="w-4 h-4 text-butter" />
                  <span>hello@myplanet.services</span>
                </a>
                <a
                  href="tel:+14155550148"
                  className="flex items-center gap-2 text-ink-muted hover:text-butter transition-colors"
                >
                  <Phone className="w-4 h-4 text-butter" />
                  <span>+1 (415) 555-0148</span>
                </a>
              </div>
            </div>

            <div className="flex justify-start sm:justify-end">
              <Link
                to="/contact"
                className="bg-butter text-butter-foreground rounded-full px-8 py-4 text-sm font-semibold hover:scale-105 transition-transform inline-flex items-center gap-2"
              >
                <span>Book a discovery call</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FaqPage;
