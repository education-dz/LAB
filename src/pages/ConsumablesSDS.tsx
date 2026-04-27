import React from 'react';
import { Package, ShieldCheck, AlertTriangle, Activity, History, Plus, FileText, Sparkles, Search, Filter } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function ConsumablesSDS({ isNested = false }: { isNested?: boolean }) {
  const stats = [
    { label: 'إجمالي المستهلكات', value: '242', icon: Package, color: 'bg-primary/10' },
    { label: 'ملفات SDS مكتملة', value: '100%', icon: ShieldCheck, color: 'bg-primary/5' },
    { label: 'تنبيهات نقص المخزون', value: '04', icon: AlertTriangle, color: 'bg-error/10' },
    { label: 'معدل الاستهلاك', value: 'متوسط', icon: Activity, color: 'bg-surface-container-low' },
  ];

  return (
    <div className={cn("space-y-12 max-w-7xl mx-auto pb-24 rtl font-sans", !isNested && "px-6")} dir="rtl">
      {/* Header */}
      {!isNested && (
        <header className="relative flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-4">
          <div className="text-right space-y-3 relative z-10">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-full text-primary text-xs font-black uppercase tracking-widest mb-2">
              <Package size={14} />
              جرد المستهلكات والربط مع SDS
            </div>
            <h1 className="text-6xl font-black text-primary tracking-tighter">المستهلكات و SDS</h1>
            <p className="text-on-surface/60 text-xl font-bold">ربط المواد <span className="text-primary italic">بملفات بيانات السلامة</span> مع تنبيهات ذكية لنقص المخزون.</p>
          </div>
          
          <div className="flex items-center gap-4 relative z-10">
            <button className="bg-primary text-on-primary px-10 py-4 rounded-full font-black flex items-center gap-3 shadow-2xl shadow-primary/30 hover:bg-primary-container transition-all active:scale-95">
              <Plus size={24} />
              إضافة مادة مستهلكة
            </button>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
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

      {/* Consumables List Placeholder */}
      <section className="bg-surface rounded-[40px] border border-outline/10 shadow-2xl overflow-hidden">
        <div className="p-10 border-b border-outline/5 flex justify-between items-center bg-surface-container-low/30">
          <div className="flex items-center gap-4">
            <div className="w-2 h-8 bg-primary rounded-full"></div>
            <h3 className="text-2xl font-black text-primary">قائمة المستهلكات والربط مع SDS</h3>
          </div>
          <div className="flex gap-4">
            <button className="w-12 h-12 flex items-center justify-center rounded-full bg-surface border border-outline/10 text-primary hover:bg-primary/5 transition-all">
              <Search size={20} />
            </button>
            <button className="w-12 h-12 flex items-center justify-center rounded-full bg-surface border border-outline/10 text-primary hover:bg-primary/5 transition-all">
              <Filter size={20} />
            </button>
          </div>
        </div>
        <div className="p-10 text-center space-y-6">
          <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto text-primary/20">
            <Package size={48} />
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-black text-primary">لا توجد مواد مسجلة</h4>
            <p className="text-on-surface/40 font-bold max-w-md mx-auto">سيتم عرض قائمة المواد المستهلكة (قفازات، ورق ترشيح، إلخ) مع روابط ملفات SDS الخاصة بها هنا.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
