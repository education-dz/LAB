import React, { useState, useEffect } from 'react';
import { Search, X, Package, Beaker, User, FileText, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { query, collection, getDocs, where, limit } from 'firebase/firestore';
import { db, getUserCollection } from '../firebase';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

interface SearchResult {
  id: string;
  title: string;
  type: 'equipment' | 'chemical' | 'teacher' | 'report';
  path: string;
  subtitle?: string;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        // Toggle handled by parent but good to have
      }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const searchResults: SearchResult[] = [];
        
        // Search Equipment
        const eqQuery = query(
          getUserCollection('equipment'),
          limit(3)
        );
        const eqSnap = await getDocs(eqQuery);
        eqSnap.docs.forEach(doc => {
          const data = doc.data();
          if (data.name?.toLowerCase().includes(searchTerm.toLowerCase())) {
            searchResults.push({
              id: doc.id,
              title: data.name,
              type: 'equipment',
              path: '/inventory/equipment',
              subtitle: data.category
            });
          }
        });

        // Search Chemicals
        const chemQuery = query(
          getUserCollection('chemicals'),
          limit(3)
        );
        const chemSnap = await getDocs(chemQuery);
        chemSnap.docs.forEach(doc => {
          const data = doc.data();
          if (data.name?.toLowerCase().includes(searchTerm.toLowerCase())) {
            searchResults.push({
              id: doc.id,
              title: data.name,
              type: 'chemical',
              path: '/inventory/chemicals',
              subtitle: data.formula
            });
          }
        });

        // Search Teachers
        const teacherQuery = query(
          getUserCollection('teachers'),
          limit(3)
        );
        const teacherSnap = await getDocs(teacherQuery);
        teacherSnap.docs.forEach(doc => {
          const data = doc.data();
          if (data.name?.toLowerCase().includes(searchTerm.toLowerCase())) {
            searchResults.push({
              id: doc.id,
              title: data.name,
              type: 'teacher',
              path: '/teachers',
              subtitle: data.subject
            });
          }
        });

        setResults(searchResults);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const getTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'equipment': return <Package size={18} />;
      case 'chemical': return <Beaker size={18} />;
      case 'teacher': return <User size={18} />;
      case 'report': return <FileText size={18} />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-2xl bg-surface rounded-3xl shadow-2xl overflow-hidden border border-outline/10"
          >
            <div className="p-4 border-b border-outline/10 flex items-center gap-4 bg-surface-container-low">
              <Search className="text-primary" size={24} />
              <input
                autoFocus
                className="flex-1 bg-transparent border-none focus:ring-0 text-lg font-bold text-primary placeholder:text-outline/50"
                placeholder="ابحث عن أي شيء (أجهزة، مواد، أساتذة...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button 
                onClick={onClose}
                className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-4 no-scrollbar">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                  <p className="text-sm font-bold text-outline">جاري البحث...</p>
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-2">
                  {results.map((result) => (
                    <Link
                      key={`${result.type}-${result.id}`}
                      to={result.path}
                      onClick={onClose}
                      className="flex items-center gap-4 p-4 rounded-2xl hover:bg-primary/5 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                        {getTypeIcon(result.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-black text-primary">{result.title}</h4>
                        <p className="text-xs text-secondary font-bold">{result.subtitle}</p>
                      </div>
                      <ArrowRight size={18} className="text-outline opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                    </Link>
                  ))}
                </div>
              ) : searchTerm ? (
                <div className="text-center py-12">
                  <p className="text-outline font-bold">لم يتم العثور على نتائج لـ "{searchTerm}"</p>
                </div>
              ) : (
                <div className="py-8 px-4">
                  <h5 className="text-[10px] font-black text-outline uppercase tracking-widest mb-4">عمليات بحث شائعة</h5>
                  <div className="flex flex-wrap gap-2">
                    {['حمض الكلور', 'مجهر ضوئي', 'أستاذ العلوم', 'تقرير يومي'].map(tag => (
                      <button 
                        key={tag}
                        onClick={() => setSearchTerm(tag)}
                        className="px-4 py-2 rounded-full bg-surface-container-high text-xs font-bold text-primary hover:bg-primary/10 transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 bg-surface-container-lowest border-t border-outline/5 flex justify-between items-center text-[10px] font-bold text-outline">
              <div className="flex gap-4">
                <span><kbd className="bg-surface-container-high px-1.5 py-0.5 rounded border border-outline/20">ESC</kbd> للإغلاق</span>
                <span><kbd className="bg-surface-container-high px-1.5 py-0.5 rounded border border-outline/20">ENTER</kbd> للاختيار</span>
              </div>
              <span>نظام البحث الذكي v1.0</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
