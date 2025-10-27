
import React, { useState, useCallback } from 'react';
import { BackgroundColorSelector } from './BackgroundColorSelector';
import { FashionPoseSelector } from './FashionPoseSelector';
import { ArtisticStyleSelector } from './ArtisticStyleSelector';
import { LoadingSpinner } from './LoadingSpinner';
import { ImageIcon, ShirtIcon, UploadCloudIcon, XCircleIcon } from './icons';

interface SceneInputFormProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  imagePreviews: string[];
  handleImageAdd: (files: FileList | null, onComplete?: () => void) => void;
  handleImageRemove: (index: number) => void;
  fashionPose: string;
  setFashionPose: (pose: string) => void;
  fashionBackgroundColor: string;
  setFashionBackgroundColor: (color: string) => void;
  artisticStyle: string;
  setArtisticStyle: (style: string) => void;
}

export const SceneInputForm: React.FC<SceneInputFormProps> = ({
  handleSubmit,
  isLoading,
  imagePreviews,
  handleImageAdd,
  handleImageRemove,
  fashionPose,
  setFashionPose,
  fashionBackgroundColor,
  setFashionBackgroundColor,
  artisticStyle,
  setArtisticStyle
}) => {
  const [dropState, setDropState] = useState<'idle' | 'dragging' | 'processing'>('idle');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setDropState('processing');
      handleImageAdd(e.target.files, () => setDropState('idle'));
    }
    e.target.value = ''; // Reset input to allow re-uploading the same file
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setDropState('processing');
      handleImageAdd(e.dataTransfer.files, () => setDropState('idle'));
    } else {
      setDropState('idle');
    }
  }, [handleImageAdd]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setDropState('dragging'); };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.relatedTarget && e.currentTarget.contains(e.relatedTarget as Node)) return;
    setDropState('idle');
  };

  const isSubmitDisabled = isLoading || imagePreviews.length === 0 || !fashionPose;

  return (
    <>
      <div className="flex items-center justify-center gap-2 pb-3 mb-6 border-b-2 border-red-800">
        <ShirtIcon className="w-5 h-5 text-red-800" />
        <h2 className="text-md font-bold text-red-800">الموديل الخفي</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          id="image-upload-input"
          name="image-upload-input"
          type="file"
          className="sr-only"
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/webp"
          disabled={isLoading}
        />
        <div className="space-y-6">
          <div className="p-4 bg-red-800/10 border border-red-800/20 text-red-900 text-center rounded-lg animate-fade-in-up">
            <p className="font-semibold">ارفع صورة، اختار الحالة، واحنا هنحولها لصورة احترافية.</p>
          </div>
          <div>
            <label htmlFor="image-upload-input" className="block text-lg font-bold mb-2 text-stone-800 cursor-pointer">
              ١. ارفع صورة قطعة الملابس
            </label>
            <div className="relative">
              {imagePreviews.length > 0 ? (
                <div className="relative group aspect-square max-w-[150px]">
                  <img src={imagePreviews[0]} alt="Preview" className="w-full h-full object-cover rounded-lg border-2 border-stone-400/50" />
                  <div className="absolute top-1 right-1 z-10">
                    <button
                      type="button"
                      onClick={() => handleImageRemove(0)}
                      className="p-1 bg-black/60 rounded-full text-white hover:bg-red-800 transition-all duration-200 transform active:scale-90"
                      aria-label="Remove image"
                      disabled={isLoading}
                    >
                      <XCircleIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  className={`relative flex justify-center items-center w-full h-28 px-6 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                    dropState === 'dragging' ? 'border-solid border-red-700 bg-red-800/5' : 'border-dashed border-stone-400/50 hover:border-red-800/80'
                  }`}
                >
                  <label htmlFor="image-upload-input" className="absolute inset-0 cursor-pointer" />
                  {dropState === 'idle' && (
                    <div className="text-center pointer-events-none">
                      <ImageIcon className="mx-auto h-8 w-8 text-stone-500" />
                      <p className="text-sm text-stone-600">
                        <span className="font-semibold text-red-800">اختار صورة</span> أو اسحبها هنا
                      </p>
                    </div>
                  )}
                  {dropState === 'processing' && (
                    <div className="text-center pointer-events-none">
                      <LoadingSpinner minimal />
                      <p className="text-sm font-semibold text-stone-600 mt-2 animate-pulse">جاري معالجة الصورة...</p>
                    </div>
                  )}
                  {dropState === 'dragging' && (
                    <div className="absolute inset-0 bg-red-800/10 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center pointer-events-none animate-scale-in">
                      <UploadCloudIcon className="h-10 w-10 text-red-700" />
                      <p className="text-red-700 font-bold mt-2">ارمي الصورة هنا لرفعها</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-lg font-bold mb-2 text-stone-800">٢. اختر وضعية المنتج</label>
            <FashionPoseSelector selectedPose={fashionPose} onSelectPose={setFashionPose} disabled={isLoading} />
          </div>
          <div>
            <label className="block text-lg font-bold mb-2 text-stone-800">٣. اختر لون الخلفية</label>
            <BackgroundColorSelector selectedColor={fashionBackgroundColor} onSelectColor={setFashionBackgroundColor} disabled={isLoading} />
          </div>
           <div>
            <label className="block text-lg font-bold mb-2 text-stone-800">٤. اختر الستايل الفني</label>
            <ArtisticStyleSelector selectedStyle={artisticStyle} onSelectStyle={setArtisticStyle} disabled={isLoading} />
          </div>
        </div>
        <div className="flex justify-center mt-8 border-t border-stone-300/50 pt-6">
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="w-full px-8 py-3 bg-red-800 text-white font-bold rounded-lg hover:bg-red-700 disabled:bg-stone-400/50 disabled:cursor-not-allowed disabled:text-stone-600 transition-all duration-300 transform hover:scale-105 active:scale-[0.98] shadow-lg shadow-red-900/30"
          >
            {isLoading ? '...بنجهز الصورة' : 'حوّل الصورة'}
          </button>
        </div>
      </form>
    </>
  );
};
