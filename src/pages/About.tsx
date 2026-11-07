import LoadingImage from '../components/LoadingImage';
import { Link } from 'react-router-dom';

const interests = [
  { label: 'Like to play chess', icon: 'fa-chess-knight', position: 'top-2 right-[88%]', delay: '0s' },
  { label: 'Love listening to music', icon: 'fa-music', position: 'top-[32%] right-[96%]', delay: '-1.4s' },
  { label: 'Like to draw and sketch faces', icon: 'fa-pencil', position: 'top-[62%] right-[84%]', delay: '-2.6s' },
];

const stack = [
  {
    title: 'Frontend',
    items: ['HTML5', 'CSS3/SASS', 'JavaScript', 'Phaser.js', 'React', 'React Hooks', 'React Router', 'TypeScript', 'Tailwind CSS', 'Vite'],
  },
  {
    title: 'Backend and databases',
    items: ['C# / C++', 'Java', 'Python', 'Node.js', 'Express.js', 'PostgreSQL', 'MySQL', 'MariaDB', 'Firebase', 'Neon'],
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

const floatStyles = `
  @keyframes interest-bubble {
    0% { transform: translateY(-5px); }
    100% { transform: translateY(6px); }
  }

  .interest-bubble {
    animation: interest-bubble 3.6s ease-in-out infinite alternate;
  }
    
  @media (prefers-reduced-motion: reduce) {
    .interest-bubble { animation: none; }
  }
`;

function InterestBubbles() {
  return (
    <>
      {interests.map((interest) => (
        <span
          key={interest.label}
          aria-hidden="true"
          className={`pointer-events-none absolute z-20 translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:translate-x-0 group-focus-within:opacity-100 ${interest.position}`}
        >
          <span
            className="invert relative flex items-center gap-2 whitespace-nowrap rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 font-sans text-xs text-[var(--fg)] shadow-lg"
            style={{ animationDelay: interest.delay }}
          >
            <i className={`fa-solid ${interest.icon} text-[var(--muted)]`}></i>
            {interest.label}
          </span>
        </span>
      ))}
    </>
  );
}

export default function About() {
  return (
    <article className="space-y-10">
      <header className="space-y-3">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">ABOUT</h1>
      </header>

      <section className="flow-root space-y-4">
        <style>{floatStyles}</style>

        <div className="float-right mb-3 ml-5 w-38 space-y-4 sm:w-48">
          <div className="group relative" tabIndex={0} aria-label="Alef Justin Loresca, hover to see interests">
            <LoadingImage
              src="/profile.png"
              alt="Alef Justin Loresca"
              wrapperClassName="w-full aspect-square"
              className="block w-full h-full rounded-full object-cover duration-200 group-hover:filter-none"
              draggable={false}
            />
            <InterestBubbles />
          </div>
        </div>

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

        <p className="italic text-center text-[var(--muted)]">
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