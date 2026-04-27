import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Users, Check, Layers, Filter } from 'lucide-react';
import { cn } from '../lib/utils';
import { useEducationalMap } from '../hooks/useEducationalMap';

interface ClassPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (className: string) => void;
  initialValue?: string;
}

export default function ClassPicker({ isOpen, onClose, onSelect, initialValue }: ClassPickerProps) {
  const { levels, isLoading } = useEducationalMap();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevelId, setSelectedLevelId] = useState<string>('');
  const [tempSelected, setTempSelected] = useState<string>(initialValue || '');

  useEffect(() => {
    if (isOpen) {
      setTempSelected(initialValue || '');
      setSearchTerm('');
      setSelectedLevelId('');
    }
  }, [isOpen, initialValue]);

  const filteredLevels = useMemo(() => {
    if (!levels) return [];
    
    return levels.map(level => {
      const filteredGroups = level.groups.filter(group => 
        group.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      return {
        ...level,
        groups: filteredGroups
      };
    }).filter(level => 
      (selectedLevelId === '' || level.id === selectedLevelId) && 
      level.groups.length > 0
    );
  }, [levels, searchTerm, selectedLevelId]);

  const handleSelect = (groupName: string) => {
    setTempSelected(groupName);
  };

  const handleConfirm = () => {
    if (tempSelected) {
      onSelect(tempSelected);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm no-print">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-surface w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-outline/10 flex justify-between items-center bg-surface-container-low/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-black text-primary">اختيار القسم</h3>
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
                  placeholder="بحث سريع عن قسم..."
                  className="w-full bg-surface-container-low border-none rounded-2xl pr-12 pl-6 py-4 font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full md:w-48 relative">
                <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface/40" size={18} />
                <select 
                  className="w-full bg-surface-container-low border-none rounded-2xl pr-12 pl-6 py-4 font-bold focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                  value={selectedLevelId}
                  onChange={(e) => setSelectedLevelId(e.target.value)}
                >
                  <option value="">كل المستويات</option>
                  {levels.map(level => (
                    <option key={level.id} value={level.id}>{level.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Body - Chips */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="font-bold text-on-surface/40">جاري تحميل الخريطة التربوية...</p>
              </div>
            ) : filteredLevels.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
                <div className="p-4 bg-surface-container-low rounded-full text-on-surface/20">
                  <Search size={48} />
                </div>
                <div>
                  <p className="font-black text-on-surface/60 text-lg">لم يتم العثور على نتائج</p>
                  <p className="text-on-surface/40 font-bold">جرب تغيير معايير البحث أو إضافة أقسام في الإعدادات</p>
                </div>
              </div>
            ) : (
              filteredLevels.map(level => (
                <div key={level.id} className="space-y-4">
                  <div className="flex items-center gap-2 text-primary/60 font-black text-sm uppercase tracking-wider">
                    <Layers size={16} />
                    {level.name}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {level.groups.map((group, idx) => {
                      const isSelected = tempSelected === group;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelect(group)}
                          className={cn(
                            "px-5 py-3 rounded-2xl font-bold transition-all border-2 flex items-center gap-2 active:scale-95",
                            isSelected 
                              ? "bg-primary text-on-primary border-primary shadow-lg shadow-primary/20" 
                              : "bg-surface border-outline/10 text-on-surface/70 hover:border-primary/30 hover:bg-primary/5"
                          )}
                        >
                          {isSelected && <Check size={16} />}
                          {group}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-outline/10 bg-surface-container-low/30 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-right">
              {tempSelected && (
                <div className="flex items-center gap-2 text-primary font-black">
                  <Check size={18} />
                  <span>القسم المختار:</span>
                  <span className="bg-primary/10 px-3 py-1 rounded-lg">{tempSelected}</span>
                </div>
              )}
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <button 
                onClick={onClose}
                className="flex-1 sm:flex-none px-8 py-4 rounded-2xl font-black text-on-surface/60 hover:bg-surface-container-low transition-all"
              >
                إلغاء
              </button>
              <button 
                onClick={handleConfirm}
                disabled={!tempSelected}
                className="flex-1 sm:flex-none px-8 py-4 rounded-2xl bg-primary text-on-primary font-black shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
              >
                تأكيد الاختيار
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
