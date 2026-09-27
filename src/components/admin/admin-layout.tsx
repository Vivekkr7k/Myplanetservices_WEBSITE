import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../lib/admin-auth';
import { useCurrency } from '../../lib/currency-context';
import { useTheme } from '../../lib/theme';
import {
  LayoutDashboard,
  Users,
  FileText,
  Inbox,
  LogOut,
  ExternalLink,
  Sun,
  Moon,
  Menu,
  X,
  Building2,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function AdminLayout({ children, title, subtitle, actions }: AdminLayoutProps) {
  const { user, logout } = useAdminAuth();
  const { currency, setCurrency } = useCurrency();
  const { theme, toggle: toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    {
      label: 'Dashboard',
      path: '/admin',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: 'Inquiries & Leads',
      path: '/admin/inquiries',
      icon: Inbox,
      exact: false,
    },
    {
      label: 'Client Records',
      path: '/admin/clients',
      icon: Users,
      exact: false,
    },
    {
      label: 'Quotations & Vault',
      path: '/admin/quotations',
      icon: FileText,
      exact: false,
    },
  ];

  const isActive = (itemPath: string, exact: boolean) => {
    if (exact) return location.pathname === itemPath;
    return location.pathname.startsWith(itemPath);
  };

  return (
    <div
      className="h-[100dvh] min-h-[100dvh] w-full bg-background text-foreground flex flex-col lg:flex-row antialiased overflow-hidden select-auto"
      data-lenis-prevent
    >
      {/* Mobile Top Header */}
      <header className="lg:hidden flex items-center justify-between px-3.5 py-2.5 bg-card border-b border-border shrink-0 z-30 shadow-2xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-butter text-butter-foreground flex items-center justify-center font-display font-bold text-sm shadow-xs shrink-0">
            MP
          </div>
          <div className="min-w-0">
            <span className="font-display font-semibold text-sm leading-tight block truncate">Studio Admin</span>
            <span className="text-[10px] text-muted-foreground block font-mono truncate">My Planet Services</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Currency toggle */}
          <button
            onClick={() => setCurrency(currency === 'USD' ? 'INR' : 'USD')}
            className="px-2.5 py-1 rounded-lg bg-secondary hover:bg-butter hover:text-butter-foreground text-foreground text-xs font-semibold border border-border/80 transition-colors shadow-2xs cursor-pointer"
            title="Switch currency"
          >
            {currency === 'USD' ? '$ USD' : '₹ INR'}
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg bg-secondary text-foreground hover:bg-secondary/80 border border-border/80 transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-butter" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg bg-secondary text-foreground hover:bg-secondary/80 border border-border/80 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Desktop Fixed Sidebar / Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 max-w-[85vw] h-[100dvh] bg-card border-r border-border flex flex-col shrink-0 transition-transform duration-300 ease-in-out lg:static lg:h-full lg:w-64 lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="p-5 border-b border-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-butter text-butter-foreground flex items-center justify-center font-display font-bold text-base shadow-xs">
              MP
            </div>
            <div>
              <div className="font-display font-bold text-sm text-foreground flex items-center gap-1.5">
                <span>Studio Admin</span>
                <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-mono bg-butter/30 text-butter-foreground border border-butter/40">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground font-mono">My Planet Services</p>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1 rounded-lg text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Navigation — Scrollable if window height is small */}
        <nav className="p-3 flex-1 space-y-1 overflow-y-auto">
          <p className="px-3 pt-2 pb-1.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
            Operations & Clients
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path, item.exact);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-butter text-butter-foreground font-semibold shadow-xs'
                    : 'text-foreground/80 hover:text-foreground hover:bg-secondary/80'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-butter-foreground' : 'text-muted-foreground'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-4">
            <p className="px-3 pt-2 pb-1.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
              External & Quick Links
            </p>
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-secondary/80 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                <span>Public Website</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
            </Link>
          </div>
        </nav>

        {/* User Card & Logout */}
        <div className="p-3 border-t border-border bg-secondary/30">
          <div className="flex items-center justify-between p-2 rounded-xl bg-card border border-border/80 mb-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-ink text-ink-foreground flex items-center justify-center text-xs font-bold font-display shrink-0 shadow-xs">
                VK
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-foreground truncate">{user?.name || 'Admin'}</div>
                <div className="text-[10px] text-muted-foreground truncate">{user?.role || 'Lead Admin'}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout session"
              className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-30 lg:hidden"
        />
      )}

      {/* Main Content Area — ONLY this right side scrolls */}
      <div
        className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto relative"
        data-lenis-prevent
      >
        {/* Top Navbar */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-card/85 backdrop-blur-md border-b border-border sticky top-0 z-20 shrink-0">
          <div>
            <h1 className="font-display text-xl font-semibold text-foreground tracking-tight">{title}</h1>
            {subtitle && <p className="text-xs text-muted-foreground font-sans mt-0.5">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-3">
            {/* Currency switcher */}
            <div className="flex items-center bg-secondary rounded-full p-0.5 border border-border text-xs font-medium">
              <button
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1 rounded-full transition-all duration-200 ${
                  currency === 'USD' ? 'bg-butter text-butter-foreground font-semibold shadow-xs' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                $ USD
              </button>
              <button
                onClick={() => setCurrency('INR')}
                className={`px-3 py-1 rounded-full transition-all duration-200 ${
                  currency === 'INR' ? 'bg-butter text-butter-foreground font-semibold shadow-xs' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                ₹ INR
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-secondary text-foreground hover:bg-secondary/80 border border-border transition-colors"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-butter" /> : <Moon className="w-4 h-4 text-muted-foreground" />}
            </button>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary hover:bg-destructive/10 hover:text-destructive text-foreground text-xs font-medium border border-border transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-14 sm:pb-8">
          {/* Mobile Page Title Banner (lg:hidden because top desktop navbar displays it) */}
          <div className="lg:hidden mb-4 pb-3 border-b border-border/70">
            <h1 className="font-display text-lg sm:text-xl font-bold text-foreground tracking-tight leading-snug">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-muted-foreground font-sans mt-0.5 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {actions && (
            <div className="mb-5 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              {actions}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
