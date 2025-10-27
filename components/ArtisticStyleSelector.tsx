
import React from 'react';

interface ArtisticStyleSelectorProps {
  selectedStyle: string;
  onSelectStyle: (style: string) => void;
  disabled: boolean;
}

const styles = [
  { key: 'default', name: 'الوضع العادي (افتراضي)' },
  { key: 'cinematic', name: 'إضاءة سينمائية' },
  { key: 'ethereal', name: 'أثيري وهوت كوتور' },
  { key: 'minimalist', name: 'بسيط وحركي' },
  { key: 'street', name: 'ستريت ستايل وظلال' },
];

export const ArtisticStyleSelector: React.FC<ArtisticStyleSelectorProps> = ({ selectedStyle, onSelectStyle, disabled }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {styles.map(style => (
        <button
          key={style.key}
          type="button"
          disabled={disabled}
          onClick={() => onSelectStyle(style.key)}
          className={`w-full p-2 text-xs font-semibold rounded-md text-center transition-all duration-200 transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-stone-200 focus:ring-red-800 disabled:opacity-50 ${
            selectedStyle === style.key ? 'bg-red-800 text-white shadow-md' : 'bg-white/60 text-stone-800 hover:bg-stone-300/70'
          }`}
        >
          {style.name}
        </button>
      ))}
    </div>
  );
};
