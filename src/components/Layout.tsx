import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import CustomScrollbar from './CustomScrollbar';

const links = [
  { to: '/', label: 'Home', icon: 'fa-house' },
  { to: '/about', label: 'About', icon: 'fa-user' },
  { to: '/projects', label: 'Projects', icon: 'fa-folder-open' },
  { to: '/certifications', label: 'Certifications', icon: 'fa-award' },
  { to: '/services', label: 'Services', icon: 'fa-briefcase' },
  { to: '/contact', label: 'Contact', icon: 'fa-envelope' },
];

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
      className="absolute inset-x-0 bottom-0 h-1 bg-[var(--border)]/40 lg:hidden"
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
      className="w-full group flex flex-col items-center justify-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5 text-center font-sans shadow-sm transition-colors duration-200 hover:bg-[var(--muted)]/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg)]"
    >
      <span className="flex size-8 items-center justify-center rounded-full bg-[var(--fg)] text-[var(--bg)] transition-transform duration-200 group-hover:scale-105">
        <i className="fa-solid fa-gamepad" aria-hidden="true"></i>
      </span>
      
      <span>
        <span className="block text-sm font-semibold text-[var(--fg)]">Take a break</span>
        <span className="mt-1 block text-xs text-[var(--muted)]">Play a quick game</span>
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

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg)] text-[var(--fg)] selection:text-blue-500 lg:pl-64">
      <aside className="fixed inset-y-0 left-0 z-[100] hidden w-64 flex-col border-r border-[var(--border)] bg-[var(--bg)] px-7 py-8 font-sans lg:flex">
        <Link
          to="/"
          className="font-serif text-lg font-semibold leading-tight tracking-tight duration-200 hover:text-[var(--muted)]"
        >
          ALEF JUSTIN LORESCA
        </Link>

        <nav aria-label="Main navigation" className="mt-12 mb-4 h-full flex flex-col justify-between gap-2">
          <ul className="flex flex-col gap-2 text-sm">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-sm px-3 py-2.5 duration-200 ${
                    isActive
                      ? 'bg-[var(--muted)]/10 font-semibold text-[var(--fg)]'
                      : 'text-[var(--muted)] hover:bg-[var(--muted)]/5 hover:text-[var(--fg)]'
                  }`
                }
              >
                <i className={`fa-solid ${link.icon} w-4 text-center`} aria-hidden="true"></i>
                {link.label}
              </NavLink>
            ))}
          </ul>

          <GameLaunchCard onStart={() => navigate("/game")} />
        </nav>

        <div className="mt-auto flex items-center justify-between border-t border-[var(--border)] pt-6 text-sm text-[var(--muted)]">
          <span>Appearance</span>
          <ThemeToggle dark={dark} onToggle={toggleTheme} />
        </div>
      </aside>

      <nav aria-label="Main navigation" className="sticky top-0 z-[99] border-b border-[var(--border)] bg-[var(--bg)] font-sans lg:hidden">
        <div className="max-w-4xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
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
          <div className="max-w-4xl mx-auto px-5 py-2">
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

      <main className="flex-1 w-full max-w-4xl mx-auto px-5 py-12 font-sans text-[17px] leading-relaxed">
        <Outlet />
      </main>

      <footer className="font-sans bg-[var(--bg)] border-t border-[var(--border)] z-[99]">
        <div className="max-w-4xl mx-auto px-5 py-6 flex flex-wrap items-center justify-between gap-4 text-sm text-[var(--muted)]">
          <span>&copy; 2026 Alef Justin Loresca</span>

          <div className="flex items-center gap-4">
            <a href="https://github.com/krobbus" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="duration-200 hover:text-[var(--fg)]">
              <i className="fa-brands fa-github text-lg"></i>
            </a>

            <a href="https://www.linkedin.com/in/alefjustinloresca/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="duration-200 hover:text-[var(--fg)]">
              <i className="fa-brands fa-linkedin text-lg"></i>
            </a>

            <a href="https://www.instagram.com/ajloresca/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="duration-200 hover:text-[var(--fg)]">
              <i className="fa-brands fa-square-instagram text-lg"></i>
            </a>

            <a href="https://m.me/lorescaalef/" target="_blank" rel="noopener noreferrer" aria-label="Messenger" className="duration-200 hover:text-[var(--fg)]">
              <i className="fa-brands fa-facebook-messenger text-lg"></i>
            </a>
          </div>
        </div>
      </footer>

      <CustomCursor />
      <CustomScrollbar
        key={pathname}
        windowTarget
        label="Page scroll"
        className="page-scrollbar hidden lg:block"
      />
    </div>
  );
}