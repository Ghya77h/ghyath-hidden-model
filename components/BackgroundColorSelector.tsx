
import React from 'react';
import { CheckIcon } from './icons';

interface BackgroundColorSelectorProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
  disabled: boolean;
}

const colors = [
  { name: 'White', arName: 'أبيض', hex: '#ffffff' },
  { name: 'Warm Beige', arName: 'بيج دافئ', hex: '#eaddd7' },
  { name: 'Cool Grey', arName: 'رمادي بارد', hex: '#d1d5db' },
  { name: 'Soft Pink', arName: 'وردي ناعم', hex: '#fbcfe8' },
  { name: 'Sky Blue', arName: 'أزرق سماوي', hex: '#bae6fd' },
  { name: 'Olive Green', arName: 'أخضر زيتوني', hex: '#6b705c' },
  { name: 'Burnt Orange', arName: 'برتقالي محروق', hex: '#d97706' },
  { name: 'Rich Maroon', arName: 'أحمر داكن', hex: '#883a3a' },
  { name: 'Deep Navy', arName: 'أزرق كحلي', hex: '#2b2d42' },
  { name: 'Charcoal', arName: 'فحمي داكن', hex: '#374151' },
];

const darkColors = new Set(['Olive Green', 'Burnt Orange', 'Rich Maroon', 'Deep Navy', 'Charcoal']);

export const BackgroundColorSelector: React.FC<BackgroundColorSelectorProps> = ({ selectedColor, onSelectColor, disabled }) => {
  return (
    <div className="grid grid-cols-5 gap-3 p-2 bg-stone-200/50 rounded-lg">
      {colors.map((color) => {
        const isSelected = selectedColor === color.name;
        const isDark = darkColors.has(color.name);
        return (
          <button
            key={color.name}
            type="button"
            title={color.arName}
            disabled={disabled}
            onClick={() => onSelectColor(color.name)}
            className={`w-10 h-10 rounded-full border-2 transition-all duration-200 transform active:scale-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-stone-200 focus:ring-red-800 disabled:opacity-50 flex items-center justify-center ${
              isSelected ? 'border-red-800 scale-110 shadow-lg' : 'border-stone-400/50 hover:border-red-800/80'
            }`}
            style={{ backgroundColor: color.hex }}
            aria-pressed={isSelected}
          >
            {isSelected && <CheckIcon className={`w-6 h-6 ${isDark ? 'text-white' : 'text-stone-900'}`} />}
          </button>
        );
      })}
    </div>
  );
};
