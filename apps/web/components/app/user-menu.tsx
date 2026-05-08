'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface Props {
  email: string;
  role: string;
}

export function UserMenu({ email, role }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const initial = (email[0] || '?').toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-warm-soft text-sm font-medium text-warm transition-colors hover:bg-warm-soft/80"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {initial}
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 z-30 mt-2 w-56 overflow-hidden rounded-md border bg-popover text-sm shadow-lg"
        >
          <div className="border-b px-3 py-2">
            <p className="truncate font-medium">{email}</p>
            <p className="text-xs capitalize text-muted-foreground">{role}</p>
          </div>
          <Link
            href="/settings/profile"
            className="block px-3 py-2 hover:bg-accent"
            onClick={() => setOpen(false)}
            role="menuitem"
          >
            Profile
          </Link>
          <Link
            href="/settings/notifications"
            className="block px-3 py-2 hover:bg-accent"
            onClick={() => setOpen(false)}
            role="menuitem"
          >
            Notifications
          </Link>
          <form action="/auth/sign-out" method="post" className="border-t">
            <button
              type="submit"
              className="block w-full px-3 py-2 text-left text-destructive hover:bg-accent"
              role="menuitem"
            >
              Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
