import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Map, 
  BookOpen, 
  RefreshCw, 
  PlusCircle,
  ArrowLeft,
  Sparkles,
  GraduationCap,
  Users,
  Calculator
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const pedagogicalModules = [
  { 
    title: 'جدولة الحصص', 
    desc: 'تسيير الجدول الزمني للمؤسسة وتوزيع الفترات الدراسية.', 
    icon: Calendar, 
    color: 'bg-primary/10', 
    path: '/timetable' 
  },
  { 
    title: 'حصص المخبر', 
    desc: 'جدولة استخدام المخابر وتفادي التضارب بين الأفواج التربوية.', 
    icon: Clock, 
    color: 'bg-[#4a7c59]/10', 
    path: '/lab-schedule' 
  },
  { 
    title: 'المتابعة البيداغوجية', 
    desc: 'متابعة تنفيذ البرامج الدراسية والدروس التطبيقية المنجزة.', 
    icon: GraduationCap, 
    color: 'bg-[#8bc34a]/10', 
    path: '/pedagogical-tracking' 
  },
  { 
    title: 'سجل المتابعة', 
    desc: 'سجل رقمي متكامل يضم استعمال الوسائل، حصيلة الأعمال التطبيقية، والتقدم في البرنامج.', 
    icon: BookOpen, 
    color: 'bg-secondary/10', 
    path: '/follow-up-registry' 
  },
  { 
    title: 'إدارة الخريطة التربوية', 
    desc: 'توزيع التلاميذ والأقسام على القاعات والمخابر المتاحة.', 
    icon: Map, 
    color: 'bg-[#d4a574]/10', 
    path: '/educational-map' 
  },
  { 
    title: 'التحضير الذكي', 
    desc: 'نماذج رقمية متطورة لتحضير التجارب والنشاطات العلمية.', 
    icon: BookOpen, 
    color: 'bg-primary/5', 
    path: '/smart-forms' 
  },
  { 
    title: 'مزامنة الحصص', 
    desc: 'ربط التحضير الذكي بجدول الحصص الفعلي لضمان الجاهزية.', 
    icon: RefreshCw, 
    color: 'bg-surface-container-high', 
    path: '/sync' 
  },
  { 
    title: 'طلب نشاط', 
    desc: 'تقديم طلبات جديدة للنشاطات العلمية والتجارب المخبرية.', 
    icon: PlusCircle, 
    color: 'bg-error/10', 
    path: '/activity-request' 
  },
  { 
    title: 'تسيير الأفواج', 
    desc: 'إدارة وتنظيم أفواج التلاميذ ضمن الأقسام والمخابر.', 
    icon: Users, 
    color: 'bg-[#8bc34a]/10', 
    path: '/student-groups' 
  },
  { 
    title: 'الحاسبة المخبرية', 
    desc: 'مجموعة من الأدوات والحسابات السريعة لتحضير المحاليل.', 
    icon: Calculator, 
    color: 'bg-primary/10', 
    path: '/calculators' 
  },
];

export default function PedagogicalDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-6 pb-24 rtl font-sans" dir="rtl">
      {/* Header */}
      <header className="relative flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-4">
        <div className="text-right space-y-3 relative z-10">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-full text-primary text-xs font-black uppercase tracking-widest mb-2">
            <GraduationCap size={14} />
            الفضاء البيداغوجي الرقمي
          </div>
          <h1 className="text-6xl font-black text-primary tracking-tighter font-serif">المتابعة البيداغوجية</h1>
          <p className="text-on-surface/60 text-xl font-bold">تسيير الجداول الزمنية والنشاطات العلمية</p>
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
        {pedagogicalModules.map((mod, i) => {
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
                <span className="group-hover:tracking-[0.2em] transition-all uppercase text-xs">فتح القسم</span>
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
