// Zero-State persis Gambar 2 (Sky Aura + Centered Prompt)
window.KalaAiComponents = window.KalaAiComponents || {};
window.KalaAiComponents.ZeroState = function ZeroState({
  children,
  activeGem,
  language
}) {
  const t = k => window.getKaliText ? window.getKaliText(k, language) : k;
  return /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-center justify-center min-h-full w-full px-4 py-10 relative overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 pointer-events-none dark:hidden transition-opacity duration-300",
    style: {
      backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(191, 219, 254, 0.45), transparent 55%), radial-gradient(circle at 80% 70%, rgba(219, 234, 254, 0.55), transparent 60%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 pointer-events-none hidden dark:block transition-opacity duration-300",
    style: {
      backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(30, 58, 138, 0.25), transparent 55%), radial-gradient(circle at 80% 70%, rgba(30, 64, 175, 0.15), transparent 60%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "relative z-10 w-full max-w-4xl flex flex-col items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full text-center mb-8 animate-fade-in"
  }, activeGem && /*#__PURE__*/React.createElement("div", {
    className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/20 bg-card text-accent text-xs font-medium mb-5 shadow-sm"
  }, "Persona Aktif: ", activeGem.name), /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl sm:text-[40px] font-bold tracking-tight text-ink mb-3"
  }, t('title')), /*#__PURE__*/React.createElement("p", {
    className: "text-base text-muted max-w-xl mx-auto leading-relaxed"
  }, activeGem ? activeGem.instruction : t('tagline'))), /*#__PURE__*/React.createElement("div", {
    className: "w-full max-w-[760px] animate-fade-in",
    style: {
      animationDelay: '0.1s'
    }
  }, children)));
};