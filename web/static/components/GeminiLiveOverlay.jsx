// Komponen KalaAiLiveOverlay (Anti-UI-Slop: flat tonal surface, 1px border, strokeWidth={1.75})
window.KalaAiComponents = window.KalaAiComponents || {};

window.KalaAiComponents.KalaAiLiveOverlay = function KalaAiLiveOverlay({
  isOpen,
  onClose,
}) {
  const { useState, useEffect } = React;
  const [isListening, setIsListening] = useState(true);
  const [transcript, setTranscript] = useState('Mendengarkan suara Anda...');

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      setTranscript('Bagaimana saya bisa membantu Anda hari ini?');
    }, 2500);
    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 flex flex-col items-center text-center relative">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg border border-border bg-surface text-muted hover:text-ink transition-colors">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface text-muted text-xs font-mono mb-6">
          <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
          <span>Kali AI Live Voice</span>
        </div>

        <div className="relative w-32 h-32 my-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-border animate-ping opacity-50" />
          <div className="absolute inset-3 rounded-full bg-surface animate-pulse" />
          <div className="relative w-20 h-20 rounded-full bg-accent flex items-center justify-center text-white">
            <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="22" /></svg>
          </div>
        </div>

        <p className="text-sm text-ink font-medium max-w-xs leading-relaxed min-h-[48px] mb-8">
          "{transcript}"
        </p>

        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setIsListening(!isListening)} className={`px-5 py-2.5 rounded-lg border text-xs font-medium transition-colors ${isListening ? 'border-border bg-surface text-ink hover:bg-hover' : 'border-accent bg-accent text-white hover:bg-accent-hover'}`}>
            {isListening ? 'Bisukan (Mute)' : 'Lanjutkan Mendengarkan'}
          </button>
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors">
            Akhiri Sesi
          </button>
        </div>
      </div>
    </div>
  );
};
