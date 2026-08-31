import { useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Globe, Bot, Layers, Smartphone, Search, Megaphone, Check, Sparkles } from 'lucide-react';

export interface ServiceMilestone {
  mile: string;
  category: string;
  title: string;
  description: string;
  badge: string;
  metrics: string;
  icon: typeof Globe;
  link: string;
  timeRange: string;
}

export const MILESTONE_SERVICES: ServiceMilestone[] = [
  {
    mile: '01',
    category: 'Web Platforms',
    title: 'Website Development',
    description: 'High-converting marketing platforms & headless architectures on Next.js 15 with sub-second page loads.',
    badge: 'Core Web Vitals 98+',
    metrics: 'Next.js 15 · Sanity · Tailored Motion',
    icon: Globe,
    link: '#services',
    timeRange: '0.0s – 1.8s · Daylight',
  },
  {
    mile: '02',
    category: 'Autonomous Intelligence',
    title: 'AI Agents & Copilots',
    description: 'Multi-agent reasoning swarms, hybrid vector RAG knowledge bases, and autonomous customer workflows.',
    badge: 'Sub-14ms Latency',
    metrics: 'Claude 3.5 · LangGraph · Vector DB',
    icon: Bot,
    link: '#services',
    timeRange: '1.8s – 3.6s · AI Sprints',
  },
  {
    mile: '03',
    category: 'Product Engineering',
    title: 'SaaS Platform Engineering',
    description: 'End-to-end multi-tenant product development with Stripe billing, authentication, and serverless edge scaling.',
    badge: 'MVP in 4–8 Weeks',
    metrics: 'Postgres · Edge Cluster · SOC2 Prep',
    icon: Layers,
    link: '#services',
    timeRange: '3.6s – 5.4s · Scale Ops',
  },
  {
    mile: '04',
    category: 'Mobile Systems',
    title: 'iOS & Android App Systems',
    description: 'Native-feel cross-platform mobile apps with 60fps gesture physics, unified design tokens, and offline sync.',
    badge: '60 FPS Gesture Physics',
    metrics: 'React Native · Expo · App Store Ready',
    icon: Smartphone,
    link: '#services',
    timeRange: '5.4s – 7.2s · Mobile Hub',
  },
  {
    mile: '05',
    category: 'AI & Search Indexing',
    title: 'SEO, AEO & GEO Program',
    description: 'Dominate traditional Google search while securing verified citations in AI answer engines (ChatGPT, Perplexity).',
    badge: '#1 Search & LLM Citations',
    metrics: 'Entity Schema · LLM Citations · Analytics',
    icon: Search,
    link: '#services',
    timeRange: '7.2s – 8.8s · Sunset Index',
  },
  {
    mile: '06',
    category: 'Growth Architecture',
    title: 'Performance Marketing',
    description: 'Paid acquisition, lifecycle automation funnels, and revenue attribution engineered for compounding growth.',
    badge: '3.6× Average First-Year ROI',
    metrics: 'Attribution Dashboards · Ad Creative',
    icon: Megaphone,
    link: '#services',
    timeRange: '8.8s – 10.0s · Night Shift',
  },
];

interface RoadServicesSignboardProps {
  controlledIdx?: number;
  videoTime?: number;
  onSelectMilestone?: (idx: number) => void;
}

