
import React from 'react';

interface LoadingSpinnerProps {
  minimal?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ minimal = false }) => {
  if (minimal) {
    return (
      <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
        <div className="w-2 h-2 rounded-full bg-red-800 animate-pulse [animation-delay:-0.3s]" />
        <div className="w-2 h-2 rounded-full bg-red-800 animate-pulse [animation-delay:-0.15s]" />
        <div className="w-2 h-2 rounded-full bg-red-800 animate-pulse" />
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center space-y-4 text-center">
      <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
        <div className="w-4 h-4 rounded-full bg-red-800 animate-pulse [animation-delay:-0.3s]" />
        <div className="w-4 h-4 rounded-full bg-red-800 animate-pulse [animation-delay:-0.15s]" />
        <div className="w-4 h-4 rounded-full bg-red-800 animate-pulse" />
      </div>
      <p className="text-red-800 text-lg font-semibold">...بنجهز الصورة الاحترافية</p>
    </div>
  );
};
