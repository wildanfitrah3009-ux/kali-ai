import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";
// Komponen ChatMessage (Anti-UI-Slop: flat tonal surface, 1px border, strokeWidth={1.75})
window.KalaAiComponents = window.KalaAiComponents || {};
window.KalaAiComponents.ChatMessage = React.memo(function ChatMessage({
  message,
  onOpenInCanvas,
  onCopy
}) {
  const {
    useState
  } = React;
  const [thinkingOpen, setThinkingOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const handleCopy = async () => {
    const text = message.content || '';
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
      if (onCopy) onCopy();
      setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      console.warn('Copy gagal:', err);
    }
  };
  if (isUser) {
    return /*#__PURE__*/_jsxDEV("div", {
      className: "flex justify-end w-full animate-fade-in",
      children: /*#__PURE__*/_jsxDEV("div", {
        className: "max-w-[82%] sm:max-w-[72%] rounded-2xl rounded-tr-md px-4 py-3 bg-accent-soft border border-accent/20 text-ink text-sm leading-relaxed whitespace-pre-wrap",
        children: [message.attachments && message.attachments.length > 0 && /*#__PURE__*/_jsxDEV("div", {
          className: "flex flex-wrap gap-1.5 mb-2",
          children: message.attachments.map((file, idx) => /*#__PURE__*/_jsxDEV("span", {
            className: "inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-border bg-card text-[11px] font-mono text-muted",
            children: [/*#__PURE__*/_jsxDEV("svg", {
              viewBox: "0 0 24 24",
              className: "w-3 h-3",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: 1.75,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              children: /*#__PURE__*/_jsxDEV("path", {
                d: "m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"
              }, void 0, false)
            }, void 0, false), file.name]
          }, idx, true))
        }, void 0, false), message.content]
      }, void 0, true)
    }, void 0, false);
  }
  return /*#__PURE__*/_jsxDEV("div", {
    className: "flex items-start gap-3 w-full animate-fade-in",
    children: [/*#__PURE__*/_jsxDEV("div", {
      className: "w-8 h-8 rounded-lg border border-border bg-card flex items-center justify-center shrink-0 mt-0.5 text-accent",
      children: /*#__PURE__*/_jsxDEV("svg", {
        viewBox: "0 0 24 24",
        className: "w-4 h-4",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.75,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [/*#__PURE__*/_jsxDEV("polygon", {
          points: "12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"
        }, void 0, false), /*#__PURE__*/_jsxDEV("line", {
          x1: "12",
          y1: "22",
          x2: "12",
          y2: "12"
        }, void 0, false), /*#__PURE__*/_jsxDEV("line", {
          x1: "22",
          y1: "8.5",
          x2: "12",
          y2: "12"
        }, void 0, false), /*#__PURE__*/_jsxDEV("line", {
          x1: "2",
          y1: "8.5",
          x2: "12",
          y2: "12"
        }, void 0, false)]
      }, void 0, true)
    }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
      className: "flex-1 min-w-0 space-y-2.5",
      children: [message.status && !message.content && /*#__PURE__*/_jsxDEV("div", {
        className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-card text-xs text-muted",
        children: [/*#__PURE__*/_jsxDEV("span", {
          className: "w-1.5 h-1.5 rounded-full bg-accent animate-pulse"
        }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
          children: message.status
        }, void 0, false)]
      }, void 0, true), message.thinking && /*#__PURE__*/_jsxDEV("div", {
        className: "rounded-lg border border-border bg-card overflow-hidden",
        children: [/*#__PURE__*/_jsxDEV("button", {
          type: "button",
          onClick: () => setThinkingOpen(prev => !prev),
          className: "w-full flex items-center justify-between px-3 py-2 text-xs text-muted hover:bg-hover transition-colors",
          children: [/*#__PURE__*/_jsxDEV("span", {
            className: "flex items-center gap-2 font-medium",
            children: [/*#__PURE__*/_jsxDEV("svg", {
              viewBox: "0 0 24 24",
              className: "w-3.5 h-3.5 text-accent",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: 1.75,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              children: [/*#__PURE__*/_jsxDEV("circle", {
                cx: "12",
                cy: "12",
                r: "10"
              }, void 0, false), /*#__PURE__*/_jsxDEV("path", {
                d: "M12 16v-4"
              }, void 0, false), /*#__PURE__*/_jsxDEV("path", {
                d: "M12 8h.01"
              }, void 0, false)]
            }, void 0, true), /*#__PURE__*/_jsxDEV("span", {
              children: "Proses Penalaran"
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("svg", {
            viewBox: "0 0 24 24",
            className: `w-3.5 h-3.5 transition-transform ${thinkingOpen ? 'rotate-180' : ''}`,
            fill: "none",
            stroke: "currentColor",
            strokeWidth: 1.75,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: /*#__PURE__*/_jsxDEV("polyline", {
              points: "6 9 12 15 18 9"
            }, void 0, false)
          }, void 0, false)]
        }, void 0, true), thinkingOpen && /*#__PURE__*/_jsxDEV("div", {
          className: "px-3.5 py-2.5 border-t border-border bg-surface text-xs text-muted leading-relaxed whitespace-pre-wrap",
          children: message.thinking
        }, void 0, false)]
      }, void 0, true), message.sources && message.sources.length > 0 && /*#__PURE__*/_jsxDEV("div", {
        className: "flex flex-wrap gap-1.5",
        children: message.sources.map((src, idx) => /*#__PURE__*/_jsxDEV("a", {
          href: src.url,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border bg-card hover:bg-hover text-[11px] text-muted hover:text-ink transition-colors max-w-[220px]",
          children: [/*#__PURE__*/_jsxDEV("span", {
            className: "font-mono text-accent",
            children: ["[", idx + 1, "]"]
          }, void 0, true), /*#__PURE__*/_jsxDEV("span", {
            className: "truncate",
            children: src.title
          }, void 0, false)]
        }, idx, true))
      }, void 0, false), message.error ? /*#__PURE__*/_jsxDEV("div", {
        className: "rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs text-red-600 dark:text-red-400",
        children: message.error
      }, void 0, false) : message.content && /*#__PURE__*/_jsxDEV("div", {
        className: "rounded-2xl border border-border bg-card px-4 py-3.5 text-sm text-ink leading-relaxed",
        children: [/*#__PURE__*/_jsxDEV(FormattedContent, {
          content: message.content,
          onOpenInCanvas: onOpenInCanvas
        }, void 0, false), message.streaming && /*#__PURE__*/_jsxDEV("span", {
          className: "inline-block w-1.5 h-4 ml-1 align-middle bg-accent animate-pulse"
        }, void 0, false)]
      }, void 0, true), message.content && !message.streaming && /*#__PURE__*/_jsxDEV("div", {
        className: "flex items-center gap-1.5 pt-0.5",
        children: [/*#__PURE__*/_jsxDEV("button", {
          type: "button",
          onClick: handleCopy,
          className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border bg-card hover:bg-hover text-[11px] text-muted hover:text-ink transition-colors",
          children: [/*#__PURE__*/_jsxDEV("svg", {
            viewBox: "0 0 24 24",
            className: "w-3.5 h-3.5",
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
          }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
            children: copied ? 'Tersalin' : 'Salin'
          }, void 0, false)]
        }, void 0, true), onRegenerate && /*#__PURE__*/_jsxDEV("button", {
          type: "button",
          onClick: onRegenerate,
          title: "Ulangi Jawaban",
          className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border bg-card hover:bg-hover text-[11px] text-muted hover:text-ink transition-colors ml-1",
          children: [/*#__PURE__*/_jsxDEV("svg", {
            viewBox: "0 0 24 24",
            className: "w-3.5 h-3.5",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: 1.75,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: [/*#__PURE__*/_jsxDEV("path", {
              d: "M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"
            }, void 0, false), /*#__PURE__*/_jsxDEV("path", {
              d: "M21 3v5h-5"
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("span", {
            children: "Ulangi"
          }, void 0, false)]
        }, void 0, true)]
      }, void 0, true)]
    }, void 0, true)]
  }, void 0, true);
}, (prev, next) => {
  // Hanya re-render bila data pesan berubah (abaikan identitas callback)
  return prev.message === next.message;
});
function FormattedContent({
  content,
  onOpenInCanvas
}) {
  const containerRef = React.useRef(null);

  // Pisahkan teks chat biasa dengan dokumen Artifact (Word)
  const artifactMatch = content.match(/\[ARTIFACT\]([\s\S]*?)\[\/ARTIFACT\]/);
  let chatText = content;
  let artifactText = null;
  if (artifactMatch) {
    artifactText = artifactMatch[1].trim();
    chatText = content.replace(/\[ARTIFACT\][\s\S]*?\[\/ARTIFACT\]/, '\n\n*(Dokumen dibuat dan dibuka di panel Canvas)*').trim();
  }
  const html = React.useMemo(() => {
    if (!window.marked) {
      // Fallback aman: escape HTML agar teks tampil apa adanya, bukan tag mentah
      const esc = chatText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>');
      return esc;
    }
    try {
      const rawHtml = window.marked.parse(chatText, {
        breaks: true
      });
      const parser = new DOMParser();
      const doc = parser.parseFromString(rawHtml, 'text/html');
      doc.querySelectorAll('pre code').forEach(block => {
        if (window.hljs) {
          window.hljs.highlightElement(block);
        }
      });
      return doc.body.innerHTML;
    } catch (e) {
      return chatText;
    }
  }, [chatText]);
  React.useEffect(() => {
    if (!containerRef.current) return;
    const pres = containerRef.current.querySelectorAll('pre');
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
  }, [html]);
  return /*#__PURE__*/_jsxDEV("div", {
    children: [/*#__PURE__*/_jsxDEV("div", {
      ref: containerRef,
      className: "prose prose-sm dark:prose-invert max-w-none break-words prose-p:my-1.5 prose-ul:my-1.5 prose-ol:my-1.5 prose-li:my-0.5 prose-headings:mt-3 prose-headings:mb-1.5 prose-pre:my-2 prose-table:w-full prose-table:text-xs prose-pre:overflow-x-auto prose-headings:scroll-mt-16",
      dangerouslySetInnerHTML: {
        __html: html
      }
    }, void 0, false), artifactText && /*#__PURE__*/_jsxDEV("div", {
      className: "mt-3 flex flex-wrap items-center gap-2",
      children: [onOpenInCanvas && /*#__PURE__*/_jsxDEV("button", {
        type: "button",
        onClick: () => onOpenInCanvas(artifactText),
        className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-accent/30 bg-accent/10 text-accent text-xs font-medium hover:bg-accent/20 transition-colors",
        children: [/*#__PURE__*/_jsxDEV("svg", {
          viewBox: "0 0 24 24",
          className: "w-3.5 h-3.5",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: 2,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          children: [/*#__PURE__*/_jsxDEV("path", {
            d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
          }, void 0, false), /*#__PURE__*/_jsxDEV("polyline", {
            points: "14 2 14 8 20 8"
          }, void 0, false)]
        }, void 0, true), "Buka di Canvas"]
      }, void 0, true), /*#__PURE__*/_jsxDEV("button", {
        type: "button",
        onClick: () => {
          const blob = new Blob([artifactText], {
            type: 'text/plain;charset=utf-8'
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'dokumen-kali.txt';
          a.click();
          URL.revokeObjectURL(url);
        },
        className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-card text-muted hover:text-ink hover:bg-hover text-xs font-medium transition-colors",
        children: [/*#__PURE__*/_jsxDEV("svg", {
          viewBox: "0 0 24 24",
          className: "w-3.5 h-3.5",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: 2,
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
        }, void 0, true), "Unduh"]
      }, void 0, true)]
    }, void 0, true)]
  }, void 0, true);
}