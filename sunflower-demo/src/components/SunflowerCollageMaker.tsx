"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Camera, ImagePlus, Download, Trash2 } from "lucide-react";

export function SunflowerCollageMaker() {
  const [images, setImages] = useState<string[]>([]);
  const collageRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Custom text layers
  type TextLayer = { id: number; text: string; x: number; y: number };
  const [textLayers, setTextLayers] = useState<TextLayer[]>([]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only spawn text if we didn't click on a button or an input
    if ((e.target as HTMLElement).tagName === 'BUTTON' || (e.target as HTMLElement).tagName === 'INPUT') return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setTextLayers(prev => [...prev, { id: Date.now(), text: "", x, y }]);
  };

  const updateText = (id: number, newText: string) => {
    setTextLayers(prev => prev.map(t => t.id === id ? { ...t, text: newText } : t));
  };

  const removeEmptyTexts = () => {
    setTextLayers(prev => prev.filter(t => t.text.trim().length > 0));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 4 - images.length);
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setImages(prev => {
              if (prev.length >= 4) return prev;
              return [...prev, event.target!.result as string];
            });
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const exportCollage = async () => {
    if (!collageRef.current) return;
    setIsExporting(true);
    
    try {
      // Need a small delay to allow UI to update (hide trash icons)
      await new Promise(resolve => setTimeout(resolve, 100));

      const { toPng } = await import('html-to-image');
      
      const dataUrl = await toPng(collageRef.current, {
        pixelRatio: 2,
        backgroundColor: '#111513',
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left'
        }
      });
      
      const link = document.createElement("a");
      link.download = `helianthus-story-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to export image", err);
      alert("Something went wrong exporting the collage. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-12 items-start justify-center w-full">
      {/* Controls */}
      <div className="w-full md:w-1/3 space-y-8">
        <div>
          <h3 className="font-serif text-3xl mb-4 text-[#F9F8F4]">Story Studio</h3>
          <p className="text-[#F9F8F4]/70 leading-relaxed text-sm">
            Curate a beautiful, sunflower-themed collage for your Instagram Story. Upload up to 4 photos from your gallery or take a new picture.
          </p>
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-center gap-3 w-full p-4 rounded-xl border border-[#F9F8F4]/20 bg-[#1A231C]/50 hover:bg-[#1A231C] text-[#F9F8F4] transition-colors cursor-pointer group shadow-lg">
            <ImagePlus className="w-5 h-5 text-[#DDA826] group-hover:scale-110 transition-transform" />
            <span className="font-medium tracking-wide uppercase text-xs">Upload from Gallery</span>
            <input 
              type="file" 
              accept="image/*" 
              multiple 
              className="hidden" 
              onChange={handleImageUpload} 
              disabled={images.length >= 4}
            />
          </label>

          <label className="flex items-center justify-center gap-3 w-full p-4 rounded-xl border border-[#F9F8F4]/20 bg-[#1A231C]/50 hover:bg-[#1A231C] text-[#F9F8F4] transition-colors cursor-pointer group shadow-lg">
            <Camera className="w-5 h-5 text-[#DDA826] group-hover:scale-110 transition-transform" />
            <span className="font-medium tracking-wide uppercase text-xs">Take Photo</span>
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" 
              className="hidden" 
              onChange={handleImageUpload}
              disabled={images.length >= 4}
            />
          </label>
        </div>

        {images.length > 0 && (
          <button 
            onClick={exportCollage}
            disabled={isExporting}
            className="flex items-center justify-center gap-3 w-full p-4 rounded-xl bg-[#DDA826] text-[#1A231C] hover:bg-white transition-colors cursor-pointer group shadow-[0_0_20px_rgba(221,168,38,0.3)] font-bold uppercase tracking-widest text-xs"
          >
            {isExporting ? (
              <span className="animate-pulse">Exporting...</span>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Save for Instagram</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Collage Preview - IG Story Aspect Ratio (9:16) */}
      <div className="w-full md:w-auto flex justify-center mt-12 md:mt-0">
        <div 
          className="relative w-[320px] h-[568px] flex-shrink-0 rounded-3xl overflow-hidden shadow-2xl bg-[#1A231C] ring-4 ring-[#F9F8F4]/10"
        >
          {/* THE EXPORTABLE CANVAS */}
          <div 
            ref={collageRef} 
            onClick={handleCanvasClick}
            className="absolute inset-0 bg-[#111513] overflow-hidden cursor-text"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='70' height='70' viewBox='0 0 70 70' xmlns='http://www.w3.org/2000/svg'%3E%3Cg transform='translate(35,35)' opacity='0.3'%3E%3Ccircle cx='0' cy='-12' r='4' fill='%23DDA826'/%3E%3Ccircle cx='0' cy='12' r='4' fill='%23DDA826'/%3E%3Ccircle cx='-12' cy='0' r='4' fill='%23DDA826'/%3E%3Ccircle cx='12' cy='0' r='4' fill='%23DDA826'/%3E%3Ccircle cx='-8.5' cy='-8.5' r='4' fill='%23DDA826'/%3E%3Ccircle cx='8.5' cy='8.5' r='4' fill='%23DDA826'/%3E%3Ccircle cx='-8.5' cy='8.5' r='4' fill='%23DDA826'/%3E%3Ccircle cx='8.5' cy='-8.5' r='4' fill='%23DDA826'/%3E%3Ccircle cx='0' cy='0' r='7' fill='%232C1A0B'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
              backgroundSize: "70px 70px"
            }}
          >
            {/* Top Left Text Area */}
            <div className="absolute top-6 left-4 z-20 max-w-[140px]">
              <h2 
                contentEditable 
                suppressContentEditableWarning
                onClick={(e) => e.stopPropagation()}
                className="font-serif italic text-4xl text-[#E8C051] mb-2 leading-none outline-none focus:ring-2 focus:ring-[#E8C051]/50 rounded px-1 -mx-1"
              >
                Sunlight
              </h2>
              
              {/* Cursive underline / line art */}
              <svg viewBox="0 0 100 30" className="w-24 h-8 mt-2 text-[#E8C051] opacity-80 overflow-visible">
                <path d="M 0 15 Q 20 5, 40 15 T 60 15 T 100 15" fill="none" stroke="currentColor" strokeWidth="1" />
                {/* Tiny sun at the end */}
                <circle cx="100" cy="15" r="3" fill="currentColor" />
                <path d="M 100 9 L 100 11 M 100 19 L 100 21 M 94 15 L 96 15 M 104 15 L 106 15" stroke="currentColor" strokeWidth="1" />
              </svg>
            </div>

            {/* Photo Grid - Absolute Scrapbook Layout */}
            {images.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none z-10">
                <div className="w-full h-full flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-2xl">
                  <p className="text-[#DDA826] text-xs font-bold uppercase tracking-widest text-center px-8 drop-shadow-md">
                    Upload photos to begin your scrapbook
                  </p>
                </div>
              </div>
            ) : (
              <>

                {/* Slot 1: Top Right Polaroid */}
                {images[0] && (
                  <motion.div 
                    drag
                    dragConstraints={collageRef}
                    dragMomentum={false}
                    onPointerDown={(e) => e.stopPropagation()}
                    initial={{ rotate: 4 }}
                    className="absolute top-[20px] right-[10px] w-[150px] h-[170px] bg-white p-2 pb-6 shadow-2xl z-10 group border border-gray-200 cursor-grab active:cursor-grabbing"
                  >
                    <img src={images[0]} alt="1" className="w-full h-full object-cover pointer-events-none" />
                    {!isExporting && (
                      <button onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); removeImage(0); }} className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </motion.div>
                )}

                {/* Slot 2: Mid Left Organic Blob */}
                {images[1] && (
                  <motion.div 
                    drag
                    dragConstraints={collageRef}
                    dragMomentum={false}
                    onPointerDown={(e) => e.stopPropagation()}
                    initial={{ rotate: -6 }}
                    className="absolute top-[170px] left-[0px] w-[200px] h-[220px] bg-white p-2 shadow-2xl z-20 group cursor-grab active:cursor-grabbing"
                    style={{ borderRadius: "50% 50% 40% 60% / 60% 40% 60% 40%" }}
                  >
                    <img src={images[1]} alt="2" className="w-full h-full object-cover pointer-events-none" style={{ borderRadius: "50% 50% 40% 60% / 60% 40% 60% 40%" }} />
                    {!isExporting && (
                      <button onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); removeImage(1); }} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-2.5 bg-black/50 hover:bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </motion.div>
                )}

                {/* Slot 3: Mid Right Organic Blob */}
                {images[2] && (
                  <motion.div 
                    drag
                    dragConstraints={collageRef}
                    dragMomentum={false}
                    onPointerDown={(e) => e.stopPropagation()}
                    initial={{ rotate: 8 }}
                    className="absolute top-[310px] right-[0px] w-[190px] h-[210px] bg-white p-2 shadow-2xl z-30 group cursor-grab active:cursor-grabbing"
                    style={{ borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%" }}
                  >
                    <img src={images[2]} alt="3" className="w-full h-full object-cover pointer-events-none" style={{ borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%" }} />
                    {!isExporting && (
                      <button onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); removeImage(2); }} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-2.5 bg-black/50 hover:bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </motion.div>
                )}

                {/* Slot 4: Bottom Polaroid/Torn */}
                {images[3] && (
                  <motion.div 
                    drag
                    dragConstraints={collageRef}
                    dragMomentum={false}
                    onPointerDown={(e) => e.stopPropagation()}
                    initial={{ rotate: -3 }}
                    className="absolute top-[400px] left-[10px] w-[220px] h-[160px] bg-white p-2 pb-6 shadow-2xl z-40 group border border-gray-200 cursor-grab active:cursor-grabbing"
                  >
                    <img src={images[3]} alt="4" className="w-full h-full object-cover pointer-events-none" />
                    {!isExporting && (
                      <button onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); removeImage(3); }} className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </motion.div>
                )}
              </>
            )}

            {/* Custom User Text Layers */}
            {textLayers.map(t => (
              isExporting ? (
                <div
                  key={t.id}
                  style={{ 
                    left: t.x, 
                    top: t.y, 
                    transform: "translate(-50%, -50%)",
                    fontFamily: "var(--font-kalam)" 
                  }}
                  className="absolute bg-transparent border-none outline-none text-white text-4xl drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] z-50 text-center w-[350px]"
                >
                  {t.text}
                </div>
              ) : (
                <input
                  key={t.id}
                  autoFocus
                  style={{ 
                    left: t.x, 
                    top: t.y, 
                    transform: "translate(-50%, -50%)",
                    fontFamily: "var(--font-kalam)" 
                  }}
                  className="absolute bg-transparent border-none outline-none text-white text-4xl drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] z-50 text-center w-[350px] placeholder-white/50"
                  value={t.text}
                  onChange={(e) => updateText(t.id, e.target.value)}
                  onBlur={removeEmptyTexts}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="Type here..."
                />
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
