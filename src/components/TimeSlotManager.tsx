import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, X, Clock, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTimeSlots } from '../hooks/useTimeSlots';
import { cn } from '../lib/utils';

interface TimeSlotManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TimeSlotManager({ isOpen, onClose }: TimeSlotManagerProps) {
  const { timeSlots, saveTimeSlots, loading } = useTimeSlots();
  const [editingSlots, setEditingSlots] = useState<string[]>([]);
  const [newSlot, setNewSlot] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setEditingSlots([...timeSlots]);
    }
  }, [isOpen, timeSlots]);

  const handleAdd = () => {
    if (newSlot && !editingSlots.includes(newSlot)) {
      setEditingSlots([...editingSlots, newSlot]);
      setNewSlot('');
    }
  };

  const handleRemove = (index: number) => {
    setEditingSlots(editingSlots.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveTimeSlots(editingSlots);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error saving time slots:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm rtl font-sans" dir="rtl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-surface w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden border border-outline/10"
          >
            {/* Header */}
            <div className="p-8 bg-primary/5 border-b border-outline/5 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                  <Clock size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-primary">تعديل قائمة المواقيت</h2>
                  <p className="text-xs font-bold text-on-surface/40">تخصيص الفترات الزمنية للحصص التعليمية</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-3 hover:bg-outline/10 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {/* Add New Slot */}
              <div className="flex gap-3">
                <input 
                  type="text" 
                  placeholder="مثال: 08:00 - 09:30"
                  className="flex-1 bg-surface-container-low border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                  value={newSlot}
                  onChange={(e) => setNewSlot(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                />
                <button 
                  onClick={handleAdd}
                  disabled={!newSlot}
                  className="bg-primary text-on-primary p-4 rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary-container transition-all active:scale-95 disabled:opacity-50"
                >
                  <Plus size={24} />
                </button>
              </div>

              {/* Slots List */}
              <div className="space-y-3">
                {editingSlots.map((slot, index) => (
                  <motion.div 
                    key={`${slot}-${index}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl border border-outline/5 group hover:border-primary/20 transition-all"
                  >
                    <span className="font-bold text-on-surface">{slot}</span>
                    <button 
                      onClick={() => handleRemove(index)}
                      className="p-2 text-error hover:bg-error/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </motion.div>
                ))}
                {editingSlots.length === 0 && (
                  <div className="text-center py-12 text-on-surface/40 font-bold">
                    لا توجد مواقيت مضافة حالياً
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-8 bg-surface-container-low/50 border-t border-outline/5 flex gap-4">
              <button 
                onClick={handleSave}
                disabled={isSaving || loading}
                className="flex-1 bg-primary text-on-primary py-5 rounded-[24px] font-black text-xl shadow-2xl shadow-primary/20 hover:bg-primary-container transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : showSuccess ? (
                  <CheckCircle2 size={24} />
                ) : (
                  <Save size={24} />
                )}
                {showSuccess ? 'تم الحفظ' : 'حفظ التغييرات'}
              </button>
              <button 
                onClick={onClose}
                className="flex-1 bg-surface border border-outline/10 text-on-surface py-5 rounded-[24px] font-black text-xl hover:bg-surface-container-high transition-all active:scale-95"
              >
                إلغاء
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
