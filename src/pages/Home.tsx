import { Link } from 'react-router-dom';
import { certifications } from '../constants/CertificationRef';
import { projects } from '../constants/ProjectRef';

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
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-lg font-bold uppercase tracking-wider text-[var(--muted)]">
          Contents
        </h2>

        <ul className="divide-y divide-[var(--border)] border-y border-[var(--border)] text-[var(--muted)] ">
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
