// Main App â€” dua tahap: LandingView -> Chat Workspace
const {
  useState,
  useEffect,
  useRef,
  useCallback
} = React;
const DEFAULT_GEMS = [{
  id: 'gem_default_coder',
  name: 'Mentor Kode',
  instruction: 'Kamu adalah mentor pemrograman yang sabar. Jelaskan konsep dengan contoh kode bersih dan beri saran praktik terbaik.'
}, {
  id: 'gem_default_writer',
  name: 'Penulis Kreatif',
  instruction: 'Kamu adalah penulis kreatif. Gunakan bahasa yang hidup, imajinatif, dan mengalir dalam setiap jawaban.'
}];
function uid(prefix) {
  return (prefix || 'id') + '_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
}
function App() {
  const C = window.KalaAiComponents || {};
  const {
    Header,
    Sidebar,
    ZeroState,
    ChatMessage,
    PromptInputBox,
    CanvasWorkspace,
    PersonaModal,
    KalaAiLiveOverlay,
    LandingView,
    SettingsModal
  } = C;

  // ----- Theme -----
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('kali_theme') || 'light';
    } catch (e) {
      return 'light';
    }
  });
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('kali_theme', theme);
    } catch (e) {}
  }, [theme]);
  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem('kali_lang') || 'id';
    } catch (e) {
      return 'id';
    }
  });
  const handleSetLanguage = lang => {
    setLanguage(lang);
    try {
      localStorage.setItem('kali_lang', lang);
    } catch (e) {}
  };

  // --- Autentikasi ---
  const [authState, setAuthState] = useState({
    loading: true,
    enabled: false,
    authed: true
  });
  const [loginPw, setLoginPw] = useState('');
  const [oauthUser, setOauthUser] = useState(null);
  const [providers, setProviders] = useState([]);
  useEffect(() => {
    Promise.all([fetch('/api/auth-status').then(r => r.json()).catch(() => ({})), fetch('/auth/me').then(r => r.json()).catch(() => ({
      user: null
    }))]).then(([st, me]) => {
      const user = me && me.user ? me.user : null;
      setOauthUser(user);
      setProviders(st && st.providers || []);
      const loggedIn = !!user || !!st.authed;
      setAuthState({
        loading: false,
        enabled: !!st.auth_enabled || (st.providers || []).length > 0,
        authed: loggedIn
      });
    }).catch(() => setAuthState({
      loading: false,
      enabled: false,
      authed: true
    }));
  }, []);
  const doLogin = async e => {
    e.preventDefault();
    try {
      const r = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          password: loginPw
        })
      });
      if (r.ok) setAuthState(s => ({
        ...s,
        authed: true
      }));else alert('Password salah.');
    } catch (err) {
      alert('Gagal login: ' + err.message);
    }
  };
  const handleSetTheme = newTheme => {
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
    const seed = (window.initialConvos || []).map(c => ({
      ...c,
      messages: []
    }));
    return seed.length ? seed : [{
      id: uid('convo'),
      title: 'Percakapan Baru',
      pinned: false,
      messages: []
    }];
  });
  const [activeId, setActiveId] = useState(() => conversations[0]?.id || null);
  useEffect(() => {
    try {
      localStorage.setItem('kali_conversations', JSON.stringify(conversations));
    } catch (e) {}
  }, [conversations]);

  // ----- Gems -----
  const [gems, setGems] = useState(DEFAULT_GEMS);
  const [activeGemId, setActiveGemId] = useState(null);
  const activeGem = gems.find(g => g.id === activeGemId) || null;

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
    fetch('/api/info', {
      signal: controller.signal
    }).then(r => r.ok ? r.json() : null).then(data => {
      if (!cancelled && data) setServerInfo(data);
    }).catch(err => {
      if (err.name !== 'AbortError') console.error(err);
    });
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);
  const activeConvo = conversations.find(c => c.id === activeId) || null;
  const messages = activeConvo ? activeConvo.messages : [];
  const isZeroState = messages.length === 0;
  const updateConvoMessages = useCallback((convoId, updater) => {
    setConversations(prev => prev.map(c => c.id === convoId ? {
      ...c,
      messages: updater(c.messages)
    } : c));
  }, []);
  const handleNewChat = () => {
    const convo = {
      id: uid('convo'),
      title: 'Percakapan Baru',
      pinned: false,
      messages: []
    };
    setConversations(prev => [convo, ...prev]);
    setActiveId(convo.id);
    setInput('');
    setAttachments([]);
    setView('chat');
  };
  const handleSelectConvo = id => {
    setActiveId(id);
    setView('chat');
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };
  const handleTogglePin = id => {
    setConversations(prev => prev.map(c => c.id === id ? {
      ...c,
      pinned: !c.pinned
    } : c));
  };
  const handleDeleteConvo = id => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (id === activeId) {
      const remaining = conversations.filter(c => c.id !== id);
      setActiveId(remaining[0]?.id || null);
    }
  };
  const handleAddGem = gem => setGems(prev => [...prev, gem]);
  const handleDeleteGem = id => {
    setGems(prev => prev.filter(g => g.id !== id));
    if (activeGemId === id) setActiveGemId(null);
  };
  const handleOpenInCanvas = content => {
    setCanvasContent(content || '');
    setCanvasOpen(true);
  };
  const handleExportChat = (format = 'txt') => {
    if (!activeConvo) return;
    let content = '';
    activeConvo.messages.forEach(m => {
      content += `[${m.role === 'user' ? 'User' : 'Kali AI'}]\n${m.content}\n\n`;
    });
    const blob = new Blob([content], {
      type: 'text/plain;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeConvo.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const stopGeneration = () => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setIsGenerating(false);
  };
  const handleRegenerate = msgId => {
    if (!activeConvo || isGenerating) return;
    const msgs = activeConvo.messages;
    const idx = msgs.findIndex(m => m.id === msgId);
    if (idx === -1) return;
    let lastUserIdx = -1;
    for (let i = idx - 1; i >= 0; i--) {
      if (msgs[i].role === 'user') {
        lastUserIdx = i;
        break;
      }
    }
    if (lastUserIdx === -1) return;
    const lastUserMsg = msgs[lastUserIdx];
    const history = buildHistory(msgs.slice(0, lastUserIdx), lastUserMsg.content);
    updateConvoMessages(activeId, oldMsgs => oldMsgs.slice(0, idx));
    runChat(activeId, lastUserMsg.content, history);
  };
  const buildHistory = (convoMsgs, userContent) => {
    const history = convoMsgs.filter(m => m.role === 'user' || m.role === 'assistant').filter(m => !m.error).map(m => ({
      role: m.role,
      content: m.content || ''
    }));
    history.push({
      role: 'user',
      content: userContent
    });
    return history;
  };
  const runChat = async (convoId, userContent, history) => {
    const assistantId = uid('msg');
    updateConvoMessages(convoId, msgs => [...msgs, {
      id: assistantId,
      role: 'assistant',
      content: '',
      status: 'Kali AI sedang menjawab...',
      streaming: true
    }]);
    const controller = new AbortController();
    abortRef.current = controller;
    setIsGenerating(true);
    const patch = updater => updateConvoMessages(convoId, msgs => msgs.map(m => m.id === assistantId ? updater(m) : m));
    try {
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Id': convoId || 'default'
        },
        body: JSON.stringify({
          messages: history,
          search: searchEnabled,
          mode: thinkingEnabled ? 'thinking' : 'fast',
          language,
          session_id: convoId || 'default',
          attachments: (attachments || []).map(a => a.extracted).filter(Boolean),
          profile: (() => {
            try {
              return JSON.parse(localStorage.getItem('kali_profile') || '{}');
            } catch (e) {
              return {};
            }
          })(),
          images: (attachments || []).map(a => a.image).filter(Boolean),
          agentic: !!thinkingEnabled
        }),
        signal: controller.signal
      });
      if (!resp.ok) {
        let errText = 'Permintaan gagal (' + resp.status + ')';
        try {
          const j = await resp.json();
          if (j && j.detail) errText = j.detail;
        } catch (e) {}
        patch(m => ({
          ...m,
          status: null,
          error: errText,
          streaming: false
        }));
        return;
      }
      if (!resp.body) {
        patch(m => ({
          ...m,
          status: null,
          error: 'Respons server tidak dapat dibaca.',
          streaming: false
        }));
        return;
      }
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let done = false;

      // Buffer token & flush berkala (~50ms) untuk mencegah re-render per token
      let pending = '';
      let flushTimer = null;
      const flush = () => {
        if (!pending) return;
        const chunk = pending;
        pending = '';
        patch(m => ({
          ...m,
          status: null,
          content: (m.content || '') + chunk
        }));
      };
      const scheduleFlush = () => {
        if (flushTimer) return;
        flushTimer = setTimeout(() => {
          flushTimer = null;
          flush();
        }, 50);
      };
      const handleEvent = part => {
        const lines = part.split('\n');
        for (const line of lines) {
          const clean = line.replace(/\r$/, '');
          if (!clean.startsWith('data:')) continue;
          const data = clean.slice(5).trim();
          if (!data) continue;
          if (data === '[DONE]') {
            done = true;
            return;
          }
          let obj;
          try {
            obj = JSON.parse(data);
          } catch (e) {
            continue;
          }
          if (obj.error) {
            flush();
            patch(m => ({
              ...m,
              status: null,
              error: obj.error,
              streaming: false
            }));
            done = true;
            return;
          }
          if (obj.status) patch(m => ({
            ...m,
            status: obj.status
          }));
          if (obj.sources) patch(m => ({
            ...m,
            sources: obj.sources
          }));
          if (obj.delta) {
            pending += obj.delta;
            scheduleFlush();
          }
        }
      };

      // Watchdog: jika tak ada data selama 60 detik, hentikan agar UI tidak nyangkut.
      let watchdog = null;
      const armWatchdog = () => {
        if (watchdog) clearTimeout(watchdog);
        watchdog = setTimeout(() => {
          done = true;
          try {
            controller.abort();
          } catch (e) {}
        }, 60000);
      };
      armWatchdog();
      while (!done) {
        const {
          value,
          done: streamDone
        } = await reader.read();
        if (streamDone) {
          if (watchdog) {
            clearTimeout(watchdog);
            watchdog = null;
          }
          buffer += decoder.decode();
          if (buffer.trim()) handleEvent(buffer.replace(/\r\n/g, '\n'));
          break;
        }
        armWatchdog();
        buffer += decoder.decode(value, {
          stream: true
        });
        const normalized = buffer.replace(/\r\n/g, '\n');
        const parts = normalized.split('\n\n');
        buffer = parts.pop() || '';
        for (const part of parts) {
          handleEvent(part);
          if (done) break;
        }
      }
      if (flushTimer) {
        clearTimeout(flushTimer);
        flushTimer = null;
      }
      if (watchdog) {
        clearTimeout(watchdog);
        watchdog = null;
      }
      flush();
      patch(m => ({
        ...m,
        status: null,
        streaming: false
      }));
    } catch (err) {
      if (err && err.name === 'AbortError') {
        patch(m => ({
          ...m,
          status: null,
          streaming: false
        }));
      } else {
        patch(m => ({
          ...m,
          status: null,
          error: String(err && err.message ? err.message : err),
          streaming: false
        }));
      }
    } finally {
      abortRef.current = null;
      setIsGenerating(false);
    }
  };
  const handleSubmit = e => {
    if (e && e.preventDefault) e.preventDefault();
    const text = input.trim();
    if (!text && attachments.length === 0 || isGenerating) return;
    let convoId = activeId;
    if (!convoId) {
      const convo = {
        id: uid('convo'),
        title: 'Percakapan Baru',
        pinned: false,
        messages: []
      };
      setConversations(prev => [convo, ...prev]);
      setActiveId(convo.id);
      convoId = convo.id;
    }
    const userMsg = {
      id: uid('msg'),
      role: 'user',
      content: text,
      attachments: attachments.length ? attachments.slice() : undefined
    };
    const priorMessages = (conversations.find(c => c.id === convoId) || {}).messages || [];
    const history = buildHistory(priorMessages, text);
    updateConvoMessages(convoId, msgs => [...msgs, userMsg]);
    setConversations(prev => prev.map(c => c.id === convoId && (c.title === 'Percakapan Baru' || !c.title) ? {
      ...c,
      title: text.slice(0, 60) || 'Percakapan Baru'
    } : c));
    setInput('');
    setAttachments([]);
    runChat(convoId, text, history);
  };
  const handleLiveTranscript = text => {
    const clean = (text || '').trim();
    if (!clean || isGenerating) return;
    let convoId = activeId;
    if (!convoId) {
      const convo = {
        id: uid('convo'),
        title: 'Percakapan Baru',
        pinned: false,
        messages: []
      };
      setConversations(prev => [convo, ...prev]);
      setActiveId(convo.id);
      convoId = convo.id;
    }
    const userMsg = {
      id: uid('msg'),
      role: 'user',
      content: clean
    };
    const priorMessages = (conversations.find(c => c.id === convoId) || {}).messages || [];
    const history = buildHistory(priorMessages, clean);
    updateConvoMessages(convoId, msgs => [...msgs, userMsg]);
    setConversations(prev => prev.map(c => c.id === convoId && (c.title === 'Percakapan Baru' || !c.title) ? {
      ...c,
      title: clean.slice(0, 60) || 'Percakapan Baru'
    } : c));
    setView('chat');
    runChat(convoId, clean, history);
  };
  const handleSelectPrompt = prompt => setInput(prompt);
  const handleAddAttachment = att => {
    setAttachments(prev => [...prev, att]);
    // Jika objek menyertakan File asli, unggah untuk diekstrak teksnya
    if (att && att.file instanceof File && (att.type || '').startsWith('image/')) {
      // Gambar: baca sebagai data URL untuk vision (tanpa upload ke server)
      const reader = new FileReader();
      reader.onload = () => {
        setAttachments(prev => prev.map(a => a === att ? {
          ...a,
          image: reader.result
        } : a));
      };
      reader.readAsDataURL(att.file);
      return;
    }
    if (att && att.file instanceof File) {
      const fd = new FormData();
      fd.append('file', att.file);
      fetch('/api/upload', {
        method: 'POST',
        body: fd
      }).then(r => r.ok ? r.json() : null).then(j => {
        if (j && j.text) {
          setAttachments(prev => prev.map(a => a === att ? {
            ...a,
            extracted: j.text
          } : a));
        }
      }).catch(() => {});
    }
  };
  const handleRemoveAttachment = idx => setAttachments(prev => prev.filter((_, i) => i !== idx));
  const messagesEndRef = useRef(null);
  const nearBottomRef = useRef(true);
  const scrollTimerRef = useRef(null);
  useEffect(() => {
    // Auto-scroll hanya saat sudah/dekat dasar, dan di-throttle, tanpa smooth berulang
    if (!nearBottomRef.current) return;
    if (scrollTimerRef.current) return;
    scrollTimerRef.current = setTimeout(() => {
      scrollTimerRef.current = null;
      const el = messagesEndRef.current;
      if (el && el.scrollIntoView && nearBottomRef.current) {
        el.scrollIntoView({
          block: 'end'
        }); // instan, hemat
      }
    }, 60);
  }, [messages]);
  useEffect(() => () => {
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
  }, []);
  const handleChatScroll = e => {
    const el = e.currentTarget;
    nearBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
  };
  if (!Header || !Sidebar || !ZeroState || !ChatMessage || !PromptInputBox || !CanvasWorkspace || !PersonaModal || !KalaAiLiveOverlay || !LandingView) {
    return /*#__PURE__*/React.createElement("div", {
      className: "min-h-screen flex items-center justify-center bg-surface text-ink"
    }, /*#__PURE__*/React.createElement("div", {
      className: "max-w-md text-center p-6 rounded-2xl border border-border bg-card"
    }, /*#__PURE__*/React.createElement("h1", {
      className: "text-lg font-semibold mb-2"
    }, "Komponen belum termuat"), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-muted"
    }, "Pastikan semua file di static/components dimuat sebelum App.jsx.")));
  }
  const promptBox = /*#__PURE__*/React.createElement(PromptInputBox, {
    input: input,
    onChangeInput: setInput,
    onSubmit: handleSubmit,
    onStop: stopGeneration,
    isGenerating: isGenerating,
    searchEnabled: searchEnabled,
    onToggleSearch: () => setSearchEnabled(v => !v),
    thinkingEnabled: thinkingEnabled,
    onToggleThinking: () => setThinkingEnabled(v => !v),
    attachments: attachments,
    onAddAttachment: handleAddAttachment,
    onRemoveAttachment: handleRemoveAttachment,
    onOpenLive: () => setLiveOpen(true),
    language: language
  });
  if (authState.loading) {
    return /*#__PURE__*/React.createElement("div", {
      className: "h-screen w-screen flex items-center justify-center text-muted text-sm"
    }, "Memuat...");
  }
  if (authState.enabled && !authState.authed) {
    const btn = 'w-full py-2 rounded-lg text-sm font-medium border border-border bg-card hover:bg-hover text-ink transition-colors';
    return /*#__PURE__*/React.createElement("div", {
      className: "h-screen w-screen flex items-center justify-center bg-surface"
    }, /*#__PURE__*/React.createElement("div", {
      className: "p-6 rounded-2xl border border-border bg-card shadow-sm w-[340px] space-y-3"
    }, /*#__PURE__*/React.createElement("h2", {
      className: "text-lg font-semibold text-ink text-center"
    }, "Masuk ke Kali AI"), providers.includes('google') && /*#__PURE__*/React.createElement("a", {
      href: "/auth/google",
      className: btn
    }, "Masuk dengan Google"), providers.includes('github') && /*#__PURE__*/React.createElement("a", {
      href: "/auth/github",
      className: btn
    }, "Masuk dengan GitHub"), providers.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "text-center text-xs text-muted"
    }, "atau"), /*#__PURE__*/React.createElement("form", {
      onSubmit: async e => {
        e.preventDefault();
        try {
          const r = await fetch('/auth/local-login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: loginPw.email || '',
              password: loginPw.pw || ''
            })
          });
          if (r.ok || r.redirected) {
            const me = await fetch('/auth/me').then(x => x.json());
            setOauthUser(me.user);
            setAuthState(s => ({
              ...s,
              authed: !!me.user
            }));
          } else alert('Email atau password salah.');
        } catch (err) {
          alert('Gagal: ' + err.message);
        }
      },
      className: "space-y-2"
    }, /*#__PURE__*/React.createElement("input", {
      type: "email",
      placeholder: "Email",
      defaultValue: "",
      onChange: e => setLoginPw(p => ({
        ...(p || {}),
        email: e.target.value
      })),
      className: "w-full px-3 py-2 rounded-lg border border-border bg-transparent text-sm text-ink focus:outline-none focus:border-accent"
    }), /*#__PURE__*/React.createElement("input", {
      type: "password",
      placeholder: "Password",
      onChange: e => setLoginPw(p => ({
        ...(p || {}),
        pw: e.target.value
      })),
      className: "w-full px-3 py-2 rounded-lg border border-border bg-transparent text-sm text-ink focus:outline-none focus:border-accent"
    }), /*#__PURE__*/React.createElement("button", {
      type: "submit",
      className: "w-full py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover"
    }, "Masuk"))));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "h-screen w-screen flex overflow-hidden bg-surface text-ink"
  }, view === 'landing' ? /*#__PURE__*/React.createElement(LandingView, {
    language: language,
    onEnterChat: () => setView('chat'),
    onOpenCanvas: () => {
      setView('chat');
      setCanvasOpen(true);
    },
    onOpenGems: () => setGemsModalOpen(true),
    theme: theme,
    onToggleTheme: toggleTheme
  }) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Sidebar, {
    isOpen: sidebarOpen,
    onToggle: () => setSidebarOpen(v => !v),
    conversations: conversations,
    activeId: activeId,
    onSelectConvo: handleSelectConvo,
    onNewChat: handleNewChat,
    onTogglePin: handleTogglePin,
    onDeleteConvo: handleDeleteConvo,
    gems: gems,
    activeGemId: activeGemId,
    onSelectGem: setActiveGemId,
    onOpenGemsModal: () => setGemsModalOpen(true),
    serverInfo: serverInfo,
    onOpenSettings: () => setSettingsOpen(true),
    language: language
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-w-0 flex flex-col h-full"
  }, /*#__PURE__*/React.createElement(Header, {
    onToggleSidebar: () => setSidebarOpen(v => !v),
    onNewChat: handleNewChat,
    theme: theme,
    onToggleTheme: toggleTheme,
    isCanvasOpen: canvasOpen,
    onToggleCanvas: () => setCanvasOpen(v => !v),
    onOpenLive: () => setLiveOpen(true),
    activeGem: activeGem,
    onClearGem: () => setActiveGemId(null),
    onOpenGemsModal: () => setGemsModalOpen(true),
    isZeroState: isZeroState,
    onBackHome: () => setView('landing'),
    sidebarOpen: sidebarOpen,
    language: language,
    onExportChat: () => handleExportChat('txt')
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-h-0 flex"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-w-0 flex flex-col h-full relative"
  }, isZeroState ? /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-h-0 overflow-y-auto flex flex-col"
  }, /*#__PURE__*/React.createElement(ZeroState, {
    activeGem: activeGem,
    language: language
  }, promptBox)) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-h-0 overflow-y-auto chat-scroll",
    onScroll: handleChatScroll
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-3xl mx-auto w-full px-4 py-6 space-y-6"
  }, messages.map(m => /*#__PURE__*/React.createElement(ChatMessage, {
    key: m.id,
    message: m,
    language: language,
    onRegenerate: m.role === 'assistant' ? () => handleRegenerate(m.id) : null,
    onOpenInCanvas: handleOpenInCanvas,
    onCopy: () => setToast('Disalin ke clipboard')
  })), /*#__PURE__*/React.createElement("div", {
    ref: messagesEndRef
  }))), /*#__PURE__*/React.createElement("div", {
    className: "px-4 pb-4 pt-2 shrink-0 bg-gradient-to-t from-surface via-surface to-transparent"
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-[720px] mx-auto"
  }, promptBox)))), /*#__PURE__*/React.createElement(CanvasWorkspace, {
    language: language,
    isOpen: canvasOpen,
    content: canvasContent,
    onChangeContent: setCanvasContent,
    onClose: () => setCanvasOpen(false),
    onSendToChat: text => {
      const t = (text || '').trim();
      if (!t) return;
      setInput(t);
      setCanvasOpen(false);
    }
  })))), /*#__PURE__*/React.createElement(PersonaModal, {
    language: language,
    isOpen: gemsModalOpen,
    onClose: () => setGemsModalOpen(false),
    gems: gems,
    onAddGem: handleAddGem,
    onDeleteGem: handleDeleteGem
  }), /*#__PURE__*/React.createElement(SettingsModal, {
    isOpen: settingsOpen,
    onClose: () => setSettingsOpen(false),
    serverInfo: serverInfo,
    theme: theme,
    onToggleTheme: toggleTheme,
    onSetTheme: handleSetTheme,
    language: language,
    onSetLanguage: handleSetLanguage
  }), /*#__PURE__*/React.createElement(KalaAiLiveOverlay, {
    isOpen: liveOpen,
    onClose: () => setLiveOpen(false),
    onTranscript: handleLiveTranscript
  }));
}
window.KalaAiComponents = window.KalaAiComponents || {};
window.KalaAiComponents.App = App;
window.App = App;
