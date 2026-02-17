import { cn } from '@/lib/utils';
import React from 'react';
import { Button } from '@/components/ui/button';
import { XIcon, MenuIcon } from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function MobileNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="md:hidden">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            aria-controls="mobile-menu"
            aria-expanded={open}
            aria-label="Toggle menu"
            className="md:hidden"
            onClick={() => setOpen(!open)}
            size="icon"
            variant="outline"
          >
            <div
              className={cn(
                'transition-all',
                open ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
              )}
            >
              <XIcon />
            </div>
            <div
              className={cn(
                'absolute transition-all',
                open ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
              )}
            >
              <MenuIcon />
            </div>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href="/" className="text-xl">
                Home
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/courses" className="text-xl">
                Courses
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard" className="text-xl">
                Dashboard
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
