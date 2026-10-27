import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import LoadingImage from '../components/LoadingImage';
import ProjectMedia from '../components/ProjectMedia';
import { projectList, projectPath, type ProjectEntry } from '../constants/ProjectRoutes';

function ProjectList() {
  return (
    <article className="space-y-12">
      <header className="space-y-3">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">PROJECTS</h1>
        <p className="text-[var(--muted)]">A selection of things I've built.</p>
      </header>

      {projectList.map((project) => {
        const path = projectPath(project);

        return (
          <section
            key={project.id}
            data-scroll-bookmark={project.title}
            data-scroll-bookmark-image={project.slides[0]?.src}
            className="border-t border-[var(--border)] pt-8"
          >
            <div className="flex items-start gap-4 sm:gap-6">
              <Link
                to={path}
                aria-label={`View details: ${project.title}`}
                className="group block aspect-[4/3] w-32 shrink-0 overflow-hidden border border-[var(--border)] bg-black sm:w-56"
              >
                <LoadingImage
                  src={project.slides[0].src}
                  alt={project.slides[0].caption}
                  className="block h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  wrapperClassName="block h-full w-full"
                />
              </Link>

              <div className="min-w-0 flex-1 space-y-2">
                <p className="font-sans text-xs uppercase tracking-wider">{project.id}</p>

                <h2 className="font-serif text-lg font-semibold leading-snug sm:text-2xl">
                  <Link to={path} className="duration-200 hover:text-[var(--muted)]">
                    {project.title}
                  </Link>
                </h2>

                <p className="font-sans text-xs uppercase tracking-wider text-[var(--muted)]">
                  {project.description}
                </p>

                <p className="line-clamp-3 text-sm text-[var(--muted)] sm:line-clamp-4 sm:text-base">
                  {project.summary}
                </p>

                <Link
                  to={path}
                  className="group inline-flex items-center gap-2 pt-1 font-sans text-sm underline-offset-4 duration-200 hover:text-[var(--muted)] hover:underline"
                >
                  View details
                  <i
                    className="fa-solid fa-chevron-right text-xs transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  ></i>
                </Link>
              </div>
            </div>
          </section>
        );
      })}
    </article>
  );
}

function ProjectDetail({ project }: { project: ProjectEntry }) {
  return (
    <article className="space-y-8">
      <Link
        to="/projects"
        className="group inline-flex items-center gap-2 font-sans text-sm text-[var(--muted)] duration-200 hover:text-[var(--fg)]"
      >
        <i
          className="fa-solid fa-chevron-left text-xs transition-transform duration-200 group-hover:-translate-x-0.5"
          aria-hidden="true"
        ></i>
        All projects
      </Link>

      <section data-scroll-bookmark={project.title} className="space-y-4">
        <header className="space-y-1">
          <p className="font-sans text-xs uppercase tracking-wider">{project.id}</p>

          {project.link ? (
            <div className="flex items-center justify-between gap-4">
              <h1 className="font-serif text-3xl font-bold leading-snug sm:text-4xl">{project.title}</h1>

              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex shrink-0 items-center gap-2 hover:text-[var(--muted)]"
              >
                <span className="font-sans text-sm">View Live</span>
                <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
              </a>
            </div>
          ) : (
            <h1 className="font-serif text-3xl font-bold leading-snug sm:text-4xl">{project.title}</h1>
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

        <ProjectMedia key={project.id} title={project.title} slides={project.slides} />

        <ul className="list-disc space-y-4 pl-5 text-justify marker:text-[var(--muted)]">
          {project.points.map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      </section>
    </article>
  );
}

function ProjectNotFound() {
  return (
    <article className="space-y-4">
      <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">PROJECT NOT FOUND</h1>
      <p className="text-[var(--muted)]">We couldn't find a project with that ID.</p>
      <Link to="/projects" className="inline-block underline underline-offset-4">
        Back to all projects
      </Link>
    </article>
  );
}

export default function Projects() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const project = id ? projectList.find((item) => String(item.num) === id) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (!project) return;

    const previousTitle = document.title;
    document.title = `${project.name} | Alef Justin Loresca`;
    return () => {
      document.title = previousTitle;
    };
  }, [project]);

  if (id && !project) return <ProjectNotFound />;
  return project ? <ProjectDetail project={project} /> : <ProjectList />;
}