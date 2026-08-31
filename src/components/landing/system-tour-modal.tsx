import { useState, useEffect } from 'react';
import { X, Play, Pause, Cpu, ShieldCheck, Zap, Code2, ArrowRight, CheckCircle2 } from 'lucide-react';

interface SystemTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialNode?: number;
}

const TOUR_NODES = [
  {
    id: 1,
    title: 'AI Multi-Agent Core',
    subtitle: 'Autonomous reasoning, structured function calling & vector RAG',
    badge: 'LLM Orchestration',
    icon: Cpu,
    status: 'Operational · 14ms latency',
    codeSnippet: `// My Planet Services Agent Runtime v4.2
import { createAgentPipeline } from '@myplanet/agents';

export const salesCopilot = createAgentPipeline({
  model: 'claude-3-5-sonnet',
  memory: 'vector-hybrid-rag',
  tools: [crmQuery, calendarBooking, quoteGenerator],
  guardrails: { strictJson: true, privacyLevel: 'SOC2' }
});`,
    features: ['Autonomous multi-step execution', 'Zero-leak data isolation', 'Instant fallback routing'],
  },
  {
    id: 2,
    title: 'Next-Gen UI & Micro-Interactions',
    subtitle: '60fps GPU-accelerated motion & reactive state engine',
    badge: 'Frontend Systems',
    icon: Zap,
    status: 'Core Web Vitals: 99/100',
    codeSnippet: `// Reactive UI Design Tokens
export const themePreset = createThemeSystem({
  aesthetic: 'glassmorphism-luxury',
  motionDials: { variance: 8, intensity: 6, density: 4 },
  tokens: { surface: 'oklch(0.97 0.007 92)', blur: '24px' }
});`,
    features: ['Instant hydration architecture', 'Sub-millisecond input response', 'Full accessibility WCAG AAA'],
  },
  {
    id: 3,
    title: 'Global Edge Cloud & Security',
    subtitle: 'Zero-trust architecture with distributed multi-region edge nodes',
    badge: 'Cloud Infrastructure',
    icon: ShieldCheck,
    status: '99.99% Uptime SLA',
    codeSnippet: `// Edge Distribution Config
export const edgeCluster = new CloudCluster({
  regions: ['iad1', 'sfo1', 'fra1', 'sin1'],
  caching: { staleWhileRevalidate: 3600 },
  ddosShield: 'enterprise-active'
});`,
    features: ['Multi-region automated failover', 'Continuous penetration testing', 'Automated compliance reporting'],
  },
];

export function SystemTourModal({ isOpen, onClose, initialNode = 0 }: SystemTourModalProps) {
  const [activeNodeIndex, setActiveNodeIndex] = useState(initialNode);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    setActiveNodeIndex(initialNode);
  }, [initialNode]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Auto-step when playing
  useEffect(() => {
    if (!isOpen || !isPlaying) return;
    const timer = setInterval(() => {
      setActiveNodeIndex((prev) => (prev + 1) % TOUR_NODES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isOpen, isPlaying]);

  if (!isOpen) return null;

  const currentNode = TOUR_NODES[activeNodeIndex];
  const IconComponent = currentNode.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl bg-zinc-950/95 border border-white/15 rounded-[32px] sm:rounded-[36px] overflow-hidden shadow-2xl text-white flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-butter text-butter-foreground flex items-center justify-center font-bold text-xs">
              MPS
            </div>
            <div>
              <div className="font-display font-medium text-sm text-white flex items-center gap-2">
                <span>My Planet Services Architecture Tour</span>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Live System Inspector
                </span>
              </div>
              <p className="text-xs text-zinc-400">Interactive Blueprint & Code Inspection</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? 'Pause Autoplay' : 'Play Tour'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 overflow-y-auto grid lg:grid-cols-[1.1fr_1fr] gap-8 items-center">
          {/* Left Column: Visual Screen / Code Preview */}
          <div className="flex flex-col gap-4">
            {/* Visual Screen Thumbnail */}
            <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-xl aspect-video bg-zinc-900 group">
              <img
                src="/assets/tour-preview.jpg"
                alt="System Tour Visual Blueprint"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-mono text-emerald-300">{currentNode.status}</span>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400">Step 0{activeNodeIndex + 1} of 03</span>
                </div>
              </div>
            </div>

            {/* Live Code Preview */}
            <div className="bg-zinc-900/90 rounded-2xl p-4 border border-white/10 font-mono text-xs text-zinc-300 overflow-x-auto shadow-inner">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5 text-[11px] text-zinc-500">
                <div className="flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-butter" />
                  <span>runtime-inspector.ts</span>
                </div>
                <span>TypeScript 5.7</span>
              </div>
              <pre className="text-[11px] leading-relaxed text-zinc-300">
                <code>{currentNode.codeSnippet}</code>
              </pre>
            </div>
          </div>

          {/* Right Column: Node Details & Switcher */}
          <div className="flex flex-col justify-between h-full">
            <div>
              {/* Node Selector Pills */}
              <div className="flex items-center gap-2 mb-6">
                {TOUR_NODES.map((node, idx) => (
                  <button
                    key={node.id}
                    onClick={() => {
                      setActiveNodeIndex(idx);
                      setIsPlaying(false);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      activeNodeIndex === idx
                        ? 'bg-butter text-butter-foreground shadow-sm scale-105'
                        : 'bg-white/10 text-zinc-400 hover:text-white hover:bg-white/15'
                    }`}
                  >
                    0{node.id}. {node.title.split(' ')[0]}
                  </button>
                ))}
              </div>

              {/* Title & Badge */}
              <div className="inline-block px-2.5 py-0.5 rounded-md bg-white/10 text-[11px] font-medium text-butter mb-2">
                {currentNode.badge}
              </div>
              <h3 className="font-display text-2xl font-semibold text-white mb-2 flex items-center gap-2">
                <IconComponent className="w-6 h-6 text-butter" />
                <span>{currentNode.title}</span>
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                {currentNode.subtitle}
              </p>

              {/* Features List */}
              <div className="space-y-2.5 mb-8">
                {currentNode.features.map((feat) => (
                  <div key={feat} className="flex items-center gap-2.5 text-xs text-zinc-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bottom */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => {
                  onClose();
                  const contactEl = document.getElementById('contact');
                  if (contactEl) contactEl.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full bg-butter text-butter-foreground rounded-full py-3 px-6 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-md cursor-pointer"
              >
                <span>Inquire About Custom Engineering</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
