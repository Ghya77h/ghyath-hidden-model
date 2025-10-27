
import React, { useState } from 'react';
import { ShirtIcon } from './icons';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      onLogin();
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[rgba(var(--color-surface-rgb),0.3)] backdrop-blur-md border border-[rgba(var(--color-border-rgb),0.3)] rounded-2xl p-8 shadow-2xl shadow-stone-900/10 animate-fade-in-up">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-4">
              <ShirtIcon className="w-10 h-10 text-red-800" />
              <div>
                <h1 className="text-3xl font-black text-stone-900 tracking-wider">الموديل الخفي</h1>
                <p className="text-stone-600 mt-0.5 text-sm">حوّل صورك لصور احترافية</p>
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <p className="text-center text-md text-stone-600 pt-4">أهلاً بك. ارفع صورة لملابسك ودع الذكاء الاصطناعي يبهرك.</p>
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-8 py-3 bg-red-800 text-white font-bold rounded-lg hover:bg-red-700 disabled:bg-stone-400/50 disabled:cursor-not-allowed disabled:text-stone-600 transition-all duration-300 transform hover:scale-105 active:scale-[0.98] shadow-lg shadow-red-900/30"
              >
                {isLoading ? '...جاري التحضير' : 'ابدأ الآن'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
