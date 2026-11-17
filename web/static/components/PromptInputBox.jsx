// Prompt Card responsif Light/Dark (Anti-UI-Slop)
window.KalaAiComponents = window.KalaAiComponents || {};

window.KalaAiComponents.PromptInputBox = function PromptInputBox({
  language,
  input,
  onChangeInput,
  onSubmit,
  onStop,
  isGenerating,
  searchEnabled,
  onToggleSearch,
  thinkingEnabled,
  onToggleThinking,
  attachments,
  onAddAttachment,
  onRemoveAttachment,
  onOpenLive,
}) {
  const { useRef, useEffect, useState } = React;
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isListening, setIsListening] = useState(false);

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Browser Anda tidak mendukung fitur input suara.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'en' ? 'en-US' : 'id-ID';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onChangeInput(input ? `${input} ${transcript}` : transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 180) + 'px';
    }
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isGenerating) onSubmit(e);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => onAddAttachment({ name: file.name, size: file.size, type: file.type }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full max-w-[760px] mx-auto">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if ((input.trim() || attachments.length > 0) && !isGenerating) onSubmit(e);
        }}
        className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm transition-colors"
      >
        {/* Input Area */}
        <div className="p-4">
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2.5 pb-2 border-b border-border">
              {attachments.map((att, idx) => (
                <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border bg-surface text-xs font-mono text-ink">
                  <span className="truncate max-w-[140px]">{att.name}</span>
                  <button type="button" onClick={() => onRemoveAttachment(idx)} className="text-muted hover:text-red-500">
                    <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                </span>
              ))}
            </div>
          )}

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => onChangeInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder={(window.getKaliText ? window.getKaliText('placeholder', language) : 'Message Kali AI')}
            className="w-full bg-transparent text-ink placeholder:text-muted text-[15px] resize-none focus:outline-none max-h-48 leading-relaxed px-1"
          />

          {/* Toolbar Bawah */}
          <div className="flex items-center justify-between pt-3 mt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onToggleThinking}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full border text-sm font-medium transition-colors ${
                  thinkingEnabled ? 'border-accent/50 bg-accent-soft text-accent' : 'border-border bg-transparent text-muted hover:bg-hover hover:text-ink'
                }`}
              >
                <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" /><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" /><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" /></svg>
                <span>DeepThink</span>
              </button>

              <button
                type="button"
                onClick={onToggleSearch}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full border text-sm font-medium transition-colors ${
                  searchEnabled ? 'border-accent/50 bg-accent-soft text-accent' : 'border-border bg-transparent text-muted hover:bg-hover hover:text-ink'
                }`}
              >
                <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                <span>Search</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleVoiceInput}
                title="Input Suara"
                className={`flex items-center justify-center w-9 h-9 rounded-full transition-colors ${isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-muted hover:text-ink hover:bg-hover'}`}
              >
                <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="22" /></svg>
              </button>
              <input ref={fileInputRef} type="file" multiple onChange={handleFileChange} className="hidden" />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Lampirkan file"
                className="flex items-center justify-center w-9 h-9 rounded-full text-muted hover:text-ink hover:bg-hover transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
              </button>

              {isGenerating ? (
                <button type="button" onClick={onStop} title="Hentikan" className="flex items-center justify-center w-9 h-9 rounded-full border border-red-500/30 bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors">
                  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim() && attachments.length === 0}
                  title="Kirim pesan"
                  className={`flex items-center justify-center w-9 h-9 rounded-full transition-colors ${
                    input.trim() || attachments.length > 0
                      ? 'bg-accent text-white hover:bg-accent-hover'
                      : 'bg-surface text-muted border border-border cursor-not-allowed'
                  }`}
                >
                  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
