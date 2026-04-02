import { useNavigate } from 'react-router-dom';
import { 
  FlaskConical, 
  Beaker, 
  Monitor, 
  Package, 
  Trash2, 
  Database,
  ArrowLeft,
  Sparkles,
  Wrench
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const inventoryModules = [
  { 
    title: 'المخزن الكيميائي', 
    desc: 'تتبع المحاليل، تواريخ الصلاحية، ودرجات الخطورة Safety Data.', 
    icon: FlaskConical, 
    color: 'bg-[#4a7c59]/10', 
    path: '/chemicals' 
  },
  { 
    title: 'الزجاجيات والعتاد', 
    desc: 'قاعدة بيانات شاملة للأجهزة والمعدات الزجاجية والميكانيكية.', 
    icon: Beaker, 
    color: 'bg-[#8bc34a]/10', 
    path: '/equipment' 
  },
  { 
    title: 'جرد التجهيزات التقنية', 
    desc: 'واجهة عرض للأجهزة الحساسة (المجاهر الرقمية، أجهزة الطيف) تظهر حالة المعايرة.', 
    icon: Monitor, 
    color: 'bg-[#d4a574]/10', 
    path: '/tech-inventory' 
  },
  { 
    title: 'جرد الزجاجيات والكسور', 
    desc: 'سجل دقيق لمتابعة الأدوات الزجاجية وحساب القيمة المالية للفواقد والكسور.', 
    icon: Beaker, 
    color: 'bg-[#4a7c59]/5', 
    path: '/glassware-breakage' 
  },
  { 
    title: 'إدارة النفايات الكيميائية', 
    desc: 'نظام مخصص للتعامل مع المواد المنتهية الصلاحية والتالفة وفق بروتوكولات التحييد.', 
    icon: Trash2, 
    color: 'bg-error/10', 
    path: '/chemical-waste' 
  },
  { 
    title: 'جرد المستهلكات و SDS', 
    desc: 'سجل متقدم يربط كل مادة مستهلكة بملف بيانات السلامة الخاص بها.', 
    icon: Package, 
    color: 'bg-[#8bc34a]/5', 
    path: '/consumables-sds' 
  },
  { 
    title: 'الصيانة والإصلاح', 
    desc: 'سجلات صيانة الأجهزة المعطلة وطلبات تصليح الوسائل التعليمية.', 
    icon: Wrench, 
    color: 'bg-surface-container-high', 
    path: '/maintenance' 
  },
];

export default function InventoryDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-6 pb-24 rtl font-sans" dir="rtl">
      {/* Header */}
      <header className="relative flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-4">
        <div className="text-right space-y-3 relative z-10">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-full text-primary text-xs font-black uppercase tracking-widest mb-2">
            <Database size={14} />
            إدارة المخزون الشاملة
          </div>
          <h1 className="text-6xl font-black text-primary tracking-tighter font-serif">لوحة الجرد</h1>
          <p className="text-on-surface/60 text-xl font-bold">تسيير ومتابعة كافة ممتلكات المخبر</p>
        </div>
        
        <button 
          onClick={() => navigate('/')}
          className="bg-white text-primary border border-outline/10 px-8 py-4 rounded-[32px] font-black flex items-center gap-3 shadow-xl hover:bg-primary/5 transition-all active:scale-95"
        >
          <ArrowLeft size={24} />
          العودة للرئيسية
        </button>

        <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {inventoryModules.map((mod, i) => {
          const Icon = mod.icon;
          return (
            <motion.div
              key={mod.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(mod.path)}
              className="bg-white p-8 rounded-[40px] hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-500 group cursor-pointer border border-outline/5 relative overflow-hidden shadow-xl"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
              
              <div className="flex justify-between items-start mb-10 relative z-10">
                <div className={cn(
                  "w-20 h-20 rounded-[28px] flex items-center justify-center shadow-inner transition-all duration-500 group-hover:rotate-12 group-hover:scale-110",
                  mod.color
                )}>
                  <Icon size={36} className="text-primary" />
                </div>
                <div className="bg-surface-container-low backdrop-blur-sm text-primary p-2 rounded-full shadow-sm border border-outline/5">
                  <Sparkles size={16} />
                </div>
              </div>
              
              <div className="relative z-10">
                <h4 className="text-2xl font-black text-primary mb-3 group-hover:text-primary-container transition-colors font-serif">{mod.title}</h4>
                <p className="text-base text-on-surface/60 mb-10 line-clamp-3 leading-relaxed font-medium">{mod.desc}</p>
              </div>

              <div className="pt-6 flex justify-between items-center text-primary font-black text-sm border-t border-outline/5 relative z-10">
                <span className="group-hover:tracking-[0.2em] transition-all uppercase text-xs">فتح السجل</span>
                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-all shadow-sm">
                  <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
