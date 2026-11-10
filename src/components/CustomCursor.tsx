import { useEffect, useRef } from 'react';

const BURST_ANGLES = [45, 90, 135, 180, 225, 270];
const EDGE_THRESHOLD = 4;
const GAME_FRAME_SELECTOR = '[data-custom-cursor-frame]';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const interactiveSelector = 'a, button, input, textarea, select, summary, [role="button"], [tabindex]:not([tabindex="-1"])';

    const hideCursor = () => {
      cursor.classList.remove('is-visible', 'is-interactive', 'is-grabbing');
    };

    const isAtEdge = (x: number, y: number) => {
      const { clientWidth, clientHeight } = document.documentElement;
      return (
        x <= EDGE_THRESHOLD ||
        y <= EDGE_THRESHOLD ||
        x >= clientWidth - EDGE_THRESHOLD ||
        y >= clientHeight - EDGE_THRESHOLD
      );
    };

    const isTouchingGameFrame = (x: number, y: number) => {
      const frame = document.querySelector<HTMLIFrameElement>(GAME_FRAME_SELECTOR);
      if (!frame) return false;

      const rect = frame.getBoundingClientRect();
      return (
        x >= rect.left - EDGE_THRESHOLD &&
        x <= rect.right + EDGE_THRESHOLD &&
        y >= rect.top - EDGE_THRESHOLD &&
        y <= rect.bottom + EDGE_THRESHOLD
      );
    };

    const isGameFrameElement = (value: EventTarget | null) =>
      value instanceof Element && Boolean(value.closest(GAME_FRAME_SELECTOR));

    const handlePointerMove = (event: PointerEvent) => {
      if (isAtEdge(event.clientX, event.clientY) || isTouchingGameFrame(event.clientX, event.clientY)) {
        hideCursor();
        return;
      }

      const target = document.elementFromPoint(event.clientX, event.clientY);
      if (isGameFrameElement(target)) {
        hideCursor();
        return;
      }

      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      cursor.classList.add('is-visible');
      cursor.classList.toggle(
        'is-interactive',
        target instanceof Element && Boolean(target.closest(interactiveSelector))
      );
    };

    const handleMouseOut = (event: MouseEvent) => {
      if (!event.relatedTarget || isGameFrameElement(event.relatedTarget)) hideCursor();
    };

    const handleMouseOver = (event: MouseEvent) => {
      if (isGameFrameElement(event.target)) hideCursor();
    };

    const handlePointerOverCapture = (event: PointerEvent) => {
      if (isGameFrameElement(event.target)) hideCursor();
    };

    const handlePointerOutCapture = (event: PointerEvent) => {
      if (isGameFrameElement(event.relatedTarget)) hideCursor();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') hideCursor();
    };

    const handleGameCursorMessage = (event: MessageEvent<unknown>) => {
      const gameFrame = document.querySelector<HTMLIFrameElement>(GAME_FRAME_SELECTOR);
      if (
        !gameFrame ||
        event.source !== gameFrame.contentWindow ||
        typeof event.data !== 'object' ||
        event.data === null
      ) {
        return;
      }

      const message = event.data as { type?: unknown; x?: unknown; y?: unknown };
      if (message.type === 'game-cursor-leave' || message.type === 'game-cursor-move') {
        hideCursor();
      }
    };

    const spawnBurst = () => {
      cursor.querySelector('[data-cursor-burst]')?.remove();

      const burst = document.createElement('span');
      burst.setAttribute('data-cursor-burst', '');
      burst.style.cssText = 'position:absolute;top:1px;left:2px;width:0;height:0;pointer-events:none;';

      BURST_ANGLES.forEach((angle) => {
        const line = document.createElement('span');
        line.style.cssText =
          'position:absolute;top:0;left:-1px;width:2px;height:7px;border-radius:1px;background:var(--fg);transform-origin:50% 0;opacity:0;';
        const animation = line.animate(
          [
            { opacity: 1, transform: `rotate(${angle}deg) translateY(5px) scaleY(1)` },
            { opacity: 0, transform: `rotate(${angle}deg) translateY(17px) scaleY(0.25)` },
          ],
          { duration: 420, easing: 'cubic-bezier(0.2, 0.7, 0.3, 1)', fill: 'forwards' }
        );
        animation.onfinish = () => burst.remove();
        burst.appendChild(line);
      });

      cursor.appendChild(burst);
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Element && event.target.closest('[data-custom-grab]')) {
        cursor.classList.add('is-grabbing');
      }
      if (event.button === 0 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        spawnBurst();
      }
    };

    const handlePointerEnd = () => {
      cursor.classList.remove('is-grabbing');
    };

    const root = document.documentElement;

    window.addEventListener('pointermove', handlePointerMove);
    root.addEventListener('mouseleave', hideCursor);
    root.addEventListener('pointerleave', hideCursor);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('pointerover', handlePointerOverCapture, true);
    window.addEventListener('pointerout', handlePointerOutCapture, true);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', hideCursor);
    window.addEventListener('blur', hideCursor);
    window.addEventListener('pointerdown', handlePointerDown, true);
    window.addEventListener('pointerup', handlePointerEnd, true);
    window.addEventListener('pointercancel', handlePointerEnd, true);
    window.addEventListener('message', handleGameCursorMessage);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      root.removeEventListener('mouseleave', hideCursor);
      root.removeEventListener('pointerleave', hideCursor);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('pointerover', handlePointerOverCapture, true);
      window.removeEventListener('pointerout', handlePointerOutCapture, true);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', hideCursor);
      window.removeEventListener('blur', hideCursor);
      window.removeEventListener('pointerdown', handlePointerDown, true);
      window.removeEventListener('pointerup', handlePointerEnd, true);
      window.removeEventListener('pointercancel', handlePointerEnd, true);
      window.removeEventListener('message', handleGameCursorMessage);
    };
  }, []);

  return (
    <div ref={cursorRef} className="custom-cursor" aria-hidden="true">
      <svg viewBox="0 0 24 28">
        <path d="M2 1 21 17h-9l-4 10z" />
        <path className="grabbing-hand" d="M8 13V7a1.5 1.5 0 0 1 3 0v4-6a1.5 1.5 0 0 1 3 0v6-5a1.5 1.5 0 0 1 3 0v6-3a1.5 1.5 0 0 1 3 0v7c0 4-2.5 7-6.5 7h-1c-2.5 0-4-1-5.5-3l-3-4a1.5 1.5 0 0 1 2.5-1.7L8 16z" />
      </svg>
    </div>
  );
}