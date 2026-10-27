import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type RefObject } from 'react';

type CustomScrollbarProps = {
  label: string;
  targetRef?: RefObject<HTMLElement | null>;
  windowTarget?: boolean;
  className?: string;
};

type ScrollMetrics = {
  progress: number;
  isScrollable: boolean;
};

type Bookmark = {
  id: string;
  label: string;
  image: string | null;
  top: number;
};

export default function CustomScrollbar({
  label,
  targetRef,
  windowTarget = false,
  className = '',
}: CustomScrollbarProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const dragRef = useRef<{ pointerId: number; offset: number } | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [hoveredBookmark, setHoveredBookmark] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<ScrollMetrics>({
    progress: 0,
    isScrollable: false,
  });

  useEffect(() => {
    const element = windowTarget ? null : targetRef?.current;
    if (!windowTarget && !element) return;

    const getMeasurements = () => {
      const clientSize = windowTarget ? window.innerHeight : element!.clientHeight;
      const scrollSize = windowTarget
        ? document.documentElement.scrollHeight
        : element!.scrollHeight;
      const scrollOffset = windowTarget ? window.scrollY : element!.scrollTop;
      const maxScroll = Math.max(0, scrollSize - clientSize);

      setMetrics({
        progress: maxScroll > 0 ? Math.min(1, scrollOffset / maxScroll) : 0,
        isScrollable: maxScroll > 0,
      });
    };

    getMeasurements();
    const scrollTarget = windowTarget ? window : element!;
    scrollTarget.addEventListener('scroll', getMeasurements, { passive: true });
    window.addEventListener('resize', getMeasurements);

    const resizeObserver = new ResizeObserver(getMeasurements);
    resizeObserver.observe(document.documentElement);
    resizeObserver.observe(document.body);
    if (element) resizeObserver.observe(element);

    return () => {
      scrollTarget.removeEventListener('scroll', getMeasurements);
      window.removeEventListener('resize', getMeasurements);
      resizeObserver.disconnect();
    };
  }, [targetRef, windowTarget]);

  useEffect(() => {
    if (!windowTarget) return;

    const updateBookmarks = () => {
      const pageHeight = document.documentElement.scrollHeight;
      const nextBookmarks = Array.from(
        document.querySelectorAll<HTMLElement>('[data-scroll-bookmark]')
      ).map((target, index) => ({
        id: `${target.dataset.scrollBookmark}-${index}`,
        label: target.dataset.scrollBookmark ?? 'Section',
        image: target.dataset.scrollBookmarkImage ?? null,
        top: pageHeight > 0
          ? Math.min(100, Math.max(0, ((target.getBoundingClientRect().top + window.scrollY) / pageHeight) * 100))
          : 0,
      }));

      setBookmarks(nextBookmarks);
    };

    updateBookmarks();
    window.addEventListener('resize', updateBookmarks);
    const resizeObserver = new ResizeObserver(updateBookmarks);
    resizeObserver.observe(document.documentElement);
    resizeObserver.observe(document.body);
    document.querySelectorAll<HTMLElement>('[data-scroll-bookmark]').forEach((target) => {
      resizeObserver.observe(target);
    });

    return () => {
      window.removeEventListener('resize', updateBookmarks);
      resizeObserver.disconnect();
    };
  }, [windowTarget]);

  const setScrollProgress = (progress: number, behavior: ScrollBehavior = 'instant') => {
    const clampedProgress = Math.min(1, Math.max(0, progress));
    if (windowTarget) {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: clampedProgress * maxScroll, behavior });
      return;
    }

    const element = targetRef?.current;
    if (element) {
      element.scrollTo({
        top: clampedProgress * (element.scrollHeight - element.clientHeight),
        behavior,
      });
    }
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    const track = trackRef.current;
    if (!track) return;

    if (event.target instanceof Element && event.target.closest('[data-scroll-bookmark-button]')) return;

    const trackBounds = track.getBoundingClientRect();
    const thumbBounds = thumbRef.current?.getBoundingClientRect();
    const clickedThumb = event.target instanceof Element
      && Boolean(thumbRef.current?.contains(event.target))
      && thumbBounds;
    const offset = clickedThumb
      ? event.clientY - thumbBounds.top
      : (thumbBounds?.height ?? 0) / 2;

    dragRef.current = { pointerId: event.pointerId, offset };
    track.setPointerCapture(event.pointerId);

    const availableHeight = trackBounds.height - (thumbBounds?.height ?? 0);
    const progress = availableHeight > 0
      ? (event.clientY - trackBounds.top - offset) / availableHeight
      : 0;
    setScrollProgress(progress, clickedThumb ? 'instant' : 'smooth');
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const track = trackRef.current;
    if (!drag || !track || drag.pointerId !== event.pointerId) return;

    const trackBounds = track.getBoundingClientRect();
    const thumbHeight = thumbRef.current?.getBoundingClientRect().height ?? 0;
    const availableHeight = trackBounds.height - thumbHeight;
    const progress = availableHeight > 0
      ? (event.clientY - trackBounds.top - drag.offset) / availableHeight
      : 0;
    setScrollProgress(progress);
  };

  const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;

    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const element = windowTarget ? null : targetRef?.current;
    const clientSize = windowTarget ? window.innerHeight : element?.clientHeight ?? 0;
    const scrollOffset = windowTarget ? window.scrollY : element?.scrollTop ?? 0;
    const maxScroll = windowTarget
      ? document.documentElement.scrollHeight - window.innerHeight
      : (element?.scrollHeight ?? 0) - clientSize;

    let nextScroll: number | null = null;
    switch (event.key) {
      case 'ArrowUp':
        nextScroll = scrollOffset - 40;
        break;
      case 'ArrowDown':
        nextScroll = scrollOffset + 40;
        break;
      case 'PageUp':
        nextScroll = scrollOffset - clientSize;
        break;
      case 'PageDown':
        nextScroll = scrollOffset + clientSize;
        break;
      case 'Home':
        nextScroll = 0;
        break;
      case 'End':
        nextScroll = maxScroll;
        break;
    }

    if (nextScroll !== null) {
      event.preventDefault();
      setScrollProgress(maxScroll > 0 ? nextScroll / maxScroll : 0, 'smooth');
    }
  };

  if (!metrics.isScrollable) return null;

  return (
    <div
      ref={trackRef}
      data-custom-grab
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      className={`fixed right-4 top-30 bottom-30 z-[110] w-4 touch-none cursor-none ${className}`}
    >
      <span className="absolute inset-x-1 top-0 bottom-0 rounded-full bg-[var(--border)]/30" />
      <span
        ref={thumbRef}
        role="scrollbar"
        aria-label={label}
        aria-orientation="vertical"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(metrics.progress * 100)}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        data-custom-grab
        className="absolute left-1/2 size-3 -translate-x-1/2 rounded-full bg-[var(--muted)]/80 transition-colors hover:bg-[var(--fg)]"
        style={{
          top: `calc(${metrics.progress * 100}% - ${metrics.progress * 12}px)`,
        }}
      />
      {bookmarks.map((bookmark) => (
        <button
          key={bookmark.id}
          type="button"
          data-scroll-bookmark-button
          aria-label={`Scroll to ${bookmark.label}`}
          onClick={() => setScrollProgress(bookmark.top / 100, 'smooth')}
          onPointerDown={(event) => event.stopPropagation()}
          onPointerEnter={() => setHoveredBookmark(bookmark.id)}
          onPointerLeave={() => setHoveredBookmark(null)}
          onFocus={() => setHoveredBookmark(bookmark.id)}
          onBlur={() => setHoveredBookmark(null)}
          className="group absolute inset-x-0 z-20 h-3 -translate-y-1/2 cursor-none"
          style={{
            top: `calc(${bookmark.top}% - ${bookmark.top * 0.12}px + 6px)`,
          }}
        >
          <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[var(--muted)] transition-all group-hover:h-0.5 group-hover:bg-[var(--fg)]" />
          {hoveredBookmark === bookmark.id && (
            <span
              className={`pointer-events-none absolute right-full mr-3 w-52 overflow-hidden rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--fg)] shadow-xl ${
                bookmark.top < 15
                  ? 'top-0'
                  : bookmark.top > 85
                    ? 'bottom-0'
                    : 'top-1/2 -translate-y-1/2'
              }`}
            >
              {bookmark.image && (
                <img
                  src={bookmark.image}
                  alt=""
                  className="aspect-video w-full object-cover"
                />
              )}
              <span className="block px-3 py-2 font-sans text-xs font-medium">
                {bookmark.label}
              </span>
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
