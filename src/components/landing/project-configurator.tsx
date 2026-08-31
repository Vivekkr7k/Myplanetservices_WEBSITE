import { useState } from 'react';
import { Calendar, Clock, Sparkles, Check, ArrowRight, Layers, Bot, Shield, Laptop } from 'lucide-react';
import { toast } from 'sonner';

interface ModuleOption {
  id: string;
  name: string;
  category: string;
  icon: typeof Bot;
  recommended?: boolean;
}

const MODULE_OPTIONS: ModuleOption[] = [
  { id: 'ai', name: 'AI Agents & RAG Workflows', category: 'Intelligence', icon: Bot, recommended: true },
  { id: 'web', name: 'Modern React & Design System', category: 'Frontend', icon: Laptop, recommended: true },
  { id: 'cloud', name: 'Serverless Edge Cloud & DB', category: 'Backend', icon: Layers, recommended: true },
  { id: 'sec', name: 'Enterprise SOC2 & Security', category: 'Hardening', icon: Shield },
];

const SPRINT_TIERS = [
  {
    id: 'mvp',
    name: '2-Week MVP Sprint',
    duration: '2 Weeks',
    price: 4900,
    team: 'Lead Engineer + UI Designer',
    turnaround: 'Delivery in 14 days',
    bestFor: 'Founders validating a new SaaS or high-converting marketing system.',
  },
  {
    id: 'full',
    name: '4-Week Core Platform',
    duration: '4 Weeks',
    price: 9800,
    team: 'Full Squad (Eng, AI, Design, Growth)',
    turnaround: 'Delivery in 28 days',
    bestFor: 'Scaling startups needing production-grade SaaS and automated pipelines.',
  },
  {
    id: 'enterprise',
    name: '8-Week Scale Engine',
    duration: '8 Weeks',
    price: 18500,
    team: 'Dedicated Squad + AI Architect',
    turnaround: 'Delivery in 56 days',
    bestFor: 'Enterprise systems requiring multi-tenant architecture & compliance.',
  },
];

export function ProjectConfigurator() {
  const [selectedTierId, setSelectedTierId] = useState('full');
  const [selectedModules, setSelectedModules] = useState<string[]>(['ai', 'web', 'cloud']);
  const [startDate] = useState('Mar 02, 2026');

  const selectedTier = SPRINT_TIERS.find((t) => t.id === selectedTierId) || SPRINT_TIERS[1];

  const toggleModule = (id: string) => {
    setSelectedModules((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleReserve = () => {
    toast.success('Sprint slot configured!', {
      description: `Reserved ${selectedTier.name} starting ${startDate}. Redirecting to brief intake...`,
    });
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative rounded-[32px] sm:rounded-[36px] bg-zinc-950/80 backdrop-blur-2xl border border-white/15 p-6 sm:p-8 shadow-2xl text-white overflow-hidden">
      {/* Ambient glass glow */}
      <div
        className="absolute -top-24 -right-24 w-64 h-64 bg-butter/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Header */}
      <div className="flex items-center justify-between pb-5 mb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-butter uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Sprint Scope</span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-medium text-white tracking-tight">
            Reserve Studio Capacity
          </h3>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
          Q1 Slots Open
        </span>
      </div>

      {/* Sprint Tier Selector Tabs */}
      <div className="space-y-2 mb-6">
        <label className="text-xs font-medium text-zinc-400 block">Select Scope & Velocity</label>
        <div className="grid grid-cols-3 gap-2 p-1 rounded-2xl bg-white/5 border border-white/10">
          {SPRINT_TIERS.map((tier) => (
            <button
              key={tier.id}
              onClick={() => setSelectedTierId(tier.id)}
              className={`py-2.5 px-2 rounded-xl text-xs font-medium transition-all text-center ${
                selectedTierId === tier.id
                  ? 'bg-butter text-butter-foreground font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="truncate">{tier.duration}</div>
              <div className="text-[10px] opacity-80 mt-0.5">${tier.price.toLocaleString()}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Date & Turnaround Dual Pills */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5 flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-butter shrink-0 animate-icon-float">
            <Calendar className="w-4 h-4 animate-icon-wiggle" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] text-zinc-400 font-medium">Kickoff Window</div>
            <div className="text-xs font-semibold text-white truncate">{startDate}</div>
          </div>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5 flex items-center gap-3 group">
          <div style={{ animationDelay: '0.4s' }} className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-butter shrink-0 animate-icon-float">
            <Clock className="w-4 h-4 animate-icon-pulse" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] text-zinc-400 font-medium">Cadence</div>
            <div className="text-xs font-semibold text-white truncate">Weekly live builds</div>
          </div>
        </div>
      </div>

      {/* Module Selection Pills */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-medium text-zinc-400">Included Stack Architecture</label>
          <span className="text-[11px] text-butter font-medium">{selectedModules.length} Modules Active</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {MODULE_OPTIONS.map((mod) => {
            const isSelected = selectedModules.includes(mod.id);
            const Icon = mod.icon;
            return (
              <button
                key={mod.id}
                onClick={() => toggleModule(mod.id)}
                className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-2.5 ${
                  isSelected
                    ? 'bg-white/10 border-butter/40 text-white shadow-xs'
                    : 'bg-white/5 border-white/10 text-zinc-400 hover:border-white/20'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected ? 'bg-butter text-butter-foreground' : 'bg-white/10 text-zinc-400'
                  }`}
                >
                  {isSelected ? <Check className="w-3 h-3 stroke-[3]" /> : <Icon className="w-3 h-3" />}
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-medium text-white leading-tight truncate">{mod.name}</div>
                  <div className="text-[10px] text-zinc-400">{mod.category}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pricing & Reservation Action */}
      <div className="pt-5 border-t border-white/10 flex items-center justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-2xl sm:text-3xl font-semibold text-white">
              ${selectedTier.price.toLocaleString()}
            </span>
            <span className="text-xs text-zinc-400">/{selectedTier.duration.toLowerCase()}</span>
          </div>
          <div className="text-[11px] text-zinc-400">{selectedTier.team}</div>
        </div>

        <button
          onClick={handleReserve}
          className="bg-white hover:bg-butter hover:text-butter-foreground text-zinc-950 px-6 py-3.5 rounded-full text-xs sm:text-sm font-semibold inline-flex items-center gap-2 hover:scale-[1.03] active:scale-[0.98] transition-all shadow-lg cursor-pointer"
        >
          <span>Reserve Sprint</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
