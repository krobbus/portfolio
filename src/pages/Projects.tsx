import { projects } from '../constants/ProjectRef';
import CustomScrollbar from '../CustomScrollbar';
import LoadingImage from '../LoadingImage';
import { useEffect, useId, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';

type ProjectSlide = {
  src: string;
  caption: string;
};

function ProjectMedia({ title, slides }: { title: string; slides: ProjectSlide[] }) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const titleId = useId();
  const galleryTrackId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const galleryButtonRef = useRef<HTMLButtonElement>(null);
  const galleryDialogScrollRef = useRef<HTMLDivElement>(null);
  const galleryTrackRef = useRef<HTMLDivElement>(null);
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const scrollbarThumbRef = useRef<HTMLSpanElement>(null);
  const scrollbarDragRef = useRef<{ pointerId: number; offset: number } | null>(null);
  const dragRef = useRef<{ pointerId: number; startX: number; scrollLeft: number } | null>(null);
  const [scrollbar, setScrollbar] = useState({
    thumbPercent: 100,
    progress: 0,
    slideProgress: [] as number[],
  });
  const [hoveredSlide, setHoveredSlide] = useState<number | null>(null);
  const currentSlide = slides[0];

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;

    const track = galleryTrackRef.current;
    if (!track) return;

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      scrollLeft: track.scrollLeft,
    };
    track.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const track = galleryTrackRef.current;
    if (!drag || !track || drag.pointerId !== event.pointerId) return;

    track.scrollLeft = drag.scrollLeft - (event.clientX - drag.startX);
  };

  const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;

    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const updateScrollbar = () => {
    const track = galleryTrackRef.current;
    if (!track) return;

    const maxScroll = track.scrollWidth - track.clientWidth;
    const slideProgress = Array.from(track.querySelectorAll<HTMLElement>('[data-gallery-slide]'))
      .map((slide) => {
        const slideOffset = slide.getBoundingClientRect().left
          - track.getBoundingClientRect().left
          + track.scrollLeft;
        return maxScroll > 0 ? Math.min(1, slideOffset / maxScroll) : 0;
      });

    setScrollbar({
      thumbPercent: maxScroll > 0 ? (track.clientWidth / track.scrollWidth) * 100 : 100,
      progress: maxScroll > 0 ? track.scrollLeft / maxScroll : 0,
      slideProgress,
    });
  };

  const scrollFromScrollbar = (clientX: number, offset = 0, behavior: ScrollBehavior = 'instant') => {
    const track = galleryTrackRef.current;
    const scrollbarElement = scrollbarRef.current;
    if (!track || !scrollbarElement) return;

    const bounds = scrollbarElement.getBoundingClientRect();
    const thumbWidth = (scrollbar.thumbPercent / 100) * bounds.width;
    const availableWidth = bounds.width - thumbWidth;
    const progress = availableWidth > 0
      ? Math.min(1, Math.max(0, (clientX - bounds.left - offset) / availableWidth))
      : 0;
    track.scrollTo({
      left: progress * (track.scrollWidth - track.clientWidth),
      behavior,
    });
  };

  const handleScrollbarPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;

    if (event.target instanceof Element && event.target.closest('[data-gallery-bookmark]')) return;

    const thumb = scrollbarThumbRef.current;
    const thumbBounds = thumb?.getBoundingClientRect();
    const clickedThumb = event.target instanceof Element
      && Boolean(thumb?.contains(event.target))
      && thumbBounds;

    if (clickedThumb) {
      scrollbarDragRef.current = {
        pointerId: event.pointerId,
        offset: event.clientX - thumbBounds.left,
      };
      event.currentTarget.setPointerCapture(event.pointerId);
      return;
    }

    scrollFromScrollbar(event.clientX, (thumbBounds?.width ?? 0) / 2, 'smooth');
  };

  const handleScrollbarPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = scrollbarDragRef.current;
    if (drag?.pointerId === event.pointerId && event.currentTarget.hasPointerCapture(event.pointerId)) {
      scrollFromScrollbar(event.clientX, drag.offset);
    }
  };

  const handleScrollbarPointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (scrollbarDragRef.current?.pointerId !== event.pointerId) return;

    scrollbarDragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const scrollToSlide = (index: number) => {
    const track = galleryTrackRef.current;
    const slide = track?.querySelectorAll<HTMLElement>('[data-gallery-slide]')[index];
    if (!track || !slide) return;

    const slideOffset = slide.getBoundingClientRect().left
      - track.getBoundingClientRect().left
      + track.scrollLeft;
    track.scrollTo({
      left: Math.min(slideOffset, track.scrollWidth - track.clientWidth),
      behavior: 'smooth',
    });
  };

  const handleScrollbarKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const track = galleryTrackRef.current;
    if (!track) return;

    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      track.scrollBy({ left: event.key === 'ArrowLeft' ? -120 : 120 });
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      track.scrollLeft = event.key === 'Home' ? 0 : track.scrollWidth;
    }
  };

  useEffect(() => {
    if (!isGalleryOpen) return;

    const previousOverflow = document.body.style.overflow;
    const galleryButton = galleryButtonRef.current;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsGalleryOpen(false);
    };

    document.body.style.overflow = 'hidden';
    document.body.classList.add('gallery-open');
    window.addEventListener('keydown', handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove('gallery-open');
      window.removeEventListener('keydown', handleKeyDown);
      galleryButton?.focus();
    };
  }, [isGalleryOpen]);

  useEffect(() => {
    if (!isGalleryOpen) return;

    const track = galleryTrackRef.current;
    if (!track) return;

    updateScrollbar();
    track.addEventListener('scroll', updateScrollbar, { passive: true });
    const resizeObserver = new ResizeObserver(updateScrollbar);
    resizeObserver.observe(track);

    return () => {
      track.removeEventListener('scroll', updateScrollbar);
      resizeObserver.disconnect();
    };
  }, [isGalleryOpen]);

  return (
    <figure>
      <div className="flex flex-col gap-2">
        <button
          ref={galleryButtonRef}
          type="button"
          onClick={() => setIsGalleryOpen(true)}
          aria-haspopup="dialog"
          aria-label={`Open ${title} image gallery, ${slides.length} images`}
          className="group relative block w-full min-w-0 aspect-video border border-[var(--border)] bg-black text-left"
        >
          <span className="absolute right-3 top-3 z-10 rounded bg-black/70 px-2 py-1 font-sans text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            View all {slides.length} images
          </span>
          
          <LoadingImage
            src={currentSlide.src}
            alt={currentSlide.caption}
            className="block w-full h-full object-contain"
            wrapperClassName="block w-full h-full"
          />
        </button>

        <figcaption className="flex items-center justify-between gap-3 font-sans text-xs sm:text-sm text-[var(--muted)]">
          <span>{currentSlide.caption}</span>

          <span className="shrink-0 font-mono text-xs">1 / {slides.length}</span>
        </figcaption>
      </div>

      {isGalleryOpen && (
        <div
          ref={galleryDialogScrollRef}
          className="fixed inset-0 z-[100] overflow-y-auto bg-black/90 p-4 sm:p-8"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsGalleryOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="mx-auto max-w-6xl space-y-6 text-white"
          >
            <header className="sticky top-0 z-10 flex items-center justify-between gap-4 bg-black/95 py-3">
              <h2 id={titleId} className="font-serif text-xl font-semibold sm:text-2xl">
                {title} Gallery
              </h2>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setIsGalleryOpen(false)}
                aria-label="Close image gallery"
                className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/40 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                <i className="fa-solid fa-xmark" aria-hidden="true"></i>
              </button>
            </header>

            <div
              ref={galleryTrackRef}
              role="region"
              aria-label={`${title} images; drag horizontally to browse`}
              tabIndex={0}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerEnd}
              onPointerCancel={handlePointerEnd}
              onDragStart={(event) => event.preventDefault()}
              data-custom-grab
              id={galleryTrackId}
              className="gallery-track flex gap-5 overflow-x-auto overscroll-x-contain pb-3 touch-pan-x select-none"
            >
              {slides.map((slide, index) => (
                <figure
                  key={slide.src}
                  data-gallery-slide
                  className="w-[min(85vw,48rem)] shrink-0 space-y-2"
                >
                  <div className="aspect-video border border-white/20 bg-black">
                    <LoadingImage
                      src={slide.src}
                      alt={slide.caption}
                      className="block h-full w-full object-contain"
                      wrapperClassName="block h-full w-full"
                      draggable={false}
                    />
                  </div>

                  <figcaption className="flex items-center justify-between gap-3 text-sm text-white/80">
                    <span>{slide.caption}</span>
                    <span className="shrink-0 font-mono text-xs">
                      {index + 1} / {slides.length}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>

            {scrollbar.thumbPercent < 100 && (
              <div
                ref={scrollbarRef}
                role="scrollbar"
                aria-label={`${title} gallery horizontal scroll`}
                aria-controls={galleryTrackId}
                aria-orientation="horizontal"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(scrollbar.progress * 100)}
                tabIndex={0}
                data-custom-grab
                onPointerDown={handleScrollbarPointerDown}
                onPointerMove={handleScrollbarPointerMove}
                onPointerUp={handleScrollbarPointerEnd}
                onPointerCancel={handleScrollbarPointerEnd}
                onKeyDown={handleScrollbarKeyDown}
                className="relative mx-auto h-5 w-full max-w-2xl touch-none cursor-none"
              >
                <span className="absolute inset-x-0 top-2 h-1 rounded-full bg-white/20" />
                <span
                  ref={scrollbarThumbRef}
                  data-custom-grab
                  className="absolute top-2 size-3 -translate-y-1/2 rounded-full bg-white/80 transition-colors hover:bg-white"
                  style={{
                    left: `calc(${scrollbar.progress * 100}% - ${scrollbar.progress * 12}px)`,
                  }}
                />
                {scrollbar.slideProgress.map((progress, index) => (
                  <button
                    key={slides[index].src}
                    type="button"
                    data-gallery-bookmark
                    aria-label={`Scroll to ${slides[index].caption}`}
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={() => scrollToSlide(index)}
                    onPointerEnter={() => setHoveredSlide(index)}
                    onPointerLeave={() => setHoveredSlide(null)}
                    onFocus={() => setHoveredSlide(index)}
                    onBlur={() => setHoveredSlide(null)}
                    className="group absolute inset-y-0 z-10 w-3 -translate-x-1/2 cursor-none"
                    style={{ left: `calc(${progress * 100}% - ${progress * 12}px + 6px)` }}
                  >
                    <span className="absolute left-1/2 top-1/2 h-3 w-px -translate-x-1/2 -translate-y-1/2 bg-white/60 transition-all group-hover:w-0.5 group-hover:bg-white" />
                    {hoveredSlide === index && (
                      <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-48 -translate-x-1/2 overflow-hidden rounded border border-white/20 bg-black text-white shadow-xl">
                        <img
                          src={slides[index].src}
                          alt=""
                          className="aspect-video w-full object-cover"
                        />
                        <span className="block px-3 py-2 text-left font-sans text-xs">
                          {slides[index].caption}
                        </span>
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </section>

          <CustomScrollbar
            targetRef={galleryDialogScrollRef}
            label={`${title} gallery vertical scroll`}
          />
        </div>
      )}
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
        <section
          key={project.id}
          data-scroll-bookmark={project.title}
          data-scroll-bookmark-image={project.slides[0]?.src}
          className="space-y-4 border-t border-[var(--border)] pt-8"
        >
          <header className="space-y-1">
            <p className="font-sans text-xs uppercase tracking-wider">{project.id}</p>
            {project.link ? (
              <div className="flex justify-between items-center gap-4">
                <h2 className="font-serif text-2xl font-semibold leading-snug">{project.title}</h2>

                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[var(--muted)] cursor-pointer"
                >
                  <span className="font-sans text-sm">View Live</span>
                  <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
                </a>
              </div>
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

          <ProjectMedia title={project.title} slides={project.slides} />

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
