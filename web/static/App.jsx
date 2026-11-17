// Main App â€” dua tahap: LandingView -> Chat Workspace
const { useState, useEffect, useRef, useCallback } = React;

const DEFAULT_GEMS = [
  {
    id: 'gem_default_coder',
    name: 'Mentor Kode',
    instruction: 'Kamu adalah mentor pemrograman yang sabar. Jelaskan konsep dengan contoh kode bersih dan beri saran praktik terbaik.',
  },
  {
    id: 'gem_default_writer',
    name: 'Penulis Kreatif',
    instruction: 'Kamu adalah penulis kreatif. Gunakan bahasa yang hidup, imajinatif, dan mengalir dalam setiap jawaban.',
  },
];

function uid(prefix) {
  return (prefix || 'id') + '_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
}

function App() {
  const C = window.KalaAiComponents || {};
  const { Header, Sidebar, ZeroState, ChatMessage, PromptInputBox, CanvasWorkspace, PersonaModal, KalaAiLiveOverlay, LandingView, SettingsModal } = C;

  // ----- Theme -----
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('kali_theme') || 'light'; } catch (e) { return 'light'; }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('kali_theme', theme); } catch (e) {}
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  const [language, setLanguage] = useState(() => {
    try { return localStorage.getItem('kali_lang') || 'id'; } catch (e) { return 'id'; }
  });

  const handleSetLanguage = (lang) => {
    setLanguage(lang);
    try { localStorage.setItem('kali_lang', lang); } catch (e) {}
  };

  const handleSetTheme = (newTheme) => {
    if (newTheme === 'system') {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    } else {
      setTheme(newTheme);
    }
  };

  // ----- View: 'landing' | 'chat' -----
  const [view, setView] = useState('landing');

  // ----- Layout -----
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [thinkingEnabled, setThinkingEnabled] = useState(false);
  const [canvasOpen, setCanvasOpen] = useState(false);
  const [canvasContent, setCanvasContent] = useState('');
  const [gemsModalOpen, setGemsModalOpen] = useState(false);
  const [liveOpen, setLiveOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // ----- Conversations -----
  const [conversations, setConversations] = useState(() => {
    try {
      const saved = localStorage.getItem('kali_conversations');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    const seed = (window.initialConvos || []).map((c) => ({ ...c, messages: [] }));
    return seed.length ? seed : [{ id: uid('convo'), title: 'Percakapan Baru', pinned: false, messages: [] }];
  });
  const [activeId, setActiveId] = useState(() => conversations[0]?.id || null);

  useEffect(() => {
    try { localStorage.setItem('kali_conversations', JSON.stringify(conversations)); } catch (e) {}
  }, [conversations]);

  // ----- Gems -----
  const [gems, setGems] = useState(DEFAULT_GEMS);
  const [activeGemId, setActiveGemId] = useState(null);
  const activeGem = gems.find((g) => g.id === activeGemId) || null;

  // ----- Input state -----
  const [input, setInput] = useState('');
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const abortRef = useRef(null);

  // ----- Server info -----
  const [serverInfo, setServerInfo] = useState(null);
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    fetch('/api/info', { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (!cancelled && data) setServerInfo(data); })
      .catch((err) => { if (err.name !== 'AbortError') console.error(err); });
    return () => { cancelled = true; controller.abort(); };
  }, []);

  const activeConvo = conversations.find((c) => c.id === activeId) || null;
  const messages = activeConvo ? activeConvo.messages : [];
  const isZeroState = messages.length === 0;

  const updateConvoMessages = useCallback((convoId, updater) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === convoId ? { ...c, messages: updater(c.messages) } : c))
    );
  }, []);

  const handleNewChat = () => {
    const convo = { id: uid('convo'), title: 'Percakapan Baru', pinned: false, messages: [] };
    setConversations((prev) => [convo, ...prev]);
    setActiveId(convo.id);
    setInput('');
    setAttachments([]);
    setView('chat');
  };

  const handleSelectConvo = (id) => {
    setActiveId(id);
    setView('chat');
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  const handleTogglePin = (id) => {
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c)));
  };

  const handleDeleteConvo = (id) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (id === activeId) {
      const remaining = conversations.filter((c) => c.id !== id);
      setActiveId(remaining[0]?.id || null);
    }
  };

  const handleAddGem = (gem) => setGems((prev) => [...prev, gem]);
  const handleDeleteGem = (id) => {
    setGems((prev) => prev.filter((g) => g.id !== id));
    if (activeGemId === id) setActiveGemId(null);
  };

  const handleOpenInCanvas = (content) => { setCanvasContent(content || ''); setCanvasOpen(true); };

  const handleExportChat = (format = 'txt') => {
    if (!activeConvo) return;
    let content = '';
    activeConvo.messages.forEach(m => {
      content += `[${m.role === 'user' ? 'User' : 'Kali AI'}]\n${m.content}\n\n`;
    });
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeConvo.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stopGeneration = () => {
    if (abortRef.current) { abortRef.current.abort(); abortRef.current = null; }
    setIsGenerating(false);
  };

  const handleRegenerate = (msgId) => {
    if (!activeConvo || isGenerating) return;
    const msgs = activeConvo.messages;
    const idx = msgs.findIndex(m => m.id === msgId);
    if (idx === -1) return;
    
    let lastUserIdx = -1;
    for (let i = idx - 1; i >= 0; i--) {
      if (msgs[i].role === 'user') { lastUserIdx = i; break; }
    }
    if (lastUserIdx === -1) return;
    
    const lastUserMsg = msgs[lastUserIdx];
    const history = buildHistory(msgs.slice(0, lastUserIdx), lastUserMsg.content);
    
    updateConvoMessages(activeId, (oldMsgs) => oldMsgs.slice(0, idx));
    runChat(activeId, lastUserMsg.content, history);
  };

  const buildHistory = (convoMsgs, userContent) => {
    const history = convoMsgs
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .filter((m) => !m.error)
      .map((m) => ({ role: m.role, content: m.content || '' }));
    history.push({ role: 'user', content: userContent });
    return history;
  };

  const runChat = async (convoId, userContent, history) => {
    const assistantId = uid('msg');
    updateConvoMessages(convoId, (msgs) => [
      ...msgs,
      { id: assistantId, role: 'assistant', content: '', status: 'Kali AI sedang menjawab...', streaming: true },
    ]);

    const controller = new AbortController();
    abortRef.current = controller;
    setIsGenerating(true);

    const patch = (updater) =>
      updateConvoMessages(convoId, (msgs) => msgs.map((m) => (m.id === assistantId ? updater(m) : m)));

    try {
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, search: searchEnabled, mode: thinkingEnabled ? 'thinking' : 'fast', language }),
        signal: controller.signal,
      });

      if (!resp.ok) {
        let errText = 'Permintaan gagal (' + resp.status + ')';
        try { const j = await resp.json(); if (j && j.detail) errText = j.detail; } catch (e) {}
        patch((m) => ({ ...m, status: null, error: errText, streaming: false }));
        return;
      }
      if (!resp.body) {
        patch((m) => ({ ...m, status: null, error: 'Respons server tidak dapat dibaca.', streaming: false }));
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let done = false;

      const handleEvent = (part) => {
        const lines = part.split('\n');
        for (const line of lines) {
          const clean = line.replace(/\r$/, '');
          if (!clean.startsWith('data:')) continue;
          const data = clean.slice(5).trim();
          if (!data) continue;
          if (data === '[DONE]') { done = true; return; }
          let obj;
          try { obj = JSON.parse(data); } catch (e) { continue; }
          if (obj.error) { patch((m) => ({ ...m, status: null, error: obj.error, streaming: false })); done = true; return; }
          if (obj.status) patch((m) => ({ ...m, status: obj.status }));
          if (obj.sources) patch((m) => ({ ...m, sources: obj.sources }));
          if (obj.delta) patch((m) => ({ ...m, status: null, content: (m.content || '') + obj.delta }));
        }
      };

      while (!done) {
        const { value, done: streamDone } = await reader.read();
        if (streamDone) {
          buffer += decoder.decode();
          if (buffer.trim()) handleEvent(buffer.replace(/\r\n/g, '\n'));
          break;
        }
        buffer += decoder.decode(value, { stream: true });
        const normalized = buffer.replace(/\r\n/g, '\n');
        const parts = normalized.split('\n\n');
        buffer = parts.pop() || '';
        for (const part of parts) {
          handleEvent(part);
          if (done) break;
        }
      }

      patch((m) => ({ ...m, status: null, streaming: false }));
    } catch (err) {
      if (err && err.name === 'AbortError') {
        patch((m) => ({ ...m, status: null, streaming: false }));
      } else {
        patch((m) => ({ ...m, status: null, error: String(err && err.message ? err.message : err), streaming: false }));
      }
    } finally {
      abortRef.current = null;
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const text = input.trim();
    if ((!text && attachments.length === 0) || isGenerating) return;

    let convoId = activeId;
    if (!convoId) {
      const convo = { id: uid('convo'), title: 'Percakapan Baru', pinned: false, messages: [] };
      setConversations((prev) => [convo, ...prev]);
      setActiveId(convo.id);
      convoId = convo.id;
    }

    const userMsg = {
      id: uid('msg'), role: 'user', content: text,
      attachments: attachments.length ? attachments.slice() : undefined,
    };

    const priorMessages = (conversations.find((c) => c.id === convoId) || {}).messages || [];
    const history = buildHistory(priorMessages, text);
    updateConvoMessages(convoId, (msgs) => [...msgs, userMsg]);
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convoId && (c.title === 'Percakapan Baru' || !c.title)
          ? { ...c, title: text.slice(0, 60) || 'Percakapan Baru' }
          : c
      )
    );

    setInput('');
    setAttachments([]);
    runChat(convoId, text, history);
  };

  const handleLiveTranscript = (text) => {
    const clean = (text || '').trim();
    if (!clean || isGenerating) return;

    let convoId = activeId;
    if (!convoId) {
      const convo = { id: uid('convo'), title: 'Percakapan Baru', pinned: false, messages: [] };
      setConversations((prev) => [convo, ...prev]);
      setActiveId(convo.id);
      convoId = convo.id;
    }

    const userMsg = { id: uid('msg'), role: 'user', content: clean };
    const priorMessages = (conversations.find((c) => c.id === convoId) || {}).messages || [];
    const history = buildHistory(priorMessages, clean);

    updateConvoMessages(convoId, (msgs) => [...msgs, userMsg]);
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convoId && (c.title === 'Percakapan Baru' || !c.title)
          ? { ...c, title: clean.slice(0, 60) || 'Percakapan Baru' }
          : c
      )
    );
    setView('chat');
    runChat(convoId, clean, history);
  };

  const handleSelectPrompt = (prompt) => setInput(prompt);
  const handleAddAttachment = (att) => setAttachments((prev) => [...prev, att]);
  const handleRemoveAttachment = (idx) => setAttachments((prev) => prev.filter((_, i) => i !== idx));

  const messagesEndRef = useRef(null);
  useEffect(() => {
    if (messagesEndRef.current && messagesEndRef.current.scrollIntoView) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]);

  if (!Header || !Sidebar || !ZeroState || !ChatMessage || !PromptInputBox || !CanvasWorkspace || !PersonaModal || !KalaAiLiveOverlay || !LandingView) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface text-ink">
        <div className="max-w-md text-center p-6 rounded-2xl border border-border bg-card">
          <h1 className="text-lg font-semibold mb-2">Komponen belum termuat</h1>
          <p className="text-sm text-muted">Pastikan semua file di static/components dimuat sebelum App.jsx.</p>
        </div>
      </div>
    );
  }

  const promptBox = (
    <PromptInputBox
      input={input}
      onChangeInput={setInput}
      onSubmit={handleSubmit}
      onStop={stopGeneration}
      isGenerating={isGenerating}
      searchEnabled={searchEnabled}
      onToggleSearch={() => setSearchEnabled((v) => !v)}
      thinkingEnabled={thinkingEnabled}
      onToggleThinking={() => setThinkingEnabled((v) => !v)}
      attachments={attachments}
      onAddAttachment={handleAddAttachment}
      onRemoveAttachment={handleRemoveAttachment}
      onOpenLive={() => setLiveOpen(true)}
      language={language}
    />
  );

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-surface text-ink">
      {view === 'landing' ? (
        <LandingView
          onEnterChat={() => setView('chat')}
          onOpenCanvas={() => { setView('chat'); setCanvasOpen(true); }}
          onOpenGems={() => setGemsModalOpen(true)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      ) : (
        <>
          <Sidebar
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen((v) => !v)}
            conversations={conversations}
            activeId={activeId}
            onSelectConvo={handleSelectConvo}
            onNewChat={handleNewChat}
            onTogglePin={handleTogglePin}
            onDeleteConvo={handleDeleteConvo}
            gems={gems}
            activeGemId={activeGemId}
            onSelectGem={setActiveGemId}
            onOpenGemsModal={() => setGemsModalOpen(true)}
            serverInfo={serverInfo}
            onOpenSettings={() => setSettingsOpen(true)}
            language={language}
          />

          <div className="flex-1 min-w-0 flex flex-col h-full">
            <Header
              onToggleSidebar={() => setSidebarOpen((v) => !v)}
              onNewChat={handleNewChat}
              theme={theme}
              onToggleTheme={toggleTheme}
              isCanvasOpen={canvasOpen}
              onToggleCanvas={() => setCanvasOpen((v) => !v)}
              onOpenLive={() => setLiveOpen(true)}
              activeGem={activeGem}
              onClearGem={() => setActiveGemId(null)}
              onOpenGemsModal={() => setGemsModalOpen(true)}
              isZeroState={isZeroState}
              onBackHome={() => setView('landing')}
              sidebarOpen={sidebarOpen}
              language={language}
              onExportChat={() => handleExportChat('txt')}
            />

            <div className="flex-1 min-h-0 flex">
              <div className="flex-1 min-w-0 flex flex-col h-full relative">
                {isZeroState ? (
                  <div className="flex-1 min-h-0 overflow-y-auto flex flex-col">
                    <ZeroState activeGem={activeGem} language={language}>
                      {promptBox}
                    </ZeroState>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 min-h-0 overflow-y-auto">
                      <div className="max-w-3xl mx-auto w-full px-4 py-6 space-y-6">
                        {messages.map((m) => (
                          <ChatMessage key={m.id} message={m} onRegenerate={m.role === 'assistant' ? () => handleRegenerate(m.id) : null} onOpenInCanvas={handleOpenInCanvas} onCopy={() => setToast('Disalin ke clipboard')} />
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    </div>
                    <div className="px-4 pb-4 pt-2 shrink-0 bg-gradient-to-t from-surface via-surface to-transparent">
                      <div className="max-w-[720px] mx-auto">{promptBox}</div>
                    </div>
                  </>
                )}
              </div>

              <CanvasWorkspace
                isOpen={canvasOpen}
                content={canvasContent}
                onChangeContent={setCanvasContent}
                onClose={() => setCanvasOpen(false)}
                onSendToChat={(text) => {
                  const t = (text || '').trim();
                  if (!t) return;
                  setInput(t);
                  setCanvasOpen(false);
                }}
              />
            </div>
          </div>
        </>
      )}

      <PersonaModal
        isOpen={gemsModalOpen}
        onClose={() => setGemsModalOpen(false)}
        gems={gems}
        onAddGem={handleAddGem}
        onDeleteGem={handleDeleteGem}
      />

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        serverInfo={serverInfo}
        theme={theme}
        onToggleTheme={toggleTheme}
        onSetTheme={handleSetTheme}
        language={language}
        onSetLanguage={handleSetLanguage}
      />

      <KalaAiLiveOverlay isOpen={liveOpen} onClose={() => setLiveOpen(false)} onTranscript={handleLiveTranscript} />
    </div>
  );
}

window.KalaAiComponents = window.KalaAiComponents || {};
window.KalaAiComponents.App = App;
window.App = App;
