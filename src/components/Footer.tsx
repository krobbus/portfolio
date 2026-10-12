import { useState, useEffect } from "react";
import emailjs from '@emailjs/browser';

export default function Footer({ footerRef }: { footerRef: React.RefObject<HTMLElement | null> }) {
    const [showCloud, setShowCloud] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 1200;
        }
        return true;
    })
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [number, setNumber] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);

        try {
            await emailjs.send(
                import.meta.env.VITE_SERVICE_ID,
                import.meta.env.VITE_TEMPLATE_ID,
                { name, email, number, subject, message },
                import.meta.env.VITE_PUBLIC_KEY
            );
            alert("Message sent! I'll get back to you soon.");
            setName('');
            setEmail('');
            setNumber('');
            setSubject('');
            setMessage('');
        } catch (err) {
            alert(`Something went wrong — please try again. ${err}`);
        } finally {
            setSending(false);
        }
    };

    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 1200px)');
        
        const handleScreenChange = (e: MediaQueryListEvent) => {
            setShowCloud(e.matches);
        };
        setShowCloud(mediaQuery.matches);

        mediaQuery.addEventListener('change', handleScreenChange);
        return () => mediaQuery.removeEventListener('change', handleScreenChange);
    }, []);

    return(
        <footer id="contactSection" ref={footerRef} className="pt-12 pb-20 border-t border-white/10 flex flex-col gap-4">
            <div id="contactContainers" className="w-full flex flex-wrap justify-center lg:justify-end items-center gap-3 sm:gap-4">
                <a
                    href="https://github.com/krobbus"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-xs sm:text-sm font-medium text-slate-300 
                    hover:text-white hover:border-blue-400/50 hover:bg-blue-500/10 hover:shadow-[0_0_20px_rgba(59,130,246,0.25)] 
                    hover:-translate-y-0.5 flex items-center gap-2.5 transition-all duration-200 shadow-md group cursor-pointer"
                >
                    <i className="fa-brands fa-github"></i>
                    <span>Github</span>
                </a>

                <a
                    href="https://www.linkedin.com/in/alefjustinloresca/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-xs sm:text-sm font-medium text-slate-300 
                    hover:text-white hover:border-blue-400/50 hover:bg-blue-500/10 hover:shadow-[0_0_20px_rgba(59,130,246,0.25)] 
                    hover:-translate-y-0.5 flex items-center gap-2.5 transition-all duration-200 shadow-md group cursor-pointer"
                >
                    <i className="fa-brands fa-linkedin"></i>
                    <span>LinkedIn</span>
                </a>

                <a
                    href="https://www.instagram.com/ajloresca/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-xs sm:text-sm font-medium text-slate-300 
                    hover:text-white hover:border-blue-400/50 hover:bg-blue-500/10 hover:shadow-[0_0_20px_rgba(59,130,246,0.25)] 
                    hover:-translate-y-0.5 flex items-center gap-2.5 transition-all duration-200 shadow-md group cursor-pointer"
                >
                    <i className="fa-brands fa-square-instagram"></i>
                    <span>Instagram</span>
                </a>

                <a
                    href="https://m.me/lorescaalef/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-xs sm:text-sm font-medium text-slate-300 
                    hover:text-white hover:border-blue-400/50 hover:bg-blue-500/10 hover:shadow-[0_0_20px_rgba(59,130,246,0.25)] 
                    hover:-translate-y-0.5 flex items-center gap-2.5 transition-all duration-200 shadow-md group cursor-pointer"
                >
                    <i className="fa-brands fa-facebook-messenger"></i>
                    <span>Messenger</span>
                </a>
            </div>
            
            <div id="emailContainer" className="flex flex-col items-end bg-slate-900/90 border border-white/10 rounded-3xl p-8 sm:p-12 shadow-[0_16px_48px_rgba(0,0,0,0.6)] space-y-10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                
                {showCloud && (
                    <div className="absolute top-[10%] left-[10px] opacity-15 pointer-events-none select-none animate-pulse">
                        <img 
                            src="/images/icons/Cloud.png" 
                            alt="Cloud" 
                            className="w-72 sm:w-96 h-auto blur-sm"
                        />
                    </div>
                )}

                <div className="space-y-2 text-center lg:text-right">
                    <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                        KEEP IN TOUCH
                    </h3>

                    <p className="text-slate-400 text-sm sm:text-base">Have a project in mind or want to collaborate? Drop me a message below.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input
                            id="nameInput"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="(OPTIONAL) MY NAME IS"
                            className="w-full bg-white/5 border border-white/10 focus:border-blue-400 focus:bg-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 outline-none transition-all text-sm"
                        />

                        <input
                            id="emailInput"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="MY EMAIL IS *"
                            required
                            className="w-full bg-white/5 border border-white/10 focus:border-blue-400 focus:bg-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 outline-none transition-all text-sm"
                        />
                    </div>

                    <input
                        id="numberInput"
                        type="tel"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        placeholder="(OPTIONAL) MY PHONE NUMBER IS"
                        className="w-full bg-white/5 border border-white/10 focus:border-blue-400 focus:bg-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 outline-none transition-all text-sm"
                    />

                    <select
                        id="subjectSelect"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                        className="w-full bg-[#0d121f] border border-white/10 focus:border-blue-400 rounded-xl px-4 py-3.5 text-white outline-none transition-all text-sm cursor-pointer"
                    >
                        <option id="default" value="" disabled hidden>SUBJECT LINE *</option>
                        <option value="I'D LIKE TO SET A MEETING" className="bg-slate-900 text-white">I'D LIKE TO SET A MEETING</option>
                        <option value="I'D LIKE TO ASK A QUESTION" className="bg-slate-900 text-white">I'D LIKE TO ASK A QUESTION</option>
                        <option value="I'D LIKE TO MAKE A PROPOSAL" className="bg-slate-900 text-white">I'D LIKE TO MAKE A PROPOSAL</option>
                    </select>

                    {subject === "I'D LIKE TO SET A MEETING" ? (
                        <button
                            type="button"
                            onClick={() => window.open('https://calendly.com/lorescajustin/15-minutes-meeting', '_blank', 'noopener,noreferrer')}
                            className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-2"
                        >
                            Book a time on Calendly
                        </button>
                    ) : (
                        <div className="space-y-6">
                            <textarea
                                id="messageInput"
                                rows={4}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="I'D LIKE TO TALK ABOUT *"
                                required
                                className="w-full bg-white/5 border border-white/10 focus:border-blue-400 focus:bg-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 outline-none transition-all text-sm resize-none"
                            />

                            <button
                                type="submit"
                                disabled={sending}
                                className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
                            >
                                {sending ? 'Sending...' : 'Send Message'}
                            </button>
                        </div>
                    )}
                </form>

                <div className="w-full border-t border-white/10 pt-8">
                    <span className="text-slate-400 text-sm">&copy; 2026 Alef Justin Loresca. All rights reserved.</span>
                </div>
            </div>
        </footer>
    )
}