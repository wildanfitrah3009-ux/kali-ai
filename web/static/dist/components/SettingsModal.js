import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
// Modal Pengaturan (Anti-UI-Slop)
window.KalaAiComponents = window.KalaAiComponents || {};
window.KalaAiComponents.SettingsModal = function SettingsModal({
  isOpen,
  onClose,
  theme,
  onToggleTheme,
  onSetTheme,
  language,
  onSetLanguage
}) {
  const {
    useState
  } = React;
  const [activeTab, setActiveTab] = useState('general');
  const t = k => window.getKaliText ? window.getKaliText(k, language) : k;
  if (!isOpen) return null;
  const languages = [{
    code: 'id',
    label: 'Indonesia'
  }, {
    code: 'en',
    label: 'English'
  }, {
    code: 'ja',
    label: '\u65E5\u672C\u8A9E (Jepang)'
  }, {
    code: 'zh',
    label: '\u4E2D\u6587 (China)'
  }, {
    code: 'ko',
    label: '\uD55C\uAD6D\uC5B4 (Korea)'
  }];
  return /*#__PURE__*/_jsxDEV("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in",
    children: /*#__PURE__*/_jsxDEV("div", {
      className: "w-full max-w-[800px] h-[500px] rounded-2xl border border-border bg-card overflow-hidden flex flex-col",
      children: [/*#__PURE__*/_jsxDEV("div", {
        className: "flex items-center justify-between px-6 py-4 border-b border-border shrink-0",
        children: [/*#__PURE__*/_jsxDEV("h2", {
          className: "text-base font-semibold text-ink",
          children: t('settingsTitle')
        }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
          type: "button",
          onClick: onClose,
          className: "p-1.5 rounded-lg text-muted hover:text-ink hover:bg-hover transition-colors",
          children: /*#__PURE__*/_jsxDEV("svg", {
            viewBox: "0 0 24 24",
            className: "w-4 h-4",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: 2,
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
        className: "flex flex-1 min-h-0",
        children: [/*#__PURE__*/_jsxDEV("div", {
          className: "w-48 border-r border-border p-3 shrink-0 space-y-1",
          children: /*#__PURE__*/_jsxDEV("button", {
            className: "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium bg-hover text-ink transition-colors",
            children: [/*#__PURE__*/_jsxDEV("svg", {
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
                r: "3"
              }, void 0, false), /*#__PURE__*/_jsxDEV("path", {
                d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
              }, void 0, false)]
            }, void 0, true), t('general')]
          }, void 0, true)
        }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
          className: "flex-1 overflow-y-auto p-6",
          children: /*#__PURE__*/_jsxDEV("div", {
            className: "space-y-8 max-w-md",
            children: [/*#__PURE__*/_jsxDEV("div", {
              children: [/*#__PURE__*/_jsxDEV("h3", {
                className: "text-sm font-medium text-ink mb-3",
                children: t('theme')
              }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                className: "grid grid-cols-2 gap-3",
                children: [/*#__PURE__*/_jsxDEV("button", {
                  onClick: () => onSetTheme && onSetTheme('light'),
                  className: `flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-colors ${theme === 'light' ? 'border-accent bg-hover text-ink' : 'border-border bg-transparent text-muted hover:bg-hover hover:text-ink'}`,
                  children: [/*#__PURE__*/_jsxDEV("svg", {
                    viewBox: "0 0 24 24",
                    className: "w-5 h-5",
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
                  }, void 0, true), /*#__PURE__*/_jsxDEV("span", {
                    className: "text-xs font-medium",
                    children: t('light')
                  }, void 0, false)]
                }, void 0, true), /*#__PURE__*/_jsxDEV("button", {
                  onClick: () => onSetTheme && onSetTheme('dark'),
                  className: `flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-colors ${theme === 'dark' ? 'border-accent bg-hover text-ink' : 'border-border bg-transparent text-muted hover:bg-hover hover:text-ink'}`,
                  children: [/*#__PURE__*/_jsxDEV("svg", {
                    viewBox: "0 0 24 24",
                    className: "w-5 h-5",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: 1.75,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    children: /*#__PURE__*/_jsxDEV("path", {
                      d: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"
                    }, void 0, false)
                  }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                    className: "text-xs font-medium",
                    children: t('dark')
                  }, void 0, false)]
                }, void 0, true)]
              }, void 0, true)]
            }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
              className: "flex items-center justify-between",
              children: [/*#__PURE__*/_jsxDEV("span", {
                className: "text-sm font-medium text-ink",
                children: t('language')
              }, void 0, false), /*#__PURE__*/_jsxDEV("select", {
                value: language || 'id',
                onChange: e => onSetLanguage && onSetLanguage(e.target.value),
                className: "w-48 px-3 py-2 rounded-lg border border-border bg-transparent text-sm text-ink focus:outline-none focus:border-accent cursor-pointer",
                children: languages.map(lang => /*#__PURE__*/_jsxDEV("option", {
                  value: lang.code,
                  className: "bg-card text-ink",
                  children: lang.label
                }, lang.code, false))
              }, void 0, false)]
            }, void 0, true)]
          }, void 0, true)
        }, void 0, false)]
      }, void 0, true)]
    }, void 0, true)
  }, void 0, false);
};