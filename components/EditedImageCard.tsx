
import React from 'react';
import type { EditedImageResult } from '../types';

interface EditedImageCardProps {
  originalImages: string[];
  result: EditedImageResult;
  onImageClick: (src: string) => void;
}

export const EditedImageCard: React.FC<EditedImageCardProps> = ({ originalImages, result, onImageClick }) => {
  const editedImageUrl = `data:${result.newImage.mimeType};base64,${result.newImage.data}`;

  return (
    <div className="bg-[rgba(var(--color-surface-rgb),0.4)] backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl animate-fade-in-up">
      <h2 className="text-3xl font-bold text-center text-red-800 mb-8">النتيجة النهائية</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div>
          <h3 className="text-xl font-bold text-stone-800 mb-3 text-center">الصورة الأصلية</h3>
          <div className="grid grid-cols-1 gap-2">
            <img
              src={originalImages[0]}
              alt="Original"
              className="rounded-lg shadow-md border-2 border-stone-300 w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => onImageClick(originalImages[0])}
            />
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-stone-800 mb-3">بعد التعديل</h3>
          <div className="mx-auto w-full max-w-full rounded-lg shadow-md border-2 border-red-300 overflow-hidden bg-stone-200/50 aspect-auto">
            <img
              src={editedImageUrl}
              alt="Edited"
              className="w-full h-full object-contain cursor-pointer"
              onClick={() => onImageClick(editedImageUrl)}
            />
          </div>
        </div>
      </div>
      {result.responseText && (
        <div className="mt-8 border-t border-stone-400/30 pt-6">
          <h3 className="font-bold text-stone-800 text-lg mb-2">ملاحظات المساعد الذكي:</h3>
          <p className="text-stone-600 bg-stone-100/50 p-4 rounded-lg">{result.responseText}</p>
        </div>
      )}
    </div>
  );
};
