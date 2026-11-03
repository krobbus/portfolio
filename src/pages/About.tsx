import { type ChangeEvent, useEffect, useRef, useState } from 'react';
import LoadingImage from '../components/LoadingImage';
import gameHtml from '../components/game.html?raw';
import { Link } from 'react-router-dom';

const interests = [
  { label: 'Like to play chess', icon: 'fa-chess-knight', position: 'top-2 right-[88%]', delay: '0s' },
  { label: 'Love listening to music', icon: 'fa-music', position: 'top-[32%] right-[96%]', delay: '-1.4s' },
  { label: 'Like to draw and sketch faces', icon: 'fa-pencil', position: 'top-[62%] right-[84%]', delay: '-2.6s' },
];

const playlist = [
  { title: 'Sabihin Mo Lang', artist: 'HEY JUNE!', src: '/audio/hey-june-sabihin-mo-lang.mp3' },
  { title: 'Dagat', artist: 'Meryl', src: '/audio/meryl-dagat.mp3' },
  { title: 'Violet', artist: 'Allison Shore', src: '/audio/allison-shore-violet.mp3' },
];

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
            <span className="absolute -right-1 size-2 rotate-45 border-b border-r border-[var(--border)] bg-[var(--bg)]"></span>
          </span>
        </span>
      ))}
    </>
  );
}

function Playlist() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
  }, [playing, index]);

  const step = (direction: number) => {
    setIndex((current) => (current + direction + playlist.length) % playlist.length);
    startPlayback();
  };

  const startPlayback = () => {
    if (volume === 0) setVolume(50);
    setMuted(false);
    setPlaying(true);
  };

  const togglePlayback = () => {
    if (playing) {
      setPlaying(false);
    } else {
      startPlayback();
    }
  };

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextVolume = Number(e.target.value);
    setVolume(nextVolume);
    setMuted(nextVolume === 0);
  };

  const isMuted = muted || volume === 0;
  const volumeIcon = isMuted
    ? 'fa-volume-xmark'
    : volume < 50
      ? 'fa-volume-low'
      : 'fa-volume-high';
  const current = playlist[index];

  const selectTrack = (target: number) => {
    if (target === index) {
      togglePlayback();
      return;
    }
    setIndex(target);
    startPlayback();
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume / 100;
    audio.muted = muted;
  }, [muted, volume]);

  return (
    <section
      aria-label="Playlist"
      className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 font-sans shadow-sm h-fit w-full"
    >
      <audio
        ref={audioRef}
        src={current.src}
        preload="none"
        onEnded={() => step(1)}
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
      />

      <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-widest text-[var(--muted)]">
            {playing ? 'Now playing' : 'Playlist'}
          </p>
          <p className="truncate text-sm font-semibold">{current.title}</p>
          <p className="truncate text-xs text-[var(--muted)]">{current.artist}</p>
        </div>

        <div className="hidden shrink-0 items-center justify-end gap-1 text-[var(--muted)] sm:flex">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous song"
            className="flex size-7 items-center justify-center rounded-full duration-200 hover:text-[var(--fg)]"
          >
            <i className="fa-solid fa-backward-step text-xs" aria-hidden="true"></i>
          </button>

          <button
            type="button"
            onClick={togglePlayback}
            aria-label={playing ? 'Pause' : 'Play'}
            className="flex size-8 items-center justify-center rounded-full bg-[var(--fg)] text-[var(--bg)] duration-200 hover:opacity-80"
          >
            <i className={`fa-solid ${playing ? 'fa-pause' : 'fa-play'} text-xs`} aria-hidden="true"></i>
          </button>

          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next song"
            className="flex size-7 items-center justify-center rounded-full duration-200 hover:text-[var(--fg)]"
          >
            <i className="fa-solid fa-forward-step text-xs" aria-hidden="true"></i>
          </button>

          <div className="ml-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (isMuted && volume === 0) {
                  setVolume(50);
                  setMuted(false);
                } else {
                  setMuted((currentState) => !currentState);
                }
              }}
              aria-pressed={isMuted}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
              className="flex size-7 items-center justify-center rounded-full transition-colors duration-200 hover:text-[var(--fg)]"
            >
              <i className={`fa-solid ${volumeIcon} text-xs`} aria-hidden="true"></i>
            </button>

            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              aria-label="Volume control"
              aria-valuetext={`${volume}%`}
              className="volume-slider w-20 sm:w-24"
              style={{
                background: `linear-gradient(to right, var(--fg) ${volume}%, var(--border) ${volume}%)`,
              }}
            />
          </div>
        </div>
      </div>

      <ul className="my-4 divide-y divide-[var(--border)] border-y border-[var(--border)]">
        {playlist.map((track, trackIndex) => {
          const active = trackIndex === index;
          return (
            <li key={track.src}>
              <button
                type="button"
                onClick={() => selectTrack(trackIndex)}
                aria-current={active}
                className={`flex w-full items-center gap-2 py-2 text-left text-xs duration-200 hover:bg-[var(--muted)]/10 ${
                  active ? 'text-[var(--fg)]' : 'text-[var(--muted)]'
                }`}
              >
                <i
                  className={`fa-solid ${active && playing ? 'fa-pause' : 'fa-play'} w-3 text-[10px]`}
                  aria-hidden="true"
                ></i>
                <span className="min-w-0 flex-1">
                  <span className={`block truncate ${active ? 'font-semibold' : ''}`}>{track.title}</span>
                  <span className="block truncate text-[10px] opacity-80">{track.artist}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="flex shrink-0 items-center justify-center gap-1 text-[var(--muted)] sm:hidden">
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Previous song"
          className="flex size-7 items-center justify-center rounded-full duration-200 hover:text-[var(--fg)]"
        >
          <i className="fa-solid fa-backward-step text-xs" aria-hidden="true"></i>
        </button>

        <button
          type="button"
          onClick={() => setPlaying((currentState) => !currentState)}
          aria-label={playing ? 'Pause' : 'Play'}
          className="flex size-8 items-center justify-center rounded-full bg-[var(--fg)] text-[var(--bg)] duration-200 hover:opacity-80"
        >
          <i className={`fa-solid ${playing ? 'fa-pause' : 'fa-play'} text-xs`} aria-hidden="true"></i>
        </button>

        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Next song"
          className="flex size-7 items-center justify-center rounded-full duration-200 hover:text-[var(--fg)]"
        >
          <i className="fa-solid fa-forward-step text-xs" aria-hidden="true"></i>
        </button>

        <div className="ml-2 flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (isMuted && volume === 0) {
                setVolume(50);
                setMuted(false);
              } else {
                setMuted((currentState) => !currentState);
              }
            }}
            aria-pressed={isMuted}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            className="flex size-7 items-center justify-center rounded-full transition-colors duration-200 hover:text-[var(--fg)]"
          >
            <i className={`fa-solid ${volumeIcon} text-xs`} aria-hidden="true"></i>
          </button>

          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            aria-label="Volume control"
            aria-valuetext={`${volume}%`}
            className="volume-slider w-20 sm:w-24"
            style={{
              background: `linear-gradient(to right, var(--fg) ${volume}%, var(--border) ${volume}%)`,
            }}
          />
        </div>
      </div>
    </section>
  );
}

