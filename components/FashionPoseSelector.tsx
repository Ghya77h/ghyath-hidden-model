
import React, { useState } from 'react';
import { ChevronDownIcon } from './icons';

interface FashionPoseSelectorProps {
  selectedPose: string;
  onSelectPose: (pose: string) => void;
  disabled: boolean;
}

const poseCategories = [
  {
    title: 'للملابس الرسمية والأنيقة',
    poses: [
      { ar: 'مشية موديل واثقة', en: 'a confident walking pose' },
      { ar: 'وقفة تصوير شيك', en: 'an elegant and poised standing pose' },
      { ar: 'كأنها بتتكلم في اجتماع', en: 'as if assertively explaining a point' },
      { ar: 'وقفة راقية (إيد عـ الوسط)', en: 'a sophisticated pose with one hand on the hip' },
      { ar: 'نزلة ستايل من ع السلم', en: 'as if confidently descending a staircase' },
    ],
  },
  {
    title: 'للملابس الرياضية والحركية',
    poses: [
      { ar: 'لقطة جري رياضي', en: 'a powerful running motion' },
      { ar: 'قفزة ديناميكية في الهوا', en: 'a dynamic mid-air jumping pose' },
      { ar: 'وضعية يوغا أو إطالة', en: 'a focused yoga or stretching pose' },
      { ar: 'كأنها بتشوط كورة', en: 'in a dynamic pose as if kicking a ball' },
      { ar: 'إطالة بعد التمرين', en: 'a powerful post-workout stretching pose' },
    ],
  },
  {
    title: 'للملابس الكاجوال والمريحة',
    poses: [
      { ar: 'حركة عائمة ومريحة', en: 'a relaxed floating pose, suggesting ease' },
      { ar: 'تتمايل مع نسمة هوا', en: 'gently swaying as if caught in a breeze' },
      { ar: 'ساندة على حاجة', en: 'a casual leaning pose' },
      { ar: 'قاعدة في الهوا', en: 'casually sitting on an invisible stool' },
      { ar: 'ساندة على حيطة وهمية', en: 'leaning against an invisible wall with crossed arms' },
    ],
  },
  {
    title: 'للفساتين والملابس الحريمي',
    poses: [
      { ar: 'لفة فستان رشيقة', en: 'a graceful twirling motion, with the fabric flowing out' },
      { ar: 'مشية فخمة وساحرة', en: 'a sweeping, majestic walking pose' },
      { ar: 'انحناءة بسيطة وأنيقة', en: 'a gentle curtsy pose, with the fabric draping elegantly' },
      { ar: 'وقفة درامية لعرض الأكمام', en: 'a dramatic pose with arms outstretched, showcasing the sleeves' },
    ],
  },
  {
    title: 'وضعيات حركية وديناميكية',
    poses: [
      { ar: 'ماشية عكس الريح', en: 'a powerful forward stride, as if walking into a strong wind' },
      { ar: 'قفزة جانبية درامية', en: 'a dramatic mid-air leap to the side' },
      { ar: 'وقفة استعداد للانطلاق', en: 'an athletic pose, as if about to sprint off the blocks' },
      { ar: 'لفة سريعة مع حركة القماش', en: 'a quick twisting motion, capturing the fabric in movement' },
      { ar: 'حركة احتفالية', en: 'arms thrown up in a celebratory motion' },
    ],
  },
];

export const FashionPoseSelector: React.FC<FashionPoseSelectorProps> = ({ selectedPose, onSelectPose, disabled }) => {
  const [openCategory, setOpenCategory] = useState<string | null>(poseCategories[0]?.title ?? null);

  return (
    <div className="space-y-2 animate-fade-in-up">
      {poseCategories.map((category) => {
        const isOpen = openCategory === category.title;
        const categoryId = `poses-${category.title.replace(/\s/g, '-')}`;
        return (
          <div key={category.title} className="p-3 bg-stone-200/50 rounded-lg">
            <button
              type="button"
              onClick={() => setOpenCategory(p => (p === category.title ? null : category.title))}
              className="w-full flex justify-between items-center text-left"
              aria-expanded={isOpen}
              aria-controls={categoryId}
            >
              <h5 className="text-sm font-bold text-stone-700">{category.title}</h5>
              <ChevronDownIcon className={`w-5 h-5 text-stone-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div
              id={categoryId}
              className={`grid transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'grid-rows-[1fr] mt-2' : 'grid-rows-[0fr]'}`}
            >
              <div className="min-h-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {category.poses.map((pose) => (
                    <button
                      key={pose.en}
                      type="button"
                      disabled={disabled}
                      onClick={() => onSelectPose(pose.en)}
                      className={`w-full p-2 text-xs font-semibold rounded-md text-left transition-all transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-stone-200 focus:ring-red-800 disabled:opacity-50 ${
                        selectedPose === pose.en
                          ? 'bg-red-800 text-white shadow-md'
                          : 'bg-white/60 text-stone-800 hover:bg-stone-300/70'
                      }`}
                    >
                      {pose.ar}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
