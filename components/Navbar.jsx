import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import ThemeToggle from '@/components/ThemeToggle';

function HamburgerIcon({ open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {open ? (
        <>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </>
      ) : (
        <>
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </>
      )}
    </svg>
  );
}

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="relative z-10 border-b border-gray-200 dark:border-slate-800/60 bg-white/80 dark:bg-[#07090f]/70 backdrop-blur-md">
      {/* Main bar */}
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">

        {/* Mobile menu button — left of logo, authenticated only */}
        {session && (
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden p-1.5 rounded-lg text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/60 transition-colors"
            aria-label="Toggle menu"
          >
            <HamburgerIcon open={menuOpen} />
          </button>
        )}

        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenu}
          className="font-bold text-base tracking-tight text-gray-900 dark:text-white"
        >
          SharePrompt
        </Link>

        {/* Desktop nav links — authenticated only */}
        {session && (
          <div className="hidden md:flex items-center gap-5 text-sm text-gray-500 dark:text-slate-400 ml-2">
            <Link href="/" className="hover:text-gray-900 dark:hover:text-white transition-colors">
              New Prompt
            </Link>
            <Link href="/history" className="hover:text-gray-900 dark:hover:text-white transition-colors">
              History
            </Link>
            <Link href="/chat" className="hover:text-gray-900 dark:hover:text-white transition-colors">
              Chat
            </Link>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right side — always visible */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {session ? (
            <div className="flex items-center gap-2">
              {session.user.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name}
                  width={28}
                  height={28}
                  className="rounded-full ring-1 dark:ring-slate-700"
                />
              )}
              <button
                onClick={() => signOut()}
                className="hidden md:inline-flex text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/60 transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => signIn('google')}
                className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-colors"
              >
                Sign in
              </button>
              <button
                onClick={() => signIn('google')}
                className="text-xs px-3 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium hover:opacity-90 transition-opacity"
              >
                Try for free →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {session && menuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-slate-800/60 bg-white/95 dark:bg-[#07090f]/95 backdrop-blur-md">
          <div className="max-w-3xl mx-auto px-4 py-3 space-y-1">
            {/* Nav links */}
            <Link
              href="/"
              onClick={closeMenu}
              className="flex items-center px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              New Prompt
            </Link>
            <Link
              href="/history"
              onClick={closeMenu}
              className="flex items-center px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              History
            </Link>
            <Link
              href="/chat"
              onClick={closeMenu}
              className="flex items-center px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              Chat
            </Link>

            {/* Divider */}
            <div className="h-px bg-gray-100 dark:bg-slate-800 my-1" />

            {/* Theme + user row */}
            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center gap-2">
                {session.user.image && (
                  <Image
                    src={session.user.image}
                    alt={session.user.name}
                    width={24}
                    height={24}
                    className="rounded-full ring-1 dark:ring-slate-700"
                  />
                )}
                <span className="text-sm text-gray-700 dark:text-slate-300 truncate max-w-[140px]">
                  {session.user.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <button
                  onClick={() => { signOut(); closeMenu(); }}
                  className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/60 transition-colors"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
