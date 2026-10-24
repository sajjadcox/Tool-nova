import { useState, useEffect } from 'react';

const STORAGE_KEY = 'toolnova_recent_tools';
const MAX_RECENT = 12;

export function useRecentTools() {
  const [recentToolIds, setRecentToolIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentToolIds));
    } catch {
      // ignore storage errors
    }
  }, [recentToolIds]);

  const addRecentTool = (toolId: string) => {
    setRecentToolIds(prev => {
      const filtered = prev.filter(id => id !== toolId);
      return [toolId, ...filtered].slice(0, MAX_RECENT);
    });
  };

  const clearRecentTools = () => {
    setRecentToolIds([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  return { recentToolIds, addRecentTool, clearRecentTools };
}
