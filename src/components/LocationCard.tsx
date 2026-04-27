import { useState } from 'react';
import { MapPin, Loader2, School, Navigation, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

export interface InstitutionSuggestion {
  name: string;
  directorate?: string;
  commune?: string;
  cycle?: string;
}

export default function LocationCard({ 
  onSelect, 
  communeName 
}: { 
  onSelect?: (suggestion: InstitutionSuggestion) => void;
  communeName?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [institutions, setInstitutions] = useState<InstitutionSuggestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const getNearbyInstitutions = async (lat: number, lng: number) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || process.env.GEMINI_API_KEY || '' });
      const prompt = `ما هي المتوسطات والثانويات القريبة أو المتواجدة في ${communeName ? `بلدية ${communeName}` : 'المنطقة'}؟ يرجى تقديم قائمة بأسماء المؤسسات فقط (متوسطات وثانويات فقط) مع تفاصيلها (المديرية، البلدية، الطور) بتنسيق JSON فقط: [{"name": "...", "directorate": "...", "commune": "...", "cycle": "..."}]`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng: {
                latitude: lat,
                longitude: lng
              }
            }
          }
        },
      });

      let text = response.text || "[]";
      // Clean up markdown if present
      if (text.includes("```json")) {
        text = text.split("```json")[1].split("```")[0].trim();
      } else if (text.includes("```")) {
        text = text.split("```")[1].split("```")[0].trim();
      }

      try {
        const data = JSON.parse(text);
        if (Array.isArray(data)) {
          setInstitutions(data.slice(0, 5));
        } else {
          setInstitutions([]);
        }
      } catch (e) {
        console.error("JSON parse error:", e);
        setInstitutions([]);
      }
    } catch (err: any) {
      console.error("Error fetching institutions:", err);
      const errorMessage = err?.message || String(err);
      if (errorMessage.includes("quota") || errorMessage.includes("RESOURCE_EXHAUSTED") || errorMessage.includes("Hard quota limit reached")) {
        setError("تم الوصول إلى الحد الأقصى لاستخدام الذكاء الاصطناعي. يرجى المحاولة لاحقاً.");
        
        // If the user hasn't selected their own key, prompt them to do so
        if (typeof window !== 'undefined' && (window as any).aistudio?.openSelectKey) {
          const hasKey = await (window as any).aistudio.hasSelectedApiKey();
          if (!hasKey) {
            await (window as any).aistudio.openSelectKey();
            // Try again after key selection
            return getNearbyInstitutions(lat, lng);
          }
        }
      } else {
        setError("تعذر العثور على مؤسسات قريبة.");
      }
    }
  };

  const handleGetLocation = () => {
    setLoading(true);
    setError(null);
    setInstitutions([]);

    if (!navigator.geolocation) {
      setError("المتصفح لا يدعم تحديد الموقع.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        getNearbyInstitutions(latitude, longitude).finally(() => setLoading(false));
      },
      (err) => {
        console.error("Geolocation error:", err);
        if (err.code === 1) {
          setError("تم رفض الوصول إلى الموقع. يرجى تفعيل إذن الموقع في إعدادات المتصفح.");
        } else if (err.code === 2) {
          setError("تعذر تحديد الموقع. يرجى التأكد من تشغيل الـ GPS.");
        } else if (err.code === 3) {
          setError("انتهت مهلة تحديد الموقع. يرجى المحاولة مرة أخرى.");
        } else {
          setError("حدث خطأ أثناء تحديد الموقع الجغرافي.");
        }
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const copyToClipboard = () => {
    if (location) {
      const text = `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface p-8 rounded-[40px] border border-outline/5 shadow-xl relative overflow-hidden group h-full"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
      
      <div className="flex justify-between items-start mb-10 relative z-10">
        <div className="w-20 h-20 rounded-[28px] bg-primary/5 flex items-center justify-center shadow-inner transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
          <MapPin size={36} className="text-primary" />
        </div>
        <button
          onClick={handleGetLocation}
          disabled={loading}
          className="bg-primary text-on-primary px-8 py-3 rounded-full text-sm font-black shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Navigation size={16} />}
          {loading ? 'جاري التحديد...' : 'تحديد الموقع'}
        </button>
      </div>

      <div className="relative z-10">
        <h4 className="text-2xl font-black text-primary mb-3 font-serif">الموقع الجغرافي</h4>
        <p className="text-base text-on-surface/60 mb-8 leading-relaxed font-medium">
          قم بتحديد موقع المؤسسة التعليمية بدقة للحصول على إحداثيات GPS واقتراحات المؤسسات القريبة.
        </p>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              key="error-message"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-error text-sm font-bold bg-error/5 p-5 rounded-[24px] mb-6 border border-error/10"
            >
              {error}
            </motion.div>
          )}

          {location && (
            <motion.div
              key="location-data"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between p-5 bg-primary/5 rounded-[24px] border border-primary/10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-surface rounded-xl shadow-sm text-primary">
                    <Navigation size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-on-surface/30 uppercase tracking-widest">إحداثيات GPS</span>
                    <span className="text-base font-black text-primary font-mono">
                      {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="p-3 bg-surface rounded-xl shadow-sm text-primary hover:bg-primary hover:text-on-primary transition-all active:scale-90"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>

              {institutions.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-1 h-4 bg-primary rounded-full"></div>
                    <span className="text-[10px] font-black text-on-surface/30 uppercase tracking-widest">المؤسسات التعليمية القريبة</span>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {institutions.map((inst, i) => (
                      <motion.div
                        key={`inst-${i}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => onSelect?.(inst)}
                        className="flex items-center gap-4 p-4 bg-surface border border-outline/5 rounded-[20px] shadow-sm hover:border-primary/30 transition-all cursor-pointer group/item hover:shadow-md"
                      >
                        <div className="p-2.5 bg-primary/5 rounded-xl text-primary group-hover/item:bg-primary group-hover/item:text-on-primary transition-colors">
                          <School size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-on-surface/80 group-hover/item:text-primary transition-colors">{inst.name}</span>
                          {inst.commune && (
                            <span className="text-[10px] text-on-surface/40 font-medium">{inst.commune} - {inst.directorate}</span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
