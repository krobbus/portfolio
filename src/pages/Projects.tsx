import { projects } from '../constants/ProjectRef';
import LoadingImage from '../LoadingImage';
import { useState } from 'react';

type ProjectSlide = {
  src: string;
  caption: string;
};

function ProjectMedia({ link, slides }: { link: string | null; slides: ProjectSlide[] }) {
  const [slideIndex, setSlideIndex] = useState(0);
  const totalSlides = slides.length;
  const currentSlide = slides[slideIndex];

  const changeSlide = (direction: -1 | 1) => {
    setSlideIndex((index) => (index + direction + totalSlides) % totalSlides);
  };

  return (
    <figure>
      <div className="flex items-center gap-2">
        {totalSlides > 1 && (
          <button
            type="button"
            onClick={() => changeSlide(-1)}
            aria-label="Previous slide"
            className="shrink-0 rounded-full border border-[var(--border)] bg-[var(--bg)] p-2 text-[var(--fg)] transition-colors hover:bg-[var(--muted)]/20 focus-visible:outline-2"
          >
            <i className="fa-solid fa-chevron-left" aria-hidden="true"></i>
          </button>
        )}

        <div className="group relative min-w-0 flex-1 bg-black border border-[var(--border)] aspect-video">
          {link ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View project: ${currentSlide.caption}`}
              className="absolute inset-0 cursor-pointer"
            >
              <LoadingImage
                src={currentSlide.src}
                alt={currentSlide.caption}
                className="block w-full h-full object-contain"
                wrapperClassName="block w-full h-full"
              />
              <span className="absolute inset-0 flex items-start justify-end p-3 transition-opacity duration-200 sm:items-center sm:justify-center sm:bg-black/80 sm:p-0 sm:text-white sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                <span className="flex items-center gap-2 border border-[var(--muted)] bg-[var(--bg)]/90 px-3 py-1.5 text-xs text-[var(--fg)] sm:bg-transparent sm:px-4 sm:py-2 sm:text-sm sm:text-white">
                  View live
                  <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
                </span>
              </span>
            </a>
          ) : (
            <LoadingImage
              src={currentSlide.src}
              alt={currentSlide.caption}
              className="block w-full h-full object-contain"
              wrapperClassName="block w-full h-full"
            />
          )}
          
          <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-black/50 px-3 py-2 font-sans text-xs sm:text-sm text-white">
            <span>{currentSlide.caption}</span>
            <span aria-live="polite" className="shrink-0 font-mono text-xs">
              {slideIndex + 1} / {totalSlides}
            </span>
          </figcaption>
        </div>

        {totalSlides > 1 && (
          <button
            type="button"
            onClick={() => changeSlide(1)}
            aria-label="Next slide"
            className="shrink-0 rounded-full border border-[var(--border)] bg-[var(--bg)] p-2 text-[var(--fg)] transition-colors hover:bg-[var(--muted)]/20 focus-visible:outline-2"
          >
            <i className="fa-solid fa-chevron-right" aria-hidden="true"></i>
          </button>
        )}
      </div>

    </figure>
  );
}

export default function Projects() {
  return (
    <article className="space-y-12">
      <header className="space-y-3">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">PROJECTS</h1>
        <p className="text-[var(--muted)]">A selection of things I've built.</p>
      </header>

      {projects.map((project) => (
        <section key={project.id} className="space-y-4 border-t border-[var(--border)] pt-8">
          <header className="space-y-1">
            <p className="font-sans text-xs uppercase tracking-wider">{project.id}</p>
            {project.link ? (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[var(--muted)] cursor-pointer"
              >
                <h2 className="font-serif text-2xl font-semibold leading-snug">{project.title}</h2>
                <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
              </a>
            ) : (
              <h2 className="font-serif text-2xl font-semibold leading-snug">{project.title}</h2>
            )}

            <p className="font-sans text-xs uppercase tracking-wider text-[var(--muted)]">{project.description}</p>
            <p className="flex flex-wrap items-center gap-2 pt-4 font-sans text-sm text-[var(--muted)]">
              Built with 

              {project.pills.map((pill, index) => (
                <span
                  key={pill}
                  className="inline-flex items-center rounded-[0.7rem] border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 text-xs text-[var(--fg)] shadow-sm transition-transform duration-200 hover:-translate-y-0.5"
                  style={{
                    transform: `rotate(${index % 2 === 0 ? -2 : 2}deg)`,
                  }}
                >
                  {pill}
                </span>
              ))}
            </p>
          </header>

          <ProjectMedia link={project.link} slides={project.slides} />

          <ul className="text-justify list-disc pl-5 space-y-4 marker:text-[var(--muted)]">
            {project.points.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </section>
      ))}
    </article>
  );
}
