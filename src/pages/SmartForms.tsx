import React, { useState } from 'react';
import { BookOpen, FileText, CheckCircle, Clock, Plus, Search, Filter, Sparkles, Activity, FileStack, PackageMinus, History, Archive, Loader, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { findSmartForm } from '../services/geminiService';

const FORM_TEMPLATES = [
  {
    title: 'تحضير نشاط تطبيقي',
    desc: 'نموذج طلب التجهيزات والمواد الكيميائية للعمل المخبري.',
    type: 'نموذج مطبوع (A4)',
    icon: Activity,
    path: '/activity-request',
    color: 'text-primary',
    bg: 'bg-primary/10'
  },
  {
    title: 'بطاقة إعارة مستلزمات',
    desc: 'تسجيل وإثبات خروج أجهزة من المخبر مؤقتاً.',
    type: 'نموذج نصف صفحة',
    icon: FileStack,
    path: '/loan-request',
    color: 'text-tertiary',
    bg: 'bg-tertiary/10'
  },
  {
    title: 'محضر كسر / تعويض',
    desc: 'تصريح كسر زجاجيات أو إتلاف من طرف التلاميذ أو الأساتذة.',
    type: 'نموذج رسمي',
    icon: PackageMinus,
    path: '/glassware-breakage',
    color: 'text-error',
    bg: 'bg-error/10'
  },
  {
    title: 'محضر إسقاط تجهيزات',
    desc: 'اقتراح إخراج أجهزة من الجرد بصدد التلف النهائي.',
    type: 'لجنة الإسقاط',
    icon: History,
    path: '/scrapping',
    color: 'text-warning',
    bg: 'bg-warning/10'
  },
  {
    title: 'سجل المتابعة اليومية',
    desc: 'ورقة المتابعة الزمنية لإشعال المخبر وتدوين الأعمال.',
    type: 'دفتر المتابعة',
    icon: Archive,
    path: '/follow-up-registry',
    color: 'text-secondary',
    bg: 'bg-secondary-container'
  }
];

export default function SmartForms() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchingAi, setIsSearchingAi] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{recommendedPath: string, reasoning: string} | null>(null);

  const filteredForms = FORM_TEMPLATES.filter(form => 
    form.title.includes(searchTerm) || form.desc.includes(searchTerm)
  );

  const handleAiSearch = async () => {
    if (!searchTerm.trim()) return;
    setIsSearchingAi(true);
    setAiSuggestion(null);
    try {
      const formsData = FORM_TEMPLATES.map(f => ({ title: f.title, path: f.path, desc: f.desc }));
      const result = await findSmartForm(searchTerm, formsData);
      if (result) {
        setAiSuggestion(result);
      }
    } catch(err) {
      console.error(err);
    } finally {
      setIsSearchingAi(false);
    }
  };

  const clearAiSearch = () => {
    setAiSuggestion(null);
    setSearchTerm('');
  };

  const getSuggestedForm = () => {
    if (!aiSuggestion) return null;
    return FORM_TEMPLATES.find(f => f.path === aiSuggestion.recommendedPath);
  };

  const suggestedForm = getSuggestedForm();

  const stats = [
    { label: 'النماذج المتاحة', value: FORM_TEMPLATES.length.toString(), icon: BookOpen, color: 'bg-primary/10' },
    { label: 'الاعتماد', value: '100%', icon: CheckCircle, color: 'bg-primary/5' },
    { label: 'التحديث', value: '2026', icon: Clock, color: 'bg-tertiary/10' },
    { label: 'معدل الرقمنة', value: '84%', icon: Sparkles, color: 'bg-secondary-container' },
  ];

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-6 pb-24 rtl font-sans" dir="rtl">
      {/* Header */}
      <header className="relative flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-4">
        <div className="text-right space-y-3 relative z-10">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-full text-primary text-xs font-black uppercase tracking-widest mb-2">
            <Sparkles size={14} />
            المولد الذكي للوثائق الرسمية
          </div>
          <h1 className="text-5xl font-black text-primary tracking-tighter font-serif">نماذج العمل والمحاضر</h1>
          <p className="text-on-surface/60 text-xl font-bold">بوابة استخراج الوثائق الرسمية للمخبر، معتمدة وجاهزة للطباعة.</p>
        </div>
        
        <div className="flex items-center gap-4 relative z-10 w-full md:w-auto">
          <div className="relative w-full md:w-96 flex">
            <div className="relative flex-1">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface/40" size={20} />
              <input 
                type="text" 
                placeholder="ابحث عن نموذج أو اسأل الذكاء الاصطناعي..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
                className="w-full bg-white border border-outline/10 rounded-r-2xl pr-12 pl-4 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
              />
            </div>
            <button 
              onClick={handleAiSearch}
              disabled={isSearchingAi || !searchTerm.trim()}
              className="bg-primary text-on-primary px-6 rounded-l-2xl font-black flex items-center justify-center transition-all hover:bg-primary/90 disabled:opacity-50"
            >
              {isSearchingAi ? <Loader className="animate-spin" size={20} /> : <Sparkles size={20} />}
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      </header>

      {/* AI Suggestion Banner */}
      <AnimatePresence>
        {aiSuggestion && suggestedForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-primary/10 border-2 border-primary/20 rounded-[32px] p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 relative">
              <div className="flex items-start gap-4 p-4">
                <div className="p-3 bg-white text-primary rounded-2xl shadow-sm mt-1">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-primary mb-2">اقتراح المساعد الذكي:</h3>
                  <p className="text-sm font-bold text-on-surface/80 leading-relaxed max-w-2xl">{aiSuggestion.reasoning}</p>
                  
                  <div className="mt-6 flex flex-col md:flex-row p-4 bg-white/60 rounded-2xl border border-white items-center gap-4">
                    <suggestedForm.icon className="text-primary" size={32} />
                    <div className="flex-1 text-center md:text-right">
                      <h4 className="font-black text-primary">{suggestedForm.title}</h4>
                      <p className="text-xs text-on-surface/60 font-bold mt-1">{suggestedForm.desc}</p>
                    </div>
                    <Link to={suggestedForm.path} className="px-6 py-2 bg-primary text-on-primary rounded-xl font-black text-xs hover:scale-105 active:scale-95 transition-all shadow-md flex items-center gap-2">
                       فتح النموذج المقترح
                       <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
              <button 
                onClick={clearAiSearch} 
                className="absolute top-6 left-6 text-primary/40 hover:text-primary transition-colors text-sm font-bold underline"
              >
                إغلاق
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "p-6 md:p-8 rounded-[32px] md:rounded-[40px] border border-outline/5 transition-all group relative overflow-hidden shadow-sm hover:shadow-md bg-white",
            )}
          >
            <div className={cn("absolute top-0 left-0 w-24 h-24 rounded-br-[80px] -ml-6 -mt-6 opacity-50 group-hover:scale-150 transition-transform duration-700", stat.color)} />
            <div className="relative z-10 flex justify-between items-start mb-6">
              <div className="p-4 bg-surface-container-low rounded-2xl shadow-sm text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <stat.icon size={24} />
              </div>
            </div>
            <div className="relative z-10">
              <p className="text-xs text-on-surface/40 font-black uppercase tracking-widest mb-1">{stat.label}</p>
              <span className="text-3xl font-black tracking-tighter inline-block text-primary">{stat.value}</span>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Templates Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <AnimatePresence>
          {filteredForms.map((template, i) => {
            const Icon = template.icon;
            return (
              <motion.div
                key={template.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white p-8 rounded-[40px] border border-outline/5 shadow-md hover:shadow-xl hover:border-primary/20 transition-all duration-500 group flex flex-col h-full relative overflow-hidden cursor-pointer"
              >
                <div className="absolute top-0 right-0 w-2 h-full bg-transparent group-hover:bg-primary transition-colors" />
                <div className={cn("w-16 h-16 rounded-[24px] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500", template.bg, template.color)}>
                  <Icon size={32} />
                </div>
                <h4 className="text-2xl font-black text-primary mb-3">{template.title}</h4>
                <p className="text-on-surface/60 font-bold mb-8 leading-relaxed flex-grow">{template.desc}</p>
                <div className="flex justify-between items-center pt-6 border-t border-outline/5 mt-auto">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary/40 bg-surface-container-low px-3 py-1 rounded-full">{template.type}</span>
                  <Link to={template.path} className="text-on-primary bg-primary px-4 py-2 rounded-xl font-black text-xs hover:bg-primary/90 flex items-center gap-2 shadow-sm transition-all active:scale-95">
                    فتح النموذج
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
        
        {filteredForms.length === 0 && (
          <div className="col-span-full py-12 text-center text-on-surface/40 font-bold">
            <FileText size={48} className="mx-auto mb-4 opacity-50" />
            <p>لم يتم العثور على أي نموذج يطابق بحثك.</p>
          </div>
        )}
      </section>
    </div>
  );
}
