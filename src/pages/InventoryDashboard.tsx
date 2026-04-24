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
  Wrench,
  ShieldCheck,
  RefreshCw,
  Printer
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const inventoryModules = [
  { 
    title: 'المخزن الكيميائي', 
    desc: 'تتبع المحاليل، تواريخ الصلاحية، ودرجات الخطورة Safety Data.', 
    icon: FlaskConical, 
    color: 'bg-primary/10', 
    path: '/chemicals' 
  },
  { 
    title: 'الزجاجيات والعتاد', 
    desc: 'قاعدة بيانات شاملة للأجهزة والمعدات الزجاجية والميكانيكية.', 
    icon: Beaker, 
    color: 'bg-secondary-container/50', 
    path: '/equipment' 
  },
  { 
    title: 'مصفوفة التوافق', 
    desc: 'قواعد تخزين المواد الكيميائية وتفادي التفاعلات الخطرة.', 
    icon: ShieldCheck, 
    color: 'bg-surface-container-high', 
    path: '/chemical-storage' 
  },
  { 
    title: 'جرد التجهيزات التقنية', 
    desc: 'واجهة عرض للأجهزة الحساسة تظهر حالة المعايرة.', 
    icon: Monitor, 
    color: 'bg-tertiary-container/20', 
    path: '/tech-inventory' 
  },
  { 
    title: 'جرد المستهلكات و SDS', 
    desc: 'سجل متقدم يربط كل مادة مستهلكة بملف بيانات السلامة الخاص بها.', 
    icon: Package, 
    color: 'bg-surface-container-low', 
    path: '/consumables-sds' 
  },
  { 
    title: 'جرد الزجاجيات والكسور', 
    desc: 'سجل متتابع للأدوات الزجاجية وحساب القيمة المالية للفواقد والكسور.', 
    icon: Beaker, 
    color: 'bg-primary/5', 
    path: '/glassware-breakage' 
  },
  { 
    title: 'إدارة النفايات الكيميائية', 
    desc: 'نظام للتعامل مع المواد المنتهية وفق بروتوكولات التحييد.', 
    icon: Trash2, 
    color: 'bg-error-container text-on-error-container', 
    path: '/chemical-waste' 
  },
  { 
    title: 'الصيانة والإصلاح', 
    desc: 'سجلات صيانة الأجهزة المعطلة وطلبات التصليح.', 
    icon: Wrench, 
    color: 'bg-surface-container-high', 
    path: '/maintenance' 
  },
  { 
    title: 'إسقاط التجهيزات', 
    desc: 'إسقاط وتكهين فني للمعدات التالفة وغير القابلة للإصلاح.', 
    icon: Trash2, 
    color: 'bg-error-container text-on-error-container', 
    path: '/scrapping' 
  },
  { 
    title: 'إعارة الوسائل', 
    desc: 'إدارة وتوثيق طلبات الإعارة بين الأقسام والمخابر.', 
    icon: RefreshCw, 
    color: 'bg-primary/10', 
    path: '/loan-request' 
  },
  { 
    title: 'مركز الطباعة (QR)', 
    desc: 'توليد وطباعة ملصقات QR Code لكافة المواد والأجهزة.', 
    icon: Printer, 
    color: 'bg-secondary-container/50 text-secondary', 
    path: '/qr-print-center' 
  },
];

export default function InventoryDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-6 pb-24 rtl font-sans" dir="rtl">
      {/* Header */}
      <header className="relative flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-4">
        <div className="text-right space-y-3 relative z-10">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-full text-primary text-[0.6875rem] font-black uppercase tracking-widest mb-2">
            <Database size={14} />
            إدارة المخزون الشاملة
          </div>
          <h1 className="text-[3.5rem] leading-none font-black text-primary tracking-tighter">لوحة الجرد</h1>
          <p className="text-on-surface/80 text-[1.25rem] font-bold">تسيير ومتابعة كافة ممتلكات المخبر المادية والكيميائية</p>
        </div>
        
        <button 
          onClick={() => navigate('/')}
          className="bg-surface-container-lowest text-primary px-8 py-4 rounded-full text-[0.875rem] font-bold flex items-center gap-3 shadow-ambient hover:shadow-ambient-hover hover:-translate-y-[2px] transition-all duration-300 ease-out active:scale-95"
        >
          <ArrowLeft size={20} />
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
              transition={{ delay: i * 0.05, duration: 0.3, ease: 'easeOut' }}
              onClick={() => navigate(mod.path)}
              className="bg-surface-container-lowest p-8 rounded-md3-card hover:shadow-ambient-hover hover:-translate-y-[2px] transition-all duration-300 ease-out group cursor-pointer relative overflow-hidden shadow-ambient"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
              
              <div className="flex justify-between items-start mb-10 relative z-10">
                <div className={cn(
                  "w-20 h-20 rounded-[24px] flex items-center justify-center shadow-sm transition-all duration-500 group-hover:rotate-12 group-hover:scale-110",
                  mod.color
                )}>
                  <Icon size={36} className="text-primary mix-blend-multiply" />
                </div>
                <div className="bg-surface-container-low text-primary p-2 rounded-full shadow-sm">
                  <Sparkles size={16} />
                </div>
              </div>
              
              <div className="relative z-10">
                <h4 className="text-[1.75rem] leading-tight font-bold text-primary mb-3 group-hover:text-primary-container transition-colors font-sans">{mod.title}</h4>
                <p className="text-[0.875rem] text-on-surface/80 mb-10 line-clamp-3 leading-relaxed font-medium">{mod.desc}</p>
              </div>

              <div className="pt-6 flex justify-between items-center text-primary font-black text-sm relative z-10">
                <span className="group-hover:tracking-[0.2em] transition-all uppercase text-[0.6875rem]">فتح السجل</span>
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
