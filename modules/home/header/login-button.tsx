'use client';

import { Button } from '@/components/ui/button';
import { Route } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const LoginButton = ({ className }: { className?: string }) => {
  const pathname = usePathname();

  const loginHref =
    pathname === '/'
      ? '/login'
      : `/login?callbackURL=${encodeURIComponent(pathname)}`;

  return (
    <Button variant="outline" className={className} asChild>
      <Link href={loginHref as Route}>Sign in</Link>
    </Button>
  );
};
