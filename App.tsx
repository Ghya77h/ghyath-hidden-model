
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Login } from './components/Login';
import { Header } from './components/Header';
import { SceneInputForm } from './components/SceneInputForm';
import { LoadingSpinner } from './components/LoadingSpinner';
import { EditedImageCard } from './components/EditedImageCard';
import { ImageModal } from './components/ImageModal';
import { SparklesIcon } from './components/icons';
import { editImage } from './services/geminiService';
import type { ImagePart, EditedImageResult } from './types';
import { fileToBase64 } from './utils/fileUtils';

const backgroundPrompts: Record<string, string> = {
    'White': "a seamless, pure white studio background",
    'Warm Beige': "a seamless, warm beige studio background",
    'Cool Grey': "a seamless, gradient cool grey studio background",
    'Soft Pink': "a seamless, soft pastel pink studio background",
    'Sky Blue': "a seamless, light sky blue studio background",
    'Olive Green': "a seamless, muted olive green studio background",
    'Burnt Orange': "a seamless, warm burnt orange studio background",
    'Rich Maroon': "a seamless, rich maroon studio background",
    'Deep Navy': "a seamless, deep navy blue studio background",
    'Charcoal': "a seamless, dark charcoal grey studio background"
};

const artisticStyleTemplates: Record<string, string> = {
    'cinematic': "A stunning, high-fashion product photograph of a garment, gracefully floating or suspended. The composition is centered. Dramatic, cinematic lighting from the upper right creates intense, warm highlights and ethereal, glowing rim light effect that sharply contrasts with cooler shadows. The background is {{BACKGROUND_PLACEHOLDER}}. The overall aesthetic is clean, modern, and elegant, rendered with photorealistic precision, emphasizing the delicate texture and luxurious feel of the fabric, achieved with a shallow depth of field.",
    'ethereal': "A highly detailed, ethereal, high-fashion studio shot of a pristine white mannequin gracefully 'floating' mid-air, wearing an exquisite garment. The entire scene is bathed in soft, diffused, high-key overhead lighting. Surrounding the mannequin are numerous delicate, abstract, petal-like fabric elements, fluttering around. The background is a vast, flowing cascade of smooth fabric that is {{BACKGROUND_PLACEHOLDER}}. The image exudes a sense of purity, lightness, and elegant motion, rendered with hyperrealistic detail.",
    'minimalist': "A high-key, minimalist studio product photograph of a garment, dynamically suspended mid-air as if in motion. The garment exhibits natural folds and creases. The composition features the garment floating against a clean, seamless background which is {{BACKGROUND_PLACEHOLDER}}. Soft, diffused professional studio lighting illuminates the garment from above and slightly in front, creating subtle volumetric shadows. A soft, elongated shadow is cast beneath the garment. Shot with a shallow depth of field, sharp focus, evoking a clean, contemporary aesthetic.",
    'street': "A full-body, high-fashion studio shot of an invisible person or headless mannequin, dynamically posed. The background is a clean, minimalist seamless studio setup which is {{BACKGROUND_PLACEHOLDER}}. Dramatic, high-contrast, directional natural light originates from the upper left, casting intricate, sharp, elongated shadow patterns resembling palm fronds or window blinds across the entire background and subtly onto the subject. The lighting creates strong specular highlights on the fabric. The overall aesthetic is modern, clean, editorial, and sophisticated with a strong focus on light and shadow play."
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [images, setImages] = useState<ImagePart[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [editedImageResult, setEditedImageResult] = useState<EditedImageResult | null>(null);
  const [fashionPose, setFashionPose] = useState<string>('');
  const [fashionBackgroundColor, setFashionBackgroundColor] = useState<string>('Cool Grey');
  const [artisticStyle, setArtisticStyle] = useState<string>('default');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleThemeChange = (newTheme: 'light' | 'dark') => setTheme(newTheme);
  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => {
      setIsAuthenticated(false);
      // Reset state on logout
      setImages([]);
      setImagePreviews([]);
      setEditedImageResult(null);
      setFashionPose('');
      setFashionBackgroundColor('Cool Grey');
      setArtisticStyle('default');
      setError(null);
      setHasSubmitted(false);
  };

  const handleImageAdd = useCallback(async (files: FileList | null, onComplete?: () => void) => {
    if (!files || files.length === 0) {
      onComplete?.();
      return;
    }
    if (files.length > 1) {
      setError("يمكنك إضافة صورة واحدة فقط.");
      onComplete?.();
      return;
    }
    const file = files[0];
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError(`حجم الصورة '${file.name}' كبير. اختار صورة أصغر من 10 ميجا.`);
      onComplete?.();
      return;
    }
    try {
      setError(null);
      const imagePart = await fileToBase64(file);
      setImages([imagePart]);
      setImagePreviews(prev => {
        prev.forEach(URL.revokeObjectURL);
        return [URL.createObjectURL(file)];
      });
    } catch (err) {
      console.error("Error converting file:", err);
      setError("حصلت مشكلة واحنا بنجهز الصور.");
    } finally {
      onComplete?.();
    }
  }, []);

  const handleImageRemove = useCallback((indexToRemove: number) => {
    setImages(prev => prev.filter((_, i) => i !== indexToRemove));
    setImagePreviews(prev => {
      const urlToRemove = prev[indexToRemove];
      const newPreviews = prev.filter((_, i) => i !== indexToRemove);
      if (urlToRemove) URL.revokeObjectURL(urlToRemove);
      return newPreviews;
    });
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading || images.length === 0 || !fashionPose) return;

    setIsLoading(true);
    setHasSubmitted(true);
    setError(null);
    setEditedImageResult(null);

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    let prompt: string;
    const backgroundDescription = backgroundPrompts[fashionBackgroundColor] || backgroundPrompts['Cool Grey'];

    if (artisticStyle === 'default') {
      prompt = `Your task is to perform a professional fashion product photo transformation. 1. **Isolate the Outfit:** From the reference image provided, meticulously isolate the complete outfit. 2. **Remove the Model:** Completely remove every trace of the human model. The final image must contain ONLY the clothing on a perfectly invisible mannequin. 3. **Re-render on Invisible Mannequin:** Re-render the isolated outfit as a hyperrealistic 3D object, worn by an invisible mannequin in the following pose: "${fashionPose}". 4. **CRITICAL for Headwear:** If the garment is a hijab, reconstruct the inner lining to look natural on an invisible head. 5. **Set the Scene:** Place the outfit in a clean, minimalist scene with this background: ${backgroundDescription}. Use soft, diffused studio lighting. 6. **Final Aesthetic:** The final image must have a high-fashion, sophisticated, and ethereal editorial photography aesthetic.`;
    } else {
      const template = artisticStyleTemplates[artisticStyle];
      prompt = template.replace('{{BACKGROUND_PLACEHOLDER}}', backgroundDescription);
    }
    
    try {
      const result = await editImage(images, prompt);
      setEditedImageResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'للأسف حصلت مشكلة. جرب تاني كمان شوية.');
    } finally {
      setIsLoading(false);
    }
  }, [images, isLoading, fashionPose, fashionBackgroundColor, artisticStyle]);

  const renderResults = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-full min-h-[400px]">
          <LoadingSpinner />
        </div>
      );
    }
    if (error) {
      return (
        <div className="mt-12 text-center text-red-800 bg-red-200/50 p-4 rounded-lg animate-fade-in-up">
          <p>{error}</p>
        </div>
      );
    }
    if (!hasSubmitted) {
      return (
        <div className="flex flex-col justify-center items-center h-full min-h-[400px] text-center text-stone-500 p-8 border-2 border-dashed border-stone-300 rounded-2xl animate-fade-in-up">
          <SparklesIcon className="w-16 h-16 mb-4 text-stone-400" />
          <h2 className="text-2xl font-bold text-stone-700 mb-2">حوّل صور ملابسك لاحترافية</h2>
          <p>ارفع صورة لقطعة ملابس، اختار الوضعية، والذكاء الاصطناعي هيعرضهالك على موديل خفي في استوديو احترافي.</p>
        </div>
      );
    }
    if (!editedImageResult) {
      return (
         <div className="flex flex-col justify-center items-center h-full min-h-[400px] text-center text-stone-500 p-8 animate-fade-in-up">
          <h2 className="text-2xl font-bold text-stone-700 mb-2">مفيش نتيجة طلعت</h2>
          <p>الذكاء الاصطناعي معرفش يحلل الصورة دي. جرب صورة تانية.</p>
        </div>
      );
    }
    return (
      <div className="animate-fade-in-up">
        <EditedImageCard originalImages={imagePreviews} result={editedImageResult} onImageClick={setModalImage} />
      </div>
    );
  };

  if (!isAuthenticated) return <Login onLogin={handleLogin} />;

  return (
    <div className="min-h-screen text-stone-800 flex flex-col">
      <div className="flex-grow">
        <Header onLogout={handleLogout} theme={theme} onThemeChange={handleThemeChange} />
        <main className="container mx-auto px-4 py-8">
          <div className="lg:grid lg:grid-cols-5 lg:gap-8">
            <div className="lg:col-span-2 lg:sticky lg:top-8 self-start lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto custom-scrollbar">
              <div className="bg-[rgba(var(--color-surface-rgb),0.3)] backdrop-blur-md border border-[rgba(var(--color-border-rgb),0.3)] rounded-2xl p-6 shadow-2xl shadow-stone-900/10">
                <SceneInputForm
                  handleSubmit={handleSubmit}
                  isLoading={isLoading}
                  imagePreviews={imagePreviews}
                  handleImageAdd={handleImageAdd}
                  handleImageRemove={handleImageRemove}
                  fashionPose={fashionPose}
                  setFashionPose={setFashionPose}
                  fashionBackgroundColor={fashionBackgroundColor}
                  setFashionBackgroundColor={setFashionBackgroundColor}
                  artisticStyle={artisticStyle}
                  setArtisticStyle={setArtisticStyle}
                />
              </div>
            </div>
            <div className="lg:col-span-3 mt-12 lg:mt-0" ref={resultsRef}>
              {renderResults()}
            </div>
          </div>
        </main>
      </div>
      <footer className="text-center py-6 mt-auto">
        <p className="text-sm text-stone-500">صُنع بحب بواسطة عبدالرحمن صلاح ❤️</p>
      </footer>
      {modalImage && <ImageModal src={modalImage} onClose={() => setModalImage(null)} />}
    </div>
  );
};

export default App;
