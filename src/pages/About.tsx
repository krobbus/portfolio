import { Link } from 'react-router-dom';

const stack = [
  {
    title: 'Frontend',
    items: ['HTML5', 'CSS3/SASS', 'JavaScript', 'Phaser.js', 'React', 'React Hooks', 'React Router', 'TypeScript', 'Tailwind CSS', 'Vite'],
  },
  {
    title: 'Backend and databases',
    items: ['Python/Scripting', 'Node.js', 'Express.js', 'PostgreSQL', 'MySQL', 'MariaDB', 'Firebase', 'Neon'],
  },
  {
    title: 'APIs and LLMs',
    items: ['Gemini API', 'Stripe API', 'RESTful API design', 'Google Gemini', 'Claude', 'GitHub Copilot'],
  },
  {
    title: 'DevOps and tools',
    items: ['Git/Github', 'Github Actions', 'Vercel', 'Render', 'CronJob', 'Prettier', 'Notion'],
  },
];

export default function About() {
  return (
    <article className="space-y-10">
      <header className="space-y-3">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">ABOUT</h1>
      </header>

      <section className="flow-root space-y-4">
        <img
          src="/profile.png"
          alt="Alef Justin Loresca"
          className="float-right ml-5 w-42 sm:w-56 aspect-square object-cover grayscale duration-600 hover:filter-none"
          draggable="false"
        />

        <p className="text-justify">
          I'm a Full Stack Web Developer who enjoys turning ideas into interfaces people actually want to use.
          My focus is on modern web development (React, TypeScript, Express.js, Tailwind CSS, PostgreSQL, and MongoDB)
          with a growing interest in how good architecture makes everything downstream easier.
        </p>

        <p className="text-justify">
          I care about the details: readable code, thoughtful UI, and building things that feel solid, not just functional.
          I bring genuine curiosity to every project, a habit of digging until I actually understand why something works,
          and a steady drive to keep leveling up my craft.
        </p>

        <p className="text-justify">
          Outside of writing code, I'm usually exploring new tech tools and finding clever ways to optimize processes and boost productivity.
        </p>

        <p className="italic text-justify text-[var(--muted)]">
          If you're looking for someone eager to learn, easy to work with, and serious about doing good work,{' '}
          <Link to="/contact" className="inline-flex underline underline-offset-4 text-[var(--fg)] duration-200 hover:text-[var(--muted)]">let's connect</Link>.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="font-serif text-xl font-semibold border-b border-[var(--border)] pb-2">TECH STACK</h2>

        {stack.map((group) => (
          <div key={group.title} className="space-y-2">
            <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
              {group.title}
            </h3>

            <div className="flex flex-wrap gap-2 px-4">
              {group.items.map((item, index) => (
                <span
                  key={item}
                  className="inline-flex items-center rounded-[0.7rem] border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 text-sm text-[var(--fg)] shadow-sm transition-transform duration-200 hover:-translate-y-0.5"
                  style={{
                    transform: `rotate(${index % 2 === 0 ? -2 : 2}deg)`,
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </section>
    </article>
  );
}
