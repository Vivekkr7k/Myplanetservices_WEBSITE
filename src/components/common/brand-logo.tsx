import { Link } from 'react-router-dom';

interface BrandLogoProps {
  variant?: 'light' | 'dark';
  className?: string;
  showText?: boolean;
}

export function PlanetMark({
  className = 'w-8 h-8',
  planetColor,
  orbitColor = '#F6E05E',
  starColor = '#F6E05E',
}: {
  className?: string;
  planetColor?: string;
  orbitColor?: string;
  starColor?: string;
}) {
  return (
    <svg
      viewBox="0 0 54 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} shrink-0`}
      aria-hidden="true"
    >
      {/* 4-Point Star at top-right of orbit */}
      <path
        d="M 43 7 Q 43 12 48 12 Q 43 12 43 17 Q 43 12 38 12 Q 43 12 43 7 Z"
        fill={starColor}
        className="animate-icon-sparkle origin-center"
      />

      {/* Main Planet Body (Circle) */}
      <circle
        cx="25"
        cy="27"
        r="15"
        stroke={planetColor || 'currentColor'}
        strokeWidth="2.75"
        strokeLinecap="round"
        className="transition-colors"
      />

      {/* Sweeping Planetary Orbit Ring */}
      <path
        d="M 9 37.5 C 7 42.5 15 45.5 29 40 C 40 35.5 47 27.5 45 19 C 44.2 15.5 40 16 38 17.5"
        stroke={orbitColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        className="animate-icon-wiggle origin-center"
      />
    </svg>
  );
}

export function BrandLogo({
  variant = 'dark',
  className = '',
  showText = true,
}: BrandLogoProps) {
  const isLight = variant === 'light';

  return (
    <div className={`flex items-center gap-2.5 group select-none ${className}`}>
      {/* Planet & Orbit Icon Mark */}
      <div className="relative flex items-center justify-center">
        <PlanetMark
          className="w-8 h-8 sm:w-9 sm:h-9 transition-transform duration-300 group-hover:scale-105"
          planetColor={isLight ? '#09090B' : '#FFFFFF'}
          orbitColor="#F6E05E"
          starColor="#F6E05E"
        />
      </div>

      {showText && (
        <>
          {/* Vertical Divider */}
          <div
            className={`h-6 w-[1.5px] rounded-full mx-0.5 ${
              isLight ? 'bg-zinc-300' : 'bg-white/20'
            }`}
            aria-hidden="true"
          />

          {/* Logo Wordmark */}
          <div className="flex flex-col text-left justify-center leading-none">
            <span
              className={`font-display text-sm sm:text-base font-semibold tracking-tight ${
                isLight ? 'text-zinc-950' : 'text-white'
              }`}
            >
              my planet
            </span>
            <span
              className={`text-[7.5px] sm:text-[8.5px] font-mono uppercase tracking-[0.26em] font-semibold mt-0.5 ${
                isLight ? 'text-zinc-600' : 'text-butter'
              }`}
            >
              S E R V I C E S
            </span>
          </div>
        </>
      )}
    </div>
  );
}

export function BrandLogoLink({
  to = '/',
  variant = 'dark',
  className = '',
}: {
  to?: string;
  variant?: 'light' | 'dark';
  className?: string;
}) {
  return (
    <Link to={to} className={`inline-flex items-center shrink-0 ${className}`} aria-label="My Planet Services Home">
      <BrandLogo variant={variant} />
    </Link>
  );
}

export default BrandLogo;
