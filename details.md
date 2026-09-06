# My Planet Services — Full Design & Content Specification

Everything needed to replicate this website exactly: tech stack, design tokens, typography, layout, animation, and all copy.

---

## 1. Tech Stack

| Layer | Choice |
|---|---|
| Framework | TanStack Start v1 (React 19, SSR) |
| Router | `@tanstack/react-router` 1.170.x (file-based routes in `src/routes`) |
| Build tool | Vite 7 |
| Styling | Tailwind CSS v4 (CSS-first config in `src/styles.css`, no `tailwind.config.js`) |
| UI primitives | shadcn/ui (new-york style) + Radix UI — available but the landing page is hand-built |
| Icons | `lucide-react` |
| Data | `@tanstack/react-query` (provider only; page is static) |
| Extras | `tw-animate-css`, `clsx`, `tailwind-merge`, `sonner` |
| Backend | None. Fully static marketing page; contact form is `preventDefault()` only |

### File map
```
src/
  styles.css                     design tokens + custom utilities
  routes/__root.tsx              html shell, font <link>s, providers
  routes/index.tsx               homepage, SEO head(), section order
  hooks/use-reveal.tsx           IntersectionObserver scroll reveal
  components/landing/
    site-nav.tsx                 fixed pill navbar + mobile menu
    hero.tsx                     hero + MacBook frame + dashboard mock
    services.tsx                 LogoMarquee + Services
    why-process.tsx              WhyUs + Process
    sections.tsx                 Work, Testimonials, Pricing, Faq, ContactCta, SiteFooter
```

Section order in `index.tsx`:
`SiteNav → Hero → LogoMarquee → Services → WhyUs → Process → Work → Testimonials → Pricing → Faq → ContactCta → SiteFooter`

---

## 2. Design Direction

Inspired by two references: a cream/ink editorial SaaS layout (Valtro) and a soft-gradient fintech hero (DOODI). Result: **warm cream canvas + near-black "ink" blocks + butter-yellow accent + mint aurora glow**, geometric grotesk type, very large radii, generous whitespace, no purple/blue AI-gradient clichés.

Principles:
- Alternating rhythm: light cream sections vs. full-bleed dark ink sections.
- Pill shapes for nav, buttons, tags, eyebrows.
- Cards use `rounded-3xl` (~1.75rem) or `rounded-[32px]`; every card lifts `-translate-y-1.5` on hover.
- Eyebrow label pattern above every section heading: uppercase, 11px, `tracking-[0.14em]`, butter pill.
- Headings break lines manually (`<br />`) for editorial ragging.
- Max content width `max-w-6xl` (72rem), horizontal padding `px-5`, vertical `py-24 sm:py-32`.

---

## 3. Color System (OKLCH, light theme `:root`)

```css
--radius: 0.875rem;

--background:            oklch(0.968 0.007 92);   /* warm cream */
--foreground:            oklch(0.19 0.008 60);    /* near-black warm */
--card:                  oklch(0.99 0.004 92);
--card-foreground:       oklch(0.19 0.008 60);
--popover:               oklch(0.99 0.004 92);
--popover-foreground:    oklch(0.19 0.008 60);

--primary:               oklch(0.19 0.008 60);
--primary-foreground:    oklch(0.975 0.006 92);
--secondary:             oklch(0.94 0.008 92);
--secondary-foreground:  oklch(0.24 0.008 60);
--muted:                 oklch(0.94 0.008 92);
--muted-foreground:      oklch(0.52 0.012 70);
--accent:                oklch(0.93 0.05 155);
--accent-foreground:     oklch(0.25 0.03 155);

--butter:                oklch(0.93 0.1 100);     /* signature yellow */
--butter-foreground:     oklch(0.22 0.03 90);
--mint:                  oklch(0.87 0.08 158);

--ink:                   oklch(0.16 0.004 60);    /* dark section bg */
--ink-foreground:        oklch(0.975 0.006 92);
--ink-soft:              oklch(0.22 0.005 60);    /* cards on ink */
--ink-muted:             oklch(0.72 0.008 80);    /* body text on ink */

--destructive:           oklch(0.577 0.245 27.325);
--border, --input:       oklch(0.89 0.008 90);
--ring:                  oklch(0.62 0.03 90);

--chart-1: oklch(0.646 0.222 41.116);
--chart-2: oklch(0.6 0.118 184.704);
--chart-3: oklch(0.398 0.07 227.392);
--chart-4: oklch(0.828 0.189 84.429);
--chart-5: oklch(0.769 0.188 70.08);
```

