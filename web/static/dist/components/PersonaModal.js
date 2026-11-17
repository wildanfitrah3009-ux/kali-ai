// Komponen PersonaModal (Anti-UI-Slop: flat tonal surface, 1px border, strokeWidth={1.75})
window.KalaAiComponents = window.KalaAiComponents || {};
window.KalaAiComponents.PersonaModal = function PersonaModal({
  isOpen,
  onClose,
  gems,
  onAddGem,
  onDeleteGem
}) {
  const {
    useState,
    useEffect
  } = React;
  const [name, setName] = useState('');
  const [instruction, setInstruction] = useState('');
  useEffect(() => {
    if (!isOpen) return;
    const onKey = e => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  const handleSubmit = e => {
    e.preventDefault();
    if (!name.trim() || !instruction.trim()) return;
    onAddGem({
      id: 'gem_' + Date.now(),
      name: name.trim(),
      instruction: instruction.trim()
    });
    setName('');
    setInstruction('');
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full max-w-lg rounded-2xl border border-border bg-card overflow-hidden flex flex-col max-h-[90vh]"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between px-5 py-4 border-b border-border bg-sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2.5"
  }, /*#__PURE__*/React.createElement("span", {
    className: "flex items-center justify-center w-8 h-8 rounded-lg border border-border bg-card text-accent"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    className: "w-4 h-4",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("polygon", {
    points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "text-sm font-semibold text-ink"
  }, "Kelola Gems"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-muted"
  }, "Buat dan sesuaikan persona Kali AI Anda."))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClose,
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
  })))), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 overflow-y-auto p-5 space-y-6"
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    className: "space-y-4 rounded-xl border border-border bg-surface p-4"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-xs font-semibold uppercase tracking-wider text-muted"
  }, "Buat Gem Baru"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-medium text-ink mb-1"
  }, "Nama Gem"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: name,
    onChange: e => setName(e.target.value),
    placeholder: "Contoh: Mentor Python Ahli",
    className: "w-full px-3 py-2 rounded-lg border border-border bg-card text-xs text-ink placeholder:text-muted focus:outline-none focus:border-accent"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-medium text-ink mb-1"
  }, "Instruksi Sistem"), /*#__PURE__*/React.createElement("textarea", {
    value: instruction,
    onChange: e => setInstruction(e.target.value),
    placeholder: "Jelaskan bagaimana Gem ini harus merespons...",
    rows: 3,
    className: "w-full px-3 py-2 rounded-lg border border-border bg-card text-xs text-ink placeholder:text-muted focus:outline-none focus:border-accent resize-none"
  })), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    disabled: !name.trim() || !instruction.trim(),
    className: `w-full py-2.5 rounded-lg text-xs font-medium transition-colors ${name.trim() && instruction.trim() ? 'bg-accent text-white hover:bg-accent-hover' : 'bg-surface text-muted border border-border cursor-not-allowed'}`
  }, "Simpan Gem")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-xs font-semibold uppercase tracking-wider text-muted mb-3"
  }, "Daftar Gems Tersedia"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, gems.map(gem => /*#__PURE__*/React.createElement("div", {
    key: gem.id,
    className: "flex items-start justify-between gap-3 p-3 rounded-xl border border-border bg-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "min-w-0"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-xs font-semibold text-ink truncate"
  }, gem.name), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-muted mt-0.5 line-clamp-2 leading-relaxed"
  }, gem.instruction)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => onDeleteGem(gem.id),
    title: window.getKaliText ? window.getKaliText('deleteGem', language) : 'Hapus Gem',
    className: "p-1.5 rounded-lg border border-border bg-surface text-muted hover:text-red-500 transition-colors shrink-0"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    className: "w-3.5 h-3.5",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "3 6 5 6 21 6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
  }))))))))));
};