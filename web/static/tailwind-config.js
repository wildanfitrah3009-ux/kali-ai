window.tailwind = window.tailwind || {};
window.tailwind.config = {
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'message-pop': {
          '0%': { opacity: '0', transform: 'translateY(8px) scale(0.96)' },
          '60%': { opacity: '1', transform: 'translateY(-2px) scale(1.01)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'typing-cursor': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.35s ease-out both',
        'message-pop': 'message-pop 0.32s cubic-bezier(0.22, 1, 0.36, 1) both',
        'typing-cursor': 'typing-cursor 1s step-end infinite',
      },
      colors: {
        surface: 'var(--bg-surface)',
        card: 'var(--bg-card)',
        sidebar: 'var(--bg-sidebar)',
        hover: 'var(--bg-hover)',
        border: 'var(--border-color)',
        ink: 'var(--text-main)',
        muted: 'var(--text-secondary)',
        accent: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
          soft: 'var(--primary-bg)',
        },
      },
    },
  },
};
