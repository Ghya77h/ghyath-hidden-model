
import React, { useEffect } from 'react';
import { XCircleIcon } from './icons';

interface ImageModalProps {
  src: string;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ src, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-up"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div className="relative max-w-full max-h-full" onClick={(e) => e.stopPropagation()}>
        <img src={src} alt="Fullscreen view" className="block max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" />
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 p-1.5 bg-white/80 rounded-full text-stone-800 hover:bg-red-800 hover:text-white transition-all duration-200 transform active:scale-90"
          aria-label="Close image viewer"
        >
          <XCircleIcon className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};
