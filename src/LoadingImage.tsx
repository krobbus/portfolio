import { useState } from 'react';

type LoadingImageProps = {
  src: string;
  alt: string;
  className: string;
  wrapperClassName?: string;
  draggable?: boolean;
};

export default function LoadingImage({
  src,
  alt,
  className,
  wrapperClassName = '',
  draggable,
}: LoadingImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <span className={`relative isolate inline-block overflow-hidden ${wrapperClassName}`}>
      <img
        src={src}
        alt={alt}
        className={`${className} transition-opacity duration-200 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        draggable={draggable}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
      {!loaded && (
        <span role="status" className="absolute inset-0 flex items-center justify-center">
          <span className="sr-only">Loading image...</span>
          <span
            aria-hidden="true"
            className="size-8 animate-spin rounded-full border-2 border-[var(--muted)] border-t-[var(--fg)] motion-reduce:animate-none"
          />
        </span>
      )}
    </span>
  );
}
