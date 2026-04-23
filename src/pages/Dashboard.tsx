import { useState, useEffect, useRef } from 'react';
import { onSnapshot, query, where, doc, writeBatch, serverTimestamp, getDocs } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, getUserCollection } from '../firebase';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { ensureApiKey, getEquipmentIntelligence } from '../services/geminiService';
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
  FileUp,
  Database,
  Trash2,
  Map,
  Monitor,
  Beaker,
  RefreshCw,
  Cpu,
  Plus,
  Activity,
  CheckCircle,
  Clock
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function Dashboard() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
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
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const [recentReports, setRecentReports] = useState<any[]>([]);

  useEffect(() => {
    const unsubReports = onSnapshot(getUserCollection('reports'), (snap) => {
      setCounts(prev => ({ ...prev, reports: snap.size }));
      const reports = snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
        .slice(0, 3);
      setRecentReports(reports);
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
        
        let totalImported = 0;

        for (const sheetName of wb.SheetNames) {
          const ws = wb.Sheets[sheetName];
          const data = XLSX.utils.sheet_to_json(ws) as any[];
          
          if (data.length === 0) continue;

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

          const CHUNK_SIZE = 450;
          const chunks = [];
          for (let i = 0; i < data.length; i += CHUNK_SIZE) {
            chunks.push(data.slice(i, i + CHUNK_SIZE));
          }

          for (const chunk of chunks) {
            const batch = writeBatch(db);
            chunk.forEach((item) => {
              // Detailed heuristics for collection detection
              let collectionName = '';
              
              if (item['الاسم'] && item['المادة']) collectionName = 'teachers';
              else if (item['تعيين الجهاز'] || item['النوع'] === 'زجاجيات' || item['النوع'] === 'أجهزة') collectionName = 'equipment';
              else if (item['الاسم'] && (item['الصيغة'] || item['CAS'] || item['الكمية'])) collectionName = 'chemicals';
              
              // Fallback based on sheet name if headers are ambiguous
              if (!collectionName) {
                const normalizedSheet = sheetName.toLowerCase();
                if (normalizedSheet.includes('chem')) collectionName = 'chemicals';
                else if (normalizedSheet.includes('equip')) collectionName = 'equipment';
                else if (normalizedSheet.includes('teach')) collectionName = 'teachers';
              }

              if (!collectionName) return;

              const docRef = doc(getUserCollection(collectionName as any));
              
              if (collectionName === 'chemicals') {
                const quantity = Number(item['الكمية'] || 0);
                batch.set(docRef, {
                  nameAr: item['الاسم'] || 'مادة غير مسمى',
                  nameEn: item['Name'] || item['الاسم'] || 'Unnamed Chemical',
                  formula: item['الصيغة'] || '',
                  casNumber: item['CAS'] || '',
                  storageTemp: item['درجة التخزين'] || '',
                  expiryDate: formatDate(item['تاريخ الانتهاء']),
                  quantity: isNaN(quantity) ? 0 : quantity,
                  unit: item['الوحدة'] || 'ml',
                  state: item['الحالة'] || 'solid',
                  hazardClass: String(item['الخطورة'] || '').toLowerCase() === 'danger' ? 'danger' : 'safe',
                  shelf: item['الموقع'] || '',
                  ghs: [],
                  notes: item['ملاحظات'] || '',
                  createdAt: serverTimestamp()
                });
              } else if (collectionName === 'teachers') {
                batch.set(docRef, {
                  name: String(item['الاسم'] || 'أستاذ غير مسمى').trim(),
                  subject: String(item['المادة'] || 'مادة غير محددة').trim(),
                  rank: item['الرتبة'] || '',
                  functionalCode: item['الرمز الوظيفي'] || '',
                  birthDate: formatDate(item['تاريخ الازدياد']),
                  grade: item['الدرجة'] || '',
                  effectiveDate: formatDate(item['تاريخ السريان']),
                  email: item['البريد'] || '',
                  levels: item['الأطوار'] ? String(item['الأطوار']).split(';').map(s => s.trim()) : [],
                  createdAt: serverTimestamp()
                });
              } else if (collectionName === 'equipment') {
                const typeRaw = String(item['النوع'] || '').toLowerCase();
                const statusRaw = String(item['الحالة'] || '').toLowerCase();
                const quantity = Number(item['الكمية الإجمالية'] || 0);
                
                batch.set(docRef, {
                  name: String(item['تعيين الجهاز'] || 'جهاز غير مسمى').trim(),
                  type: typeRaw.includes('زجاج') ? 'glassware' : typeRaw.includes('جهاز') ? 'tech' : 'other',
                  serialNumber: item['رقم الجرد'] || item['الرقم التسلسلي'] || '',
                  status: statusRaw.includes('سليم') ? 'functional' : statusRaw.includes('صيانة') ? 'maintenance' : 'broken',
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
              totalImported++;
            });
            await batch.commit();
          }
        }

        setNotification({ message: `تم استيراد ${totalImported} سجل بنجاح من كافة الصفحات!`, type: 'success' });
      } catch (error) {
        console.error('Error importing XLS:', error);
        setNotification({ message: 'حدث خطأ أثناء استيراد الملف. يرجى التأكد من أن البيانات تطابق النموذج.', type: 'error' });
      } finally {
        setIsImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsBinaryString(file);
  };

  const stats = [
    { label: 'إجمالي التقارير', value: counts.reports.toString(), trend: '+12%', icon: FileText, color: 'bg-[#4a7c59]/10', path: '/reports' },
    { label: 'التجهيزات النشطة', value: counts.equipment.toString(), trend: 'عنصر', icon: Package, color: 'bg-[#8bc34a]/10', path: '/equipment' },
    { label: 'كواشف منخفضة', value: counts.lowStock.toString(), trend: 'تحتاج طلب', icon: AlertTriangle, color: 'bg-error/10', path: '/chemicals', filter: 'low' },
    { label: 'فريق العمل (الأساتذة)', value: counts.teachers.toString(), trend: 'نشط', icon: Users, color: 'bg-[#d4a574]/10', path: '/teachers' },
  ];

  const [isSmartUpdating, setIsSmartUpdating] = useState(false);

  const handleSmartUpdate = async () => {
    // Ensure API key is available before starting
    const hasKey = await ensureApiKey();
    if (!hasKey) {
      setNotification({ message: 'يرجى اختيار مفتاح API الخاص بك لاستخدام ميزة التحديث الذكي.', type: 'error' });
      return;
    }

    setIsSmartUpdating(true);
    try {
      const snap = await getDocs(getUserCollection('equipment'));
      const items = snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      
      if (items.length === 0) {
        setNotification({ message: 'لا توجد تجهيزات لتحديثها.', type: 'error' });
        return;
      }

      // Process in chunks to avoid large payloads
      const CHUNK_SIZE = 10;
      for (let i = 0; i < items.length; i += CHUNK_SIZE) {
        const chunk = items.slice(i, i + CHUNK_SIZE);
        const itemsToProcess = chunk.map(item => ({ id: item.id, name: item.name }));
        
        const enrichedData = await getEquipmentIntelligence(itemsToProcess);
        
        if (!enrichedData) {
          throw new Error('فشل الحصول على بيانات الذكاء الاصطناعي.');
        }

        const batch = writeBatch(db);
        enrichedData.forEach((update: any) => {
          const docRef = doc(getUserCollection('equipment'), update.id);
          batch.update(docRef, {
            smartNameAr: update.smartNameAr,
            smartDescriptionAr: update.smartDescriptionAr,
            imageKeyword: update.imageKeyword,
            lastSmartUpdate: serverTimestamp()
          });
        });
        await batch.commit();
        
        // Small delay between chunks to respect rate limits (15 RPM for free tier)
        if (i + CHUNK_SIZE < items.length) {
          await new Promise(r => setTimeout(r, 5000));
        }
      }

      setNotification({ message: 'تم التحديث الذكي للمخزون بنجاح!', type: 'success' });
    } catch (error) {
      console.error('Error in smart update:', error);
      setNotification({ message: 'حدث خطأ أثناء التحديث الذكي. يرجى المحاولة لاحقاً.', type: 'error' });
    } finally {
      setIsSmartUpdating(false);
    }
  };

  const handleExportTemplate = async () => {
    try {
      const wb = XLSX.utils.book_new();

      // Fetch Real Data for each sheet
      const chemSnap = await getDocs(getUserCollection('chemicals'));
      const equipSnap = await getDocs(getUserCollection('equipment'));
      const teachSnap = await getDocs(getUserCollection('teachers'));

      // Chemicals Data Mapping
      const chemicalData = chemSnap.docs.map(doc => {
        const d = doc.data();
        return {
          'الاسم': d.nameAr || '',
          'Name': d.nameEn || '',
          'الصيغة': d.formula || '',
          'CAS': d.casNumber || '',
          'درجة التخزين': d.storageTemp || '',
          'تاريخ الانتهاء': d.expiryDate || '',
          'الكمية': d.quantity || 0,
          'الوحدة': d.unit || '',
          'الحالة': d.state || '',
          'الخطورة': d.hazardClass || '',
          'الموقع': d.shelf || '',
          'ملاحظات': d.notes || ''
        };
      });

      // Add a placeholder if empty
      if (chemicalData.length === 0) {
        chemicalData.push({ 'الاسم': 'مثال: حمض الكلور', 'Name': 'HCl', 'الصيغة': 'HCl', 'CAS': '7647-01-0', 'درجة التخزين': '25C', 'تاريخ الانتهاء': '2025-12-31', 'الكمية': 500, 'الوحدة': 'ml', 'الحالة': 'liquid', 'الخطورة': 'danger', 'الموقع': 'رف أ', 'ملاحظات': 'مادة أكالة' });
      }
      const wsChem = XLSX.utils.json_to_sheet(chemicalData);
      XLSX.utils.book_append_sheet(wb, wsChem, "Chemicals");

      // Equipment Data Mapping
      const equipmentData = equipSnap.docs.map(doc => {
        const d = doc.data();
        return {
          'تعيين الجهاز': d.name || '',
          'النوع': d.type === 'glassware' ? 'زجاجيات' : d.type === 'tech' ? 'أجهزة' : 'أخرى',
          'رقم الجرد': d.serialNumber || '',
          'الرقم التسلسلي': d.serialNumber || '',
          'الحالة': d.status === 'functional' ? 'سليم' : d.status === 'maintenance' ? 'صيانة' : 'تعطل',
          'الكمية الإجمالية': d.totalQuantity || 0,
          'الممون': d.supplier || '',
          'الموقع': d.location || '',
          'ملاحظات': d.notes || '',
          'الجرد التأسيسي': d.foundationalInventory || '',
          'المراجعة العشرية': d.decennialReview || ''
        };
      });

      if (equipmentData.length === 0) {
        equipmentData.push({ 'تعيين الجهاز': 'مثال: مجهر ضوئي', 'النوع': 'أجهزة', 'رقم الجرد': 'LAB-001', 'الرقم التسلسلي': 'SN12345', 'الحالة': 'سليم', 'الكمية الإجمالية': 5, 'الممون': 'وزارة التربية', 'الموقع': 'الخزانة 1', 'ملاحظات': 'دقة عالية', 'الجرد التأسيسي': 'نعم', 'المراجعة العشرية': '2024' });
      }
      const wsEquip = XLSX.utils.json_to_sheet(equipmentData);
      XLSX.utils.book_append_sheet(wb, wsEquip, "Equipment");

      // Teachers Data Mapping
      const teacherData = teachSnap.docs.map(doc => {
        const d = doc.data();
        return {
          'الاسم': d.name || '',
          'المادة': d.subject || '',
          'الرتبة': d.rank || '',
          'الرمز الوظيفي': d.functionalCode || '',
          'تاريخ الازدياد': d.birthDate || '',
          'الدرجة': d.grade || '',
          'تاريخ السريان': d.effectiveDate || '',
          'البريد': d.email || '',
          'الأطوار': (d.levels || []).join(';')
        };
      });

      if (teacherData.length === 0) {
        teacherData.push({ 'الاسم': 'أحمد محمد', 'المادة': 'علوم طبيعية', 'الرتبة': 'أستاذ تعليم ثانوي', 'الرمز الوظيفي': '987654', 'تاريخ الازدياد': '1985-05-15', 'الدرجة': '6', 'تاريخ السريان': '2023-01-01', 'البريد': 'ahmed@mail.com', 'الأطوار': 'ثانوي' });
      }
      const wsTeachers = XLSX.utils.json_to_sheet(teacherData);
      XLSX.utils.book_append_sheet(wb, wsTeachers, "Teachers");

      XLSX.writeFile(wb, `Lab_Full_Data_Template.xlsx`);
      setNotification({ message: 'تم تحميل كافة البيانات في ملف XLS بنجاح! يمكنك الآن تعديلها وإعادة استيرادها.', type: 'success' });
    } catch (error) {
      console.error('Error exporting data template:', error);
      handleFirestoreError(error, OperationType.LIST, 'export_process');
      setNotification({ message: 'حدث خطأ أثناء تصدير البيانات. يرجى التأكد من اتصالك بالإنترنت وصلاحيات الدخول.', type: 'error' });
    }
  };

  const modules = [
    { title: 'لوحة الجرد الشاملة', desc: 'إدارة كافة ممتلكات المخبر من كواشف، أجهزة، زجاجيات ونفايات في مكان واحد.', count: (counts.chemicals + counts.equipment).toString(), icon: Database, color: 'bg-primary/10', path: '/inventory' },
    { title: 'المتابعة البيداغوجية', desc: 'تسيير الجداول الزمنية، خريطة الأقسام، والتحضير الذكي للنشاطات.', count: 'جديد', icon: BookOpen, color: 'bg-primary/5', path: '/pedagogical' },
    { title: 'التقارير اليومية', desc: 'تسجيل ومتابعة النشاطات اليومية للمخبر والحصص التطبيقية.', count: counts.reports.toString(), icon: FileText, color: 'bg-surface-container-low', path: '/daily-report' },
    { title: 'مركز النسخ الاحتياطي', desc: 'واجهة تقنية متطورة لمراقبة حجم البيانات وإدارة النسخ الاحتياطي بصيغة JSON لضمان سلامة السجلات.', count: 'جديد', icon: Database, color: 'bg-surface-container-high', path: '/backup' },
    { title: 'فريق الأساتذة', desc: 'قائمة أساتذة العلوم والفيزياء المستفيدين من خدمات المخبر.', count: counts.teachers.toString(), icon: Users, color: 'bg-primary/10', path: '/teachers' },
    { title: 'إعارة الوسائل', desc: 'إدارة طلبات إعارة الوسائل والتجهيزات العلمية بين الأقسام والمخابر.', count: 'جديد', icon: RefreshCw, color: 'bg-primary/5', path: '/loan-request' },
    { title: 'تحضير نشاط تطبيقي', desc: 'إعداد طلبات تحضير الحصص التطبيقية والوسائل والمواد اللازمة قبل 48 ساعة.', count: 'جديد', icon: Activity, color: 'bg-primary/10', path: '/activity-request' },
    { title: 'إسقاط التجهيزات', desc: 'إدارة عملية التكهين والإسقاط الفني للمعدات التالفة وغير القابلة للإصلاح.', count: 'جديد', icon: Trash2, color: 'bg-error/5', path: '/scrapping' },
    { title: 'الأمن والسلامة', desc: 'بروتوكولات السلامة، طفايات الحريق، ومعدات الإسعاف الأولي.', count: counts.incidents.toString(), icon: ShieldAlert, color: 'bg-error/10', path: '/safety' },
  ];

  return (
    <div className="space-y-16 max-w-7xl mx-auto px-6 pb-24 rtl font-sans" dir="rtl">
      {/* Notifications */}
      {notification && (
        <div className={cn(
          "fixed top-8 left-1/2 -translate-x-1/2 z-[100] px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-300",
          notification.type === 'success' ? "bg-primary text-on-primary" : "bg-error text-white"
        )}>
          {notification.type === 'success' ? <Sparkles size={20} /> : <AlertTriangle size={20} />}
          <span className="font-black">{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <header className="relative flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-4">
        <div className="text-right space-y-3 relative z-10">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-full text-primary text-xs font-black uppercase tracking-widest mb-2">
            <LayoutDashboard size={14} />
            نظرة عامة على النظام
          </div>
          <h1 className="text-4xl font-black text-primary tracking-tighter">لوحة التحكم</h1>
          <p className="text-on-surface/60 text-lg font-bold">الأرضية الرقمية — <span className="text-primary italic">فضاء موظفوا المخابر</span></p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
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

          <button 
            onClick={handleExportTemplate}
            className="bg-white text-primary border-2 border-primary/10 px-8 py-4 rounded-[32px] font-black flex items-center gap-3 shadow-xl hover:bg-primary/5 hover:border-primary transition-all active:scale-95"
          >
            <Database size={24} />
            تحميل النموذج
          </button>

          <button 
            onClick={handleSmartUpdate}
            disabled={isSmartUpdating}
            className="relative z-10 flex items-center gap-4 bg-white px-8 py-4 rounded-[32px] border border-outline/10 shadow-2xl group transition-all hover:shadow-primary/10 hover:bg-primary/5 active:scale-95 disabled:opacity-50"
          >
            <div className="p-3 bg-primary/10 rounded-2xl text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
              {isSmartUpdating ? <RefreshCw size={22} className="animate-spin" /> : <Sparkles size={22} />}
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[10px] font-black text-on-surface/30 uppercase tracking-widest">تحسين البيانات</span>
              <span className="text-base font-black text-primary leading-tight">تحديث ذكي</span>
            </div>
          </button>
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
              onClick={() => navigate(stat.path + (stat.filter ? `?filter=${stat.filter}` : ''))}
              className={cn(
                "p-8 rounded-[40px] border border-outline/5 transition-all group relative overflow-hidden shadow-xl cursor-pointer hover:-translate-y-2 hover:shadow-2xl",
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

      {/* Recent Activity Feed */}
      {recentReports.length > 0 && (
        <section>
          <div className="flex items-center gap-6 mb-10">
            <div className="w-2 h-8 bg-primary rounded-full shadow-lg shadow-primary/20"></div>
            <h2 className="text-2xl font-black text-primary tracking-tight">آخر النشاطات</h2>
            <div className="flex-1 h-px bg-outline/10"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentReports.map((report, i) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => navigate('/daily-report')}
                className="bg-white p-6 rounded-[32px] border border-outline/5 shadow-xl hover:shadow-2xl transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-primary/5 rounded-2xl text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h5 className="font-black text-primary">{report.className || 'قسم غير محدد'}</h5>
                    <p className="text-[10px] text-on-surface/40 font-bold">{report.date}</p>
                  </div>
                </div>
                <p className="text-sm text-on-surface/60 line-clamp-2 font-medium mb-4">
                  {report.observations || 'لا توجد ملاحظات مسجلة لهذا التقرير.'}
                </p>
                <div className="flex items-center justify-between text-[10px] font-black text-primary/40 uppercase tracking-widest">
                  <span>{report.teacherName || 'أستاذ غير محدد'}</span>
                  <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Modules Grid */}
      <section>
        <div className="flex items-center gap-6 mb-10">
          <div className="w-2 h-8 bg-primary rounded-full shadow-lg shadow-primary/20"></div>
          <h2 className="text-2xl font-black text-primary tracking-tight">الأقسام والوحدات</h2>
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
                  <h4 className="text-2xl font-black text-primary mb-3 group-hover:text-primary-container transition-colors">{mod.title}</h4>
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
          <h2 className="text-[30px] leading-[30px] font-black text-primary tracking-tight leading-tight">نظرة عامة على النشاط <br/>البيداغوجي للمؤسسة</h2>
          <p className="text-on-surface/60 max-w-xl leading-relaxed font-medium text-xl">يتم تحديث الإحصائيات تلقائياً بناءً على التقارير المدخلة من قبل المخبريين والأساتذة. يمكنك تصدير التقارير الشهرية والسنوية بنقرة واحدة لتحليل الأداء العام للمخبر.</p>
          <div className="flex flex-wrap gap-6 pt-8">
            <button 
              onClick={handleExportTemplate}
              className="bg-primary text-on-primary px-12 py-5 rounded-full font-black shadow-2xl shadow-primary/30 hover:bg-primary-container hover:shadow-primary/40 transition-all active:scale-95 text-lg flex items-center gap-3"
            >
              <Database size={24} />
              تحميل نموذج الجرد (XLS)
            </button>
            <button 
              onClick={handleSmartUpdate}
              disabled={isSmartUpdating}
              className="bg-white text-primary border-2 border-primary/20 px-12 py-5 rounded-full font-black hover:bg-primary/5 hover:border-primary transition-all active:scale-95 text-lg flex items-center gap-3"
            >
              {isSmartUpdating ? (
                <RefreshCw size={24} className="animate-spin" />
              ) : (
                <Sparkles size={24} />
              )}
              تحديث ذكي للكل
            </button>
          </div>
        </div>
        
        <div className="w-full lg:w-2/5 aspect-[4/3] rounded-[48px] bg-surface-container-low overflow-hidden shadow-2xl border border-outline/10 relative group flex items-center justify-center p-8">
          <div className="w-full h-full relative flex items-end justify-between gap-2">
            {[40, 70, 45, 90, 65, 85, 75].map((height, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: i * 0.1, duration: 1, ease: "easeOut" }}
                className="flex-1 bg-primary/20 rounded-t-2xl relative group/bar"
              >
                <div className="absolute inset-0 bg-primary opacity-0 group-hover/bar:opacity-100 transition-opacity rounded-t-2xl" />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-black text-primary opacity-0 group-hover/bar:opacity-100 transition-opacity">
                  {height}%
                </div>
              </motion.div>
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
          <div className="absolute bottom-8 right-8 left-8 bg-white/60 backdrop-blur-xl p-8 rounded-[32px] border border-white/30 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-black text-primary uppercase tracking-[0.3em]">معدل الاستخدام الأسبوعي</span>
              <span className="text-xl font-black text-primary">84%</span>
            </div>
            <div className="w-full bg-primary/10 h-3 rounded-full overflow-hidden shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "84%" }}
                transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
                className="bg-primary h-full rounded-full shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
