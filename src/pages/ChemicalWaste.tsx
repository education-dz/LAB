import React from 'react';
import { Trash2, AlertTriangle, ShieldCheck, Activity, History, Plus, FileText, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function ChemicalWaste({ isNested = false }: { isNested?: boolean }) {
  const stats = [
    { label: 'إجمالي النفايات', value: '42 كغ', icon: Trash2, color: 'bg-error/10' },
    { label: 'مواد بانتظار التحييد', value: '12', icon: AlertTriangle, color: 'bg-tertiary/10' },
    { label: 'عمليات معالجة ناجحة', value: '142', icon: ShieldCheck, color: 'bg-primary/5' },
    { label: 'مستوى الأمان', value: '100%', icon: Sparkles, color: 'bg-secondary-container' },
  ];

  return (
    <div className={cn("space-y-12 max-w-7xl mx-auto pb-24 rtl font-sans", !isNested && "px-6")} dir="rtl">
      {/* Header */}
      {!isNested && (
        <header className="relative flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-4">
          <div className="text-right space-y-3 relative z-10">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-error/10 rounded-full text-error text-xs font-black uppercase tracking-widest mb-2">
              <Trash2 size={14} />
              إدارة النفايات الكيميائية
            </div>
            <h1 className="text-6xl font-black text-primary tracking-tighter font-serif">النفايات الكيميائية</h1>
            <p className="text-on-surface/60 text-xl font-bold">التعامل مع المواد <span className="text-error italic">المنتهية الصلاحية</span> وفق بروتوكولات التحييد والأكسدة.</p>
          </div>
          
          <div className="flex items-center gap-4 relative z-10">
            <button className="bg-error text-white px-10 py-4 rounded-full font-black flex items-center gap-3 shadow-2xl shadow-error/30 hover:bg-error/90 transition-all active:scale-95">
              <Plus size={24} />
              تسجيل نفايات جديدة
            </button>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-error/5 rounded-full blur-[120px] pointer-events-none" />
        </header>
      )}

      {/* Stats */}
      {!isNested && (
        <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "p-8 rounded-[40px] border border-outline/5 transition-all group relative overflow-hidden shadow-xl",
                stat.color
              )}
            >
              <div className="absolute top-0 left-0 w-24 h-24 bg-surface/40 rounded-br-[80px] -ml-6 -mt-6 group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10 flex justify-between items-start mb-6">
                <div className="p-4 bg-surface rounded-2xl shadow-sm text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <stat.icon size={24} />
                </div>
              </div>
              <div className="relative z-10">
                <p className="text-xs text-on-surface/40 font-black uppercase tracking-widest mb-1">{stat.label}</p>
                <span className="text-4xl font-black tracking-tighter group-hover:scale-110 transition-transform inline-block text-primary">{stat.value}</span>
              </div>
            </motion.div>
          ))}
        </section>
      )}

      {/* Protocols Placeholder */}
      <section className="bg-surface rounded-[40px] border border-outline/10 shadow-2xl overflow-hidden">
        <div className="p-10 border-b border-outline/5 flex justify-between items-center bg-surface-container-low/30">
          <div className="flex items-center gap-4">
            <div className="w-2 h-8 bg-error rounded-full"></div>
            <h3 className="text-2xl font-black text-primary font-serif">بروتوكولات التحييد المعتمدة</h3>
          </div>
          <button className="text-primary font-black text-sm hover:underline">عرض الدليل الكامل</button>
        </div>
        <div className="p-10 text-center space-y-6">
          <div className="w-24 h-24 bg-error/5 rounded-full flex items-center justify-center mx-auto text-error/20">
            <Activity size={48} />
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-black text-primary font-serif">لا توجد عمليات معالجة جارية</h4>
            <p className="text-on-surface/40 font-bold max-w-md mx-auto">سيتم عرض قائمة المواد الكيميائية التي تحتاج إلى معالجة أو تحييد هنا، مع خطوات العمل الموصى بها.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