Dark theme (`.dark`) flips background to `oklch(0.16 0.004 60)`, card to `oklch(0.22 0.005 60)`, primary becomes butter, borders `oklch(1 0 0 / 12%)`.

### Shadows & gradients
```css
--shadow-soft: 0 1px 2px oklch(0.2 0.01 80 / 0.05),
               0 12px 40px -18px oklch(0.2 0.01 80 / 0.25);
--shadow-float: 0 30px 70px -30px oklch(0.2 0.01 80 / 0.35);

--gradient-aurora:
  radial-gradient(60% 60% at 18% 20%, oklch(0.93 0.08 158 / 0.75) 0%, transparent 60%),
  radial-gradient(50% 55% at 85% 10%, oklch(0.95 0.07 120 / 0.6) 0%, transparent 65%),
  radial-gradient(55% 60% at 60% 90%, oklch(0.95 0.08 100 / 0.55) 0%, transparent 60%);
```

All tokens are exposed to Tailwind through `@theme inline` (`--color-butter: var(--butter)` → `bg-butter`, `text-butter`, etc.).

---

## 4. Typography

Loaded via `<link>` in `src/routes/__root.tsx` (never `@import` in CSS on Tailwind v4):
```
https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap
```
with `preconnect` to `fonts.googleapis.com` and `fonts.gstatic.com`.

```css
--font-display: "Outfit", ui-sans-serif, system-ui, sans-serif;  /* headings, numbers, logo */
--font-sans:    "DM Sans", ui-sans-serif, system-ui, sans-serif; /* body */
```
Base: `body { font-family: var(--font-sans); -webkit-font-smoothing: antialiased; }`
`h1–h4 { font-family: var(--font-display); letter-spacing: -0.03em; }`

Scale used:
- H1: `text-[2.6rem] leading-[1.03] sm:text-6xl`, weight 500
- H2: `text-4xl sm:text-5xl leading-[1.06]`, weight 500
- H3 (card): `text-xl` weight 500
- Body: `text-[15px] leading-relaxed`, `text-muted-foreground`
- Small/meta: `text-sm`, `text-xs`, `text-[13px]`, `text-[11px]`
- Eyebrow: `text-[11px] font-semibold uppercase tracking-[0.14em]`
- Marquee label: `tracking-[0.28em]`
- Big stats: `font-display text-4xl`–`text-5xl` weight 500

---

## 5. Custom CSS Utilities (`@utility` — Tailwind v4)

```css
@utility aurora        { background-image: var(--gradient-aurora); }
@utility shadow-soft   { box-shadow: var(--shadow-soft); }
@utility shadow-float  { box-shadow: var(--shadow-float); }

@utility grain {                     /* subtle dotted texture overlay */
  position: relative;
  &::after {
    content: ""; position: absolute; inset: 0; pointer-events: none;
    opacity: 0.35;
    background-image: radial-gradient(oklch(0.5 0 0 / 0.06) 1px, transparent 1px);
    background-size: 4px 4px;
  }
}

@utility reveal    { opacity: 0; transform: translateY(24px);
                     transition: opacity .7s cubic-bezier(.22,1,.36,1),
                                 transform .7s cubic-bezier(.22,1,.36,1); }
@utility reveal-in { opacity: 1; transform: none; }

@utility animate-marquee    { animation: marquee 28s linear infinite; }     /* translateX(0 → -50%) */
@utility animate-float-slow { animation: float-slow 7s ease-in-out infinite; } /* ±14px, unused in hero */
```

### MacBook device frame utilities
```css
@utility device-bezel {
  background: linear-gradient(160deg,
    oklch(0.34 0.004 60) 0%, oklch(0.19 0.004 60) 22%,
    oklch(0.13 0.004 60) 65%, oklch(0.22 0.004 60) 100%);
  box-shadow:
    0 1px 0 0 oklch(1 0 0 / 0.22) inset,
    0 0 0 1px oklch(0.1 0.004 60 / 0.9),
    0 40px 80px -34px oklch(0.2 0.01 80 / 0.5),
    0 12px 30px -18px oklch(0.2 0.01 80 / 0.35);
}
@utility device-glass {
  box-shadow: 0 0 0 1px oklch(0 0 0 / 0.55) inset,
              0 24px 50px -30px oklch(0 0 0 / 0.6) inset;
}
@utility device-sheen {
  background: linear-gradient(118deg, oklch(1 0 0 / 0.16) 0%,
              oklch(1 0 0 / 0.05) 26%, transparent 46%);
}
```

---

## 6. Animation & Motion

