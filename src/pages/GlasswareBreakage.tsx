import React, { useState, useEffect } from 'react';
import { 
  Beaker, 
  TrendingUp, 
  AlertTriangle, 
  Calculator, 
  History, 
  Plus, 
  FileText, 
  Sparkles,
  Search,
  Filter,
  Trash2,
  Printer,
  CheckCircle,
  Package,
  Layers,
  ArrowUp,
  ArrowDown,
  ArrowUpDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { onSnapshot, query, addDoc, serverTimestamp, deleteDoc, doc, updateDoc, where } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, getUserCollection } from '../firebase';

interface GlasswareItem {
  id: string;
  designationFr: string;
  nameAr: string;
  type: string;
  unit: string;
  quantity: number;
  status: 'جيدة' | 'مكسورة' | 'تحتاج إصلاح' | 'مفقودة';
  location: string;
  notes: string;
  createdAt?: any;
}

const INITIAL_GLASSWARE: Partial<GlasswareItem>[] = [
  { designationFr: 'éprouvette graduée sur pied avec bec verseur 250 ml', nameAr: 'مخبرية مرقمة بحامل وفم مفرغ 250 سل', type: 'مخبرية', unit: 'قطعة', quantity: 2, status: 'جيدة', location: 'الخزانة', notes: '' },
  { designationFr: 'éprouvette graduée 100 ml', nameAr: 'مخبار مدرج 100 مل', type: 'مخبار', unit: 'قطعة', quantity: 2, status: 'جيدة', location: 'الخزانة', notes: '' },
  { designationFr: 'éprouvette graduée 100 ml', nameAr: 'مخبار مدرج 100 مل', type: 'مخبار', unit: 'قطعة', quantity: 2, status: 'جيدة', location: 'الخزانة', notes: '' },
  { designationFr: 'éprouvette graduée 500 ml', nameAr: 'مخبار مدرج 500 مل', type: 'مخبار', unit: 'قطعة', quantity: 1, status: 'جيدة', location: 'الخزانة', notes: '' },
  { designationFr: 'boîte de Petri', nameAr: 'علب بيتر', type: 'أواني', unit: 'قطعة', quantity: 5, status: 'جيدة', location: 'الخزانة', notes: '' },
  { designationFr: 'flacon compte gouttes 125 cl', nameAr: 'قارورة تقطير من الزجاج 125 سل', type: 'قارورة', unit: 'قطعة', quantity: 6, status: 'جيدة', location: 'الخزانة', notes: '' },
  { designationFr: 'verre à pied non gradué 300 CC', nameAr: 'كأس غير مرقم 300 سل', type: 'كأس', unit: 'قطعة', quantity: 3, status: 'جيدة', location: 'الخزانة', notes: '' },
  { designationFr: 'verre à pied non gradué 250 CC', nameAr: 'كأس غير مرقم 250 سل', type: 'كأس', unit: 'قطعة', quantity: 4, status: 'جيدة', location: 'الخزانة', notes: '' },
  { designationFr: 'burette 50 CC', nameAr: 'سحاحة 50 سل', type: 'سحاحة', unit: 'قطعة', quantity: 2, status: 'جيدة', location: 'الخزانة', notes: '' },
  { designationFr: 'burette 25 CC', nameAr: 'سحاحة 25 سل', type: 'سحاحة', unit: 'قطعة', quantity: 1, status: 'جيدة', location: 'الخزانة', notes: '' },
  { designationFr: 'fiole jaugée pyrex 1000 ml', nameAr: 'دورق بعلامة 1000 سل', type: 'دورق', unit: 'قطعة', quantity: 2, status: 'جيدة', location: 'الخزانة', notes: '' },
  { designationFr: 'éprouvette graduée sur pied avec bec verseur 250 ml', nameAr: 'مخبرية مرقمة بحامل وفم مفرغ 250 سل', type: 'مخبرية', unit: 'قطعة', quantity: 1, status: 'جيدة', location: 'الخزانة', notes: '' },
  { designationFr: 'brosse silicate classe 250 ml', nameAr: 'فرشاة تنظيف 250 مل', type: 'أدوات', unit: 'قطعة', quantity: 2, status: 'جيدة', location: 'الخزانة', notes: '' },
  { designationFr: 'tubes à essais pyrex 18×180', nameAr: 'أنابيب اختبار بيريكس 18×180', type: 'أنبوب اختبار', unit: 'قطعة', quantity: 50, status: 'جيدة', location: 'الخزانة', notes: '' },
  { designationFr: 'démonstration instrument of current magnetic field', nameAr: 'وشيعة محرضة', type: 'أجهزة', unit: 'قطعة', quantity: 1, status: 'جيدة', location: 'الخزانة', notes: '' },
  { designationFr: 'flacon de wolf 2 tubulures en verre 500 CC', nameAr: 'قارورة وولف من الزجاج 500 سل', type: 'قارورة', unit: 'قطعة', quantity: 3, status: 'جيدة', location: 'الخزانة', notes: '' },
  { designationFr: 'tubes à essais pyrex 18×180', nameAr: 'أنابيب اختبار', type: 'أنبوب اختبار', unit: 'قطعة', quantity: 33, status: 'جيدة', location: 'الخزانة', notes: '' },
  { designationFr: 'tubes à essais', nameAr: 'أنابيب اختبار', type: 'أنبوب اختبار', unit: 'قطعة', quantity: 35, status: 'جيدة', location: 'الخزانة', notes: '' },
  { designationFr: 'baguette verre creux 6 mm', nameAr: 'قضبان زجاجية مفرغة', type: 'قضبان', unit: 'كغ', quantity: 1, status: 'جيدة', location: 'الخزانة', notes: '' },
  { designationFr: 'tube en verre plein 6 mm', nameAr: 'قضبان زجاجية مملوءة', type: 'قضبان', unit: 'كغ', quantity: 1, status: 'جيدة', location: 'الخزانة', notes: '' },
  { designationFr: 'burette de MOHR 25 CC', nameAr: 'سحاحة موهر 25 سل بماسك موهر وسداد من المطاط', type: 'سحاحة', unit: 'قطعة', quantity: 7, status: 'جيدة', location: 'الخزانة', notes: '' },
  { designationFr: 'Réfrigérant de liebig 250 CC 40', nameAr: 'جهاز تبريد ليبيق 250 سل', type: 'أجهزة', unit: 'قطعة', quantity: 2, status: 'جيدة', location: 'الخزانة', notes: '' },
  { designationFr: 'pipette jaugée 2 traits 10 CC', nameAr: 'ماصة معلمة بخطين 10 سل', type: 'ماصة', unit: 'قطعة', quantity: 4, status: 'جيدة', location: 'الخزانة', notes: '' },
  { designationFr: 'pipettes', nameAr: 'ماصات', type: 'ماصة', unit: 'قطعة', quantity: 9, status: 'جيدة', location: 'الخزانة', notes: '' },
  { designationFr: 'burette avec robinet', nameAr: 'سحاحة بحنفية', type: 'سحاحة', unit: 'قطعة', quantity: 1, status: 'جيدة', location: 'الخزانة', notes: '' }
];

