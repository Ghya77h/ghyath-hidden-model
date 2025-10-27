
import React from 'react';
import { ThemeToggle } from './ThemeToggle';
import { LogOutIcon, ShirtIcon } from './icons';

interface HeaderProps {
  onLogout: () => void;
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogout, theme, onThemeChange }) => {
  return (
    <header className="sticky top-0 z-30 bg-stone-100/50 backdrop-blur-lg border-b border-stone-300/30 py-4 px-4 text-center">
      <div className="container mx-auto flex justify-between items-center">
        <div className="w-20 flex justify-start">
          <ThemeToggle theme={theme} onThemeChange={onThemeChange} />
        </div>
        <div className="flex justify-center items-center gap-4">
          <ShirtIcon className="w-10 h-10 text-red-800" />
          <div>
            <h1 className="text-3xl font-black text-stone-900 tracking-wider">الموديل الخفي</h1>
            <p className="text-stone-600 mt-0.5 text-sm">حوّل صورك لصور احترافية</p>
          </div>
        </div>
        <div className="w-20 flex justify-end">
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-stone-600 hover:text-red-800 bg-stone-200/50 hover:bg-red-100/60 rounded-lg transition-all duration-200 transform active:scale-95"
            aria-label="تسجيل الخروج"
          >
            <LogOutIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
