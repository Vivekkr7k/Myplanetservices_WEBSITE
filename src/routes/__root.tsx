import type { ReactNode } from 'react';

export function RootLayout({ children }: { children?: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased font-sans">
      {children}
    </div>
  );
}

export default RootLayout;