| Effect | Implementation |
|---|---|
| Scroll reveal | `useReveal()` hook: `IntersectionObserver` (`threshold 0.12`, `rootMargin 0px 0px -10% 0px`) adds `reveal-in` to every `[data-reveal]`, then unobserves. Falls back to instant reveal when IO is unsupported. |
| Stagger | `data-reveal-delay` attribute in ms — grids use `i * 70`, `i * 80`, hero right column `150`. Applied via `setTimeout`. |
| Smooth scroll | `html { scroll-behavior: smooth; }` + hash anchors (`#services`, `#why`, …) |
| Nav scroll state | `window.scrollY > 24` toggles `shadow-float` on the pill nav, `transition-all duration-500` |
| Card hover | `hover:-translate-y-1.5` + `duration-300`; service cards also `hover:shadow-soft` and icon tile turns butter |
| Button hover | `hover:scale-[1.03]` / `[1.02]`, `duration-200` |
| Arrow hover | `group-hover:-translate-y-0.5 group-hover:translate-x-0.5` |
| Logo marquee | duplicated list, `animate-marquee` 28s linear infinite, masked edges `[mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]` |
| FAQ accordion | CSS grid trick: `gridTemplateRows: '1fr' | '0fr'`, `transition-all duration-400 ease-out`, child `overflow-hidden` |
| Hero laptop | **static** — no float animation; only the reveal applies |

Easing standard: `cubic-bezier(0.22, 1, 0.36, 1)`.

---

## 7. Section-by-Section Spec

### Nav (`SiteNav`)
Fixed, `z-50`, `px-3 pt-3 sm:px-5 sm:pt-5`. Pill: `max-w-6xl rounded-full bg-ink text-ink-foreground px-4 py-2.5`.
Logo: butter rounded-lg square 7×7 with a 3×3 ink square inside + wordmark **My Planet Services** (`font-display text-lg`).
Links (desktop `lg:flex`, gap-7): Services · Why Us · Process · Work · Pricing · FAQ → `#services #why #process #work #pricing #faq`.
Right: butter pill CTA "Book a call" + `ArrowUpRight`; mobile hamburger (`Menu`/`X`) opens a `rounded-3xl bg-ink` panel listing all links plus the CTA.

### Hero
Layout: `max-w-6xl grid lg:grid-cols-[1.05fr_1fr] gap-12`, `pt-28 pb-16 sm:pt-36 sm:pb-24`. Aurora blob: `absolute inset-x-0 -top-24 h-[620px] opacity-90 blur-[2px]`.

- Eyebrow pill (butter, `Bot` icon): **AI-native product studio**
- H1: `We build the software / that grows your / business.`
- Paragraph: "My Planet Services is a SaaS development studio for founders and scaling teams. Websites, mobile apps, AI automation and search-first marketing — designed, engineered and measured under one roof."
- Buttons: **Start your project** (ink pill + `ArrowRight`) · **See our work** (card pill with border + `Play`)
- Social proof: 4 overlapping avatars `NX AR KJ MS` (ink circles, `border-2 border-background`, `-space-x-2.5`), then **120+ launches** / "Trusted by startups and enterprise teams across 14 countries."

**Laptop frame** (right column): container `overflow-hidden lg:-mr-24 xl:-mr-40`, `maxHeight: 440px` (crops the device so only the upper screen shows). Desktop tilt: `lg:[transform:perspective(1800px)_rotateY(-7deg)_rotateX(2deg)]`.
`LaptopFrame` = `device-bezel rounded-[26px] p-[10px] pb-[14px] sm:p-3 sm:pb-4`, a centered notch (`h-[18px] w-[104px] rounded-b-[10px] bg-ink`, sm: `h-5 w-[128px]`) with a 5px camera dot, and an inner `device-glass rounded-[18px]` screen carrying `device-sheen` plus an inset vignette `0 0 90px 20px oklch(0 0 0 / 0.10) inset`.

**DashboardMock** inside: header "My Planet Services Console" with ink logo tile + tab pills `Overview | Pipeline | Automations` (first active, ink pill). Greeting "Good morning, team." / "Delivery, growth and automation — one live view." Three stat cards:
| Value | Label | Delta |
|---|---|---|
| 128 | Projects shipped | 4.4% |
| 178,125 | Organic clicks | 12.1% |
| 2,940 | Hours automated | 9.8% (butter highlight card) |
Then a "Pipeline velocity" panel with badge `+$72,000` and a 10-bar chart, heights `[42, 58, 36, 74, 51, 88, 47, 63, 39, 70]`%, bar index 5 in butter, rest `bg-secondary`.

