import { Link } from 'react-router-dom';

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

      <section className="space-y-3">
        <h2 className="font-serif text-lg font-bold uppercase tracking-wider text-[var(--muted)]">
          Contents
        </h2>

        <ul className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
          <li>
            <Link to="/about" className="flex items-center justify-between py-3 hover:underline underline-offset-4">
              <span>About me and my tech stack</span>
              <i className="fa-solid fa-arrow-right text-sm text-[var(--muted)]"></i>
            </Link>
          </li>
          <li>
            <Link to="/projects" className="flex items-center justify-between py-3 hover:underline underline-offset-4">
              <span>Selected projects</span>
              <i className="fa-solid fa-arrow-right text-sm text-[var(--muted)]"></i>
            </Link>
          </li>
          <li>
            <Link to="/certifications" className="flex items-center justify-between py-3 hover:underline underline-offset-4">
              <span>Certifications</span>
              <i className="fa-solid fa-arrow-right text-sm text-[var(--muted)]"></i>
            </Link>
          </li>
          <li>
            <Link to="/contact" className="flex items-center justify-between py-3 hover:underline underline-offset-4">
              <span>Get in touch</span>
              <i className="fa-solid fa-arrow-right text-sm text-[var(--muted)]"></i>
            </Link>
          </li>
        </ul>
      </section>
    </article>
  );
}
