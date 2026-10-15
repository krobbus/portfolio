import { projects } from '../ProjectRef';
import LoadingImage from '../LoadingImage';

function ProjectMedia({ link, src, caption }: { link: string | null; src: string; caption: string }) {
  return (
    <figure className="space-y-2">
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View project: ${caption}`}
          className="bg-black group relative block border border-[var(--border)] aspect-video cursor-pointer"
        >
          <LoadingImage
            src={src}
            alt={caption}
            className="block w-full h-full object-contain"
            wrapperClassName="block w-full h-full"
          />
          <span className="absolute inset-0 flex items-end justify-end p-3 transition-opacity duration-200 sm:items-center sm:justify-center sm:bg-black/80 sm:p-0 sm:text-white sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100">
            <span className="flex items-center gap-2 border border-[var(--muted)] bg-[var(--bg)]/90 px-3 py-1.5 text-xs text-[var(--fg)] sm:bg-transparent sm:px-4 sm:py-2 sm:text-sm sm:text-white">
              View live
              <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
            </span>
          </span>
        </a>
      ) : (
        <div className="bg-black border border-[var(--border)] aspect-video relative">
          <LoadingImage
            src={src}
            alt={caption}
            className="block w-full h-full object-contain"
            wrapperClassName="block w-full h-full"
          />
        </div>
      )}

      <figcaption className="font-sans text-sm text-[var(--muted)]">
        {caption}
      </figcaption>
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
            <h2 className="font-serif text-2xl font-semibold leading-snug">{project.title}</h2>

            <p className="font-sans text-xs uppercase tracking-wider text-[var(--muted)]">{project.description}</p>
            <p className="flex flex-wrap items-center gap-2 pt-2 font-sans text-sm text-[var(--muted)]">
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

          <ProjectMedia link={project.link} src={project.src} caption={project.caption} />

          <ul className="list-disc pl-5 space-y-2 marker:text-[var(--muted)]">
            {project.points.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </section>
      ))}
    </article>
  );
}
