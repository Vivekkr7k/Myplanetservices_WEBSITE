import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Sparkles,
  Zap,
  Compass,
} from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  department: 'Leadership' | 'AI & Systems' | 'Design' | 'Growth';
  image: string;
  blobColor: string;
  bio: string;
  specialties: string[];
  experience: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Vivek Kumar',
    role: 'Partner & Technology Lead',
    department: 'Leadership',
    image: '/teampic/vivek.jpg',
    blobColor: 'from-amber-400/35 to-butter/70',
    bio: 'Architecting scalable full-stack web & mobile apps, autonomous AI copilot swarms, and data-backed performance marketing engines.',
    specialties: [
      'Website Development',
      'Mobile App Development',
      'AI Agents & Copilots',
      'SEO, AEO & GEO',
      'Performance Marketing',
    ],
    experience: '4+ yrs',
  },
  {
    name: 'Mayank',
    role: 'Co-Founder & AI Architect',
    department: 'AI & Systems',
    image: '/teampic/mayank.jpg',
    blobColor: 'from-zinc-800 to-zinc-950',
    bio: 'Specializes in AI reasoning engines, modern cloud SaaS platforms, high-converting web experiences, and multi-channel acquisition funnels.',
    specialties: [
      'AI Agents & Copilots',
      'Website Development',
      'Performance Marketing',
      'SaaS Engineering',
    ],
    experience: '4+ yrs',
  },
  {
    name: 'Bishnu Chaudhary',
    role: 'Partner & Growth Architect',
    department: 'Growth',
    image: '/teampic/bishnu.jpg',
    blobColor: 'from-butter/50 to-amber-500/40',
    bio: 'Delivering responsive web ecosystems, iOS & Android cross-platform solutions, technical search engine dominance, and revenue campaigns.',
    specialties: [
      'Website Development',
      'Mobile App Development',
      'Performance Marketing',
      'SEO, AEO & GEO',
    ],
    experience: '4+ yrs',
  },
  {
    name: 'Om Verma',
    role: 'GTM Engineer & Lead Gen Specialist',
    department: 'Growth',
    image: '/teampic/om.jpg',
    blobColor: 'from-zinc-800 to-zinc-950',
    bio: 'Architecting high-converting outbound pipelines, automated lead scoring engines, ICP market enrichment, and full-funnel GTM growth systems.',
    specialties: [
      'GTM Engineering',
      'Lead Generation & ICP',
      'Outbound Automation',
      'CRM Pipeline Architecture',
    ],
    experience: '3+ yrs',
  },
];

