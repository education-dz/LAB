import { useState, useEffect } from 'react';
import { WifiOff, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setDismissed(false);
    };
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-orange-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 no-print rtl"
        dir="rtl"
      >
        <WifiOff size={20} className="animate-pulse" />
        <span className="text-sm font-bold">أنت الآن في وضع عدم الاتصال (Offline). يتم حفظ البيانات محلياً.</span>
        <button 
          onClick={() => setDismissed(true)}
          className="mr-4 p-1 hover:bg-surface/20 rounded-full transition-all"
        >
          <X size={16} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
