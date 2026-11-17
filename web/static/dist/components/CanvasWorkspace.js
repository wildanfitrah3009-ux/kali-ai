// Komponen Split-Screen Canvas Workspace (Anti-UI-Slop: flat tonal surface, 1px border, strokeWidth={1.75})
window.KalaAiComponents = window.KalaAiComponents || {};
window.KalaAiComponents.CanvasWorkspace = function CanvasWorkspace({
  language,
  isOpen,
  content,
  onChangeContent,
  onClose,
  onSendToChat
}) {
  const {
    useState,
    useMemo,
    useRef,
    useEffect
  } = React;
  const [tab, setTab] = useState('preview'); // 'editor' | 'preview' (default pratinjau agar Markdown rapi)
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const previewRef = useRef(null);
  const stripWrapperFence = raw => {
    // Jika seluruh konten dibungkus satu blok kode ```...```, buka pembungkusnya
    // agar Markdown (heading, bold, list) dirender sebagai format asli.
    const s = (raw || '').trim();
    const m = s.match(/^```[\w-]*\n([\s\S]*?)\n```$/);
    return m ? m[1] : raw;
  };
  const renderedHtml = useMemo(() => {
    const text = stripWrapperFence(content || '');
    if (!text) return '';
    const parse = (t, o) => {
      const m = window.marked;
      if (!m) return null;
      try {
        if (typeof m === 'function') return m(t, o);
        if (typeof m.parse === 'function') return m.parse(t, o);
      } catch (e) {
        return null;
      }
      return null;
    };
    const parsed = parse(text, {
      breaks: true
    });
    if (parsed == null) {
      // Fallback: escape agar tidak menampilkan tag mentah, tapi tetap rapi.
      return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>');
    }
    try {
      const rawHtml = parsed;
      const parser = new DOMParser();
      const doc = parser.parseFromString(rawHtml, 'text/html');
      doc.querySelectorAll('pre code').forEach(block => {
        if (window.hljs) {
          try {
            window.hljs.highlightElement(block);
          } catch (e) {}
        }
      });
      return doc.body.innerHTML;
    } catch (e) {
      return text;
    }
  }, [content]);
  useEffect(() => {
    if (tab !== 'preview' || !previewRef.current) return;
    const pres = previewRef.current.querySelectorAll('pre');
    pres.forEach(pre => {
      if (pre.querySelector('.copy-code-btn')) return;
      const codeEl = pre.querySelector('code');
      if (!codeEl || !/\blanguage-/.test(codeEl.className || '')) return;
      pre.style.position = 'relative';
      const btn = document.createElement('button');
      btn.className = 'copy-code-btn';
      btn.innerText = 'Salin Kode';
      btn.style.cssText = 'position:absolute;top:8px;right:8px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:#e2e8f0;font-size:11px;padding:2px 6px;border-radius:4px;cursor:pointer;';
      btn.onclick = () => {
        const code = pre.querySelector('code');
        if (code) {
          navigator.clipboard.writeText(code.innerText);
          btn.innerText = 'Tersalin!';
          setTimeout(() => {
            btn.innerText = 'Salin Kode';
          }, 2000);
        }
      };
      pre.appendChild(btn);
    });
  }, [renderedHtml, tab]);
  if (!isOpen) return null;
  const handleCopy = async () => {
    const text = content || '';
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      console.warn('Copy gagal:', err);
    }
  };
  const handleExport = async fmt => {
    setExportOpen(false);
    const text = stripWrapperFence(content || '');
    if (!text.trim()) return;
    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: text,
          format: fmt,
          title: 'Dokumen Kali AI'
        })
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'kali-ai.' + fmt;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) {
      alert('Gagal mengekspor: ' + e.message);
    }
  };
  const handleSendToChat = () => {
    if (!onSendToChat) return;
    onSendToChat(content || '');
    setSent(true);
    setTimeout(() => setSent(false), 1800);
  };
  return /*#__PURE__*/React.createElement("section", {
    className: "w-full lg:w-[46%] xl:w-[48%] h-full flex flex-col border-l border-border bg-card shrink-0 z-20 animate-fade-in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-14 px-4 flex items-center justify-between border-b border-border bg-sidebar shrink-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "flex items-center justify-center w-7 h-7 rounded-lg border border-border bg-card text-accent"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    className: "w-4 h-4",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "14 2 14 8 20 8"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "text-xs font-semibold text-ink"
  }, "Canvas Dokumen"), /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] font-mono text-muted"
  }, (content || '').length, " karakter"))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex rounded-lg border border-border bg-surface p-0.5"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setTab('editor'),
    className: `px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${tab === 'editor' ? 'bg-card text-ink border border-border' : 'text-muted hover:text-ink'}`
  }, "Editor"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setTab('preview'),
    className: `px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${tab === 'preview' ? 'bg-card text-ink border border-border' : 'text-muted hover:text-ink'}`
  }, "Pratinjau")), onSendToChat && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: handleSendToChat,
    disabled: !(content || '').trim(),
    title: window.getKaliText ? window.getKaliText('canvasSend', language) : 'Kirim isi Canvas ke kotak chat',
    className: "inline-flex items-center gap-1 px-2 py-1.5 rounded-lg border border-accent/30 bg-accent/10 hover:bg-accent/20 text-accent text-[11px] font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    className: "w-3.5 h-3.5",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "22",
    y1: "2",
    x2: "11",
    y2: "13"
  }), /*#__PURE__*/React.createElement("polygon", {
    points: "22 2 15 22 11 13 2 9 22 2"
  })), /*#__PURE__*/React.createElement("span", null, sent ? 'Terkirim' : 'Kirim ke chat')), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: handleCopy,
    title: window.getKaliText ? window.getKaliText('canvasCopy', language) : 'Salin isi Canvas',
    className: "p-1.5 rounded-lg border border-border bg-card hover:bg-hover text-muted hover:text-ink transition-colors"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    className: "w-4 h-4",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, copied ? /*#__PURE__*/React.createElement("polyline", {
    points: "20 6 9 17 4 12"
  }) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
    x: "9",
    y: "9",
    width: "13",
    height: "13",
    rx: "2",
    ry: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setExportOpen(v => !v),
    title: window.getKaliText ? window.getKaliText('canvasDownload', language) : 'Unduh dokumen',
    className: "p-1.5 rounded-lg border border-border bg-card hover:bg-hover text-muted hover:text-ink transition-colors"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    className: "w-4 h-4",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "7 10 12 15 17 10"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "15",
    x2: "12",
    y2: "3"
  }))), exportOpen && /*#__PURE__*/React.createElement("div", {
    className: "absolute right-0 mt-1 z-20 min-w-[150px] rounded-lg border border-border bg-card shadow-lg overflow-hidden"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => handleExport('docx'),
    className: "block w-full text-left px-3 py-2 text-xs text-ink hover:bg-hover"
  }, "Word (.docx)"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => handleExport('xlsx'),
    className: "block w-full text-left px-3 py-2 text-xs text-ink hover:bg-hover"
  }, "Excel (.xlsx)"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => handleExport('pptx'),
    className: "block w-full text-left px-3 py-2 text-xs text-ink hover:bg-hover"
  }, "PowerPoint (.pptx)"))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClose,
    title: window.getKaliText ? window.getKaliText('canvasClose', language) : 'Tutup Canvas',
    className: "p-1.5 rounded-lg border border-border bg-card hover:bg-hover text-muted hover:text-ink transition-colors"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    className: "w-4 h-4",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 overflow-hidden bg-surface"
  }, tab === 'editor' ? /*#__PURE__*/React.createElement("textarea", {
    value: content,
    onChange: e => onChangeContent(e.target.value),
    placeholder: "Tulis atau tempel draf dokumen, kode, atau catatan di sini...",
    className: "w-full h-full p-5 bg-surface text-ink font-mono text-xs leading-relaxed resize-none focus:outline-none"
  }) : /*#__PURE__*/React.createElement("div", {
    className: "w-full h-full p-6 overflow-y-auto"
  }, content ? /*#__PURE__*/React.createElement("div", {
    ref: previewRef,
    className: "prose prose-sm dark:prose-invert max-w-none text-sm text-ink leading-relaxed break-words",
    dangerouslySetInnerHTML: {
      __html: renderedHtml
    }
  }) : /*#__PURE__*/React.createElement("span", {
    className: "text-muted italic text-sm"
  }, "Belum ada konten untuk ditampilkan."))));
};