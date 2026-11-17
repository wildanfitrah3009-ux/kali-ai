import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
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
  return /*#__PURE__*/_jsxDEV("header", {
    className: "h-16 px-4 sm:px-6 flex items-center justify-between shrink-0 z-20",
    children: [/*#__PURE__*/_jsxDEV("div", {
      className: "flex items-center gap-3",
      children: [/*#__PURE__*/_jsxDEV("div", {
        className: `flex items-center gap-2 select-none ${sidebarOpen ? 'hidden' : 'flex'}`,
        children: [Logo ? /*#__PURE__*/_jsxDEV(Logo, {
          className: "w-7 h-7"
        }, void 0, false) : null, /*#__PURE__*/_jsxDEV("span", {
          className: "text-lg font-bold tracking-tight text-ink hidden sm:block",
          children: "Kali AI"
        }, void 0, false)]
      }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
        className: `flex items-center bg-card border border-border rounded-full p-0.5 shadow-sm ${sidebarOpen ? 'hidden' : 'flex'}`,
        children: [/*#__PURE__*/_jsxDEV("button", {
          type: "button",
          onClick: onToggleSidebar,
          title: "Buka Sidebar",
          className: "flex items-center justify-center w-8 h-8 rounded-full text-muted hover:text-ink hover:bg-hover transition-colors",
          children: /*#__PURE__*/_jsxDEV("svg", {
            viewBox: "0 0 24 24",
            className: "w-4 h-4",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: 2,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: [/*#__PURE__*/_jsxDEV("rect", {
              x: "3",
              y: "3",
              width: "18",
              height: "18",
              rx: "2",
              ry: "2"
            }, void 0, false), /*#__PURE__*/_jsxDEV("line", {
              x1: "9",
              y1: "3",
              x2: "9",
              y2: "21"
            }, void 0, false)]
          }, void 0, true)
        }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
          type: "button",
          onClick: onNewChat,
          title: t('newChat'),
          className: "flex items-center justify-center w-8 h-8 rounded-full text-muted hover:text-ink hover:bg-hover transition-colors",
          children: /*#__PURE__*/_jsxDEV("svg", {
            viewBox: "0 0 24 24",
            className: "w-4 h-4",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: 2,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: [/*#__PURE__*/_jsxDEV("line", {
              x1: "12",
              y1: "5",
              x2: "12",
              y2: "19"
            }, void 0, false), /*#__PURE__*/_jsxDEV("line", {
              x1: "5",
              y1: "12",
              x2: "19",
              y2: "12"
            }, void 0, false)]
          }, void 0, true)
        }, void 0, false)]
      }, void 0, true)]
    }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
      className: "flex items-center gap-2",
      children: [activeGem && /*#__PURE__*/_jsxDEV("div", {
        className: "hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card text-xs font-medium text-ink",
        children: [/*#__PURE__*/_jsxDEV("span", {
          children: activeGem.name
        }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
          onClick: onClearGem,
          className: "text-muted hover:text-ink",
          children: /*#__PURE__*/_jsxDEV("svg", {
            viewBox: "0 0 24 24",
            className: "w-3.5 h-3.5",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: 2,
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
      }, void 0, true), /*#__PURE__*/_jsxDEV("button", {
        onClick: onBackHome,
        title: "Kembali ke Beranda",
        className: "hidden sm:flex items-center justify-center w-9 h-9 rounded-lg text-muted hover:text-ink hover:bg-hover transition-colors",
        children: /*#__PURE__*/_jsxDEV("svg", {
          viewBox: "0 0 24 24",
          className: "w-4 h-4",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: 1.75,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          children: [/*#__PURE__*/_jsxDEV("path", {
            d: "m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
          }, void 0, false), /*#__PURE__*/_jsxDEV("polyline", {
            points: "9 22 9 12 15 12 15 22"
          }, void 0, false)]
        }, void 0, true)
      }, void 0, false), onExportChat && /*#__PURE__*/_jsxDEV("button", {
        onClick: onExportChat,
        title: "Unduh Obrolan (TXT)",
        className: "hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border bg-card text-muted hover:text-ink hover:bg-hover transition-colors text-xs font-medium",
        children: [/*#__PURE__*/_jsxDEV("svg", {
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
        }, void 0, true), /*#__PURE__*/_jsxDEV("span", {
          children: "Ekspor"
        }, void 0, false)]
      }, void 0, true), /*#__PURE__*/_jsxDEV("button", {
        onClick: onToggleTheme,
        title: theme === 'dark' ? 'Mode Terang' : 'Mode Gelap',
        className: "flex items-center justify-center w-9 h-9 rounded-lg text-muted hover:text-ink hover:bg-hover transition-colors",
        children: theme === 'dark' ? /*#__PURE__*/_jsxDEV("svg", {
          viewBox: "0 0 24 24",
          className: "w-4 h-4",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: 1.75,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          children: [/*#__PURE__*/_jsxDEV("circle", {
            cx: "12",
            cy: "12",
            r: "4"
          }, void 0, false), /*#__PURE__*/_jsxDEV("path", {
            d: "M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
          }, void 0, false)]
        }, void 0, true) : /*#__PURE__*/_jsxDEV("svg", {
          viewBox: "0 0 24 24",
          className: "w-4 h-4",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: 1.75,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          children: /*#__PURE__*/_jsxDEV("path", {
            d: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"
          }, void 0, false)
        }, void 0, false)
      }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
        onClick: onNewChat,
        className: "hidden sm:flex items-center gap-1.5 h-9 px-4 rounded-full bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors ml-1",
        children: [/*#__PURE__*/_jsxDEV("svg", {
          viewBox: "0 0 24 24",
          className: "w-4 h-4",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: 2,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          children: [/*#__PURE__*/_jsxDEV("line", {
            x1: "12",
            y1: "5",
            x2: "12",
            y2: "19"
          }, void 0, false), /*#__PURE__*/_jsxDEV("line", {
            x1: "5",
            y1: "12",
            x2: "19",
            y2: "12"
          }, void 0, false)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("span", {
          children: t('newChat')
        }, void 0, false)]
      }, void 0, true)]
    }, void 0, true)]
  }, void 0, true);
};