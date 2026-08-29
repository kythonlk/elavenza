'use client';

import { useState, useEffect } from 'react';

const themes = [
  { id: 'sage', name: 'Sage & Earth', colors: ['#4A6741', '#D4A574', '#FAFAF7'] },
  { id: 'ocean', name: 'Ocean & Sand', colors: ['#1B4965', '#CAA882', '#F8FAFE'] },
  { id: 'lavender', name: 'Lavender & Stone', colors: ['#6B5B8A', '#C9A96E', '#FAF9FC'] },
];

export default function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState('sage');

  useEffect(() => {
    const saved = localStorage.getItem('elavenza-theme');
    if (saved) {
      setCurrent(saved);
      applyTheme(saved);
    }
  }, []);

  function applyTheme(themeId: string) {
    const html = document.documentElement;
    if (themeId === 'sage') {
      html.removeAttribute('data-theme');
    } else {
      html.setAttribute('data-theme', themeId);
    }
    setCurrent(themeId);
    localStorage.setItem('elavenza-theme', themeId);
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Theme Panel */}
      {isOpen && (
        <div className="absolute bottom-14 right-0 bg-surface rounded-2xl shadow-2xl border border-border p-5 w-72 animate-scale-in">
          <h3 className="font-heading font-bold text-sm text-text mb-1">Theme Preview</h3>
          <p className="text-xs text-text-muted mb-4">Select a color palette for client review</p>
          <div className="space-y-2.5">
            {themes.map(theme => (
              <button
                key={theme.id}
                onClick={() => applyTheme(theme.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                  current === theme.id ? 'border-primary bg-bg-alt' : 'border-transparent hover:bg-bg-alt'
                }`}
              >
                <div className="flex -space-x-1">
                  {theme.colors.map((color, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-text">{theme.name}</span>
                {current === theme.id && (
                  <svg className="w-4 h-4 text-primary ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dark transition-all hover:scale-110 flex items-center justify-center"
        aria-label="Theme switcher"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      </button>
    </div>
  );
}
