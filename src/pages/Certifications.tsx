import { certifications } from '../CertificationRef';

export default function Certifications() {
  return (
    <article className="space-y-12">
      <header className="space-y-3">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">CERTIFICATIONS</h1>
      </header>

      {certifications.map((slide) => (
        <a
          key={slide.details}
          href={slide.link}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex w-full items-center justify-between gap-6 border-b border-[var(--border)] py-6 font-sans text-sm text-[var(--muted)] duration-400 hover:px-4 hover:bg-[var(--muted)]/20 hover:text-[var(--fg)] focus-visible:text-[var(--fg)]"
        >
          <span className="transition-colors group-hover:text-[var(--fg)] group-focus-visible:text-[var(--fg)]">
            {slide.details}
          </span>
          <i
            className="fa-solid fa-arrow-up-right-from-square shrink-0 transition-colors group-hover:text-[var(--fg)] group-focus-visible:text-[var(--fg)]"
            aria-hidden="true"
          ></i>
        </a>
      ))}
    </article>
  );
}
