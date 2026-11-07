import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import gameHtml from '../components/game.html?raw';

export default function Game() {
    const navigate = useNavigate();
    const [isDesktop, setIsDesktop] = useState(() => window.matchMedia('(min-width: 1024px)').matches);

    useEffect(() => {
        const desktopQuery = window.matchMedia('(min-width: 1024px)');
        const updateDesktopState = (event: MediaQueryListEvent) => {
            setIsDesktop(event.matches);
        };

        desktopQuery.addEventListener('change', updateDesktopState);
        return () => desktopQuery.removeEventListener('change', updateDesktopState);
    }, []);

    return (
        <section className="space-y-3">
            <header className="space-y-3">
                <h1 className="font-serif text-3xl text-center sm:text-4xl font-bold tracking-wider">PLAY AS <i>"ALEF"</i>, THE DEV</h1>
            </header>

            {isDesktop ? (
                <div className="space-y-3">
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 text-sm text-[var(--muted)] transition-colors hover:text-[var(--fg)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--fg)]"
                        onClick={() => navigate("/")}
                    >
                        <i className="fa-solid fa-arrow-left" aria-hidden="true"></i>
                        Back to Home
                    </button>

                    <iframe
                        title="Coin collector game"
                        data-custom-cursor-frame
                        srcDoc={gameHtml}
                        className="block aspect-[2/1] w-full rounded-xl border border-[var(--border)] bg-[#111]"
                    />
                </div>
            ) : (
                <div className="flex flex-col gap-4 space-y-3">
                    <span className="text-center tracking-wider">Sorry, the game is not available for mobile ;-;</span>

                    <button
                        type="button"
                        className="mx-auto inline-flex items-center gap-2 text-sm border border-[var(--fg)] bg-[var(--fg)] text-[var(--bg)] px-5 py-2 transition-colors duration-200 hover:bg-[var(--bg)] hover:text-[var(--fg)] disabled:opacity-50 cursor-pointer"
                        onClick={() => navigate("/")}
                    >
                        <i className="fa-solid fa-arrow-left" aria-hidden="true"></i>
                        Back to Home
                    </button>
                </div>
            )}
        </section>
    )
}