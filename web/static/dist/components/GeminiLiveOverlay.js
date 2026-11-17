// Komponen KalaAiLiveOverlay â€” voice live via Web Speech API (SpeechRecognition + speechSynthesis)
window.KalaAiComponents = window.KalaAiComponents || {};
window.KalaAiComponents.KalaAiLiveOverlay = function KalaAiLiveOverlay({
  isOpen,
  onClose,
  onTranscript
}) {
  const {
    useState,
    useEffect,
    useRef,
    useCallback
  } = React;
  const SpeechRecognition = typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null;
  const supportsRecognition = !!SpeechRecognition;
  const supportsSynth = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const [listening, setListening] = useState(false);
  const [muted, setMuted] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interim, setInterim] = useState('');
  const [error, setError] = useState(null);
  const [manualText, setManualText] = useState('');
  const recognitionRef = useRef(null);
  const shouldRestartRef = useRef(false);
  const mutedRef = useRef(false);
  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);
  const stopRecognition = useCallback(() => {
    shouldRestartRef.current = false;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setListening(false);
    setInterim('');
  }, []);
  const startRecognition = useCallback(() => {
    if (!supportsRecognition) return;
    setError(null);
    shouldRestartRef.current = true;
    const rec = new SpeechRecognition();
    rec.lang = 'id-ID';
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = event => {
      let finalText = '';
      let interimText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) finalText += res[0].transcript;else interimText += res[0].transcript;
      }
      if (finalText.trim()) {
        const clean = finalText.trim();
        setTranscript(prev => prev ? prev + ' ' + clean : clean);
        if (onTranscript) onTranscript(clean);
        if (supportsSynth && !mutedRef.current) {
          try {
            window.speechSynthesis.cancel();
          } catch (e) {}
        }
      }
      setInterim(interimText);
    };
    rec.onerror = event => {
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setError('Izin mikrofon ditolak. Aktifkan akses mikrofon di browser.');
        shouldRestartRef.current = false;
      } else if (event.error === 'no-speech') {
        // abaikan, akan restart otomatis
      } else if (event.error === 'audio-capture') {
        setError('Mikrofon tidak ditemukan.');
        shouldRestartRef.current = false;
      } else if (event.error !== 'aborted') {
        setError('Terjadi kesalahan pengenalan suara: ' + event.error);
      }
    };
    rec.onend = () => {
      setListening(false);
      if (shouldRestartRef.current) {
        try {
          rec.start();
          setListening(true);
        } catch (e) {
          setTimeout(() => {
            if (shouldRestartRef.current) {
              try {
                rec.start();
                setListening(true);
              } catch (e2) {}
            }
          }, 300);
        }
      }
    };
    recognitionRef.current = rec;
    try {
      rec.start();
      setListening(true);
    } catch (e) {
      // start ganda -> abaikan
    }
  }, [supportsRecognition, onTranscript, supportsSynth]);

  // Reset & mulai saat overlay dibuka; hentikan saat ditutup
  useEffect(() => {
    if (isOpen) {
      setTranscript('');
      setInterim('');
      setError(null);
      setMuted(false);
      setManualText('');
      if (supportsRecognition) startRecognition();
    } else {
      stopRecognition();
      if (supportsSynth) {
        try {
          window.speechSynthesis.cancel();
        } catch (e) {}
      }
    }
    return () => {
      stopRecognition();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);
  const toggleMic = () => {
    if (listening) {
      stopRecognition();
    } else {
      startRecognition();
    }
  };
  const handleManualSend = e => {
    if (e && e.preventDefault) e.preventDefault();
    const t = manualText.trim();
    if (!t) return;
    setTranscript(prev => prev ? prev + ' ' + t : t);
    if (onTranscript) onTranscript(t);
    setManualText('');
  };
  if (!isOpen) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full max-w-md rounded-2xl border border-border bg-card p-8 flex flex-col items-center text-center relative"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClose,
    className: "absolute top-4 right-4 p-2 rounded-lg border border-border bg-surface text-muted hover:text-ink transition-colors"
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
  }))), /*#__PURE__*/React.createElement("div", {
    className: "inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface text-muted text-xs font-mono mb-6"
  }, /*#__PURE__*/React.createElement("span", {
    className: `w-2 h-2 rounded-full ${listening ? 'bg-accent animate-ping' : 'bg-muted'}`
  }), /*#__PURE__*/React.createElement("span", null, "Kali AI Live Voice")), /*#__PURE__*/React.createElement("div", {
    className: "relative w-32 h-32 my-6 flex items-center justify-center"
  }, listening && /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 rounded-full border border-border animate-ping opacity-50"
  }), /*#__PURE__*/React.createElement("div", {
    className: `absolute inset-3 rounded-full bg-surface ${listening ? 'animate-pulse' : ''}`
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: toggleMic,
    disabled: !supportsRecognition,
    className: `relative w-20 h-20 rounded-full flex items-center justify-center text-white transition-colors ${listening ? 'bg-accent hover:bg-accent-hover' : 'bg-muted hover:bg-ink'} disabled:opacity-40 disabled:cursor-not-allowed`,
    title: listening ? 'Hentikan mikrofon' : 'Mulai mikrofon'
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    className: "w-8 h-8",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M19 10v2a7 7 0 0 1-14 0v-2"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "19",
    x2: "12",
    y2: "22"
  })))), !supportsRecognition && /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-red-500 mb-3 max-w-xs"
  }, "Browser ini tidak mendukung pengenalan suara. Gunakan Chrome/Edge terbaru, atau kirim teks manual di bawah."), error && /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-red-500 mb-3 max-w-xs"
  }, error), /*#__PURE__*/React.createElement("div", {
    className: "w-full text-left text-xs text-muted font-mono mb-2"
  }, "Transkrip"), /*#__PURE__*/React.createElement("div", {
    className: "w-full max-h-32 overflow-y-auto rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink text-left leading-relaxed min-h-[48px] mb-4"
  }, transcript || /*#__PURE__*/React.createElement("span", {
    className: "text-muted italic"
  }, "Belum ada ucapan."), interim && /*#__PURE__*/React.createElement("span", {
    className: "text-muted"
  }, " ", interim)), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleManualSend,
    className: "w-full flex items-center gap-2 mb-4"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: manualText,
    onChange: e => setManualText(e.target.value),
    placeholder: "Atau ketik manual...",
    className: "flex-1 px-3 py-2 rounded-lg border border-border bg-surface text-sm text-ink focus:outline-none focus:border-accent"
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "px-3 py-2 rounded-lg border border-accent bg-accent text-white text-xs font-medium hover:bg-accent-hover transition-colors"
  }, "Kirim")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setMuted(!muted),
    className: `px-5 py-2.5 rounded-lg border text-xs font-medium transition-colors ${muted ? 'border-accent bg-accent text-white hover:bg-accent-hover' : 'border-border bg-surface text-ink hover:bg-hover'}`
  }, muted ? 'Suara TTS Mati' : 'Suara TTS Aktif'), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClose,
    className: "px-5 py-2.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors"
  }, "Akhiri Sesi"))));
};