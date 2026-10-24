import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

function getInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem('toolnova_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

// Global variable to synchronize hook instances across components
let globalTheme: Theme = getInitialTheme();
const listeners = new Set<(theme: Theme) => void>();

function applyTheme(theme: Theme) {
  globalTheme = theme;
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  try {
    localStorage.setItem('toolnova_theme', theme);
  } catch {
    // ignore
  }
  listeners.forEach(fn => fn(theme));
}

// Immediately apply initial theme on script load
if (typeof document !== 'undefined') {
  applyTheme(globalTheme);
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(globalTheme);

  useEffect(() => {
    // Ensure current DOM matches
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const handler = (newTheme: Theme) => {
      setThemeState(newTheme);
    };

    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, [theme]);

  const toggleTheme = () => {
    const next = globalTheme === 'light' ? 'dark' : 'light';
    applyTheme(next);
  };

  const setTheme = (next: Theme) => {
    applyTheme(next);
  };

  return { theme, toggleTheme, setTheme };
}

