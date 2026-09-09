import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAdminAuth, DEMO_CREDENTIALS } from '../../lib/admin-auth';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const { isAuthenticated, login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(DEMO_CREDENTIALS.email);
  const [password, setPassword] = useState(DEMO_CREDENTIALS.password);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, go straight to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const success = login(email, password);
      setIsLoading(false);
      if (success) {
        toast.success('Welcome back, Vivek! Admin session active.');
        const from = (location.state as any)?.from?.pathname || '/admin';
        navigate(from, { replace: true });
      } else {
        toast.error('Invalid credentials. Please use the pre-filled demo account.');
      }
    }, 400);
  };

  const handleFillDemo = () => {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
    toast.info('Demo admin credentials auto-filled');
  };

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col justify-center items-center px-3.5 sm:px-4 py-8 sm:py-12 relative overflow-hidden selection:bg-butter selection:text-butter-foreground">
      {/* Background aurora ambient bloom */}
      <div
        className="absolute -top-40 -left-40 w-96 h-96 bg-butter/20 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-40 -right-40 w-96 h-96 bg-mint/20 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="w-full max-w-md relative z-10">
        {/* Back Link */}
        <div className="mb-4 sm:mb-6 flex justify-between items-center text-xs">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Studio</span>
          </Link>
          <span className="text-[10px] sm:text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
            Admin Area
          </span>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl sm:rounded-[32px] bg-card border border-border/80 shadow-2xl p-5 sm:p-9 relative overflow-hidden backdrop-blur-xl">
          {/* Card Accent Top Bar */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-butter via-amber-400 to-mint" />

          {/* Logo & Title */}
          <div className="text-center mb-6 pt-2">
            <div className="w-12 h-12 rounded-2xl bg-butter text-butter-foreground flex items-center justify-center font-display font-bold text-xl mx-auto mb-3 shadow-soft">
              MP
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Studio Admin Portal
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Client record management, quotations, and contract billing.
            </p>
          </div>

          {/* Demo Credentials Auto-Filled Banner */}
          <div className="mb-6 p-3.5 rounded-2xl bg-secondary/70 border border-butter/40 flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-butter shrink-0 mt-0.5" />
              <div className="text-xs">
                <div className="font-semibold text-foreground">Demo Credentials Auto-Loaded</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  Pre-filled below for instant 1-click evaluation.
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[11px] font-semibold text-butter-foreground bg-butter px-2.5 py-1 rounded-lg hover:scale-105 transition-transform shrink-0 shadow-xs"
            >
              Reset
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@myplanetservices.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-butter/50 transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-1.5">
                Master Passphrase
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-background border border-border text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-butter/50 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-2xl bg-ink text-ink-foreground hover:bg-butter hover:text-butter-foreground font-display font-semibold text-sm transition-all duration-200 shadow-soft flex items-center justify-center gap-2 group cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-butter border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Enter Studio Workspace</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick 1-Click Access Button */}
          <div className="mt-4 pt-4 border-t border-border/60 text-center">
            <button
              type="button"
              onClick={() => {
                login(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);
                toast.success('Signed in as Demo Executive');
                navigate('/admin', { replace: true });
              }}
              className="text-xs text-muted-foreground hover:text-butter transition-colors font-mono inline-flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-butter" />
              <span>Instant 1-Click Demo Login</span>
            </button>
          </div>
        </div>

        {/* Security badge note */}
        <p className="text-center text-[11px] text-muted-foreground mt-6 font-mono">
          Session protected via encrypted local storage token • MPS Studio Security
        </p>
      </div>
    </div>
  );
}
