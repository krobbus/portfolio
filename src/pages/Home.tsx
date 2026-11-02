import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { certifications } from '../constants/CertificationRef';
import { projects } from '../constants/ProjectRef';

type ContributionDay = {
  date: string;
  count: number;
  level: number;
};

function isContributionDay(value: unknown): value is ContributionDay {
  if (typeof value !== 'object' || value === null) return false;
  if (!('date' in value) || !('count' in value) || !('level' in value)) return false;
  return (
    typeof value.date === 'string' &&
    typeof value.count === 'number' &&
    typeof value.level === 'number' &&
    Number.isInteger(value.level) &&
    value.level >= 0 &&
    value.level <= 4
  );
}

function ContributionCalendar() {
  const [contributions, setContributions] = useState<ContributionDay[] | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const loadContributions = async () => {
      try {
        const response = await fetch(
          'https://github-contributions-api.jogruber.de/v4/krobbus?y=last',
          { signal: controller.signal },
        );
        if (!response.ok) {
          throw new Error(`Contribution service returned ${response.status}`);
        }

        const data: unknown = await response.json();
        if (
          typeof data !== 'object' ||
          data === null ||
          !('contributions' in data) ||
          !Array.isArray(data.contributions) ||
          !data.contributions.every(isContributionDay)
        ) {
          throw new Error('Contribution service returned invalid data');
        }

        setContributions(data.contributions);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        console.error('Unable to load GitHub contributions', error);
        setHasError(true);
      }
    };

    void loadContributions();
    return () => controller.abort();
  }, []);

  if (hasError) {
    return <p className="text-xs text-[var(--muted)]">GitHub contributions are unavailable right now.</p>;
  }
  if (!contributions) {
    return <p className="text-xs text-[var(--muted)]">Loading GitHub contributions...</p>;
  }

  const firstDay = new Date(`${contributions[0].date}T00:00:00Z`).getUTCDay();
  const days: (ContributionDay | null)[] = [
    ...Array.from({ length: firstDay }, () => null),
    ...contributions,
  ];
  while (days.length % 7 !== 0) days.push(null);

  const weeks = Array.from({ length: days.length / 7 }, (_, weekIndex) =>
    days.slice(weekIndex * 7, weekIndex * 7 + 7),
  );
  const monthLabels = new Map<number, string>();
  const seenMonths = new Set<string>();
  contributions.forEach((day, index) => {
    const date = new Date(`${day.date}T00:00:00Z`);
    const weekIndex = Math.floor((firstDay + index) / 7);
    const monthKey = `${date.getUTCFullYear()}-${date.getUTCMonth()}`;
    if (!seenMonths.has(monthKey)) {
      monthLabels.set(weekIndex, date.toLocaleDateString(undefined, { month: 'short', timeZone: 'UTC' }));
      seenMonths.add(monthKey);
    }
  });

  return (
    <div className="overflow-x-auto">
      <div className="flex w-max gap-2">
        <div
          aria-hidden="true"
          className="grid shrink-0 gap-1 text-[9px] leading-[10px] text-[var(--muted)]"
          style={{ gridTemplateRows: '12px repeat(7, 10px)' }}
        >
          <span></span>
          <span></span>
          <span>Mon</span>
          <span></span>
          <span>Wed</span>
          <span></span>
          <span>Fri</span>
          <span></span>
        </div>
        <div
          role="img"
          aria-label="GitHub contributions for krobbus over the last year"
          className="grid gap-1"
          style={{ gridTemplateColumns: `repeat(${weeks.length}, 10px)`, gridTemplateRows: '12px repeat(7, 10px)' }}
        >
          {[...monthLabels.entries()].map(([weekIndex, label]) => (
              <span
                key={`${weekIndex}-${label}`}
                className="whitespace-nowrap text-[9px] leading-3 text-[var(--muted)]"
                style={{ gridColumn: weekIndex + 1, gridRow: 1 }}
                aria-hidden="true"
              >
                {label}
              </span>
            ))}
          {weeks.flatMap((week, weekIndex) =>
            week.map((day, dayIndex) => {
              const cellStyle = {
                gridColumn: weekIndex + 1,
                gridRow: dayIndex + 2,
              };
              if (!day) {
                return <span key={`empty-${weekIndex}-${dayIndex}`} style={cellStyle} aria-hidden="true" />;
              }

              const date = new Date(`${day.date}T00:00:00Z`).toLocaleDateString(undefined, {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                timeZone: 'UTC',
              });
              const countText = `${day.count} contribution${day.count === 1 ? '' : 's'} on ${date}`;

              return (
                <span
                  key={day.date}
                  title={countText}
                  className="size-2.5 rounded-[2px] border"
                  style={{
                    ...cellStyle,
                    backgroundColor:
                      day.count === 0
                        ? 'color-mix(in srgb, var(--fg) 16%, var(--bg))'
                        : `var(--contribution-${day.level}, var(--contribution-1))`,
                    borderColor: 'color-mix(in srgb, var(--fg) 12%, var(--bg))',
                  }}
                  aria-hidden="true"
                />
              );
            }),
          )}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <article className="space-y-10">
      <header className="space-y-3">
        <p className="font-sans text-sm text-[var(--muted)]">Laguna, Philippines</p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
          ALEF JUSTIN LORESCA
        </h1>

        <p className="font-sans text-xl text-[var(--muted)]">
          AI Full Stack Developer, where I enjoy turning complex projects into intuitive and customer-focused experience.
        </p>
      </header>

      <p className="font-sans">
        I build modern web applications with React, TypeScript, Express.js, Tailwind CSS, PostgreSQL and MongoDB.
        This site collects a short introduction, the stack I work with, selected projects and certifications.
      </p>

      <section
        aria-label="Quick stats"
        className="grid grid-cols-3 border-y border-[var(--border)] py-5"
      >
        <div className="space-y-1 px-2 text-center sm:px-4">
          <p className="font-sans text-3xl font-bold">{projects.length}</p>
          <p className="text-xs uppercase tracking-wider text-[var(--muted)]">Created Projects</p>
        </div>

        <div className="space-y-1 px-2 text-center sm:px-4">
          <p className="font-sans text-3xl font-bold">{certifications.length}</p>
          <p className="text-xs uppercase tracking-wider text-[var(--muted)]">Earned Certificates</p>
        </div>

        <div className="space-y-1 px-2 text-center sm:px-4">
          <p className="font-sans text-3xl font-bold">1-2</p>
          <p className="text-xs uppercase tracking-wider text-[var(--muted)]">Cups of coffee / day</p>
        </div>

        <div className="col-span-3 mt-5 border-t border-[var(--border)] pt-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-wider text-[var(--muted)]">
              GitHub Contributions
            </p>
            <a
              href="https://github.com/krobbus"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
            >
              View profile
            </a>
          </div>

          <ContributionCalendar />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-xl font-semibold border-b border-[var(--border)] pb-2">
          CONTENTS
        </h2>

        <ul className="divide-y divide-[var(--border)] text-[var(--muted)] ">
          <li>
            <Link to="/about" className="group flex items-center justify-between py-3 duration-400 hover:px-4 hover:bg-[var(--muted)]/20">
              <span className="transition-colors duration-200 group-hover:text-[var(--fg)] group-focus-visible:text-[var(--fg)]">
                About me and my tech stack
              </span>
              <i className="fa-solid fa-arrow-right text-sm transition-colors duration-200 group-hover:text-[var(--fg)] group-focus-visible:text-[var(--fg)]"></i>
            </Link>
          </li>

          <li>
            <Link to="/projects" className="group flex items-center justify-between py-3 duration-400 hover:px-4 hover:bg-[var(--muted)]/20">
              <span className="transition-colors duration-200 group-hover:text-[var(--fg)] group-focus-visible:text-[var(--fg)]">
                Selected projects
              </span>
              <i className="fa-solid fa-arrow-right text-sm transition-colors duration-200 group-hover:text-[var(--fg)] group-focus-visible:text-[var(--fg)]"></i>
            </Link>
          </li>

          <li>
            <Link to="/certifications" className="group flex items-center justify-between py-3 duration-400 hover:px-4 hover:bg-[var(--muted)]/20">
              <span className="transition-colors duration-200 group-hover:text-[var(--fg)] group-focus-visible:text-[var(--fg)]">
                Certifications
              </span>
              <i className="fa-solid fa-arrow-right text-sm transition-colors duration-200 group-hover:text-[var(--fg)] group-focus-visible:text-[var(--fg)]"></i>
            </Link>
          </li>

          <li>
            <Link to="/contact" className="group flex items-center justify-between py-3 duration-400 hover:px-4 hover:bg-[var(--muted)]/20">
              <span className="transition-colors duration-200 group-hover:text-[var(--fg)] group-focus-visible:text-[var(--fg)]">
                Get in touch
              </span>
              <i className="fa-solid fa-arrow-right text-sm transition-colors duration-200 group-hover:text-[var(--fg)] group-focus-visible:text-[var(--fg)]"></i>
            </Link>
          </li>
        </ul>
      </section>
    </article>
  );
}
