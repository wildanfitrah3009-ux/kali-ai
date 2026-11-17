// Header Mode Chat minimalis persis DeepSeek
window.KalaAiComponents = window.KalaAiComponents || {};

window.KalaAiComponents.Header = function Header({
  onToggleSidebar,
  onNewChat,
  theme,
  onToggleTheme,
  onOpenLive,
  activeGem,
  onClearGem,
  onBackHome,
  sidebarOpen,
  language,
  onExportChat,
}) {
  const { Logo } = window.KalaAiComponents;
  const t = (k) => (window.getKaliText ? window.getKaliText(k, language) : k);

  return (
    <header className="h-16 px-4 sm:px-6 flex items-center justify-between shrink-0 z-20">
      {/* Kiri: Logo + Kapsul Tombol */}
      <div className="flex items-center gap-3">
        <div className={`flex items-center gap-2 select-none ${sidebarOpen ? 'hidden' : 'flex'}`}>
          {Logo ? <Logo className="w-7 h-7" /> : null}
          <span className="text-lg font-bold tracking-tight text-ink hidden sm:block">Kali AI</span>
        </div>

        {/* Kapsul berisi tombol sidebar & obrolan baru (sembunyikan jika sidebar terbuka) */}
        <div className={`flex items-center bg-card border border-border rounded-full p-0.5 shadow-sm ${sidebarOpen ? 'hidden' : 'flex'}`}>
          <button
            type="button"
            onClick={onToggleSidebar}
            title="Buka Sidebar"
            className="flex items-center justify-center w-8 h-8 rounded-full text-muted hover:text-ink hover:bg-hover transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="9" y1="3" x2="9" y2="21" /></svg>
          </button>
          <button
            type="button"
            onClick={onNewChat}
            title={t('newChat')}
            className="flex items-center justify-center w-8 h-8 rounded-full text-muted hover:text-ink hover:bg-hover transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          </button>
        </div>
      </div>

      {/* Kanan: Aksi */}
      <div className="flex items-center gap-2">
        {activeGem && (
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card text-xs font-medium text-ink">
            <span>{activeGem.name}</span>
            <button onClick={onClearGem} className="text-muted hover:text-ink">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
        )}

        <button 
          onClick={onBackHome} 
          title="Kembali ke Beranda"
          className="hidden sm:flex items-center justify-center w-9 h-9 rounded-lg text-muted hover:text-ink hover:bg-hover transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
        </button>

        {onExportChat && (
          <button
            onClick={onExportChat}
            title="Unduh Obrolan (TXT)"
            className="hidden sm:flex items-center justify-center w-9 h-9 rounded-lg text-muted hover:text-ink hover:bg-hover transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
          </button>
        )}

        <button
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}
          className="flex items-center justify-center w-9 h-9 rounded-lg text-muted hover:text-ink hover:bg-hover transition-colors"
        >
          {theme === 'dark' ? (
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
          )}
        </button>

        <button
          onClick={onNewChat}
          className="hidden sm:flex items-center gap-1.5 h-9 px-4 rounded-full bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors ml-1"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          <span>{t('newChat')}</span>
        </button>
      </div>
    </header>
  );
};