export default function GlasswareBreakage({ isNested = false }: { isNested?: boolean }) {
  const [items, setItems] = useState<GlasswareItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [sortField, setSortField] = useState<keyof GlasswareItem | 'none'>('none');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const q = query(getUserCollection('glassware_inventory'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GlasswareItem));
      setItems(docs);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'glassware_inventory');
    });
    return () => unsubscribe();
  }, []);

  const handleSeedData = async () => {
    if (items.length > 0) {
      if (!confirm('قاعدة البيانات تحتوي بالفعل على بيانات. هل تريد إضافة النماذج الافتراضية أيضاً؟')) return;
    }
    setLoading(true);
    try {
      for (const item of INITIAL_GLASSWARE) {
        await addDoc(getUserCollection('glassware_inventory'), {
          ...item,
          createdAt: serverTimestamp()
        });
      }
      alert('تمت إضافة 25 صنف بنجاح!');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'glassware_inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateItem = async (id: string, updates: Partial<GlasswareItem>) => {
    try {
      await updateDoc(doc(getUserCollection('glassware_inventory'), id), updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `glassware_inventory/${id}`);
    }
  };

  const handleRemoveItem = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الصنف؟')) return;
    try {
      await deleteDoc(doc(getUserCollection('glassware_inventory'), id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `glassware_inventory/${id}`);
    }
  };

  const handleAddItem = async () => {
    try {
      await addDoc(getUserCollection('glassware_inventory'), {
        designationFr: 'New Item',
        nameAr: 'صنف جديد',
        type: 'أخرى',
        unit: 'قطعة',
        quantity: 0,
        status: 'جيدة',
        location: 'المخبر',
        notes: '',
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'glassware_inventory');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredItems = items
    .filter(item => {
      const matchesSearch = 
        item.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.designationFr.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !filterType || item.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortField === 'none') return 0;
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });

  const totalQuantity = items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  const brokenCount = items.filter(i => i.status === 'مكسورة').length;
  const goodCount = items.filter(i => i.status === 'جيدة').length;

  return (
    <div className={cn("space-y-8 max-w-7xl mx-auto pb-24 rtl font-sans", !isNested && "px-6")} dir="rtl">
      {/* Official Header (Print Only) */}
      <div className="hidden print:block mb-8 border-b-2 border-black pb-6">
        <div className="flex justify-between items-start mb-4">
          <div className="text-right text-sm font-bold">
            <p>مديرية التربية لولاية: أم البواقي</p>
            <p>ثانوية بوحازم عبد المجيد - عين كرشة</p>
          </div>
          <div className="text-center">
            <p className="font-black text-base">الجمهورية الجزائرية الديمقراطية الشعبية</p>
            <p className="font-bold text-sm">وزارة التربية الوطنية</p>
          </div>
          <div className="text-left text-sm font-bold">
            <p>السنة الدراسية: 2025 - 2026</p>
          </div>
        </div>
        <h2 className="text-center text-2xl font-black underline mt-6">جرد مخزون الزجاجيات — مخبر الوسائل التعليمية</h2>
      </div>

      {/* Header (Screen Only) */}
      {!isNested && (
        <header className="relative flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-4 print:hidden">
          <div className="text-right space-y-3 relative z-10">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-full text-primary text-xs font-black uppercase tracking-widest mb-2">
              <Beaker size={14} />
              جرد الزجاجيات والكسور
            </div>
            <h1 className="text-5xl font-black text-primary tracking-tighter">الزجاجيات والكسور</h1>
            <p className="text-on-surface/60 text-lg font-bold">سجل دقيق لمتابعة <span className="text-primary italic">الأدوات الزجاجية</span> وحساب القيمة المالية للفواقد.</p>
          </div>
          
          <div className="flex flex-wrap gap-4 relative z-10">
            <button 
              onClick={handlePrint}
              className="bg-surface text-primary border-2 border-primary/10 px-6 py-3.5 rounded-full font-black flex items-center gap-2 hover:bg-primary/5 transition-all shadow-xl active:scale-95"
            >
              <Printer size={20} />
              طباعة البطاقات
            </button>
            <button 
              onClick={handleSeedData}
              className="bg-surface text-primary border-2 border-primary/10 px-6 py-3.5 rounded-full font-black flex items-center gap-2 hover:bg-primary/5 transition-all shadow-xl active:scale-95"
            >
              <Sparkles size={20} />
              إضافة النماذج (25 صنف)
            </button>
            <button 
              onClick={handleAddItem}
              className="bg-primary text-on-primary px-8 py-3.5 rounded-full font-black flex items-center gap-2 shadow-2xl shadow-primary/30 hover:bg-primary-container transition-all active:scale-95"
            >
              <Plus size={22} />
              إضافة قطعة
            </button>
          </div>
        </header>
      )}

      {/* Stats (Screen Only) */}
      {!isNested && (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 print:hidden">
          {[
            { label: 'أصناف الزجاجيات', value: items.length, icon: Layers, color: 'bg-primary/10', textColor: 'text-primary' },
            { label: 'إجمالي الكميات', value: totalQuantity, icon: Package, color: 'bg-primary/5', textColor: 'text-primary' },
            { label: 'الحالة: جيدة', value: goodCount, icon: CheckCircle, color: 'bg-green-50', textColor: 'text-green-600' },
            { label: 'الحالة: مكسورة', value: brokenCount, icon: AlertTriangle, color: 'bg-error/10', textColor: 'text-error' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn("p-6 rounded-[32px] border border-outline/5 shadow-lg", stat.color)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-surface rounded-xl shadow-sm text-primary">
                  <stat.icon size={20} />
                </div>
              </div>
              <div>
                <p className="text-[10px] text-on-surface/40 font-black uppercase tracking-widest mb-1">{stat.label}</p>
                <span className={cn("text-3xl font-black tracking-tighter", stat.textColor)}>{stat.value}</span>
              </div>
            </motion.div>
          ))}
        </section>
      )}

      {/* Main Table Container */}
      <section className="bg-surface rounded-[40px] border border-outline/10 shadow-2xl overflow-hidden">
        {/* Table Actions (Screen Only) */}
        <div className="p-8 border-b border-outline/5 flex flex-col md:flex-row justify-between items-center gap-6 bg-surface-container-low/30 print:hidden">
          <div className="relative w-full md:w-96">
            <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-primary/40" size={20} />
            <input 
              className="w-full bg-surface border-2 border-outline/5 rounded-full pr-14 pl-6 py-3 text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
              placeholder="بحث بالاسم أو النوع..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <select 
              className="bg-surface border-2 border-outline/5 rounded-full px-6 py-3 text-sm font-black text-primary focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">كل الأنواع</option>
              {Array.from(new Set(items.map(i => i.type))).map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50 text-on-surface/40 text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="px-6 py-4 text-center">رقم</th>
                <th className="px-6 py-4">DÉSIGNATION</th>
                <th className="px-6 py-4">التسمية بالعربية</th>
                <th className="px-6 py-4">النوع</th>
                <th className="px-6 py-4 text-center">الوحدة</th>
                <th className="px-6 py-4 text-center">الكمية</th>
                <th className="px-6 py-4 text-center">الحالة</th>
                <th className="px-6 py-4">الموقع</th>
                <th className="px-6 py-4">ملاحظات</th>
                <th className="px-6 py-4 text-center print:hidden">×</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/5">
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item, index) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={item.id}
                    className="hover:bg-primary/[0.02] transition-colors group"
                  >
                    <td className="px-6 py-4 text-center font-black text-primary/40 text-xs">
                      {(index + 1).toString().padStart(2, '0')}
                    </td>
                    <td className="px-6 py-4 text-[10px] font-bold text-on-surface/60 font-mono ltr text-left">
                      <input 
                        type="text"
                        value={item.designationFr}
                        onChange={(e) => handleUpdateItem(item.id, { designationFr: e.target.value })}
                        className="bg-transparent border-none focus:ring-0 p-0 w-full text-left"
                      />
                    </td>
                    <td className="px-6 py-4 font-black text-primary text-sm">
                      <input 
                        type="text"
                        value={item.nameAr}
                        onChange={(e) => handleUpdateItem(item.id, { nameAr: e.target.value })}
                        className="bg-transparent border-none focus:ring-0 p-0 w-full"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input 
                        type="text"
                        value={item.type}
                        onChange={(e) => handleUpdateItem(item.id, { type: e.target.value })}
                        className="bg-transparent border-none focus:ring-0 p-0 w-full text-xs font-bold text-on-surface/60"
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <input 
                        type="text"
                        value={item.unit}
                        onChange={(e) => handleUpdateItem(item.id, { unit: e.target.value })}
                        className="bg-transparent border-none focus:ring-0 p-0 w-12 text-center text-xs font-bold text-on-surface/60"
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <input 
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleUpdateItem(item.id, { quantity: Number(e.target.value) })}
                        className="bg-transparent border-none focus:ring-0 p-0 w-12 text-center font-black text-primary"
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <select 
                        value={item.status}
                        onChange={(e) => handleUpdateItem(item.id, { status: e.target.value as any })}
                        className={cn(
                          "bg-transparent border-none focus:ring-0 p-0 text-xs font-black cursor-pointer",
                          item.status === 'جيدة' ? "text-green-600" : "text-red-600"
                        )}
                      >
                        <option value="جيدة">جيدة</option>
                        <option value="مكسورة">مكسورة</option>
                        <option value="تحتاج إصلاح">تحتاج إصلاح</option>
                        <option value="مفقودة">مفقودة</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <input 
                        type="text"
                        value={item.location}
                        onChange={(e) => handleUpdateItem(item.id, { location: e.target.value })}
                        className="bg-transparent border-none focus:ring-0 p-0 w-full text-xs font-bold text-on-surface/60"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input 
                        type="text"
                        value={item.notes}
                        onChange={(e) => handleUpdateItem(item.id, { notes: e.target.value })}
                        className="bg-transparent border-none focus:ring-0 p-0 w-full text-xs font-bold text-on-surface/40 italic"
                        placeholder="ملاحظات..."
                      />
                    </td>
                    <td className="px-6 py-4 text-center print:hidden">
                      <button 
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        <div className="p-8 bg-surface-container-low/30 border-t border-outline/5 text-xs font-black text-on-surface/40 uppercase tracking-widest">
          المعروض: {filteredItems.length} من أصل {items.length} قطعة
        </div>
      </section>
    </div>
  );
}
