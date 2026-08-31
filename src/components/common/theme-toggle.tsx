import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../lib/theme';

/**
 * Light/dark switch. Shows the icon for the theme you would GET on click,
 * which is the convention users expect from a single-button toggle.
 */
export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const goingDark = theme === 'light';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={goingDark ? 'Switch to dark theme' : 'Switch to light theme'}
      title={goingDark ? 'Dark theme' : 'Light theme'}
      className={`relative w-9 h-9 rounded-full border border-border bg-card text-foreground flex items-center justify-center cursor-pointer transition-all duration-200 hover:border-butter hover:scale-105 active:scale-95 shrink-0 ${className}`}
    >
      <Sun
        className={`w-4 h-4 absolute transition-all duration-300 ${
          goingDark ? 'opacity-0 -rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
        }`}
      />
      <Moon
        className={`w-4 h-4 absolute transition-all duration-300 ${
          goingDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'
        }`}
      />
    </button>
  );
}

export default ThemeToggle;
