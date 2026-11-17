// Logo Kali AI (Desain kustom dari referensi gambar)
window.KalaAiComponents = window.KalaAiComponents || {};
window.KalaAiComponents.Logo = function Logo({
  className = "w-8 h-8"
}) {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 100 100",
    className: `shrink-0 ${className}`,
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("rect", {
    width: "100",
    height: "100",
    rx: "24",
    fill: "#1D4ED8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M62.5 24H42C30.4 24 21 33.4 21 45C21 52.5 25 59 31 62.5L50 78C56.5 83 65 79 65 71C65 67 62.5 63 58 60L42 48.5C39 46.5 39 42 42 40C44 38.5 46.5 38.5 48.5 40L62.5 51C67 54.5 74 52 74 46V35C74 29 69 24 62.5 24Z",
    fill: "white"
  }));
};