### LogoMarquee
`bg-ink py-10`. Label "Trusted by". Logos: Vantage · Greenish · Glossy · Ebooks · Proline · Flash · Northwind (duplicated for the loop, `text-2xl font-display text-ink-muted`, gap-16).

### Services (`#services`)
Heading: `Everything you need / to build, launch and / scale.` Eyebrow: **Our services**. Intro: "Six disciplines, one accountable team. We plug into your roadmap and own delivery from first workshop to post-launch growth — no handoffs, no agency theatre."
Grid `sm:grid-cols-2 lg:grid-cols-3 gap-4`, cards `rounded-3xl border bg-card p-6`.

| Icon | Title | Description | Bullets |
|---|---|---|---|
| Globe | Website Development | Conversion-focused marketing sites and web platforms built on modern stacks — fast, accessible and easy for your team to edit. | Next-gen React stacks · CMS + headless content · Core Web Vitals 95+ |
| Smartphone | App Development | Native-feel iOS, Android and cross-platform apps with clean design systems, offline support and analytics baked in. | React Native & Flutter · Design systems · Store launch support |
| Bot | AI Automation | Agents, copilots and workflow automations that remove manual work from sales, support and operations. | Custom AI agents · RAG knowledge bases · Ops workflow automation |
| Search | SEO, AEO & GEO | Rank in search, answer engines and generative results. Technical foundations plus content built for how people ask today. | Technical SEO audits · Answer-engine schema · AI-visibility strategy |
| Megaphone | Digital Marketing | Paid, lifecycle and content programs that turn traffic into pipeline — measured against revenue, not vanity metrics. | Performance ads · Lifecycle email · Attribution dashboards |
| Layers | SaaS Development | End-to-end product engineering: multi-tenant architecture, billing, dashboards and everything needed to ship a real SaaS. | MVP in 6–10 weeks · Billing & auth · Scalable cloud infra |

### WhyUs (`#why`, dark ink section)
Heading: `Why teams choose / My Planet Services as their / build partner`. Eyebrow **Key benefits**. Intro: "We're built for teams that value speed, clarity and compounding results. You get senior operators who care about the metric behind the feature."

Benefits (left column, `bg-ink-soft` rows, butter icon tiles):
1. **Gauge — Ship in weeks, not quarters** — Fixed-scope sprints with a working build in your hands every Friday.
2. **Users — One senior team, end to end** — Strategy, design, engineering and growth sit in the same room.
3. **Sparkles — AI woven into the product** — Automation isn't an add-on — it's designed into the workflow from day one.
4. **ShieldCheck — Built to scale safely** — Typed codebases, tests, observability and infra that survives growth.

Stats panel (right, 2×2 in `bg-ink-soft rounded-3xl`): **120+** Products delivered · **89%** Clients who re-engage · **2.9k** Hours automated monthly · **14** Countries served. Full-width butter card below: "Average 3.4× return on the first year of engagement." / "Measured across 40 client engagements, 2023–2026."

### Process (`#process`)
Eyebrow **How we work**; H2 "A process that removes guesswork." Four cards (`md:grid-cols-2 lg:grid-cols-4`), each with a 25%/50%/75%/100% butter progress bar:
- **01 Discover** — A focused workshop to map users, constraints and the metric that defines success.
- **02 Design** — Clickable prototypes and a design system your engineers can build from immediately.
- **03 Build** — Two-week sprints, live staging links and weekly demos so nothing is a surprise.
- **04 Grow** — Launch, instrument, then improve with SEO, automation and performance marketing.

### Work (`#work`)
H2 "Recent outcomes"; sub "A few engagements where design, engineering and growth compounded together." Three ink cards, butter metric in `text-5xl`:
- **9 wks** — *SaaS Platform* — Fleetly — MVP shipped in 9 weeks, $1.2M seed raised
- **-62%** — *AI Automation* — Northwind Ops — Support resolution time cut by 62% with an AI agent
- **14×** — *SEO / AEO* — Glossy Retail — Organic sessions from 12k to 178k in eight months

### Testimonials (`bg-secondary`)
Eyebrow **Client voices**; H2 "Partnerships that keep going." Cards `rounded-3xl bg-card`, quote in `font-display text-lg font-light`, initials avatar in footer.
1. "My Planet Services replaced three vendors. They shipped our platform, then kept improving it with automation we didn't know we needed." — **Amara Reyes**, COO, Fleetly
2. "The clearest process we've worked with. Weekly demos meant zero surprises and a launch date we actually hit." — **Karan Joshi**, Founder, Northwind
3. "Our organic traffic and AI-answer visibility both climbed within a quarter. The reporting is honest and revenue-linked." — **Mia Sandoval**, Head of Growth, Glossy

