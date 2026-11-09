import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { socials } from '../constants/SocialRef';
import CustomScrollbar from './CustomScrollbar';

const links = [
  { to: '/', label: 'Home', icon: 'fa-house' },
  { to: '/about', label: 'About', icon: 'fa-user' },
  { to: '/projects', label: 'Projects', icon: 'fa-folder-open' },
  { to: '/certifications', label: 'Certifications', icon: 'fa-award' },
  { to: '/services', label: 'Services', icon: 'fa-briefcase' },
  { to: '/contact', label: 'Contact', icon: 'fa-envelope' },
];

const fadeLabel =
  'whitespace-nowrap transition-opacity duration-200 md:max-lg:opacity-0 md:max-lg:group-hover/nav:opacity-100 md:max-lg:group-focus-within/nav:opacity-100';

const collapsedOnly =
  'hidden md:max-lg:flex md:max-lg:group-hover/nav:hidden md:max-lg:group-focus-within/nav:hidden';

const expandedOnly =
  'flex md:max-lg:hidden md:max-lg:group-hover/nav:flex md:max-lg:group-focus-within/nav:flex';

function ThemeToggle({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={onToggle}
      className="relative flex h-8 w-16 shrink-0 items-center justify-between rounded-full border border-[var(--border)] bg-[var(--muted)]/10 px-1 text-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg)]"
    >
      <span
        aria-hidden="true"
        data-theme-thumb
        className={`absolute left-1 top-1 size-6 rounded-full bg-[var(--fg)] transition-[transform,background-color] duration-300 ease-out motion-reduce:transition-none ${
          dark ? 'translate-x-[30px]' : 'translate-x-0'
        }`}
      />

      <span className="relative z-10 flex size-6 items-center justify-center">
        <i
          className={`fa-solid fa-sun ${dark ? 'text-[var(--muted)]' : 'text-[var(--bg)]'}`}
          aria-hidden="true"
        ></i>
      </span>

      <span className="relative z-10 flex size-6 items-center justify-center">
        <i
          className={`fa-solid fa-moon ${dark ? 'text-[var(--bg)]' : 'text-[var(--muted)]'}`}
          aria-hidden="true"
        ></i>
      </span>
    </button>
  );
}

function CompactThemeToggle({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="flex size-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--muted)]/10 text-sm text-[var(--fg)] transition-colors duration-200 hover:bg-[var(--muted)]/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg)]"
    >
      <i className={`fa-solid ${dark ? 'fa-moon' : 'fa-sun'}`} aria-hidden="true"></i>
    </button>
  );
}

function MobileScrollProgress() {
  const [progress, setProgress] = useState(() => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    return maxScroll > 0 ? window.scrollY / maxScroll : 0;
  });

  useEffect(() => {
    let frame = 0;
    const updateProgress = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(maxScroll > 0 ? Math.min(1, window.scrollY / maxScroll) : 0);
      });
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    const resizeObserver = new ResizeObserver(updateProgress);
    resizeObserver.observe(document.documentElement);
    resizeObserver.observe(document.body);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      className="absolute inset-x-0 bottom-0 h-1 bg-[var(--border)]/40 md:hidden"
    >
      <span
        className="block h-full origin-left bg-[var(--fg)]"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}

