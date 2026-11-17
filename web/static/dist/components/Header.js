// Header Mode Chat minimalis persis DeepSeek
window.KalaAiComponents = window.KalaAiComponents || {};
window.KalaAiComponents.Header = function Header({
  onToggleSidebar,
  onNewChat,
  theme,
  onToggleTheme,
  onOpenLive,
  activeGem,
  onClearGem,
  onBackHome,
  sidebarOpen,
  language,
  onExportChat
}) {
  const {
    Logo
  } = window.KalaAiComponents;
  const t = k => window.getKaliText ? window.getKaliText(k, language) : k;
  return /*#__PURE__*/React.createElement("header", {
    className: "h-16 px-4 sm:px-6 flex items-center justify-between shrink-0 z-20"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: `flex items-center gap-2 select-none ${sidebarOpen ? 'hidden' : 'flex'}`
  }, Logo ? /*#__PURE__*/React.createElement(Logo, {
    className: "w-7 h-7"
  }) : null, /*#__PURE__*/React.createElement("span", {
    className: "text-lg font-bold tracking-tight text-ink hidden sm:block"
  }, "Kali AI")), /*#__PURE__*/React.createElement("div", {
    className: `flex items-center bg-card border border-border rounded-full p-0.5 shadow-sm ${sidebarOpen ? 'hidden' : 'flex'}`
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onToggleSidebar,
    title: "Buka Sidebar",
    className: "flex items-center justify-center w-8 h-8 rounded-full text-muted hover:text-ink hover:bg-hover transition-colors"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    className: "w-4 h-4",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "3",
    width: "18",
    height: "18",
    rx: "2",
    ry: "2"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "9",
    y1: "3",
    x2: "9",
    y2: "21"
  }))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onNewChat,
    title: t('newChat'),
    className: "flex items-center justify-center w-8 h-8 rounded-full text-muted hover:text-ink hover:bg-hover transition-colors"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    className: "w-4 h-4",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "5",
    x2: "12",
    y2: "19"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "5",
    y1: "12",
    x2: "19",
    y2: "12"
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, activeGem && /*#__PURE__*/React.createElement("div", {
    className: "hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card text-xs font-medium text-ink"
  }, /*#__PURE__*/React.createElement("span", null, activeGem.name), /*#__PURE__*/React.createElement("button", {
    onClick: onClearGem,
    className: "text-muted hover:text-ink"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    className: "w-3.5 h-3.5",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2
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
  })))), /*#__PURE__*/React.createElement("button", {
    onClick: onBackHome,
    title: "Kembali ke Beranda",
    className: "hidden sm:flex items-center justify-center w-9 h-9 rounded-lg text-muted hover:text-ink hover:bg-hover transition-colors"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    className: "w-4 h-4",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "9 22 9 12 15 12 15 22"
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: onToggleTheme,
    title: theme === 'dark' ? 'Mode Terang' : 'Mode Gelap',
    className: "flex items-center justify-center w-9 h-9 rounded-lg text-muted hover:text-ink hover:bg-hover transition-colors"
  }, theme === 'dark' ? /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    className: "w-4 h-4",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
  })) : /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    className: "w-4 h-4",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: onNewChat,
    className: "hidden sm:flex items-center gap-1.5 h-9 px-4 rounded-full bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors ml-1"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    className: "w-4 h-4",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "5",
    x2: "12",
    y2: "19"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "5",
    y1: "12",
    x2: "19",
    y2: "12"
  })), /*#__PURE__*/React.createElement("span", null, t('newChat')))));
};