function GameLaunchCard({ onStart }: { onStart: () => void }) {
  return (
    <button
      type="button"
      onClick={onStart}
      className="group flex min-h-40 flex-col items-center justify-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5 text-center font-sans shadow-sm transition-colors duration-200 hover:bg-[var(--muted)]/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg)]"
    >
      <span className="flex size-11 items-center justify-center rounded-full bg-[var(--fg)] text-[var(--bg)] transition-transform duration-200 group-hover:scale-105">
        <i className="fa-solid fa-gamepad" aria-hidden="true"></i>
      </span>
      
      <span>
        <span className="block text-sm font-semibold text-[var(--fg)]">Take a break</span>
        <span className="mt-1 block text-xs text-[var(--muted)]">Play a quick game</span>
      </span>
    </button>
  );
}

export default function About() {
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia('(min-width: 1024px)').matches);

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1024px)');
    const updateDesktopState = (event: MediaQueryListEvent) => {
      setIsDesktop(event.matches);
      if (!event.matches) setIsGameOpen(false);
    };

    desktopQuery.addEventListener('change', updateDesktopState);
    return () => desktopQuery.removeEventListener('change', updateDesktopState);
  }, []);

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

        <p className="italic text-justify text-[var(--muted)]">
          If you're looking for someone eager to learn, easy to work with, and serious about doing good work,{' '}
          <Link to="/contact" className="inline-flex underline underline-offset-4 text-[var(--fg)] duration-200 hover:text-[var(--muted)]">let's connect</Link>.
        </p>
      </section>

      <section className="space-y-3">
        {isGameOpen && isDesktop ? (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setIsGameOpen(false)}
              className="inline-flex items-center gap-2 text-sm text-[var(--muted)] transition-colors hover:text-[var(--fg)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--fg)]"
            >
              <i className="fa-solid fa-arrow-left" aria-hidden="true"></i>
              Back to music
            </button>

            <iframe
              title="Coin collector game"
              data-custom-cursor-frame
              srcDoc={gameHtml}
              className="block aspect-[4/3] w-full rounded-xl border border-[var(--border)] bg-[#111]"
            />
          </div>
        ) : (
          <div className="grid items-stretch gap-3 lg:grid-cols-[minmax(0,1fr)_12rem]">
            <Playlist />
            {isDesktop && <GameLaunchCard onStart={() => setIsGameOpen(true)} />}
          </div>
        )}
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