### Pricing (`#pricing`)
Eyebrow **Engagements**; H2 "Transparent ways to work with us." Three cards; middle is featured (`bg-ink`, butter price, "Most picked" badge). CTA on each: "Get a proposal".

| Plan | Price | Cadence | Description | Features |
|---|---|---|---|---|
| Launch | $4,900 | per project | For founders validating an idea with a sharp marketing site or landing system. | Up to 6 pages, custom design · SEO foundations & analytics · CMS handover + training · 2 weeks post-launch support |
| **Scale** | $9,800 | per month | A dedicated squad building your product and growth engine in parallel. | Full product or app build · AI automation workflows · SEO, AEO & GEO program · Weekly demos & reporting · Priority Slack channel |
| Enterprise | Custom | tailored | Multi-team delivery, compliance requirements and legacy modernisation. | Dedicated senior pod · Security & compliance review · Cloud architecture & SRE · Quarterly roadmap planning |

### FAQ (`#faq`)
Centered eyebrow **FAQ**; H2 "Questions, answered." `max-w-4xl` card, dividers, `Plus`/`Minus` toggles, first item open by default.
1. **How quickly can we start?** — Most engagements kick off within 7–10 days of the discovery call. Urgent builds can start sooner when a squad is free.
2. **Do you work with existing codebases?** — Yes. We audit what you have, stabilise the critical paths, then improve incrementally rather than forcing a rewrite.
3. **What does AI automation actually mean here?** — Practical systems: support agents trained on your docs, lead qualification, reporting pipelines and internal copilots that remove repetitive work.
4. **How is SEO different from AEO and GEO?** — SEO targets classic search rankings, AEO optimises for answer engines and featured responses, and GEO makes your brand citable inside generative AI results. We run all three together.
5. **Who owns the code and assets?** — You do — completely. Repos, design files and infrastructure are transferred to your accounts at handover.

### Contact CTA (`#contact`)
`rounded-[32px] bg-ink grain` block with an aurora blob top-right (`opacity-25 blur-2xl`).
H2 `Let's build something / worth scaling.` Body: "Tell us about the product, the timeline and the metric you're chasing. You'll get a scoped plan and a fixed quote within two working days."
Contacts: `vivek@myplanetservices.com` · Vivek (Founder & CEO): `+91 78081 58221` / `+91 62076 548506` · `Bengaluru, India` (butter icons: Mail, Phone, MapPin).
Form (`bg-ink-soft rounded-3xl`, `onSubmit` prevented): Your name · Work email · select "What do you need?" (Website Development, App Development, AI Automation, SEO / AEO / GEO, Digital Marketing, SaaS Development) · textarea "A little about the project" · butter submit **Send project brief**. Inputs: transparent, `border-white/10`, `focus:border-butter`.

### Footer
Logo + "A SaaS development studio building websites, apps, AI automation and growth systems for ambitious teams."
Columns — **Services**: Website Development, App Development, AI Automation, SEO, AEO & GEO, Digital Marketing, SaaS Development · **Company**: About, Process, Careers, Contact · **Resources**: Case studies, Blog, Playbooks, Support.
Bottom bar: `© {year} My Planet Services. All rights reserved.` / `Privacy · Terms · Cookies`.

---

## 8. SEO

Set in `src/routes/index.tsx` via `head()`:
- Title: **My Planet Services — SaaS, Web & AI Development Studio**
- Description: "My Planet Services builds websites, mobile apps, AI automation, SEO/AEO/GEO programs, digital marketing and full SaaS products for scaling teams."
- `og:title`, `og:description` mirror the above; `og:type: website`; `twitter:card: summary_large_image`
- Single `<h1>` (hero), semantic `section`/`article`/`figure`/`footer`, descriptive anchors.

---

## 9. Replication Checklist

1. Scaffold TanStack Start + Tailwind v4 + shadcn (new-york, slate base, CSS vars).
2. Paste the token block, `@theme inline` mapping, base layer, and all `@utility` rules into `src/styles.css`.
3. Add the Outfit + DM Sans `<link>` tags to `__root.tsx` head (not a CSS `@import`).
4. Add `use-reveal.tsx` and call `useReveal()` once in the homepage component.
5. Build the five landing component files, mount them in the order listed, add `data-reveal` / `data-reveal-delay` to every animated block.
6. Verify: cream/ink alternation, butter accents only on CTAs, metrics and eyebrows, all cards `rounded-3xl`, hero laptop static and cropped at 440px.