const EXPERT_BADGES = [
  { text: '4+ Years In Production Engineering', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  { text: '30+ Shipped MVPs', color: 'bg-secondary text-foreground border-border' },
  { text: '100+ Happy Founders', color: 'bg-rose-50 text-rose-800 border-rose-200' },
  { text: 'Zero Junior Handoffs', color: 'bg-butter/60 text-butter-foreground border-butter' },
];

export function TeamSection() {
  return (
    <section id="team" className="py-16 sm:py-24 lg:py-32 scroll-mt-12 bg-background relative overflow-hidden">
      {/* Ambient background lighting */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-butter/10 rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="site-container">
        {/* Floating Context Badges (Combined from Image 2) */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-10">
          {EXPERT_BADGES.map((badge) => (
            <div
              key={badge.text}
              className={`px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold border shadow-2xs transition-transform hover:scale-105 cursor-default ${badge.color}`}
            >
              {badge.text}
            </div>
          ))}
        </div>

        {/* Section Header (Combining "Our People" & "Meet Our Experts") */}
        <div data-reveal className="max-w-3xl mx-auto mb-14 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-butter text-butter-foreground text-[11px] font-semibold uppercase tracking-[0.14em] shadow-xs mb-4">
            <Sparkles className="w-3 h-3 animate-icon-sparkle" />
            <span>Senior Product Squad</span>
          </div>

          <h2 className="font-display text-display-xl font-medium text-foreground mb-5">
            Meet Our Experts
          </h2>

          <p className="text-base sm:text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto">
            We are few by design. You collaborate directly with principal operators, ex-Stripe architects, and senior designers — no account managers or outsourced junior engineers.
          </p>

          {/* Floating Pill Action Buttons (From Image 2) */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <Link
              to="/contact"
              className="bg-ink hover:opacity-90 text-ink-foreground px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide inline-flex items-center gap-2 transition-all duration-300 shadow-md hover:scale-105 active:scale-95 group"
            >
              <Zap className="w-3.5 h-3.5 fill-current text-butter animate-icon-wiggle" />
              <span>Start Sprints With Us</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>

            <Link
              to="/services"
              className="bg-card hover:bg-secondary text-foreground border border-border px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium inline-flex items-center gap-2 transition-all duration-300 shadow-xs hover:scale-102 group"
            >
              <Compass className="w-3.5 h-3.5 text-muted-foreground animate-icon-spin" />
              <span>Explore Disciplines</span>
            </Link>
          </div>
        </div>

        {/* 4-Member Portrait Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 sm:gap-7 max-w-7xl mx-auto">
          {TEAM_MEMBERS.map((member, index) => {
            const isDark = index % 2 === 1; // Alternating: Center card is Black, Side cards are Light

            return (
              <div
                key={member.name}
                data-reveal
                data-reveal-delay={`${index * 80}`}
                className={`rounded-[32px] p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 border group relative overflow-hidden ${
                  isDark
                    ? 'bg-ink text-ink-foreground border-white/10 shadow-xl hover:border-butter/40 hover:shadow-2xl'
                    : 'bg-card text-foreground border-border shadow-soft hover:shadow-xl'
                }`}
              >
                {/* Subtle corner highlight for dark cards */}
                {isDark && (
                  <div
                    className="absolute -top-10 -right-10 w-28 h-28 bg-butter/10 rounded-full blur-2xl pointer-events-none"
                    aria-hidden="true"
                  />
                )}

                <div>
                  {/* Portrait Area with Organic Silhouette Backdrop in Full Color */}
                  <div className="relative w-full aspect-square mb-6 flex items-center justify-center">
                    {/* Organic Squircle / Blob Shape Backdrop */}
                    <div
                      className={`absolute inset-2 sm:inset-3 rounded-[38%_62%_63%_37%/41%_44%_56%_59%] bg-gradient-to-tr ${member.blobColor} transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3 shadow-inner opacity-90`}
                      aria-hidden="true"
                    />

                    {/* Team Member Portrait Image (Full Natural Color) */}
                    <div className="relative z-10 w-4/5 h-4/5 rounded-2xl overflow-hidden shadow-md group-hover:scale-102 transition-transform duration-300">
                      <img
                        src={member.image}
                        alt={`${member.name} - ${member.role}`}
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>

                    {/* Experience Badge */}
                    <span
                      className={`absolute bottom-1 right-2 z-20 text-[9.5px] font-mono font-semibold px-2 py-0.5 rounded-full border shadow-2xs ${
                        isDark
                          ? 'bg-ink-soft text-butter border-white/10'
                          : 'bg-card text-foreground border-border'
                      }`}
                    >
                      {member.experience}
                    </span>
                  </div>

                  {/* Role Title in Crisp Monospace */}
                  <div
                    className={`text-[10.5px] uppercase font-mono tracking-wider font-semibold mb-1 truncate ${
                      isDark ? 'text-butter/90' : 'text-muted-foreground'
                    }`}
                  >
                    {member.role}
                  </div>

                  {/* Member Name */}
                  <h3
                    className={`font-display text-xl sm:text-2xl font-medium tracking-tight mb-2.5 ${
                      isDark ? 'text-ink-foreground' : 'text-foreground'
                    }`}
                  >
                    {member.name}
                  </h3>

                  {/* Short Bio */}
                  <p
                    className={`text-xs leading-relaxed mb-4 line-clamp-2 ${
                      isDark ? 'text-ink-muted' : 'text-muted-foreground'
                    }`}
                  >
                    {member.bio}
                  </p>
                </div>

                {/* Bottom Zone: Specialty Tags */}
                <div
                  className={`pt-4 border-t flex flex-wrap gap-1.5 ${
                    isDark ? 'border-white/10' : 'border-border/60'
                  }`}
                >
                  {member.specialties.map((spec) => (
                    <span
                      key={spec}
                      className={`text-[9.5px] font-mono px-2 py-0.5 rounded-md ${
                        isDark
                          ? 'bg-white/5 text-ink-muted border border-white/5'
                          : 'bg-secondary text-muted-foreground border border-border/40'
                      }`}
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default TeamSection;
