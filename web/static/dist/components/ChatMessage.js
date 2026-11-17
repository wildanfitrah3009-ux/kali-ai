// Komponen ChatMessage (Anti-UI-Slop: flat tonal surface, 1px border, strokeWidth={1.75})
window.KalaAiComponents = window.KalaAiComponents || {};
window.KalaAiComponents.ChatMessage = React.memo(function ChatMessage({
  message,
  language,
  onOpenInCanvas,
  onCopy,
  onRegenerate
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
    return /*#__PURE__*/React.createElement("div", {
      className: "flex justify-end w-full msg-enter"
    }, /*#__PURE__*/React.createElement("div", {
      className: "max-w-[82%] sm:max-w-[72%] rounded-2xl rounded-tr-md px-4 py-3 bg-accent-soft border border-accent/20 text-ink text-sm leading-relaxed whitespace-pre-wrap bubble-hover"
    }, message.attachments && message.attachments.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap gap-1.5 mb-2"
    }, message.attachments.map((file, idx) => /*#__PURE__*/React.createElement("span", {
      key: idx,
      className: "inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-border bg-card text-[11px] font-mono text-muted"
    }, /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      className: "w-3 h-3",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 1.75,
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"
    })), file.name))), message.content));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-3 w-full msg-enter"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ai-avatar w-8 h-8 shrink-0 mt-0.5 flex items-center justify-center"
  }, window.KalaAiComponents && window.KalaAiComponents.Logo ? React.createElement(window.KalaAiComponents.Logo, {
    className: 'w-8 h-8'
  }) : null), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-w-0 space-y-2.5"
  }, message.status && !message.content && /*#__PURE__*/React.createElement("div", {
    className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-card text-xs text-muted msg-enter"
  }, /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "typing-dot"
  }), /*#__PURE__*/React.createElement("span", {
    className: "typing-dot"
  }), /*#__PURE__*/React.createElement("span", {
    className: "typing-dot"
  })), /*#__PURE__*/React.createElement("span", null, message.status)), message.thinking && /*#__PURE__*/React.createElement("div", {
    className: "rounded-lg border border-border bg-card overflow-hidden"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setThinkingOpen(prev => !prev),
    className: "w-full flex items-center justify-between px-3 py-2 text-xs text-muted hover:bg-hover transition-colors"
  }, /*#__PURE__*/React.createElement("span", {
    className: "flex items-center gap-2 font-medium"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    className: "w-3.5 h-3.5 text-accent",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "10"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 16v-4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 8h.01"
  })), /*#__PURE__*/React.createElement("span", null, "Proses Penalaran")), /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    className: `w-3.5 h-3.5 transition-transform ${thinkingOpen ? 'rotate-180' : ''}`,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "6 9 12 15 18 9"
  }))), thinkingOpen && /*#__PURE__*/React.createElement("div", {
    className: "px-3.5 py-2.5 border-t border-border bg-surface text-xs text-muted leading-relaxed whitespace-pre-wrap"
  }, message.thinking)), message.sources && message.sources.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-1.5"
  }, message.sources.map((src, idx) => /*#__PURE__*/React.createElement("a", {
    key: idx,
    href: src.url,
    target: "_blank",
    rel: "noopener noreferrer",
    className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border bg-card hover:bg-hover text-[11px] text-muted hover:text-ink transition-colors max-w-[220px]"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-accent"
  }, "[", idx + 1, "]"), /*#__PURE__*/React.createElement("span", {
    className: "truncate"
  }, src.title)))), message.error ? /*#__PURE__*/React.createElement("div", {
    className: "rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs text-red-600 dark:text-red-400"
  }, message.error) : message.content ? /*#__PURE__*/React.createElement("div", {
    className: "rounded-2xl border border-border bg-card px-4 py-3.5 text-sm text-ink leading-relaxed bubble-hover"
  }, /*#__PURE__*/React.createElement(FormattedContent, {
    content: message.content,
    onOpenInCanvas: onOpenInCanvas
  }), message.streaming && /*#__PURE__*/React.createElement("span", {
    className: "inline-block w-1.5 h-4 ml-1 align-middle bg-accent animate-pulse"
  })) : message.streaming ? /*#__PURE__*/React.createElement("div", {
    className: "rounded-2xl border border-border bg-card px-4 py-3.5 text-sm text-muted flex items-center gap-2.5 bubble-hover"
  }, /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "typing-dot"
  }), /*#__PURE__*/React.createElement("span", {
    className: "typing-dot"
  }), /*#__PURE__*/React.createElement("span", {
    className: "typing-dot"
  })), /*#__PURE__*/React.createElement("span", null, "Kali sedang berpikir")) : null, message.content && !message.streaming && /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5 pt-0.5"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: handleCopy,
    className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border bg-card hover:bg-hover text-[11px] text-muted hover:text-ink transition-colors"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    className: "w-3.5 h-3.5",
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
  }))), /*#__PURE__*/React.createElement("span", null, copied ? 'Tersalin' : 'Salin')), onRegenerate && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      try {
        const u = new SpeechSynthesisUtterance(message.content || '');
        u.lang = language === 'en' ? 'en-US' : language === 'ja' ? 'ja-JP' : language === 'zh' ? 'zh-CN' : language === 'ko' ? 'ko-KR' : 'id-ID';
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(u);
      } catch (e) {}
    },
    title: "Putar suara",
    className: "inline-flex items-center gap-1 px-2 py-1 rounded-md border border-border bg-card hover:bg-hover text-[11px] text-muted hover:text-ink transition-colors"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    className: "w-3.5 h-3.5",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("polygon", {
    points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M15.54 8.46a5 5 0 0 1 0 7.07"
  }))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onRegenerate,
    title: window.getKaliText ? window.getKaliText('regenerate', language) : 'Ulangi Jawaban',
    className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border bg-card hover:bg-hover text-[11px] text-muted hover:text-ink transition-colors ml-1"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    className: "w-3.5 h-3.5",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M21 3v5h-5"
  })), /*#__PURE__*/React.createElement("span", null, "Ulangi"))))));
}, (prev, next) => {
  // Hanya re-render bila data pesan berubah (abaikan identitas callback)
  return prev.message === next.message;
});
function safeMarkedParse(text, opts) {
  // Dukung marked v5+ (window.marked = fungsi) dan versi lama (objek .parse).
  const m = window.marked;
  if (!m) return null;
  try {
    if (typeof m === 'function') return m(text, opts);
    if (typeof m.parse === 'function') return m.parse(text, opts);
  } catch (e) {
    return null;
  }
  return null;
}
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

  // Jika seluruh jawaban dibungkus satu blok kode ```...```, buka pembungkusnya
  // agar heading, tabel, dan teks dirender sebagai Markdown (bukan kode hitam).
  const _fence = chatText.trim().match(/^```[\w-]*\n([\s\S]*?)\n```$/);
  if (_fence) chatText = _fence[1];
  const html = React.useMemo(() => {
    const parsed = safeMarkedParse(chatText, {
      breaks: true
    });
    if (parsed == null) {
      // Fallback aman: escape HTML agar teks tampil apa adanya, bukan tag mentah
      const esc = chatText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>');
      return esc;
    }
    try {
      const rawHtml = parsed;
      const parser = new DOMParser();
      const doc = parser.parseFromString(rawHtml, 'text/html');
      doc.querySelectorAll('pre code').forEach(block => {
        // Hanya blok dengan bahasa eksplisit yang dianggap kode; jika tidak ada
        // kelas language-*, biarkan apa adanya (jangan disorot/dianggap kode).
        if (window.hljs && /\blanguage-/.test(block.className || '')) {
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
      // Hanya tandai sebagai blok kode bila punya bahasa (pre code.language-*).
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
  }, [html]);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    ref: containerRef,
    className: "prose prose-sm dark:prose-invert max-w-none break-words prose-p:my-1.5 prose-ul:my-1.5 prose-ol:my-1.5 prose-li:my-0.5 prose-headings:mt-3 prose-headings:mb-1.5 prose-pre:my-2 prose-table:w-full prose-table:text-xs prose-pre:overflow-x-auto prose-headings:scroll-mt-16",
    dangerouslySetInnerHTML: {
      __html: html
    }
  }), artifactText && /*#__PURE__*/React.createElement("div", {
    className: "mt-3 flex flex-wrap items-center gap-2"
  }, onOpenInCanvas && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => onOpenInCanvas(artifactText),
    className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-accent/30 bg-accent/10 text-accent text-xs font-medium hover:bg-accent/20 transition-colors"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    className: "w-3.5 h-3.5",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "14 2 14 8 20 8"
  })), "Buka di Canvas"), /*#__PURE__*/React.createElement("button", {
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
    className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-card text-muted hover:text-ink hover:bg-hover text-xs font-medium transition-colors"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    className: "w-3.5 h-3.5",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
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
  })), "Unduh")));
}