export function RoadServicesSignboard({
  controlledIdx,
  videoTime = 0,
  onSelectMilestone,
}: RoadServicesSignboardProps) {
  const [internalIdx, setInternalIdx] = useState(0);

  // Use controlled index if provided by hero video timeline, otherwise internal
  const currentIdx = controlledIdx !== undefined ? controlledIdx : internalIdx;
  const current = MILESTONE_SERVICES[currentIdx] || MILESTONE_SERVICES[0];
  const IconComponent = current.icon;

  const handleSelect = (idx: number) => {
    if (onSelectMilestone) {
      onSelectMilestone(idx);
    } else {
      setInternalIdx(idx);
    }
  };

  const nextMilestone = () => {
    const next = (currentIdx + 1) % MILESTONE_SERVICES.length;
    handleSelect(next);
  };

  const prevMilestone = () => {
    const prev = (currentIdx - 1 + MILESTONE_SERVICES.length) % MILESTONE_SERVICES.length;
    handleSelect(prev);
  };

  return (
    <div className="relative w-full max-w-[390px] sm:max-w-[420px] lg:max-w-[450px] select-none">
      {/* Architectural Wooden & Glass Milestone Signboard (Positioned on the road path) */}
      <div className="rounded-[22px] sm:rounded-[28px] bg-card/95 backdrop-blur-2xl text-foreground p-3 sm:p-4.5 lg:p-5 shadow-[0_15px_40px_rgba(0,0,0,0.12)] border border-border transition-all duration-300 hover:shadow-xl relative overflow-hidden">
        {/* Top Header: Road Milestone Marker & Category */}
        <div className="flex items-center justify-between pb-1.5 sm:pb-2 mb-1.5 sm:mb-2 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-primary text-primary-foreground font-mono font-bold text-[10px] sm:text-[11px] flex items-center justify-center shadow-xs">
              {current.mile}
            </div>
            <div>
              <div className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <span>Milestone {current.mile}/06</span>
                <span className="text-muted-foreground/60">·</span>
                <span className="text-emerald-700 font-semibold">{current.timeRange}</span>
              </div>
              <div className="text-[11px] sm:text-xs font-semibold text-foreground leading-tight">
                {current.category}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={prevMilestone}
              className="p-1 rounded-full border border-border hover:bg-secondary text-muted-foreground transition-colors cursor-pointer"
              aria-label="Previous service"
            >
              <ChevronLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
            <button
              type="button"
              onClick={nextMilestone}
              className="p-1 rounded-full border border-border hover:bg-secondary text-muted-foreground transition-colors cursor-pointer"
              aria-label="Next service"
            >
              <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
          </div>
        </div>

        {/* Signboard Body */}
        <div className="mb-2 sm:mb-2.5 text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100/90 text-emerald-800 text-[9px] sm:text-[10px] font-medium mb-1">
            <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
            <span>{current.badge}</span>
          </div>

          {/* Title */}
          <h3 className="font-display text-base sm:text-xl font-bold tracking-tight text-foreground mb-0.5 sm:mb-1 flex items-center gap-1.5">
            <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-foreground shrink-0" />
            <span>{current.title}</span>
          </h3>

          {/* Description */}
          <p className="text-[10px] sm:text-[11.5px] text-muted-foreground leading-snug mb-1.5 sm:mb-2 line-clamp-1 sm:line-clamp-2">
            {current.description}
          </p>

          {/* Technical Spec Pill */}
          <div className="px-2.5 py-1 rounded-lg bg-secondary text-muted-foreground text-[10px] sm:text-[11px] font-mono flex items-center gap-1.5">
            <Check className="w-2.5 h-2.5 text-emerald-600 stroke-[3]" />
            <span className="truncate">{current.metrics}</span>
          </div>
        </div>

        {/* Milestone Steps Bar & Road Progress */}
        <div className="pt-1.5 sm:pt-2 border-t border-border flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2">
            {/* 6 Step Pills */}
            <div className="flex items-center gap-1">
              {MILESTONE_SERVICES.map((item, idx) => (
                <button
                  key={item.mile}
                  onClick={() => handleSelect(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIdx === idx
                      ? 'w-4 sm:w-5 bg-primary'
                      : 'w-1.5 bg-border hover:bg-muted-foreground'
                  }`}
                  aria-label={`Jump to Milestone ${item.mile}`}
                />
              ))}
            </div>

            <a
              href={current.link}
              className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-foreground hover:text-butter-foreground underline underline-offset-4 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Explore</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </a>
          </div>

          {/* Video Timeline Scrubber Line (0s -> 10s) */}
          <div className="w-full bg-secondary rounded-full h-1 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-indigo-600 rounded-full transition-all duration-100"
              style={{ width: `${Math.min(Math.max((videoTime / 10) * 100, 4), 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
