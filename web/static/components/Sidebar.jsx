// Sidebar persis DeepSeek (Anti-UI-Slop)
window.KalaAiComponents = window.KalaAiComponents || {};

window.KalaAiComponents.Sidebar = function Sidebar({
  isOpen,
  onToggle,
  conversations,
  activeId,
  onSelectConvo,
  onNewChat,
  onTogglePin,
  onDeleteConvo,
  serverInfo,
  onOpenSettings,
  language,
}) {
  const { useState } = React;
  const [searchQuery, setSearchQuery] = useState('');
  const t = (k) => (window.getKaliText ? window.getKaliText(k, language) : k);

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Simulasi grup waktu (karena belum ada timestamp asli)
  const todayList = filtered.slice(0, 2);
  const yesterdayList = filtered.slice(2, 3);
  const last7List = filtered.slice(3, 5);
  const last30List = filtered.slice(5);

  const renderGroup = (title, items) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-6">
        <h3 className="px-3 text-[11px] font-medium text-muted mb-1.5 select-none">{title}</h3>
        <div className="space-y-0.5">
          {items.map((c) => (
            <ConvoRow key={c.id} convo={c} active={c.id === activeId} onSelect={() => onSelectConvo(c.id)} onTogglePin={() => onTogglePin(c.id)} onDelete={() => onDeleteConvo(c.id)} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {isOpen && (
        <div onClick={onToggle} className="fixed inset-0 z-30 bg-black/40 lg:hidden" aria-hidden="true" />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-sidebar transition-all duration-300 ease-in-out lg:static ${
          isOpen ? 'w-[260px] translate-x-0' : 'w-0 -translate-x-full lg:w-0 lg:translate-x-0'
        } overflow-hidden shrink-0`}
      >
        {/* Header Sidebar (DeepSeek style) */}
        <div className="flex items-center justify-between h-14 px-4 shrink-0">
          <div className="flex items-center gap-2 select-none">
            {window.KalaAiComponents.Logo ? <window.KalaAiComponents.Logo className="w-6 h-6" /> : null}
            <span className="text-base font-bold tracking-tight text-ink">Kali AI</span>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-hover transition-colors">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            </button>
            <button
              onClick={onToggle}
              title={t('closeSidebar')}
              className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-hover transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="9" y1="3" x2="9" y2="21" /></svg>
            </button>
          </div>
        </div>

        {/* Tombol Obrolan Baru */}
        <div className="px-3 pb-2 shrink-0">
          <button
            type="button"
            onClick={onNewChat}
            className="flex items-center justify-center gap-2 w-full rounded-full bg-card border border-border hover:bg-hover text-ink px-4 py-2.5 text-sm font-medium transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-ink" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            <span>{t('newChat')}</span>
          </button>
        </div>

        {/* Search */}
        <div className="px-3 pb-2 shrink-0">
          <div className="relative group">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchHistory')}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-transparent text-ink placeholder:text-muted focus:outline-none focus:bg-hover transition-colors"
            />
          </div>
        </div>

        {/* Daftar Riwayat */}
        <div className="flex-1 overflow-y-auto px-3 pb-4">
          {filtered.length === 0 ? (
            <p className="px-3 py-4 text-sm text-muted text-center">{t('noHistory')}</p>
          ) : (
            <>
              {renderGroup(t('today'), todayList)}
              {renderGroup(t('yesterday'), yesterdayList)}
              {renderGroup(t('last7'), last7List)}
              {renderGroup(t('last30'), last30List)}
            </>
          )}
        </div>

        {/* Footer: Tombol Pengaturan */}
        <div className="mt-auto p-3 shrink-0 border-t border-border">
          <button
            type="button"
            onClick={onOpenSettings}
            className="flex items-center justify-between w-full text-xs text-muted px-2 py-2 rounded-lg hover:bg-hover hover:text-ink transition-colors"
          >
            <div className="flex items-center gap-2 min-w-0">
              <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
              <span className="truncate text-[13px] font-medium">{t('settings')}</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title={t('connected')} />
          </button>
        </div>
      </aside>
    </>
  );
};

const ConvoRow = React.memo(function ConvoRow({ convo, active, onSelect, onTogglePin, onDelete }) {
  const { useState } = React;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={`group relative flex items-center justify-between rounded-lg px-3 py-2 text-[13px] transition-colors ${active ? 'bg-hover text-ink font-medium' : 'text-muted hover:bg-hover hover:text-ink'}`}>
      <button onClick={onSelect} className="flex items-center gap-2.5 flex-1 min-w-0 text-left">
        <span className="truncate">{convo.title}</span>
      </button>
      
      <div className="relative">
        <button 
          onClick={() => setMenuOpen(!menuOpen)} 
          className={`p-1 rounded-md text-muted hover:text-ink transition-opacity ${menuOpen || active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-full mt-1 w-32 rounded-lg border border-border bg-card shadow-md z-50 py-1 overflow-hidden">
              <button onClick={() => { onTogglePin(); setMenuOpen(false); }} className="w-full text-left px-3 py-1.5 text-xs text-ink hover:bg-hover flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 17v5M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" /></svg>
                {convo.pinned ? 'Lepas Sematan' : 'Sematkan'}
              </button>
              <button onClick={() => { onDelete(); setMenuOpen(false); }} className="w-full text-left px-3 py-1.5 text-xs text-red-500 hover:bg-hover flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                Hapus
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}, (prev, next) => prev.convo === next.convo && prev.active === next.active);
