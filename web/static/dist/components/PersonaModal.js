import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
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
  return /*#__PURE__*/_jsxDEV("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in",
    children: /*#__PURE__*/_jsxDEV("div", {
      className: "w-full max-w-lg rounded-2xl border border-border bg-card overflow-hidden flex flex-col max-h-[90vh]",
      children: [/*#__PURE__*/_jsxDEV("div", {
        className: "flex items-center justify-between px-5 py-4 border-b border-border bg-sidebar",
        children: [/*#__PURE__*/_jsxDEV("div", {
          className: "flex items-center gap-2.5",
          children: [/*#__PURE__*/_jsxDEV("span", {
            className: "flex items-center justify-center w-8 h-8 rounded-lg border border-border bg-card text-accent",
            children: /*#__PURE__*/_jsxDEV("svg", {
              viewBox: "0 0 24 24",
              className: "w-4 h-4",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: 1.75,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              children: /*#__PURE__*/_jsxDEV("polygon", {
                points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
              }, void 0, false)
            }, void 0, false)
          }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
            children: [/*#__PURE__*/_jsxDEV("h2", {
              className: "text-sm font-semibold text-ink",
              children: "Kelola Gems"
            }, void 0, false), /*#__PURE__*/_jsxDEV("p", {
              className: "text-xs text-muted",
              children: "Buat dan sesuaikan persona Kali AI Anda."
            }, void 0, false)]
          }, void 0, true)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("button", {
          type: "button",
          onClick: onClose,
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
      }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
        className: "flex-1 overflow-y-auto p-5 space-y-6",
        children: [/*#__PURE__*/_jsxDEV("form", {
          onSubmit: handleSubmit,
          className: "space-y-4 rounded-xl border border-border bg-surface p-4",
          children: [/*#__PURE__*/_jsxDEV("h3", {
            className: "text-xs font-semibold uppercase tracking-wider text-muted",
            children: "Buat Gem Baru"
          }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
            children: [/*#__PURE__*/_jsxDEV("label", {
              className: "block text-xs font-medium text-ink mb-1",
              children: "Nama Gem"
            }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
              type: "text",
              value: name,
              onChange: e => setName(e.target.value),
              placeholder: "Contoh: Mentor Python Ahli",
              className: "w-full px-3 py-2 rounded-lg border border-border bg-card text-xs text-ink placeholder:text-muted focus:outline-none focus:border-accent"
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            children: [/*#__PURE__*/_jsxDEV("label", {
              className: "block text-xs font-medium text-ink mb-1",
              children: "Instruksi Sistem"
            }, void 0, false), /*#__PURE__*/_jsxDEV("textarea", {
              value: instruction,
              onChange: e => setInstruction(e.target.value),
              placeholder: "Jelaskan bagaimana Gem ini harus merespons...",
              rows: 3,
              className: "w-full px-3 py-2 rounded-lg border border-border bg-card text-xs text-ink placeholder:text-muted focus:outline-none focus:border-accent resize-none"
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("button", {
            type: "submit",
            disabled: !name.trim() || !instruction.trim(),
            className: `w-full py-2.5 rounded-lg text-xs font-medium transition-colors ${name.trim() && instruction.trim() ? 'bg-accent text-white hover:bg-accent-hover' : 'bg-surface text-muted border border-border cursor-not-allowed'}`,
            children: "Simpan Gem"
          }, void 0, false)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
          children: [/*#__PURE__*/_jsxDEV("h3", {
            className: "text-xs font-semibold uppercase tracking-wider text-muted mb-3",
            children: "Daftar Gems Tersedia"
          }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
            className: "space-y-2",
            children: gems.map(gem => /*#__PURE__*/_jsxDEV("div", {
              className: "flex items-start justify-between gap-3 p-3 rounded-xl border border-border bg-card",
              children: [/*#__PURE__*/_jsxDEV("div", {
                className: "min-w-0",
                children: [/*#__PURE__*/_jsxDEV("h4", {
                  className: "text-xs font-semibold text-ink truncate",
                  children: gem.name
                }, void 0, false), /*#__PURE__*/_jsxDEV("p", {
                  className: "text-xs text-muted mt-0.5 line-clamp-2 leading-relaxed",
                  children: gem.instruction
                }, void 0, false)]
              }, void 0, true), /*#__PURE__*/_jsxDEV("button", {
                type: "button",
                onClick: () => onDeleteGem(gem.id),
                title: "Hapus Gem",
                className: "p-1.5 rounded-lg border border-border bg-surface text-muted hover:text-red-500 transition-colors shrink-0",
                children: /*#__PURE__*/_jsxDEV("svg", {
                  viewBox: "0 0 24 24",
                  className: "w-3.5 h-3.5",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: 1.75,
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  children: [/*#__PURE__*/_jsxDEV("polyline", {
                    points: "3 6 5 6 21 6"
                  }, void 0, false), /*#__PURE__*/_jsxDEV("path", {
                    d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                  }, void 0, false)]
                }, void 0, true)
              }, void 0, false)]
            }, gem.id, true))
          }, void 0, false)]
        }, void 0, true)]
      }, void 0, true)]
    }, void 0, true)
  }, void 0, false);
};