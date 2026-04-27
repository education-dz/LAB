import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Boxes, Check, Filter, Package, FlaskConical, Plus, Trash2, Beaker } from 'lucide-react';
import { cn } from '../lib/utils';
import { useResources, ResourceItem } from '../hooks/useResources';

interface ResourcePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (resources: string) => void;
  initialValue?: string;
}

export default function ResourcePicker({ isOpen, onClose, onSelect, initialValue }: ResourcePickerProps) {
  const { resources, isLoading } = useResources();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'equipment' | 'chemical' | 'glassware'>('all');
  const [selectedItems, setSelectedItems] = useState<ResourceItem[]>([]);

  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setSelectedType('all');
      
      // Parse initialValue (comma separated string)
      if (initialValue) {
        const names = initialValue.split('،').map(n => n.trim()).filter(Boolean);
        const initialSelected = resources.filter(r => names.includes(r.name));
        setSelectedItems(initialSelected);
      } else {
        setSelectedItems([]);
      }
    }
  }, [isOpen, initialValue, resources]);

  const filteredResources = useMemo(() => {
    return resources.filter(r => {
      const matchSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase());
      let matchType = selectedType === 'all';
      if (selectedType === 'equipment') {
        matchType = r.type === 'equipment' && r.category !== 'glassware';
      } else if (selectedType === 'chemical') {
        matchType = r.type === 'chemical';
      } else if (selectedType === 'glassware') {
        matchType = r.type === 'equipment' && r.category === 'glassware';
      }
      return matchSearch && matchType;
    });
  }, [resources, searchTerm, selectedType]);

  const toggleItem = (item: ResourceItem) => {
    setSelectedItems(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) {
        return prev.filter(i => i.id !== item.id);
      }
      return [...prev, item];
    });
  };

  const handleConfirm = () => {
    const resourceString = selectedItems.map(i => i.name).join('، ');
    onSelect(resourceString);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm no-print">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-surface w-full max-w-3xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-outline/10 flex justify-between items-center bg-surface-container-low/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <Boxes size={24} />
              </div>
              <h3 className="text-xl font-black text-primary">اختيار الوسائل والمواد</h3>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-error/10 text-error rounded-full transition-all"
            >
              <X size={24} />
            </button>
          </div>

          {/* Filters */}
          <div className="p-6 space-y-4 bg-surface border-b border-outline/5">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface/40" size={18} />
                <input 
                  type="text" 
                  placeholder="بحث عن وسيلة أو مادة كيميائية..."
                  className="w-full bg-surface-container-low border-none rounded-2xl pr-12 pl-6 py-4 font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex bg-surface-container-low p-1 rounded-2xl">
                <button
                  onClick={() => setSelectedType('all')}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-black transition-all",
                    selectedType === 'all' ? "bg-surface text-primary shadow-sm" : "text-on-surface/40 hover:text-primary"
                  )}
                >
                  الكل
                </button>
                <button
                  onClick={() => setSelectedType('equipment')}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2",
                    selectedType === 'equipment' ? "bg-surface text-primary shadow-sm" : "text-on-surface/40 hover:text-primary"
                  )}
                >
                  <Package size={14} />
                  الأجهزة
                </button>
                <button
                  onClick={() => setSelectedType('chemical')}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2",
                    selectedType === 'chemical' ? "bg-surface text-primary shadow-sm" : "text-on-surface/40 hover:text-primary"
                  )}
                >
                  <FlaskConical size={14} />
                  المواد الكيميائية
                </button>
                <button
                  onClick={() => setSelectedType('glassware')}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2",
                    selectedType === 'glassware' ? "bg-surface text-primary shadow-sm" : "text-on-surface/40 hover:text-primary"
                  )}
                >
                  <Beaker size={14} />
                  الزجاجيات
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface-container-low/10">
            {/* Selection List */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-on-surface/40 uppercase tracking-widest px-2">النتائج ({filteredResources.length})</h4>
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                  </div>
                ) : filteredResources.length === 0 ? (
                  <div className="text-center py-12 text-on-surface/40 font-bold">لا توجد نتائج</div>
                ) : (
                  filteredResources.map(item => {
                    const isSelected = selectedItems.find(i => i.id === item.id);
                    return (
                      <button
                        key={item.id}
                        onClick={() => toggleItem(item)}
                        className={cn(
                          "w-full p-4 rounded-2xl text-right transition-all border-2 flex items-center justify-between group",
                          isSelected 
                            ? "bg-primary/5 border-primary/20 shadow-sm" 
                            : "bg-surface border-outline/5 hover:border-primary/20"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "p-2 rounded-xl transition-colors",
                            item.type === 'equipment' 
                              ? (item.category === 'glassware' ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600") 
                              : "bg-purple-50 text-purple-600"
                          )}>
                            {item.type === 'equipment' 
                              ? (item.category === 'glassware' ? <Beaker size={18} /> : <Package size={18} />) 
                              : <FlaskConical size={18} />}
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-on-surface text-sm">{item.name}</p>
                            <p className="text-[10px] text-on-surface/40 font-black uppercase">{item.category || (item.type === 'equipment' ? 'جهاز' : 'مادة')}</p>
                          </div>
                        </div>
                        <div className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                          isSelected ? "bg-primary border-primary text-on-primary" : "border-outline/20 group-hover:border-primary/40"
                        )}>
                          {isSelected && <Check size={14} />}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Selected Items Summary */}
            <div className="space-y-4">
              <div className="flex justify-between items-center px-2">
                <h4 className="text-xs font-black text-on-surface/40 uppercase tracking-widest">العناصر المختارة ({selectedItems.length})</h4>
                {selectedItems.length > 0 && (
                  <button 
                    onClick={() => setSelectedItems([])}
                    className="text-[10px] font-black text-error hover:underline"
                  >
                    مسح الكل
                  </button>
                )}
              </div>
              <div className="bg-surface rounded-[24px] border border-outline/5 p-4 min-h-[100px] max-h-[400px] overflow-y-auto space-y-2">
                {selectedItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-on-surface/20">
                    <Boxes size={40} className="mb-2" />
                    <p className="text-xs font-bold">لم يتم اختيار أي عنصر</p>
                  </div>
                ) : (
                  selectedItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-surface-container-low/50 rounded-xl group">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          item.type === 'equipment' 
                            ? (item.category === 'glassware' ? "bg-amber-400" : "bg-blue-400") 
                            : "bg-purple-400"
                        )} />
                        <span className="text-sm font-bold text-on-surface/80">{item.name}</span>
                      </div>
                      <button 
                        onClick={() => toggleItem(item)}
                        className="p-1 text-on-surface/20 hover:text-error transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-outline/10 bg-surface-container-low/30 flex justify-end gap-3">
            <button 
              onClick={onClose}
              className="px-8 py-3 rounded-2xl font-black text-on-surface/60 hover:bg-surface transition-all"
            >
              إلغاء
            </button>
            <button 
              onClick={handleConfirm}
              disabled={selectedItems.length === 0}
              className="px-10 py-3 bg-primary text-on-primary rounded-2xl font-black shadow-xl shadow-primary/20 hover:bg-primary-container transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              تأكيد الاختيار
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
