import { useEffect, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

const subjectOptions = [
  { value: 'JUST SAYING HI', label: 'Just wanted to say hi!' },
  { value: "I'D LIKE TO ASK A QUESTION", label: "I'd like to ask a question" },
  { value: "I'D LIKE TO SET A MEETING", label: "I'd like to set a meeting" },
  { value: "I'D LIKE TO MAKE A PROPOSAL", label: "I'd like to make a proposal" },
];

function SubjectDropdown({
  value,
  onChange,
  buttonRef,
  hasError,
}: {
  value: string;
  onChange: (value: string) => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  hasError: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(0, subjectOptions.findIndex((option) => option.value === value))
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOption = subjectOptions.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return;

    const handleOutsidePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !dropdownRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('pointerdown', handleOutsidePointerDown);
    return () => document.removeEventListener('pointerdown', handleOutsidePointerDown);
  }, [open]);

  const selectOption = (index: number) => {
    const option = subjectOptions[index];
    if (!option) return;
    onChange(option.value);
    setActiveIndex(index);
    setOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      if (!open) {
        setActiveIndex(Math.max(0, subjectOptions.findIndex((option) => option.value === value)));
        setOpen(true);
      } else {
        setActiveIndex((index) => (index + direction + subjectOptions.length) % subjectOptions.length);
      }
      return;
    }

    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      setOpen(true);
      setActiveIndex(event.key === 'Home' ? 0 : subjectOptions.length - 1);
      return;
    }

    if (event.key === 'Escape' && open) {
      event.preventDefault();
      setOpen(false);
      return;
    }

    if ((event.key === 'Enter' || event.key === ' ') && open) {
      event.preventDefault();
      selectOption(activeIndex);
      return;
    }

    if ((event.key === 'Enter' || event.key === ' ') && !open) {
      event.preventDefault();
      setOpen(true);
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        ref={buttonRef}
        id="subjectSelect"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="subjectOptions"
        aria-required="true"
        aria-invalid={hasError}
        aria-describedby={hasError ? 'subjectError' : undefined}
        onClick={() => {
          if (!open) {
            setActiveIndex(Math.max(0, subjectOptions.findIndex((option) => option.value === value)));
          }
          setOpen((current) => !current);
        }}
        onKeyDown={handleKeyDown}
        className="flex w-full items-center justify-between gap-3 bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-left outline-none focus:border-[var(--fg)] cursor-pointer"
      >
        <span className={selectedOption ? 'text-[var(--fg)]' : 'text-[var(--muted)]'}>
          {selectedOption?.label ?? 'Select a subject'}
        </span>
        <i className={`fa-solid fa-chevron-down text-xs transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true"></i>
      </button>

      {open && (
        <div
          id="subjectOptions"
          role="listbox"
          aria-labelledby="subjectSelect"
          className="absolute z-20 mt-1 w-full border border-[var(--border)] bg-[var(--bg)] py-1 shadow-lg"
        >
          {subjectOptions.map((option, index) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={value === option.value}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => selectOption(index)}
              className={`w-full px-3 py-2 text-left text-sm transition-colors cursor-pointer ${
                activeIndex === index
                  ? 'bg-[var(--border)] text-[var(--fg)]'
                  : 'text-[var(--fg)] hover:bg-[var(--border)]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [subjectError, setSubjectError] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const subjectButtonRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject) {
      setSubjectError(true);
      subjectButtonRef.current?.focus();
      return;
    }

    setSending(true);

    try {
      await emailjs.send(
        import.meta.env.VITE_SERVICE_ID,
        import.meta.env.VITE_TEMPLATE_ID,
        { name, email, subject, message },
        import.meta.env.VITE_PUBLIC_KEY
      );
      alert("Message sent! I'll get back to you soon.");
      setName('');
      setEmail('');
      setSubject('');
      setSubjectError(false);
      setMessage('');
    } catch (err) {
      alert(`Something went wrong — please try again. ${err}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <article className="space-y-10">
      <header className="space-y-3">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">CONTACT</h1>
        <p className="text-[var(--muted)]">
          Have a project in mind or want to collaborate? Drop me a message below.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col font-sans space-y-5">
        <div className="space-y-1">
          <label htmlFor="nameInput" className="text-sm text-[var(--muted)]">Name</label>
          <input
            id="nameInput"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-transparent border border-[var(--border)] focus:border-[var(--fg)] px-3 py-2 outline-none"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="emailInput" className="text-sm text-[var(--muted)]">
            Email <span className="text-[var(--required)]">*</span>
          </label>

          <input
            id="emailInput"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-transparent border border-[var(--border)] focus:border-[var(--fg)] px-3 py-2 outline-none"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="subjectSelect" className="text-sm text-[var(--muted)]">
            Subject <span className="text-[var(--required)]">*</span>
          </label>
          <SubjectDropdown
            value={subject}
            onChange={(value) => {
              setSubject(value);
              setSubjectError(false);
            }}
            buttonRef={subjectButtonRef}
            hasError={subjectError}
          />
          {subjectError && (
            <p id="subjectError" className="text-sm text-[var(--required)]" role="alert">
              Please select a subject.
            </p>
          )}
        </div>

        {subject === "I'D LIKE TO SET A MEETING" ? (
          <a
            href="https://calendly.com/lorescajustin/15-minutes-meeting"
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-center items-center gap-2 mt-4 text-md border border-[var(--fg)] bg-[var(--fg)] text-[var(--bg)] px-5 py-2 transition-colors duration-200 hover:bg-[var(--bg)] hover:text-[var(--fg)]"
          >
            <i className="fa-solid fa-calendar"></i>
            Book a time on Calendly
          </a>
        ) : (
          <>
            <div className="space-y-1">
              <label htmlFor="messageInput" className="text-sm text-[var(--muted)]">
                Message <span className="text-[var(--required)]">*</span>
              </label>
              <textarea
                id="messageInput"
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="w-full bg-transparent border border-[var(--border)] focus:border-[var(--fg)] px-3 py-2 outline-none resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="flex justify-center items-center gap-2 text-md border border-[var(--fg)] bg-[var(--fg)] text-[var(--bg)] px-5 py-2 transition-colors duration-200 hover:bg-[var(--bg)] hover:text-[var(--fg)] disabled:opacity-50 cursor-pointer"
            >
              <i className="fa-solid fa-paper-plane"></i>
              {sending ? 'Sending...' : 'Send message'}
            </button>
          </>
        )}
        <span className="text-sm text-[var(--muted)]">Please don’t include passwords and other sensitive information.</span>
      </form>

      <section data-scroll-bookmark="Socials" className="flex flex-col gap-4 space-y-10 border-t border-[var(--border)] pt-8">
        <header className="space-y-3">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">SOCIALS</h1>
        </header>

        <ul className="h-[40dvh] grid grid-cols-1 md:grid-cols-2 items-center gap-4 text-sm">
          <li className="relative border border-[var(--muted)] rounded-md p-4 flex justify-start items-end h-full w-full transition-transform duration-200 hover:-translate-y-0.5 overflow-hidden">
            <a href="https://github.com/krobbus" target="_blank" rel="noopener noreferrer" className="text-[var(--muted)] transition-colors duration-200 hover:text-[var(--fg)]">
              <i className="fa-brands fa-github w-6"></i>GitHub
            </a>
            <span className="absolute bottom-0 md:bottom-4 right-4 md:left-4 text-[var(--muted)] text-lg md:text-6xl font-serif opacity-10">GITHUB</span>
          </li>

          <li className="relative border border-[var(--muted)] rounded-md p-4 flex justify-start items-end h-full w-full transition-transform duration-200 hover:-translate-y-0.5 overflow-hidden">
            <a href="https://www.linkedin.com/in/alefjustinloresca/" target="_blank" rel="noopener noreferrer" className="text-[var(--muted)] transition-colors duration-200 hover:text-[var(--fg)]">
              <i className="fa-brands fa-linkedin w-6"></i>LinkedIn
            </a>
            <span className="absolute bottom-0 md:bottom-4 right-4 md:left-4 text-[var(--muted)] text-lg md:text-6xl font-serif opacity-10">LINKEDIN</span>
          </li>

          <li className="relative border border-[var(--muted)] rounded-md p-4 flex justify-start items-end h-full w-full transition-transform duration-200 hover:-translate-y-0.5 overflow-hidden">
            <a href="https://www.instagram.com/ajloresca/" target="_blank" rel="noopener noreferrer" className="text-[var(--muted)] transition-colors duration-200 hover:text-[var(--fg)]">
              <i className="fa-brands fa-square-instagram w-6"></i>Instagram
            </a>
            <span className="absolute bottom-0 md:bottom-4 right-4 md:left-4 text-[var(--muted)] text-lg md:text-6xl font-serif opacity-10">INSTAGRAM</span>
          </li>
          
          <li className="relative border border-[var(--muted)] rounded-md p-4 flex justify-start items-end h-full w-full transition-transform duration-200 hover:-translate-y-0.5 overflow-hidden">
            <a href="https://m.me/lorescaalef/" target="_blank" rel="noopener noreferrer" className="text-[var(--muted)] transition-colors duration-200 hover:text-[var(--fg)]">
              <i className="fa-brands fa-facebook-messenger w-6"></i>Messenger
            </a>
            <span className="absolute bottom-0 md:bottom-4 right-4 md:left-4 text-[var(--muted)] text-lg md:text-6xl font-serif opacity-10">MESSENGER</span>
          </li>
        </ul>
      </section>
    </article>
  );
}
