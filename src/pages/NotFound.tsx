import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <article className="space-y-4">
      <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">PAGE NOT FOUND</h1>
      <p className="text-[var(--muted)]">The page you're looking for doesn't exist.</p>
      <Link to="/" className="inline-block underline underline-offset-4">Back to home</Link>
    </article>
  );
}
