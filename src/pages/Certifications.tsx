const certSlides = [
  {
    details: "Code The Future: Exploring Software Development, Programming, and Innovation, 2026",
    link: "https://drive.google.com/file/d/1d1ZLO98ntElEMdH-Q93Gt06jHDgsuJvJ/view?usp=sharing",
  },
  {
    details: "FreeCodeCamp's Front End Development Libraries Certificate, 2026",
    link: "https://www.freecodecamp.org/certification/alefjustinloresca/front-end-development-libraries-v9",
  },
  {
    details: "FreeCodeCamp's Back End Development and APIs Certificate, 2026",
    link: "https://www.freecodecamp.org/certification/alefjustinloresca/back-end-development-and-apis-v9",
  },
  {
    details: "Internship at Bureau Of Corrections' Certificate of Completion, 2025",
    link: "https://drive.google.com/file/d/1-_pMGBcjLxFt7o1CxfqXiZ09Na2II29l/view?usp=sharing",
  },
  {
    details: "Great Learning's Front End Development Certificate, 2024",
    link: "https://drive.google.com/file/d/1cGM2yv7Avcbec8Qsy3EBn5Bs0i518153/view?usp=sharing",
  },
];

export default function Certifications() {
  return (
    <article className="space-y-12">
      <header className="space-y-3">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">CERTIFICATIONS</h1>
      </header>

      {certSlides.map((slide) => (
        <a
          key={slide.details}
          href={slide.link}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex w-full items-center justify-between gap-4 border-b border-[var(--border)] py-2 font-sans text-sm text-[var(--muted)] transition-colors duration-200 hover:text-[var(--fg)] focus-visible:text-[var(--fg)]"
        >
          <span className="transition-colors duration-200 group-hover:text-[var(--fg)] group-focus-visible:text-[var(--fg)]">
            {slide.details}
          </span>
          <i
            className="fa-solid fa-arrow-up-right-from-square shrink-0 transition-colors duration-200 group-hover:text-[var(--fg)] group-focus-visible:text-[var(--fg)]"
            aria-hidden="true"
          ></i>
        </a>
      ))}
    </article>
  );
}
