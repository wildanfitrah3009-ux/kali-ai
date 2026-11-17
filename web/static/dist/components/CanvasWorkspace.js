import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";
// Komponen Split-Screen Canvas Workspace (Anti-UI-Slop: flat tonal surface, 1px border, strokeWidth={1.75})
window.KalaAiComponents = window.KalaAiComponents || {};
window.KalaAiComponents.CanvasWorkspace = function CanvasWorkspace({
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
  const [tab, setTab] = useState('editor'); // 'editor' | 'preview'
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const previewRef = useRef(null);
  const renderedHtml = useMemo(() => {
    const text = content || '';
    if (!text) return '';
    if (!window.marked) return text;
    try {
      const rawHtml = window.marked.parse(text, {
        breaks: true
      });
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
  const handleDownload = () => {
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Dokumen Kali AI</title></head>
      <body style="font-family: Arial, sans-serif; font-size: 12pt; line-height: 1.5;">
        ${(content || '').replace(/\n/g, '<br>')}
      </body></html>
    `;
    const blob = new Blob(['\ufeff', htmlContent], {
      type: 'application/msword'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kali-ai-dokumen.doc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const handleSendToChat = () => {
    if (!onSendToChat) return;
    onSendToChat(content || '');
    setSent(true);
    setTimeout(() => setSent(false), 1800);
  };
  return /*#__PURE__*/_jsxDEV("section", {
    className: "w-full lg:w-[46%] xl:w-[48%] h-full flex flex-col border-l border-border bg-card shrink-0 z-20 animate-fade-in",
    children: [/*#__PURE__*/_jsxDEV("div", {
      className: "h-14 px-4 flex items-center justify-between border-b border-border bg-sidebar shrink-0",
      children: [/*#__PURE__*/_jsxDEV("div", {
        className: "flex items-center gap-2",
        children: [/*#__PURE__*/_jsxDEV("span", {
          className: "flex items-center justify-center w-7 h-7 rounded-lg border border-border bg-card text-accent",
          children: /*#__PURE__*/_jsxDEV("svg", {
            viewBox: "0 0 24 24",
            className: "w-4 h-4",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: 1.75,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: [/*#__PURE__*/_jsxDEV("path", {
              d: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"
            }, void 0, false), /*#__PURE__*/_jsxDEV("polyline", {
              points: "14 2 14 8 20 8"
            }, void 0, false)]
          }, void 0, true)
        }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
          children: [/*#__PURE__*/_jsxDEV("h2", {
            className: "text-xs font-semibold text-ink",
            children: "Canvas Dokumen"
          }, void 0, false), /*#__PURE__*/_jsxDEV("p", {
            className: "text-[10px] font-mono text-muted",
            children: [(content || '').length, " karakter"]
          }, void 0, true)]
        }, void 0, true)]
      }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
        className: "flex items-center gap-1.5",
        children: [/*#__PURE__*/_jsxDEV("div", {
          className: "flex rounded-lg border border-border bg-surface p-0.5",
          children: [/*#__PURE__*/_jsxDEV("button", {
            type: "button",
            onClick: () => setTab('editor'),
            className: `px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${tab === 'editor' ? 'bg-card text-ink border border-border' : 'text-muted hover:text-ink'}`,
            children: "Editor"
          }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
            type: "button",
            onClick: () => setTab('preview'),
            className: `px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${tab === 'preview' ? 'bg-card text-ink border border-border' : 'text-muted hover:text-ink'}`,
            children: "Pratinjau"
          }, void 0, false)]
        }, void 0, true), onSendToChat && /*#__PURE__*/_jsxDEV("button", {
          type: "button",
          onClick: handleSendToChat,
          disabled: !(content || '').trim(),
          title: "Kirim isi Canvas ke kotak chat",
          className: "inline-flex items-center gap-1 px-2 py-1.5 rounded-lg border border-accent/30 bg-accent/10 hover:bg-accent/20 text-accent text-[11px] font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
          children: [/*#__PURE__*/_jsxDEV("svg", {
            viewBox: "0 0 24 24",
            className: "w-3.5 h-3.5",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: 1.75,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: [/*#__PURE__*/_jsxDEV("line", {
              x1: "22",
              y1: "2",
              x2: "11",
              y2: "13"
            }, void 0, false), /*#__PURE__*/_jsxDEV("polygon", {
              points: "22 2 15 22 11 13 2 9 22 2"
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("span", {
            children: sent ? 'Terkirim' : 'Kirim ke chat'
          }, void 0, false)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("button", {
          type: "button",
          onClick: handleCopy,
          title: "Salin isi Canvas",
          className: "p-1.5 rounded-lg border border-border bg-card hover:bg-hover text-muted hover:text-ink transition-colors",
          children: /*#__PURE__*/_jsxDEV("svg", {
            viewBox: "0 0 24 24",
            className: "w-4 h-4",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: 1.75,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: copied ? /*#__PURE__*/_jsxDEV("polyline", {
              points: "20 6 9 17 4 12"
            }, void 0, false) : /*#__PURE__*/_jsxDEV(_Fragment, {
              children: [/*#__PURE__*/_jsxDEV("rect", {
                x: "9",
                y: "9",
                width: "13",
                height: "13",
                rx: "2",
                ry: "2"
              }, void 0, false), /*#__PURE__*/_jsxDEV("path", {
                d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
              }, void 0, false)]
            }, void 0, true)
          }, void 0, false)
        }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
          type: "button",
          onClick: handleDownload,
          title: "Unduh sebagai dokumen Word (.doc)",
          className: "p-1.5 rounded-lg border border-border bg-card hover:bg-hover text-muted hover:text-ink transition-colors",
          children: /*#__PURE__*/_jsxDEV("svg", {
            viewBox: "0 0 24 24",
            className: "w-4 h-4",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: 1.75,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: [/*#__PURE__*/_jsxDEV("path", {
              d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
            }, void 0, false), /*#__PURE__*/_jsxDEV("polyline", {
              points: "7 10 12 15 17 10"
            }, void 0, false), /*#__PURE__*/_jsxDEV("line", {
              x1: "12",
              y1: "15",
              x2: "12",
              y2: "3"
            }, void 0, false)]
          }, void 0, true)
        }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
          type: "button",
          onClick: onClose,
          title: "Tutup Canvas",
          className: "p-1.5 rounded-lg border border-border bg-card hover:bg-hover text-muted hover:text-ink transition-colors",
          children: /*#__PURE__*/_jsxDEV("svg", {
            viewBox: "0 0 24 24",
            className: "w-4 h-4",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: 1.75,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: [/*#__PURE__*/_jsxDEV("line", {
              x1: "18",
              y1: "6",
              x2: "6",
              y2: "18"
            }, void 0, false), /*#__PURE__*/_jsxDEV("line", {
              x1: "6",
              y1: "6",
              x2: "18",
              y2: "18"
            }, void 0, false)]
          }, void 0, true)
        }, void 0, false)]
      }, void 0, true)]
    }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
      className: "flex-1 overflow-hidden bg-surface",
      children: tab === 'editor' ? /*#__PURE__*/_jsxDEV("textarea", {
        value: content,
        onChange: e => onChangeContent(e.target.value),
        placeholder: "Tulis atau tempel draf dokumen, kode, atau catatan di sini...",
        className: "w-full h-full p-5 bg-surface text-ink font-mono text-xs leading-relaxed resize-none focus:outline-none"
      }, void 0, false) : /*#__PURE__*/_jsxDEV("div", {
        className: "w-full h-full p-6 overflow-y-auto",
        children: content ? /*#__PURE__*/_jsxDEV("div", {
          ref: previewRef,
          className: "prose prose-sm dark:prose-invert max-w-none text-sm text-ink leading-relaxed break-words",
          dangerouslySetInnerHTML: {
            __html: renderedHtml
          }
        }, void 0, false) : /*#__PURE__*/_jsxDEV("span", {
          className: "text-muted italic text-sm",
          children: "Belum ada konten untuk ditampilkan."
        }, void 0, false)
      }, void 0, false)
    }, void 0, false)]
  }, void 0, true);
};