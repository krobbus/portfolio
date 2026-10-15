import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/certifications', label: 'Certifications' },
  { to: '/contact', label: 'Contact' },
];

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

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  return (
    <div ref={cursorRef} className="custom-cursor" aria-hidden="true">
      <svg viewBox="0 0 24 28">
        <path d="M2 1 21 17h-9l-4 10z" />
      </svg>
    </div>
  );
}

export default function Layout() {
  const { pathname } = useLocation();

  const [dark, setDark] = useState(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
    } catch {
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    try {
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    } catch {
    }
  }, [dark]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--fg)] selection:text-blue-500">
      <nav className="sticky top-0 z-99 bg-[var(--bg)] font-sans border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-5 py-4 flex flex-wrap items-center justify-center sm:justify-between gap-x-6 gap-y-2">
          <Link to="/" className="font-serif font-semibold tracking-tight duration-200 hover:text-[var(--muted)]">
            ALEF JUSTIN LORESCA
          </Link>

          <div className="flex flex-wrap justify-center items-center gap-x-5 gap-y-1 text-sm">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  isActive
                    ? 'underline underline-offset-6'
                    : 'text-[var(--muted)] duration-200 hover:text-[var(--fg)]'
                }
              >
                {link.label}
              </NavLink>
            ))}

            <button
              type="button"
              onClick={() => setDark((d) => !d)}
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="text-[var(--muted)] pl-4 duration-200 hover:text-[var(--fg)] cursor-pointer"
            >
              <i className={dark ? 'fa-solid fa-sun' : 'fa-solid fa-moon'}></i>
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-4xl mx-auto px-5 py-12 font-sans text-[17px] leading-relaxed">
        <Outlet />
      </main>

      <footer className="font-sans border-t border-[var(--border)]">
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
    </div>
  );
}
