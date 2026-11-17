// Komponen Split-Screen Canvas Workspace (Anti-UI-Slop: flat tonal surface, 1px border, strokeWidth={1.75})
window.KalaAiComponents = window.KalaAiComponents || {};

window.KalaAiComponents.CanvasWorkspace = function CanvasWorkspace({
  isOpen,
  content,
  onChangeContent,
  onClose,
}) {
  const { useState } = React;
  const [tab, setTab] = useState('editor'); // 'editor' | 'preview'
  const [copied, setCopied] = useState(false);

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
    const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kali-ai-dokumen.doc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <section className="w-full lg:w-[46%] xl:w-[48%] h-full flex flex-col border-l border-border bg-card shrink-0 z-20 animate-fade-in">
      {/* Canvas Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-border bg-sidebar shrink-0">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-7 h-7 rounded-lg border border-border bg-card text-accent">
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </span>
          <div>
            <h2 className="text-xs font-semibold text-ink">Canvas Dokumen</h2>
            <p className="text-[10px] font-mono text-muted">
              {(content || '').length} karakter
            </p>
          </div>
        </div>

        {/* Mode Switch & Actions */}
        <div className="flex items-center gap-1.5">
          <div className="flex rounded-lg border border-border bg-surface p-0.5">
            <button
              type="button"
              onClick={() => setTab('editor')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                tab === 'editor' ? 'bg-card text-ink border border-border' : 'text-muted hover:text-ink'
              }`}
            >
              Editor
            </button>
            <button
              type="button"
              onClick={() => setTab('preview')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                tab === 'preview' ? 'bg-card text-ink border border-border' : 'text-muted hover:text-ink'
              }`}
            >
              Pratinjau
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            title="Salin isi Canvas"
            className="p-1.5 rounded-lg border border-border bg-card hover:bg-hover text-muted hover:text-ink transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
              {copied ? (
                <polyline points="20 6 9 17 4 12" />
              ) : (
                <>
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </>
              )}
            </svg>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            title="Unduh Markdown"
            className="p-1.5 rounded-lg border border-border bg-card hover:bg-hover text-muted hover:text-ink transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>

          <button
            type="button"
            onClick={onClose}
            title="Tutup Canvas"
            className="p-1.5 rounded-lg border border-border bg-card hover:bg-hover text-muted hover:text-ink transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Editor / Preview Body */}
      <div className="flex-1 overflow-hidden bg-surface">
        {tab === 'editor' ? (
          <textarea
            value={content}
            onChange={(e) => onChangeContent(e.target.value)}
            placeholder="Tulis atau tempel draf dokumen, kode, atau catatan di sini..."
            className="w-full h-full p-5 bg-surface text-ink font-mono text-xs leading-relaxed resize-none focus:outline-none"
          />
        ) : (
          <div className="w-full h-full p-6 overflow-y-auto text-sm text-ink leading-relaxed whitespace-pre-wrap">
            {content || (
              <span className="text-muted italic">Belum ada konten untuk ditampilkan.</span>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
