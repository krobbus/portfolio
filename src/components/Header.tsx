export default function Header({footerRef, projectsRef}: {footerRef: React.RefObject<HTMLElement | null>; projectsRef: React.RefObject<HTMLElement | null>}) {
    return (
        <div className="relative space-y-10 py-6">
            <div className="absolute top-[-20px] right-[5%] opacity-15 pointer-events-none select-none animate-pulse">
                <img 
                    src="/images/icons/Cloud.png" 
                    alt="Cloud" 
                    className="w-72 sm:w-96 h-auto blur-sm" 
                />
            </div>

            <div className="absolute bottom-[30px] left-[20%] opacity-15 pointer-events-none select-none animate-pulse">
                <img 
                    src="/images/icons/Cloud.png" 
                    alt="Cloud" 
                    className="w-72 sm:w-96 h-auto blur-sm" 
                />
            </div>

            <div id="topHeader" className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 text-xs sm:text-sm font-medium tracking-wider text-slate-400">
                <address className="not-italic text-slate-300">Laguna, Philippines</address>
                <span>&copy; 2026</span>
            </div>

            <div className="mainWrapper space-y-8 max-w-5xl">
                <div id="mainHeader" className="space-y-4">
                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-tight">
                        ALEF JUSTIN LORESCA
                    </h1>

                    <h2 className="text-lg sm:text-2xl text-slate-300 font-normal leading-relaxed max-w-3xl">
                        AI Full Stack Developer, where I enjoy turning complex projects into intuitive and customer-focused experience.
                    </h2>
                </div>

                <div id="contactPills" className="flex flex-wrap justify-center lg:justify-start gap-6 pt-2">
                    <div className="pillWrapper flex flex-col space-y-2">
                        <div className="socialHint flex items-center space-x-3 text-xs text-slate-400 pl-1">
                            <div className="floatingIcons flex items-center -space-x-2">
                                <div className="w-6 h-6 p-1 rounded-full bg-slate-800 border border-white/20 hover:scale-125 transition-transform flex items-center justify-center">
                                    <i className="fa-brands fa-facebook-messenger"></i>
                                </div>
                                <div className="w-6 h-6 p-1 rounded-full bg-slate-800 border border-white/20 hover:scale-125 transition-transform flex items-center justify-center">
                                    <i className="fa-brands fa-square-instagram"></i>
                                </div>
                                <div className="w-6 h-6 p-1 rounded-full bg-slate-800 border border-white/20 hover:scale-125 transition-transform flex items-center justify-center">
                                    <i className="fa-brands fa-github"></i>
                                </div>
                                <div className="w-6 h-6 p-1 rounded-full bg-slate-800 border border-white/20 hover:scale-125 transition-transform flex items-center justify-center">
                                    <i className="fa-brands fa-linkedin"></i>
                                </div>
                            </div>

                            <span>you can find my socials here</span>
                        </div>

                        <button 
                            onClick={() => footerRef.current?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-6 py-3.5 rounded-2xl bg-white/10 border border-white/20 text-white font-medium shadow-[0_8px_24px_rgba(0,0,0,0.3)]
                            hover:text-blue-200 hover:bg-gradient-to-r from-blue-500/20 to-blue-500/20 hover:border-blue-400/50 hover:scale-[1.02]
                            active:scale-95 transition-all duration-300 text-sm cursor-pointer"
                        >
                            Let's Connect
                        </button>
                    </div>

                    <div className="pillWrapper flex flex-col space-y-2 justify-end">
                        <div className="socialHint flex items-center space-x-3 text-xs text-slate-400 pl-1">
                            <div className="floatingIcons flex items-center -space-x-2">
                                <div className="w-6 h-6 p-1 rounded-full bg-slate-800 border border-white/20 hover:scale-125 transition-transform flex items-center justify-center">
                                    <i className="fa-solid fa-folder-open"></i>
                                </div>
                            </div>

                            <span>wanna see my projects?</span>
                        </div>

                        <button 
                            onClick={() => projectsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-500/20 to-blue-500/20
                            hover:from-blue-500/30 hover:to-blue-500/30 border border-blue-500/40 text-blue-200 font-medium shadow-[0_8px_24px_rgba(0,0,0,0.3)] hover:border-blue-400 hover:scale-[1.02]
                            active:scale-95 transition-all duration-300 text-sm cursor-pointer"
                        >
                            Check Out My Work!
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}