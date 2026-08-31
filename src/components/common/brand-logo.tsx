import { Link } from 'react-router-dom';
import { useTheme } from '../../lib/theme';

/** Artwork with dark glyphs — for light surfaces. */
const LOGO_ON_LIGHT = '/assets/brand/logo-dark-art.png';
/** Artwork with light glyphs — for dark surfaces. */
const LOGO_ON_DARK = '/assets/brand/logo-light-art.png';

interface BrandLogoProps {
  /**
   * Surface the logo sits on.
   * 'light' = light surface (dark artwork), 'dark' = dark surface (light artwork),
   * 'auto'  = follow the active theme. Use 'dark' for permanently-ink panels
   * such as the footer CTA, which stay dark in both themes.
   */
  variant?: 'light' | 'dark' | 'auto';
  className?: string;
  /** Rendered height. Width follows the artwork's 444:260 aspect. */
  size?: 'sm' | 'md' | 'lg';
}

const SIZES: Record<NonNullable<BrandLogoProps['size']>, string> = {
  sm: 'h-7 sm:h-8',
  md: 'h-9 sm:h-10',
  lg: 'h-12 sm:h-14',
};

export function BrandLogo({
  variant = 'auto',
  className = '',
  size = 'md',
}: BrandLogoProps) {
  const { theme } = useTheme();

  const onDarkSurface = variant === 'auto' ? theme === 'dark' : variant === 'dark';
  const src = onDarkSurface ? LOGO_ON_DARK : LOGO_ON_LIGHT;

  return (
    <img
      src={src}
      alt="My Planet Services"
      width={444}
      height={260}
      decoding="async"
      className={`${SIZES[size]} w-auto select-none transition-transform duration-300 group-hover:scale-[1.03] ${className}`}
      draggable={false}
    />
  );
}

export function BrandLogoLink({
  to = '/',
  variant = 'auto',
  size = 'md',
  className = '',
}: {
  to?: string;
  variant?: BrandLogoProps['variant'];
  size?: BrandLogoProps['size'];
  className?: string;
}) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center shrink-0 group ${className}`}
      aria-label="My Planet Services — Home"
    >
      <BrandLogo variant={variant} size={size} />
    </Link>
  );
}

export default BrandLogo;
