import React, { useState, useEffect } from 'react';
import { 
  Monitor, 
  Search, 
  Bell, 
  Settings, 
  TrendingUp, 
  Filter, 
  History, 
  Activity,
  ShieldCheck,
  RefreshCw,
  Plus,
  ArrowLeft,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { onSnapshot, query, where } from 'firebase/firestore';
import { getUserCollection, handleFirestoreError, OperationType } from '../firebase';
import { useNavigate } from 'react-router-dom';

interface Equipment {
  id: string;
  name: string;
  type: 'glassware' | 'tech' | 'other';
  serialNumber: string;
  status: 'functional' | 'maintenance' | 'broken';
  totalQuantity: number;
  availableQuantity: number;
  brokenQuantity: number;
  lastCalibration?: string;
  nextCalibration?: string;
  supplier?: string;
  location?: string;
  notes?: string;
  smartNameAr?: string;
  smartDescriptionAr?: string;
  imageKeyword?: string;
}

const getSmartImage = (name: string, keyword?: string) => {
  const searchKey = keyword || name;
  const n = searchKey.toLowerCase();
  
  if (n.includes('microscope') || n.includes('مجهر')) return 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&q=80&w=800';
  if (n.includes('spectro') || n.includes('طيف')) return 'https://images.unsplash.com/photo-1532187875605-2fe358511423?auto=format&fit=crop&q=80&w=800';
  if (n.includes('computer') || n.includes('حاسوب') || n.includes('station')) return 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800';
  if (n.includes('centrifuge') || n.includes('طرد')) return 'https://images.unsplash.com/photo-1579154235602-3c2c2aa59c1c?auto=format&fit=crop&q=80&w=800';
  if (n.includes('balance') || n.includes('ميزان')) return 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800';
  if (n.includes('oscilloscope') || n.includes('راسم')) return 'https://images.unsplash.com/photo-1581092335397-9583ee92d03b?auto=format&fit=crop&q=80&w=800';
  
  return `https://picsum.photos/seed/${encodeURIComponent(searchKey)}/800/600`;
};

export default function TechInventory({ isNested = false }: { isNested?: boolean }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [devices, setDevices] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(getUserCollection('equipment'), where('type', '==', 'tech'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Equipment));
      setDevices(items);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'equipment');
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredDevices = devices.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { 
      label: 'إجمالي الأصول التقنية', 
      value: devices.length.toString(), 
      trend: 'أجهزة مسجلة', 
      icon: Cpu, 
      color: 'bg-[#4a7c59]/10 text-[#4a7c59]' 
    },
    { 
      label: 'الحالة التشغيلية', 
      value: devices.length > 0 ? `${Math.round((devices.filter(d => d.status === 'functional').length / devices.length) * 100)}%` : '0%', 
      trend: 'جاهزية الأجهزة', 
      icon: Activity, 
      color: 'bg-[#8bc34a]/10 text-[#8bc34a]' 
    },
    { 
      label: 'بانتظار الصيانة', 
      value: devices.filter(d => d.status === 'maintenance').length.toString().padStart(2, '0'), 
      trend: 'تنبيه نشط', 
      icon: RefreshCw, 
      color: 'bg-[#d4a574]/10 text-[#d4a574]' 
    },
    { 
      label: 'أجهزة خارج الخدمة', 
      value: devices.filter(d => d.status === 'broken').length.toString().padStart(2, '0'), 
      trend: 'تحتاج إصلاح', 
      icon: AlertTriangle, 
      color: 'bg-error/10 text-error' 
    },
  ];

  return (
    <div className={cn("space-y-12 max-w-7xl mx-auto pb-24 rtl font-sans", !isNested && "px-6")} dir="rtl">
      {/* Header */}
      {!isNested && (
        <header className="relative flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-4">
          <div className="text-right space-y-3 relative z-10">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-full text-primary text-xs font-black uppercase tracking-widest mb-2">
              <Monitor size={14} />
              جرد التجهيزات التكنولوجية
            </div>
            <h1 className="text-6xl font-black text-primary tracking-tighter font-serif">الأجهزة الحساسة</h1>
            <p className="text-on-surface/60 text-xl font-bold">مراقبة حالة <span className="text-primary italic">المعايرة والمواصفات</span> التقنية</p>
          </div>
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="relative group">
              <input 
                className="w-80 bg-white border border-outline/10 rounded-full px-6 py-4 pr-12 text-sm focus:ring-2 focus:ring-primary/20 transition-all shadow-xl"
                placeholder="البحث عن جهاز..." 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-outline" size={20} />
            </div>
            <button className="bg-primary text-on-primary px-8 py-4 rounded-full font-black flex items-center gap-3 shadow-2xl shadow-primary/30 hover:bg-primary-container transition-all active:scale-95">
              <Plus size={22} />
              إضافة جهاز
            </button>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        </header>
      )}

      {/* Stats Overview */}
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
              <div className="absolute top-0 left-0 w-24 h-24 bg-white/40 rounded-br-[80px] -ml-6 -mt-6 group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10 flex justify-between items-start mb-6">
                <div className="p-4 bg-white rounded-2xl shadow-sm text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <stat.icon size={24} />
                </div>
              </div>
              <div className="relative z-10">
                <p className="text-xs text-on-surface/40 font-black uppercase tracking-widest mb-1">{stat.label}</p>
                <span className="text-5xl font-black tracking-tighter group-hover:scale-110 transition-transform inline-block">{stat.value}</span>
                <p className="text-[10px] font-bold mt-2 opacity-60">{stat.trend}</p>
              </div>
            </motion.div>
          ))}
        </section>
      )}

      {/* Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-surface-container-low animate-pulse rounded-[40px] h-[500px]" />
            ))
          ) : filteredDevices.length === 0 ? (
            <div className="col-span-full py-20 text-center space-y-4 opacity-40">
              <Monitor size={80} className="mx-auto" />
              <p className="text-2xl font-black">لا توجد أجهزة تقنية مسجلة حالياً</p>
            </div>
          ) : (
            filteredDevices.map((device, i) => (
              <motion.div
                key={device.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="group bg-white rounded-[40px] border border-outline/5 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col"
              >
                <div className="relative h-64 overflow-hidden bg-surface-container-low">
                  <img 
                    src={getSmartImage(device.name, device.imageKeyword)} 
                    alt={device.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-6 right-6 bg-[#4a7c59]/90 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                    {device.location || 'مخبر غير محدد'}
                  </div>
                  <div className="absolute bottom-6 left-6 bg-white/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/30 shadow-lg">
                    <span className="text-[10px] font-black text-[#4a7c59] uppercase tracking-widest">ID: {device.serialNumber || 'N/A'}</span>
                  </div>
                </div>

                <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="text-2xl font-black text-[#4a7c59] font-serif leading-tight">{device.smartNameAr || device.name}</h3>
                      <div className={cn(
                        "w-4 h-4 rounded-full shadow-[0_0_15px]",
                        device.status === 'functional' ? "bg-green-500 shadow-green-500/50" : 
                        device.status === 'maintenance' ? "bg-orange-400 shadow-orange-400/50" : "bg-red-500 shadow-red-500/50"
                      )} />
                    </div>
                    <p className="text-xs font-bold text-on-surface/40">{device.smartDescriptionAr || device.supplier || 'المورد غير مسجل'}</p>
                  </div>

                  <div className="space-y-4 bg-surface-container-low/30 p-6 rounded-3xl border border-outline/5">
                    <div className="flex justify-between text-sm font-bold">
                      <span className="text-on-surface/40">الرقم التسلسلي:</span>
                      <span className="text-[#4a7c59] font-mono">{device.serialNumber || '---'}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold">
                      <span className="text-on-surface/40">آخر معايرة:</span>
                      <span className="text-[#4a7c59]">{device.lastCalibration || 'غير مسجل'}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold">
                      <span className="text-on-surface/40">الموعد القادم:</span>
                      <span className={cn(device.status === 'maintenance' ? "text-error" : "text-[#4a7c59]")}>
                        {device.nextCalibration || 'غير محدد'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button 
                      onClick={() => navigate(`/equipment?id=${device.id}`)}
                      className="flex-1 bg-white border-2 border-[#4a7c59]/10 text-[#4a7c59] py-4 rounded-full font-black text-xs hover:bg-[#4a7c59] hover:text-white transition-all active:scale-95 shadow-sm"
                    >
                      المواصفات الكاملة
                    </button>
                    <button className="w-14 h-14 flex items-center justify-center rounded-full bg-white border-2 border-[#4a7c59]/10 text-[#4a7c59] hover:bg-[#4a7c59] hover:text-white transition-all active:scale-95 shadow-sm">
                      <History size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>

        {/* Add New Card */}
        <button 
          onClick={() => navigate('/equipment')}
          className="group bg-surface-container-low/50 border-4 border-dashed border-outline/10 rounded-[40px] p-12 flex flex-col items-center justify-center gap-6 hover:bg-surface-container-low transition-all duration-500 min-h-[500px]"
        >
          <div className="w-20 h-20 rounded-[28px] bg-white flex items-center justify-center text-[#4a7c59] shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
            <Plus size={40} />
          </div>
          <div className="text-center space-y-2">
            <h4 className="text-2xl font-black text-[#4a7c59] font-serif">إضافة جهاز جديد</h4>
            <p className="text-sm text-on-surface/40 font-bold">تسجيل عتاد تكنولوجي عالي الدقة</p>
          </div>
        </button>
      </section>

      {/* Footer Info */}
      <footer className="mt-16 pt-8 border-t border-outline/5 flex flex-col md:flex-row justify-between items-center gap-8 text-on-surface/40">
        <div className="flex gap-8">
          <div className="flex items-center gap-3">
            <ShieldCheck size={20} className="text-primary/40" />
            <span className="text-xs font-black uppercase tracking-widest">معايير NF-ISO معتمدة</span>
          </div>
          <div className="flex items-center gap-3 border-r border-outline/10 pr-8">
            <RefreshCw size={20} className="text-primary/40" />
            <span className="text-xs font-black uppercase tracking-widest">مزامنة البيانات تلقائية</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 rounded-full border border-outline/10 flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all">
            <ArrowLeft size={20} />
          </button>
          <span className="text-xs font-black uppercase tracking-widest px-4">الصفحة 1 من 5</span>
          <button className="w-10 h-10 rounded-full border border-outline/10 flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all rotate-180">
            <ArrowLeft size={20} />
          </button>
        </div>
      </footer>
    </div>
  );
}
