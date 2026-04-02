import { useState, useEffect, useRef } from 'react';
import { onSnapshot, query, where, doc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, getUserCollection } from '../firebase';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { 
  FileText, 
  Package, 
  FlaskConical, 
  Wrench, 
  Users, 
  BookOpen, 
  Calendar, 
  ShieldAlert, 
  TrendingUp,
  AlertTriangle,
  Hammer,
  ArrowLeft,
  LayoutDashboard,
  Sparkles,
  MapPin,
  FileUp
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function Dashboard() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [counts, setCounts] = useState({
    reports: 0,
    equipment: 0,
    chemicals: 0,
    teachers: 0,
    incidents: 0,
    lowStock: 0,
    brokenEquip: 0
  });

  useEffect(() => {
    const unsubReports = onSnapshot(getUserCollection('reports'), (snap) => {
      setCounts(prev => ({ ...prev, reports: snap.size }));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'reports'));

    const unsubEquip = onSnapshot(getUserCollection('equipment'), (snap) => {
      const broken = snap.docs.filter(doc => {
        const status = doc.data().status;
        return status === 'broken' || status === 'maintenance';
      }).length;
      setCounts(prev => ({ ...prev, equipment: snap.size, brokenEquip: broken }));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'equipment'));

    const unsubChem = onSnapshot(getUserCollection('chemicals'), (snap) => {
      const low = snap.docs.filter(doc => (doc.data().quantity || 0) < 10).length;
      setCounts(prev => ({ ...prev, chemicals: snap.size, lowStock: low }));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'chemicals'));

    const unsubTeachers = onSnapshot(getUserCollection('teachers'), (snap) => {
      setCounts(prev => ({ ...prev, teachers: snap.size }));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'teachers'));

    const unsubIncidents = onSnapshot(getUserCollection('incident_logs'), (snap) => {
      setCounts(prev => ({ ...prev, incidents: snap.size }));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'incident_logs'));

    return () => {
      unsubReports();
      unsubEquip();
      unsubChem();
      unsubTeachers();
      unsubIncidents();
    };
  }, []);

  const handleImportXLS = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary', cellDates: true });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws) as any[];

        const formatDate = (val: any) => {
          if (!val) return '';
          if (val instanceof Date) {
            return val.toISOString().split('T')[0];
          }
          const d = new Date(val);
          if (!isNaN(d.getTime())) {
            return d.toISOString().split('T')[0];
          }
          return String(val).trim();
        };

        const batch = writeBatch(db);
        data.forEach((item) => {
          // Determine collection based on headers or a specific field
          let collectionName = 'chemicals';
          if (item['المادة'] || item['Subject']) collectionName = 'teachers';
          else if (item['النوع'] || item['Type'] || item['تعيين الجهاز']) collectionName = 'equipment';

          const docRef = doc(getUserCollection(collectionName));
          
          if (collectionName === 'chemicals') {
            const name = item['الاسم'] || item['Name'] || 'مادة غير مسمى';
            const quantity = Number(item['الكمية'] || item['Quantity']);
            batch.set(docRef, {
              name: String(name).trim() || 'مادة غير مسمى',
              formula: item['الصيغة'] || item['Formula'] || '',
              cas: item['CAS'] || '',
              purity: item['النقاء'] || item['Purity'] || '',
              storageTemp: item['درجة التخزين'] || item['Storage'] || '',
              expiryDate: formatDate(item['تاريخ الانتهاء'] || item['Expiry']),
              quantity: isNaN(quantity) ? 0 : quantity,
              unit: item['الوحدة'] || item['Unit'] || 'ml',
              hazardClass: (item['الخطورة'] || item['Hazard'] || 'safe').toLowerCase() === 'danger' ? 'danger' : 'safe',
              location: item['الموقع'] || item['Location'] || '',
              createdAt: serverTimestamp()
            });
          } else if (collectionName === 'teachers') {
            const name = item['الاسم'] || item['Name'] || 'أستاذ غير مسمى';
            const subject = item['المادة'] || item['Subject'] || 'مادة غير محددة';
            batch.set(docRef, {
              name: String(name).trim() || 'أستاذ غير مسمى',
              subject: String(subject).trim() || 'مادة غير محددة',
              rank: item['الرتبة'] || item['Rank'] || '',
              functionalCode: item['الرمز الوظيفي'] || item['Code'] || '',
              birthDate: formatDate(item['تاريخ الازدياد'] || item['BirthDate']),
              grade: item['الدرجة'] || item['Grade'] || '',
              effectiveDate: formatDate(item['تاريخ السريان'] || item['EffectiveDate']),
              email: item['البريد'] || item['Email'] || '',
              levels: item['الأطوار'] || item['Levels'] ? String(item['الأطوار'] || item['Levels']).split(';').map(s => s.trim()) : [],
              createdAt: serverTimestamp()
            });
          } else if (collectionName === 'equipment') {
            const type = (item['النوع'] || item['Type'] || 'other').toLowerCase();
            const status = (item['الحالة'] || item['Status'] || 'functional').toLowerCase();
            const name = item['تعيين الجهاز'] || item['الاسم'] || item['Name'] || 'جهاز غير مسمى';
            const quantity = Number(item['الكمية'] || item['الكمية الإجمالية'] || item['Total'] || 0);
            
            batch.set(docRef, {
              name: String(name).trim() || 'جهاز غير مسمى',
              type: type === 'زجاجيات' || type === 'glassware' ? 'glassware' : type === 'أجهزة' || type === 'tech' ? 'tech' : 'other',
              serialNumber: item['رقم الجرد'] || item['الرقم التسلسلي'] || item['Serial'] || '',
              status: status === 'سليم' || status === 'functional' ? 'functional' : status === 'صيانة' || status === 'maintenance' ? 'maintenance' : 'broken',
              totalQuantity: isNaN(quantity) ? 0 : quantity,
              availableQuantity: isNaN(quantity) ? 0 : quantity,
              brokenQuantity: 0,
              supplier: item['الممون'] || '',
              location: item['الموقع'] || '',
              notes: item['ملاحظات'] || '',
              foundationalInventory: item['الجرد التأسيسي'] || '',
              decennialReview: item['المراجعة العشرية'] || '',
              createdAt: serverTimestamp()
            });
          }
        });

        await batch.commit();
        alert(`تم استيراد ${data.length} سجل بنجاح!`);
      } catch (error) {
        console.error('Error importing XLS:', error);
        alert('حدث خطأ أثناء استيراد الملف. يرجى التأكد من صيغة الملف.');
      } finally {
        setIsImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsBinaryString(file);
  };

  const stats = [
    { label: 'إجمالي التقارير', value: counts.reports.toString(), trend: '+12%', icon: FileText, color: 'bg-primary/10' },
    { label: 'التجهيزات النشطة', value: counts.equipment.toString(), trend: 'عنصر', icon: Package, color: 'bg-primary/5' },
    { label: 'كواشف منخفضة', value: counts.lowStock.toString(), trend: 'تحتاج طلب', icon: AlertTriangle, color: 'bg-error/10' },
    { label: 'الأساتذة', value: counts.teachers.toString(), trend: 'نشط', icon: Users, color: 'bg-surface-container-low' },
  ];

  const modules = [
    { title: 'التقارير اليومية', desc: 'تسجيل ومتابعة النشاطات اليومية للمخبر والحصص التطبيقية.', count: counts.reports.toString(), icon: FileText, color: 'bg-primary/10', path: '/daily-report' },
    { title: 'جرد التجهيزات', desc: 'قاعدة بيانات شاملة للأجهزة والمعدات الزجاجية والميكانيكية.', count: counts.equipment.toString(), icon: Package, color: 'bg-primary/5', path: '/equipment' },
    { title: 'الكواشف الكيميائية', desc: 'تتبع المحاليل، تواريخ الصلاحية، ودرجات الخطورة Safety Data.', count: counts.chemicals.toString(), icon: FlaskConical, color: 'bg-surface-container-low', path: '/chemicals' },
    { title: 'الصيانة والإصلاح', desc: 'سجلات صيانة الأجهزة المعطلة وطلبات تصليح الوسائل التعليمية.', count: counts.brokenEquip.toString(), icon: Wrench, color: 'bg-surface-container-high', path: '/equipment' },
    { title: 'فريق الأساتذة', desc: 'قائمة أساتذة العلوم والفيزياء المستفيدين من خدمات المخبر.', count: counts.teachers.toString(), icon: Users, color: 'bg-primary/10', path: '/teachers' },
    { title: 'المتابعة البيداغوجية', desc: 'مواءمة الوسائل مع المناهج الدراسية والدروس التطبيقية.', count: '12', icon: BookOpen, color: 'bg-primary/5', path: '/reports' },
    { title: 'جدول الحصص', desc: 'التوقيت الأسبوعي لاستخدام المخابر وتوزيع القاعات.', count: 'اليوم', icon: Calendar, color: 'bg-surface-container-low', path: '/reports' },
    { title: 'الأمن والسلامة', desc: 'بروتوكولات السلامة، طفايات الحريق، ومعدات الإسعاف الأولي.', count: counts.incidents.toString(), icon: ShieldAlert, color: 'bg-error/10', path: '/safety' },
  ];

  return (
    <div className="space-y-16 max-w-7xl mx-auto px-6 pb-24 rtl font-sans" dir="rtl">
      {/* Header */}
      <header className="relative flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-4">
        <div className="text-right space-y-3 relative z-10">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-full text-primary text-xs font-black uppercase tracking-widest mb-2">
            <LayoutDashboard size={14} />
            نظرة عامة على النظام
          </div>
          <h1 className="text-6xl font-black text-primary tracking-tighter font-serif">لوحة التحكم</h1>
          <p className="text-on-surface/60 text-xl font-bold">الأرضية الرقمية — <span className="text-primary italic">فضاء موظفوا المخابر</span></p>
        </div>
        
        <div className="flex items-center gap-4">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImportXLS} 
            className="hidden" 
            accept=".xls,.xlsx"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
            className="bg-primary text-on-primary px-8 py-4 rounded-[32px] font-black flex items-center gap-3 shadow-2xl shadow-primary/30 hover:bg-primary-container hover:shadow-primary/40 transition-all active:scale-95 disabled:opacity-50"
          >
            {isImporting ? (
              <div className="w-6 h-6 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
            ) : (
              <FileUp size={24} />
            )}
            استيراد XLS
          </button>

          <div className="relative z-10 flex items-center gap-4 bg-white px-8 py-4 rounded-[32px] border border-outline/10 shadow-2xl group transition-all hover:shadow-primary/10">
            <div className="p-3 bg-primary/10 rounded-2xl text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
              <Calendar size={22} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-on-surface/30 uppercase tracking-widest">التاريخ الحالي</span>
              <span className="text-base font-black text-primary">{new Date().toLocaleDateString('ar-DZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      </header>

      {/* Alerts Bar */}
      {(counts.lowStock > 0 || counts.brokenEquip > 0) && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {counts.lowStock > 0 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-error/5 backdrop-blur-xl text-on-error-container p-6 rounded-[40px] flex items-center gap-6 border border-error/10 shadow-2xl shadow-error/5 relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-32 h-32 bg-error/5 rounded-br-[100px] -ml-10 -mt-10 group-hover:scale-150 transition-transform duration-700" />
              <div className="bg-error p-5 rounded-[24px] text-white shadow-xl shadow-error/30 relative z-10">
                <AlertTriangle size={28} />
              </div>
              <div className="flex-1 relative z-10">
                <h4 className="font-black text-lg mb-1 text-error">تنبيه حرج: مخزون الكواشف</h4>
                <p className="text-sm text-error/70 font-bold">هناك {counts.lowStock} مواد كيميائية وصلت إلى الحد الأدنى.</p>
              </div>
              <button 
                onClick={() => navigate('/chemicals')}
                className="relative z-10 bg-error text-white text-xs font-black px-8 py-4 rounded-full shadow-lg shadow-error/20 hover:bg-error/90 transition-all active:scale-95"
              >
                معالجة المخزون
              </button>
            </motion.div>
          )}
          
          {counts.brokenEquip > 0 && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-primary/5 backdrop-blur-xl text-primary p-6 rounded-[40px] flex items-center gap-6 border border-primary/10 shadow-2xl shadow-primary/5 relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-br-[100px] -ml-10 -mt-10 group-hover:scale-150 transition-transform duration-700" />
              <div className="bg-primary p-5 rounded-[24px] text-on-primary shadow-xl shadow-primary/30 relative z-10">
                <Hammer size={28} />
              </div>
              <div className="flex-1 relative z-10">
                <h4 className="font-black text-lg mb-1 text-primary">صيانة مطلوبة</h4>
                <p className="text-sm text-primary/70 font-bold">هناك {counts.brokenEquip} أجهزة تحتاج إلى صيانة فورية.</p>
              </div>
              <button 
                onClick={() => navigate('/equipment')}
                className="relative z-10 bg-primary text-on-primary text-xs font-black px-8 py-4 rounded-full shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
              >
                سجل الصيانة
              </button>
            </motion.div>
          )}
        </section>
      )}

      {/* Stats Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "p-8 rounded-[40px] border border-outline/5 transition-all group relative overflow-hidden shadow-xl",
                stat.color
              )}
            >
              <div className="absolute top-0 left-0 w-24 h-24 bg-white/40 rounded-br-[80px] -ml-6 -mt-6 group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10 flex justify-between items-start mb-6">
                <div className="p-4 bg-white rounded-2xl shadow-sm text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <Icon size={24} />
                </div>
                <span className={cn(
                  "text-[10px] font-black px-4 py-1.5 rounded-full shadow-sm uppercase tracking-widest",
                  stat.label === 'كواشف منخفضة' ? "bg-error text-white" : "bg-white text-primary"
                )}>
                  {stat.trend}
                </span>
              </div>
              <div className="relative z-10">
                <p className="text-xs text-on-surface/40 font-black uppercase tracking-widest mb-1">{stat.label}</p>
                <span className="text-5xl font-black text-primary tracking-tighter group-hover:scale-110 transition-transform inline-block">{stat.value}</span>
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* Modules Grid */}
      <section>
        <div className="flex items-center gap-6 mb-10">
          <div className="w-2 h-10 bg-primary rounded-full shadow-lg shadow-primary/20"></div>
          <h3 className="text-4xl font-black text-primary tracking-tight font-serif">الأقسام والوحدات</h3>
          <div className="flex-1 h-px bg-outline/10"></div>
          <div className="flex items-center gap-2 text-primary/40">
            <Sparkles size={20} />
            <span className="text-xs font-black uppercase tracking-[0.3em]">الوصول السريع</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {modules.map((mod, i) => {
            const Icon = mod.icon;
            return (
              <motion.div
                key={mod.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
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
                  <span className="bg-surface-container-low backdrop-blur-sm text-primary px-5 py-2 rounded-full text-sm font-black shadow-sm border border-outline/5">{mod.count}</span>
                </div>
                
                <div className="relative z-10">
                  <h4 className="text-2xl font-black text-primary mb-3 group-hover:text-primary-container transition-colors font-serif">{mod.title}</h4>
                  <p className="text-base text-on-surface/60 mb-10 line-clamp-2 leading-relaxed font-medium">{mod.desc}</p>
                </div>

                <div className="pt-6 flex justify-between items-center text-primary font-black text-sm border-t border-outline/5 relative z-10">
                  <span className="group-hover:tracking-[0.2em] transition-all uppercase text-xs">استعراض القسم</span>
                  <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-all shadow-sm">
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Activity Preview */}
      <section className="bg-white rounded-[50px] p-12 lg:p-16 flex flex-col lg:flex-row gap-16 items-center border border-outline/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full -ml-64 -mt-64 blur-[100px] pointer-events-none" />
        
        <div className="flex-1 space-y-8 relative z-10">
          <div className="inline-flex items-center gap-3 bg-primary/10 text-primary px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.3em]">
            <TrendingUp size={16} />
            تحليل البيانات الذكي
          </div>
          <h3 className="text-5xl font-black text-primary tracking-tight font-serif leading-tight">نظرة عامة على النشاط <br/>البيداغوجي للمؤسسة</h3>
          <p className="text-on-surface/60 max-w-xl leading-relaxed font-medium text-xl">يتم تحديث الإحصائيات تلقائياً بناءً على التقارير المدخلة من قبل المخبريين والأساتذة. يمكنك تصدير التقارير الشهرية والسنوية بنقرة واحدة لتحليل الأداء العام للمخبر.</p>
          <div className="flex flex-wrap gap-6 pt-8">
            <button className="bg-primary text-on-primary px-12 py-5 rounded-full font-black shadow-2xl shadow-primary/30 hover:bg-primary-container hover:shadow-primary/40 transition-all active:scale-95 text-lg">تصدير التقرير السنوي</button>
            <button className="bg-white text-primary border-2 border-primary/20 px-12 py-5 rounded-full font-black hover:bg-primary/5 hover:border-primary transition-all active:scale-95 text-lg">التحليلات المتقدمة</button>
          </div>
        </div>
        
        <div className="w-full lg:w-2/5 aspect-[4/3] rounded-[48px] bg-surface-container-low overflow-hidden shadow-2xl border border-outline/10 relative group">
          <img 
            className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-[2000ms]" 
            src="https://picsum.photos/seed/lab-chart/800/600" 
            alt="Activity Chart" 
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent"></div>
          <div className="absolute bottom-8 right-8 left-8 bg-white/60 backdrop-blur-xl p-8 rounded-[32px] border border-white/30 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-black text-primary uppercase tracking-[0.3em]">معدل الاستخدام الأسبوعي</span>
              <span className="text-xl font-black text-primary">84%</span>
            </div>
            <div className="w-full bg-primary/10 h-3 rounded-full overflow-hidden shadow-inner">
              <div className="bg-primary h-full w-[84%] rounded-full shadow-lg"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