function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const interactiveSelector = 'a, button, input, textarea, select, summary, [role="button"], [tabindex]:not([tabindex="-1"])';

    const handlePointerMove = (event: PointerEvent) => {
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      cursor.classList.add('is-visible');
      const target = document.elementFromPoint(event.clientX, event.clientY);
      cursor.classList.toggle(
        'is-interactive',
        target instanceof Element && Boolean(target.closest(interactiveSelector))
      );
    };

    const handlePointerLeave = () => {
      cursor.classList.remove('is-visible', 'is-interactive');
    };
    const handleGameCursorMessage = (event: MessageEvent<unknown>) => {
      const gameFrame = document.querySelector<HTMLIFrameElement>('[data-custom-cursor-frame]');
      if (
        !gameFrame ||
        event.source !== gameFrame.contentWindow ||
        event.origin !== window.location.origin ||
        typeof event.data !== 'object' ||
        event.data === null
      ) {
        return;
      }

      const message = event.data as { type?: unknown; x?: unknown; y?: unknown };
      if (message.type === 'game-cursor-leave') {
        cursor.classList.remove('is-visible', 'is-interactive');
      } else if (
        message.type === 'game-cursor-move' &&
        typeof message.x === 'number' &&
        typeof message.y === 'number'
      ) {
        cursor.classList.remove('is-visible', 'is-interactive', 'is-grabbing');
      }
    };
    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Element && event.target.closest('[data-custom-grab]')) {
        cursor.classList.add('is-grabbing');
      }
    };
    const handlePointerEnd = () => {
      cursor.classList.remove('is-grabbing');
    };
    const handleWindowBlur = () => {
      cursor.classList.remove('is-visible', 'is-interactive', 'is-grabbing');
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('pointerdown', handlePointerDown, true);
    window.addEventListener('pointerup', handlePointerEnd, true);
    window.addEventListener('pointercancel', handlePointerEnd, true);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('message', handleGameCursorMessage);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('pointerdown', handlePointerDown, true);
      window.removeEventListener('pointerup', handlePointerEnd, true);
      window.removeEventListener('pointercancel', handlePointerEnd, true);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('message', handleGameCursorMessage);
    };
  }, []);

  return (
    <div ref={cursorRef} className="custom-cursor" aria-hidden="true">
      <svg viewBox="0 0 24 28">
        <path d="M2 1 21 17h-9l-4 10z" />
        <path className="grabbing-hand" d="M8 13V7a1.5 1.5 0 0 1 3 0v4-6a1.5 1.5 0 0 1 3 0v6-5a1.5 1.5 0 0 1 3 0v6-3a1.5 1.5 0 0 1 3 0v7c0 4-2.5 7-6.5 7h-1c-2.5 0-4-1-5.5-3l-3-4a1.5 1.5 0 0 1 2.5-1.7L8 16z" />
      </svg>
    </div>
  );
}

function GameLaunchCard({ onStart }: { onStart: () => void }) {
  return (
    <button
      type="button"
      onClick={onStart}
      aria-label="Take a break, play a quick game"
      className="group flex w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5 text-center font-sans shadow-sm transition-[background-color,padding] duration-200 hover:bg-[var(--muted)]/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg)] md:max-lg:p-1 md:max-lg:group-hover/nav:p-5 md:max-lg:group-focus-within/nav:p-5"
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--fg)] text-[var(--bg)] transition-transform duration-200 group-hover:scale-105">
        <i className="fa-solid fa-gamepad" aria-hidden="true"></i>
      </span>

      <span className={`${expandedOnly} flex-col`}>
        <span className="block whitespace-nowrap text-sm font-semibold text-[var(--fg)]">Take a break</span>
        <span className="mt-1 block whitespace-nowrap text-xs text-[var(--muted)]">Play a quick game</span>
      </span>
    </button>
  );
}

