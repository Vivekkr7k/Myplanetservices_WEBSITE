import { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Menu,
  X,
  ArrowUpRight,
  ChevronDown,
  ShoppingCart,
  Building2,
  RefreshCw,
  Database,
  Bot,
  Layers,
  Smartphone,
  Search,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { BrandLogo } from '../common/brand-logo';
import { ThemeToggle } from '../common/theme-toggle';

const SOLUTION_CATEGORIES = [
  {
    category: 'Web & Storefronts',
    items: [
      {
        id: 'ecommerce',
        title: 'E-Commerce Development',
        desc: 'Custom headless storefronts, Shopify Plus & sub-second checkout',
        icon: ShoppingCart,
        badge: 'High Conversion',
        href: '/services?tab=ecommerce',
      },
      {
        id: 'corporate',
        title: 'Company & Corporate Websites',
        desc: 'Flagship enterprise brand presences with headless CMS & motion',
        icon: Building2,
        badge: 'Enterprise',
        href: '/services?tab=corporate',
      },
      {
        id: 'redesign',
        title: 'Website Redesign & Modernization',
        desc: 'UI/UX overhaul, 98+ PageSpeed boost with 0 SEO equity loss',
        icon: RefreshCw,
        badge: 'Popular',
        href: '/services?tab=redesign',
      },
    ],
  },
  {
    category: 'Enterprise & Autonomous Systems',
    items: [
      {
        id: 'crm-erp',
        title: 'Custom CRM & ERP Systems',
        desc: 'Tailored business operating engines, automated pipelines & portals',
        icon: Database,
        badge: 'Custom Ops',
        href: '/services?tab=crm-erp',
      },
      {
        id: 'ai',
        title: 'AI Automation & Agents',
        desc: 'Multi-agent reasoning swarms, hybrid vector RAG & ops bots',
        icon: Bot,
        badge: 'Sub-14ms',
        href: '/services?tab=ai',
      },
      {
        id: 'saas',
        title: 'SaaS Platform Engineering',
        desc: 'Production MVPs in 6–10 weeks: auth, multi-tenancy & billing',
        icon: Layers,
        badge: '4–8 Wks',
        href: '/services?tab=saas',
      },
    ],
  },
  {
    category: 'Mobile & Growth Dominance',
    items: [
      {
        id: 'app',
        title: 'Mobile App Development',
        desc: 'Fluid React Native & Flutter cross-platform apps with offline sync',
        icon: Smartphone,
        badge: 'iOS & Android',
        href: '/services?tab=app',
      },
      {
        id: 'seo',
        title: 'SEO, AEO & GEO Program',
        desc: 'Rank #1 in Google + verified citations in ChatGPT & Perplexity',
        icon: Search,
        badge: 'AI Search',
        href: '/services?tab=seo',
      },
    ],
  },
];

/**
 * Single source of truth for the header links — rendered by BOTH the desktop bar
 * and the mobile sheet. They were separate lists before, which is how /faq ended
 * up mobile-only and /why-us and /contact ended up with no entry at all.
 *
 * Solutions is not in here: it owns a mega-dropdown and is rendered separately.
 */
const NAV_LINKS = [
  { label: 'Work', href: '/work' },
  { label: 'Why Us', href: '/why-us' },
  { label: 'Process', href: '/process' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
];

export function SiteNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 180);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-5 pt-4 sm:px-10 sm:pt-6 pointer-events-none transition-all duration-300">
      <div className="max-w-7xl 2xl:max-w-[90rem] min-[120rem]:max-w-[100rem] mx-auto pointer-events-auto">
        <nav
          className={`relative rounded-full px-6 py-3.5 flex items-center justify-between transition-all duration-500 ${
            isScrolled
              ? 'bg-card/90 text-foreground backdrop-blur-2xl border border-border shadow-lg'
              : 'bg-card/60 text-foreground backdrop-blur-md border border-border/60 shadow-xs'
          }`}
          aria-label="Main Navigation"
        >
          {/* Left: Brand Logo & Title (My Planet Services) */}
          <Link
            to="/"
            className="flex items-center shrink-0 z-10"
            aria-label="My Planet Services Home"
            onClick={() => setDropdownOpen(false)}
          >
            <BrandLogo variant="auto" size="md" />
          </Link>

          {/* Center: Desktop Navigation Links (Centered in the Nav Bar) */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-7 2xl:gap-8 absolute left-1/2 -translate-x-1/2">
            {/* Solutions with Mega Dropdown */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <NavLink
                to="/services"
                onClick={() => setDropdownOpen(false)}
                className={({ isActive }) =>
                  `text-xs font-mono uppercase tracking-wider transition-colors inline-flex items-center gap-1 py-1 cursor-pointer ${
                    isActive || dropdownOpen ? 'text-foreground font-bold' : 'text-muted-foreground hover:text-foreground'
                  }`
                }
              >
                <span>SOLUTIONS</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    dropdownOpen ? 'rotate-180 text-foreground' : 'text-muted-foreground'
                  }`}
                />
              </NavLink>

              {/* Mega Dropdown Panel */}
              {dropdownOpen && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[840px] max-w-[90vw] animate-in fade-in slide-in-from-top-2 duration-200"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="rounded-[28px] bg-card/98 backdrop-blur-2xl border border-border shadow-2xl p-6 text-foreground overflow-hidden">
                    {/* Header bar inside dropdown */}
                    <div className="flex items-center justify-between pb-4 mb-5 border-b border-border/60">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-lg bg-butter text-butter-foreground flex items-center justify-center">
                          <Sparkles className="w-3 h-3 animate-icon-sparkle" />
                        </div>
                        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-foreground">
                          Engineering & Growth Disciplines
                        </span>
                      </div>
                      <Link
                        to="/services"
                        onClick={() => setDropdownOpen(false)}
                        className="text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 group transition-colors"
                      >
                        <span>View all capabilities</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>

                    {/* 3-Column Services Grid */}
                    <div className="grid grid-cols-3 gap-6 text-left">
                      {SOLUTION_CATEGORIES.map((col) => (
                        <div key={col.category} className="flex flex-col gap-3">
                          <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold px-2">
                            {col.category}
                          </div>
                          <div className="flex flex-col gap-1.5">
                            {col.items.map((item) => {
                              const ItemIcon = item.icon;
                              return (
                                <Link
                                  key={item.id}
                                  to={item.href}
                                  onClick={() => setDropdownOpen(false)}
                                  className="p-2.5 rounded-2xl hover:bg-secondary transition-all duration-150 flex items-start gap-3 group text-left"
                                >
                                  <div className="w-9 h-9 rounded-xl bg-secondary text-foreground group-hover:bg-butter group-hover:text-butter-foreground flex items-center justify-center shrink-0 transition-colors shadow-2xs">
                                    <ItemIcon className="w-4 h-4" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 mb-0.5">
                                      <span className="text-xs font-semibold text-foreground group-hover:text-foreground tracking-tight leading-snug">
                                        {item.title}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                                      {item.desc}
                                    </p>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Bottom strip inside dropdown */}
                    <div className="mt-5 pt-3.5 border-t border-border/60 flex items-center justify-between bg-secondary/60 -mx-6 -mb-6 px-6 py-3 text-xs text-muted-foreground">
                      <span className="text-muted-foreground text-[11px]">
                        Need a custom enterprise architecture or specialized squad?
                      </span>
                      <Link
                        to="/contact"
                        onClick={() => setDropdownOpen(false)}
                        className="font-semibold text-foreground hover:text-foreground flex items-center gap-1 group"
                      >
                        <span>Schedule Technical Scoping</span>
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                onClick={() => setDropdownOpen(false)}
                className={({ isActive }) =>
                  `text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-colors ${
                    isActive ? 'text-foreground font-bold' : 'text-muted-foreground hover:text-foreground'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right: Theme Toggle, CTA Button & Mobile Hamburger */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 z-10">
            <ThemeToggle />

            <Link
              to="/contact"
              className="bg-primary text-primary-foreground hover:opacity-90 rounded-full px-4 sm:px-5 py-2 text-xs font-medium inline-flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm cursor-pointer shrink-0"
            >
              <span>Start Project</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 rounded-3xl bg-card/98 backdrop-blur-2xl border border-border text-foreground p-5 sm:p-6 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300 max-h-[85vh] overflow-y-auto">
            <div className="flex flex-col gap-2 text-left">
              <NavLink
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `text-sm px-4 py-2.5 rounded-2xl transition-colors ${
                    isActive ? 'bg-secondary text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'
                  }`
                }
              >
                Home
              </NavLink>

              {/* Mobile Solutions Accordion */}
              <div className="rounded-2xl bg-secondary border border-border overflow-hidden">
                <button
                  type="button"
                  onClick={() => setMobileSolutionsOpen(!mobileSolutionsOpen)}
                  className="w-full text-sm font-semibold px-4 py-3 flex items-center justify-between text-foreground hover:bg-secondary/70 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-butter-foreground" />
                    <span>Solutions & Services</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      mobileSolutionsOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {mobileSolutionsOpen && (
                  <div className="px-3 pb-3 pt-1 flex flex-col gap-1 border-t border-border/60 animate-in fade-in duration-200">
                    {SOLUTION_CATEGORIES.flatMap((c) => c.items).map((item) => {
                      const ItemIcon = item.icon;
                      return (
                        <Link
                          key={item.id}
                          to={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-2.5 p-2 rounded-xl text-xs text-muted-foreground hover:bg-card hover:text-foreground transition-colors"
                        >
                          <div className="w-7 h-7 rounded-lg bg-card border border-border flex items-center justify-center shrink-0">
                            <ItemIcon className="w-3.5 h-3.5 text-foreground" />
                          </div>
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `text-sm px-4 py-2.5 rounded-2xl transition-colors ${
                      isActive ? 'bg-secondary text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              <div className="pt-4 border-t border-border mt-2">
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full bg-primary text-primary-foreground rounded-full py-3 text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <span>Start Project</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

