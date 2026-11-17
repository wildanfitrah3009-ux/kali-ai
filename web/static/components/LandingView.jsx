// Landing Hero (English) - preview percakapan dengan animasi mengetik (typewriter)
window.KalaAiComponents = window.KalaAiComponents || {};

window.KalaAiComponents.LandingView = function LandingView({ language, onEnterChat, onOpenGems, theme, onToggleTheme }) {
  const { Logo } = window.KalaAiComponents;
  const { useState, useEffect, useRef } = React;

  const messages = [
    { role: 'user', text: 'Hey, can you help me plan a study schedule for finals?' },
    { role: 'ai', text: 'Of course! Let us start with your toughest subject first. How many days do you have until finals?' },
    { role: 'user', text: 'About two weeks.' },
    { role: 'ai', text: 'Perfect. I would suggest studying in 50-minute blocks with short breaks, and reviewing the hardest topics early in the day.' }
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimer = useRef(null);

  // Cycle to the next message every so often, but only after the current
  // message has finished typing.
  useEffect(() => {
    if (isTyping) return;
    const interval = setInterval(() => {
      setCurrentStep((step) => (step >= messages.length - 1 ? 0 : step + 1));
    }, 1600);
    return () => clearInterval(interval);
  }, [isTyping]);

  // Show the current message instantly (no typewriter effect).
  // Re-running on `theme` keeps the displayed message in sync on theme toggle.
  useEffect(() => {
    if (typingTimer.current) clearTimeout(typingTimer.current);

    const target = messages[currentStep] ? messages[currentStep].text : '';
    setTypedText(target);
    setIsTyping(false);

    return () => { if (typingTimer.current) clearTimeout(typingTimer.current); };
  }, [currentStep, theme]);

  const isActive = (i) => i === currentStep;
  const isPast = (i) => i < currentStep;

  return (
    <div className="min-h-screen w-full flex flex-col bg-surface text-ink overflow-y-auto relative">
      <div className="pointer-events-none absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-blue-200/40 dark:bg-blue-900/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-40 w-[480px] h-[480px] rounded-full bg-indigo-200/30 dark:bg-indigo-900/20 blur-3xl" />

      <header className="relative z-10 h-20 px-6 sm:px-12 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 select-none">
          <Logo className="w-9 h-9" />
          <span className="text-xl font-bold tracking-tight text-ink">Kali AI</span>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={onToggleTheme} title={window.getKaliText ? window.getKaliText('toggleTheme', language) : 'Toggle theme'} className="flex items-center justify-center w-10 h-10 rounded-full border border-[#E2E8F0] dark:border-[#2A2D34] bg-white dark:bg-[#16181D] text-muted hover:text-ink transition-colors shadow-sm">
            {theme === 'dark' ? (
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
            )}
          </button>
          <button onClick={onEnterChat} className="flex items-center gap-1.5 h-10 px-6 rounded-full bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-sm font-semibold transition-colors shadow-sm">
            Start Chat
          </button>
        </div>
      </header>

      <main className="relative z-10 flex-1 max-w-[1320px] mx-auto w-full px-6 sm:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center py-12 lg:py-16">
        <div className="animate-fade-in">
          <h1 
            className="text-5xl sm:text-6xl lg:text-[64px] font-bold tracking-[-0.03em] leading-[1.05] mb-8"
            style={{ color: theme === 'dark' ? '#F1F5F9' : '#0F172A' }}
          >
            Build, Analyze,<br />Deploy Faster<br />with AI Workspace
          </h1>

          <p 
            className="text-lg leading-relaxed max-w-[520px] mb-10"
            style={{ color: theme === 'dark' ? '#94A3B8' : '#475569' }}
          >
            Kali AI brings you an intelligent workspace to write, build code, and analyze documents - all in one calm, focused flow.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button onClick={onEnterChat} className="flex items-center gap-2 h-12 px-8 rounded-full bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-base font-semibold transition-colors shadow-lg shadow-blue-500/20">
              Enter Chat Room
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </button>
          </div>
        </div>

        <div className="animate-fade-in relative w-full flex justify-center lg:justify-end" style={{ animationDelay: '0.15s' }}>
          <button onClick={onEnterChat} className="group relative w-full max-w-[660px] text-left block">
            <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-[28px] border border-[#E2E8F0] dark:border-[#2A2D34] bg-white dark:bg-[#16181D] opacity-40 transition-transform duration-300 group-hover:translate-x-4 group-hover:translate-y-4" />
            <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-[28px] border border-[#E2E8F0] dark:border-[#2A2D34] bg-white dark:bg-[#16181D] opacity-70 transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2" />

            <div className="relative rounded-[28px] border border-[#E2E8F0] dark:border-[#2A2D34] bg-white dark:bg-[#16181D] p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition-shadow duration-300 group-hover:shadow-[0_16px_50px_rgba(15,23,42,0.12)]">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E2E8F0] dark:border-[#2A2D34]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-300" />
                  <span className="w-3 h-3 rounded-full bg-amber-300" />
                  <span className="w-3 h-3 rounded-full bg-emerald-300" />
                </div>
                <span className="flex items-center gap-1.5 text-xs font-mono text-[#94A3B8]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  kali-ai.chat
                </span>
              </div>

              <div className="space-y-4 min-h-[260px]">
                {messages.map((msg, i) => {
                  if (!isActive(i) && !isPast(i)) return null;
                  const shownText = isPast(i) ? msg.text : typedText;
                  const showCursor = isActive(i) && isTyping;
                  const textNode = (
                    <>
                      {shownText}
                      {showCursor && (
                        <span className="inline-block w-[2px] h-[1em] align-[-2px] ml-0.5 bg-current animate-typing-cursor" />
                      )}
                    </>
                  );
                  if (msg.role === 'user') {
                    return (
                      <div key={i} className="flex justify-end animate-message-pop">
                        <div className="max-w-[78%] rounded-2xl rounded-tr-sm px-4 py-2.5 bg-[#EFF6FF] dark:bg-[#1E3A8A]/30 border border-[#DBEAFE] dark:border-[#1E3A8A] text-sm text-ink min-h-[38px]">
                          {textNode}
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div key={i} className="flex items-start gap-2.5 animate-message-pop">
                      <span className="shrink-0 mt-0.5"><Logo className="w-7 h-7" /></span>
                      <div className="max-w-[82%] rounded-2xl rounded-tl-sm px-4 py-2.5 bg-[#F8FAFC] dark:bg-[#22252D] border border-[#E2E8F0] dark:border-[#2A2D34] text-sm text-ink leading-relaxed min-h-[44px]">
                        {textNode}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-4 mt-2 border-t border-[#E2E8F0] dark:border-[#2A2D34]">
                <span className="flex items-center gap-1.5 text-xs text-[#94A3B8]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Live conversation
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1D4ED8] dark:text-[#60A5FA]">
                  Enter chat
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </span>
              </div>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
};