export default function Layout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const fadeTimerRef = useRef(0);

  const [dark, setDark] = useState(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
    } catch (error) {
      console.error('Unable to read the saved theme preference', error);
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const toggleTheme = () => {
    const root = document.documentElement;
    window.clearTimeout(fadeTimerRef.current);
    root.classList.add('theme-fade');
    setDark((current) => !current);
    fadeTimerRef.current = window.setTimeout(() => root.classList.remove('theme-fade'), 500);
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    try {
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    } catch (error) {
      console.error('Unable to save the theme preference', error);
    }
  }, [dark]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMobileMenuOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const tabletQuery = window.matchMedia('(min-width: 768px)');
    const closeOnResize = (event: MediaQueryListEvent) => {
      if (event.matches) setIsMobileMenuOpen(false);
    };

    tabletQuery.addEventListener('change', closeOnResize);
    return () => tabletQuery.removeEventListener('change', closeOnResize);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg)] text-[var(--fg)] selection:text-blue-500 md:pl-16 lg:pl-64">
      <aside className="group/nav fixed inset-y-0 left-0 z-[100] hidden w-16 flex-col overflow-hidden border-r border-[var(--border)] bg-[var(--bg)] px-3 py-8 font-sans transition-[width,box-shadow] duration-300 ease-out motion-reduce:transition-none md:flex md:max-lg:hover:w-64 md:max-lg:hover:shadow-2xl md:max-lg:focus-within:w-64 md:max-lg:focus-within:shadow-2xl lg:w-64 lg:px-7">
        <Link
          to="/"
          aria-label="Alef Justin Loresca, home"
          className="flex h-7 items-center font-serif font-semibold leading-tight tracking-tight duration-200 hover:text-[var(--muted)]"
        >
          <span className={`${expandedOnly} whitespace-nowrap text-lg`}>ALEF JUSTIN LORESCA</span>
          <span className={`${collapsedOnly} w-full justify-center text-base`}>AJL</span>
        </Link>

        <nav aria-label="Main navigation" className="mb-4 mt-12 flex h-full flex-col justify-between gap-2">
          <ul className="flex flex-col gap-2 text-sm">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                aria-label={link.label}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-sm px-3 py-2.5 duration-200 ${
                    isActive
                      ? 'bg-[var(--muted)]/10 font-semibold text-[var(--fg)]'
                      : 'text-[var(--muted)] hover:bg-[var(--muted)]/5 hover:text-[var(--fg)]'
                  }`
                }
              >
                <i className={`fa-solid ${link.icon} w-4 shrink-0 text-center`} aria-hidden="true"></i>
                <span className={fadeLabel}>{link.label}</span>
              </NavLink>
            ))}
          </ul>

          <GameLaunchCard onStart={() => navigate('/game')} />
        </nav>

        <div className="mt-auto border-t border-[var(--border)] pt-6 text-sm text-[var(--muted)]">
          <div className={`${expandedOnly} items-center justify-between`}>
            <span className="whitespace-nowrap">Appearance</span>
            <ThemeToggle dark={dark} onToggle={toggleTheme} />
          </div>
          <div className={`${collapsedOnly} justify-center`}>
            <CompactThemeToggle dark={dark} onToggle={toggleTheme} />
          </div>
        </div>
      </aside>

      <nav aria-label="Main navigation" className="sticky top-0 z-[99] border-b border-[var(--border)] bg-[var(--bg)] font-sans md:hidden">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-5 py-4">
          <Link to="/" className="font-serif font-semibold tracking-tight duration-200 hover:text-[var(--muted)]">
            ALEF JUSTIN LORESCA
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle dark={dark} onToggle={toggleTheme} />

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
              className="flex size-9 items-center justify-center text-lg text-[var(--fg)]"
            >
              <i
                className={isMobileMenuOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'}
                aria-hidden="true"
              ></i>
            </button>
          </div>
        </div>

        <div
          id="mobile-navigation"
          className={`overflow-hidden border-t border-[var(--border)] transition-[max-height,opacity] duration-200 ${
            isMobileMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 border-t-transparent opacity-0'
          }`}
          aria-hidden={!isMobileMenuOpen}
        >
          <div className="mx-auto max-w-4xl px-5 py-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                tabIndex={isMobileMenuOpen ? 0 : -1}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block border-b border-[var(--border)] py-3 text-sm last:border-b-0 ${
                    isActive
                      ? 'font-semibold text-[var(--fg)]'
                      : 'text-[var(--muted)] hover:text-[var(--fg)]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
        <MobileScrollProgress />
      </nav>

      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-12 font-sans text-[16px] leading-relaxed">
        <Outlet />
      </main>

      <footer className="z-[99] border-t border-[var(--border)] bg-[var(--bg)] font-sans">
        <div className="mx-auto max-w-5xl space-y-10 px-5 pb-6 pt-12">
          <section aria-labelledby="footer-socials" className="space-y-6">
            <header className="space-y-1">
              <h2 id="footer-socials" className="font-serif text-2xl font-bold tracking-tight sm:text-3xl">
                SOCIALS
              </h2>
            </header>

            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {socials.map((social) => (
                <li key={social.id}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--fg)] hover:bg-[var(--muted)]/5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg)]"
                  >
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-lg text-[var(--muted)] transition-colors duration-300 group-hover:border-[var(--fg)] group-hover:bg-[var(--fg)] group-hover:text-[var(--bg)]">
                      <i className={social.icon} aria-hidden="true"></i>
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-[var(--fg)]">{social.label}</span>
                      <span className="block truncate text-xs text-[var(--muted)]">{social.handle}</span>
                    </span>

                    <i
                      className="fa-solid fa-arrow-up-right-from-square shrink-0 text-xs text-[var(--muted)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--fg)]"
                      aria-hidden="true"
                    ></i>
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] pt-6 text-sm text-[var(--muted)]">
            <span>&copy; 2026 Alef Justin Loresca</span>

            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group inline-flex items-center gap-2 transition-colors duration-200 hover:text-[var(--fg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg)]"
            >
              Back to top
              <i
                className="fa-solid fa-arrow-up text-xs transition-transform duration-200 group-hover:-translate-y-0.5"
                aria-hidden="true"
              ></i>
            </button>
          </div>
        </div>
      </footer>

      <CustomCursor />
      <CustomScrollbar
        key={pathname}
        windowTarget
        label="Page scroll"
        className="page-scrollbar hidden md:block"
      />
    </div>
  );
}