import React, { useState, useEffect } from 'react';
import { onSnapshot, query, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth, handleFirestoreError, OperationType, getUserCollection } from '../firebase';
import { Helmet } from 'react-helmet-async';
import { 
  Plus, 
  Printer, 
  RotateCcw, 
  Trash2, 
  Save,
  User,
  Calendar,
  FileText,
  Package,
  MapPin,
  RefreshCw,
  Search,
  FileSignature,
  Trash2 as ScrappingIcon,
  AlertTriangle,
  History,
  TrendingUp,
  FileText as FileAlt,
  Users,
  Upload,
  Eye,
  X,
  FileCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { logActivity, LogAction, LogModule } from '../services/loggingService';

interface ScrapItem {
  id: string;
  inventoryNum: string;
  name: string;
  acquisitionDate: string;
  quantity: number;
  reason: string;
  state: string;
  acquisitionValue: string;
  estimatedValue: string;
  notes: string;
}

interface CommitteeMember {
  id: string;
  name: string;
  role: string;
  observations: string;
}

interface AttachmentDoc {
  name: string;
  data: string | null; // Used for download URL or ObjectURL
  type: string;
  file?: File; // Actual file for upload
}

type Tab = 'list' | 'pv' | 'proposal' | 'attachments';

export default function EquipmentScrapping() {
  const [activeTab, setActiveTab] = useState<Tab>('list');
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [previewDoc, setPreviewDoc] = useState<AttachmentDoc | null>(null);

  // Lists for autocomplete
  const [equipmentList, setEquipmentList] = useState<any[]>([]);
  const [teachersList, setTeachersList] = useState<any[]>([]);

  // State for the components
  const [scrapItems, setScrapItems] = useState<ScrapItem[]>([
    { id: '1', inventoryNum: '', name: '', acquisitionDate: '', quantity: 1, reason: 'تلف كامل', state: 'عاطلة', acquisitionValue: '', estimatedValue: '', notes: '' }
  ]);

  const [pvData, setPvData] = useState({
    num: `${new Date().getFullYear()}/...`,
    date: new Date().toISOString().split('T')[0],
    location: 'مخبر الوسائل التعليمية — ثانوية بوحازم عبد المجيد',
    members: [
      { id: '1', name: '', role: 'مسؤول المخبر', observations: '' },
      { id: '2', name: '', role: 'رئيس اللجنة', observations: '' }
    ],
    conclusion: ''
  });

  const [proposalData, setProposalData] = useState({
    num: `${new Date().getFullYear()}/...`,
    date: new Date().toISOString().split('T')[0],
    presenter: '',
    subject: 'اقتراح إسقاط تجهيزات مخبر الوسائل التعليمية',
    to: 'مدير ثانوية بوحازم عبد المجيد',
    justification: ''
  });

  const [attachments, setAttachments] = useState<{ [key: string]: AttachmentDoc }>({
    withdrawal_license: { name: 'رخصة السحب', data: null, type: '' },
    steering_minutes: { name: 'محضر مجلس التوجيه و التسيير', data: null, type: '' },
    scrapping_request: { name: 'طلب الإسقاط', data: null, type: '' },
    handover_minutes: { name: 'محضر التسليم', data: null, type: '' }
  });

  // Cleanup object URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      Object.values(attachments).forEach(doc => {
        if (doc.file && doc.data && doc.data.startsWith('blob:')) {
          URL.revokeObjectURL(doc.data);
        }
      });
    };
  }, [attachments]);

  useEffect(() => {
    const unsubEquip = onSnapshot(getUserCollection('equipment'), (snap) => {
      setEquipmentList(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    const unsubTeachers = onSnapshot(getUserCollection('teachers'), (snap) => {
      setTeachersList(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => { unsubEquip(); unsubTeachers(); };
  }, []);

  const handleAddScrapRow = () => {
    setScrapItems([...scrapItems, { 
      id: (scrapItems.length + 1).toString(), 
      inventoryNum: '', 
      name: '', 
      acquisitionDate: '', 
      quantity: 1, 
      reason: 'تلف كامل', 
      state: 'عاطلة', 
      acquisitionValue: '', 
      estimatedValue: '', 
      notes: '' 
    }]);
  };

  const updateScrapItem = (id: string, field: keyof ScrapItem, value: any) => {
    setScrapItems(scrapItems.map(item => {
      if (item.id === id) {
        if (field === 'name') {
          const matched = equipmentList.find(e => e.name === value);
          if (matched) {
            return { ...item, name: value, inventoryNum: matched.inventoryNumber || matched.serialNumber || '' };
          }
        }
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const handleAddMember = () => {
    setPvData({ ...pvData, members: [...pvData.members, { id: (pvData.members.length + 1).toString(), name: '', role: '', observations: '' }] });
  };

  const handleReset = () => {
    if (window.confirm('بدء نموذج جديد؟ سيتم مسح البيانات الحالية.')) {
      setScrapItems([{ id: '1', inventoryNum: '', name: '', acquisitionDate: '', quantity: 1, reason: 'تلف كامل', state: 'عاطلة', acquisitionValue: '', estimatedValue: '', notes: '' }]);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setNotification({ message: 'جاري رفع الملفات وحفظ السجل...', type: 'success' });
    
    try {
      const finalAttachments = { ...attachments };
      const uploadPromises = Object.entries(attachments).map(async ([key, doc]) => {
        if (doc.file && auth.currentUser) {
          const fileRef = ref(storage, `users/${auth.currentUser.uid}/scrapping/${Date.now()}_${doc.file.name}`);
          await uploadBytes(fileRef, doc.file);
          const downloadUrl = await getDownloadURL(fileRef);
          finalAttachments[key] = {
            name: doc.name,
            data: downloadUrl,
            type: doc.file.type
          };
        }
      });
      
      await Promise.all(uploadPromises);

      const docRef = await addDoc(getUserCollection('scrapping_records'), {
        scrapItems,
        pvData,
        proposalData,
        attachments: finalAttachments,
        createdAt: serverTimestamp()
      });
      
      await logActivity(LogAction.CREATE, LogModule.EQUIPMENT, `سجل إسقاط بملفات مرفقة رقم: ${proposalData.num}`, docRef.id);
      setNotification({ message: 'تم حفظ السجل والملفات بنجاح!', type: 'success' });
    } catch (e: any) {
      if (e.message?.includes('storage')) {
         console.error('Storage Upload Error:', e);
         setNotification({ message: 'خطأ في رفع الملفات. تأكد من إعدادات سعة التخزين (Storage Rules).', type: 'error' });
      } else {
         handleFirestoreError(e, OperationType.CREATE, 'scrapping_records');
         setNotification({ message: 'خطأ في الحفظ.', type: 'error' });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setNotification({ message: 'حجم الملف كبير جداً (الأقصى 2MB لضمان الأمان).', type: 'error' });
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    
    setAttachments({
      ...attachments,
      [key]: {
        ...attachments[key],
        data: objectUrl,
        type: file.type,
        file: file
      }
    });
    setNotification({ message: 'تم إرفاق المستند لمعاينته.', type: 'success' });
  };

  const removeAttachment = (key: string) => {
    const existingData = attachments[key].data;
    if (existingData && existingData.startsWith('blob:')) {
      URL.revokeObjectURL(existingData);
    }
    
    setAttachments({
      ...attachments,
      [key]: { name: attachments[key].name, data: null, type: '', file: undefined }
    });
  };

  const printDocument = (mode: Tab) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    let content = '';
    if (mode === 'list') {
      const rows = scrapItems.map(item => `
        <tr>
          <td>${item.id}</td>
          <td>${item.inventoryNum}</td>
          <td>${item.name}</td>
          <td>${item.acquisitionDate}</td>
          <td>${item.quantity}</td>
          <td>${item.reason}</td>
          <td>${item.state}</td>
          <td>${item.acquisitionValue}</td>
        </tr>
      `).join('');
      content = `
        <h1 style="text-align:center">قائمة جرد الوسائل المقترح إسقاطها</h1>
        <table>
          <thead><tr><th>#</th><th>رقم الجرد</th><th>التجهيز</th><th>الاقتناء</th><th>الكمية</th><th>السبب</th><th>الحالة</th><th>القيمة</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      `;
    } else if (mode === 'pv') {
      const members = pvData.members.map(m => `<li>${m.name} (${m.role})</li>`).join('');
      content = `
        <h1 style="text-align:center">محضر معاينة تقنية للتجهيزات</h1>
        <p>بتاريخ ${pvData.date}، اجتمعت اللجنة المذكورة أدناه في ${pvData.location}:</p>
        <ul>${members}</ul>
        <p><strong>الخلاصة:</strong> ${pvData.conclusion}</p>
      `;
    }

    printWindow.document.write(`
      <html dir="rtl" lang="ar">
        <head>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
            body { font-family: 'Cairo', sans-serif; padding: 40px; }
            table { width:100%; border-collapse:collapse; margin-top:20px; font-size:12px; }
            th, td { border:1px solid #000; padding:10px; text-align:right; }
            th { background:#eee; }
          </style>
        </head>
        <body>
          <div style="display:flex; justify-content:space-between; border-bottom:2px solid #000; padding-bottom:10px;">
            <div>مديرية التربية لولاية أم البواقي<br/>ثانوية بوحازم عبد المجيد</div>
            <div style="text-align:center">الجمهورية الجزائرية الديمقراطية الشعبية<br/>وزارة التربية الوطنية</div>
            <div style="text-align:left">السنة الدراسية: 2025-2026</div>
          </div>
          ${content}
          <div style="margin-top:50px; display:flex; justify-content:space-between;">
             <div>مدير الثانوية</div><div>رئيس اللجنة</div><div>مسؤول المخبر</div>
          </div>
          <script>window.print(); window.close();</script>
        </body>
      </html>
    `);
  };

  return (
    <div className="min-h-screen bg-background pb-24 rtl font-sans" dir="rtl">
      <Helmet>
        <title>إسقاط التجهيزات | الأرضية الرقمية للمخابر</title>
      </Helmet>
      <div className="max-w-7xl mx-auto p-6 md:p-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          <div className="flex items-center gap-6">
            <div className="p-5 bg-error text-white rounded-[24px] shadow-2xl shadow-error/30 animate-pulse">
              <ScrappingIcon size={40} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-primary tracking-tighter">إسقاط التجهيزات</h1>
              <p className="text-on-surface/40 font-bold">إدارة عملية التكهين والإسقاط الفني للمعدات التالفة</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button title="إعادة تهيئة النموذج" aria-label="إعادة تهيئة النموذج" onClick={handleReset} className="p-4 bg-surface border border-outline/10 text-on-surface/40 rounded-2xl hover:text-primary transition-all active:scale-95 shadow-sm"><RotateCcw size={24} /></button>
            <button onClick={handleSave} disabled={isSaving} className="px-8 py-4 bg-surface text-primary border-2 border-primary/10 rounded-2xl font-black flex items-center gap-2 hover:border-primary transition-all shadow-xl active:scale-95 disabled:opacity-50">
              {isSaving ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
              حفظ السجل
            </button>
            <button onClick={() => printDocument(activeTab)} className="px-10 py-4 bg-primary text-on-primary rounded-2xl font-black flex items-center gap-2 hover:bg-primary-container shadow-2xl transition-all active:scale-95">
              <Printer size={20} />
              طباعة {activeTab === 'list' ? 'القائمة' : activeTab === 'pv' ? 'المحضر' : 'النموذج'}
            </button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 bg-surface-container-low p-2 rounded-[32px] border border-outline/5 w-fit">
          <TabButton active={activeTab === 'list'} onClick={() => setActiveTab('list')} icon={<FileText size={18}/>} label="قائمة مقترحات الإسقاط" color="error" />
          <TabButton active={activeTab === 'pv'} onClick={() => setActiveTab('pv')} icon={<FileSignature size={18}/>} label="محضر المعاينة التقنية" color="primary" />
          <TabButton active={activeTab === 'proposal'} onClick={() => setActiveTab('proposal')} icon={<FileAlt size={18}/>} label="نموذج الاقتراح الرسمي" color="secondary" />
          <TabButton active={activeTab === 'attachments'} onClick={() => setActiveTab('attachments')} icon={<Upload size={18}/>} label="المستندات المرفقة" color="primary" />
        </div>

        {/* Dynamic Paper Content */}
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface rounded-[48px] shadow-2xl border border-outline/5 overflow-hidden min-h-[600px] flex flex-col"
        >
          {/* Paper Header */}
          <div className="p-12 border-b-2 border-primary/10 bg-surface-container-low/30 relative shrink-0">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
             <div className="flex flex-col md:flex-row justify-between gap-8 text-center md:text-right relative z-10">
                <div className="space-y-1">
                  <p className="text-sm font-black text-primary">مديرية التربية لولاية: أم البواقي</p>
                  <p className="text-xs font-bold text-on-surface/60">ثانوية بوحازم عبد المجيد - عين كرشة</p>
                </div>
                <div className="space-y-1 font-black text-primary">
                  <p className="text-base uppercase tracking-wider">الجمهورية الجزائرية الديمقراطية الشعبية</p>
                  <p className="text-sm">وزارة التربية الوطنية</p>
                </div>
                <div className="md:text-left text-primary font-black">
                  <p className="text-sm">السنة الدراسية: <span className="border-b-2 border-primary/20 px-4">2025 - 2026</span></p>
                </div>
             </div>
             
             <div className="mt-16 text-center">
                <h2 className="text-4xl font-black text-primary underline underline-offset-[20px] decoration-primary/20">
                  {activeTab === 'list' && "قائمة التجهيزات المقترح إسقاطها"}
                  {activeTab === 'pv' && "محضر المعاينة التقنية للوسائل"}
                  {activeTab === 'proposal' && "نموذج اقتراح إسقاط التجهيزات"}
                  {activeTab === 'attachments' && "الأرشيف الرقمي للمستندات"}
                </h2>
             </div>
          </div>

          <div className="p-12 space-y-12 flex-grow">
            {/* List Tab */}
            {activeTab === 'list' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                   <div className="flex gap-4">
                      <StatMini label="إجمالي المقترحات" value={scrapItems.length} color="error" />
                      <StatMini label="الكمية الكلية" value={scrapItems.reduce((acc, curr) => acc + curr.quantity, 0)} color="warning" />
                   </div>
                   <button onClick={handleAddScrapRow} className="px-6 py-3 bg-error text-white rounded-2xl font-black flex items-center gap-2 hover:bg-error/90 transition-all active:scale-95 shadow-lg shadow-error/20">
                      <Plus size={20} /> إضافة تجهيز تالف
                   </button>
                </div>

                <div className="overflow-x-auto rounded-[32px] border border-outline/5 shadow-inner bg-surface-container-low/20">
                  <table className="w-full text-right border-collapse">
                    <thead className="bg-error/5 text-[10px] font-black text-error uppercase tracking-widest">
                      <tr>
                        <th className="p-4 text-center">#</th>
                        <th className="p-4 w-40">رقم الجرد</th>
                        <th className="p-4 w-64">التعيين</th>
                        <th className="p-4">سبب الإسقاط</th>
                        <th className="p-4">الحالة</th>
                        <th className="p-4 w-32">الكمية</th>
                        <th className="p-4"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {scrapItems.map((item, idx) => (
                        <tr key={item.id} className="border-t border-outline/5 hover:bg-error/2 transition-colors">
                          <td className="p-4 text-center font-black text-error/40">{idx+1}</td>
                          <td className="p-2"><input value={item.inventoryNum} onChange={e => updateScrapItem(item.id, 'inventoryNum', e.target.value)} className="w-full bg-transparent px-2 py-2 font-bold focus:outline-none" placeholder="000" /></td>
                          <td className="p-2">
                             <input list="equip-dl" value={item.name} onChange={e => updateScrapItem(item.id, 'name', e.target.value)} className="w-full bg-transparent px-2 py-2 font-bold focus:outline-none focus:border-b-2 border-error" placeholder="اسم الجهاز..." />
                             <datalist id="equip-dl">{equipmentList.map(e => <option key={e.id} value={e.name} />)}</datalist>
                          </td>
                          <td className="p-2">
                            <select value={item.reason} onChange={e => updateScrapItem(item.id, 'reason', e.target.value)} className="w-full bg-transparent px-2 py-2 font-bold focus:outline-none">
                              <option>تلف كامل</option><option>عطب ميكانيكي</option><option>تقادم تقني</option><option>أخرى</option>
                            </select>
                          </td>
                          <td className="p-2">
                            <select value={item.state} onChange={e => updateScrapItem(item.id, 'state', e.target.value)} className="w-full bg-transparent px-2 py-2 font-bold focus:outline-none">
                              <option>عاطلة</option><option>تالفة</option><option>ناقصة</option>
                            </select>
                          </td>
                          <td className="p-2"><input type="number" value={item.quantity} onChange={e => updateScrapItem(item.id, 'quantity', parseInt(e.target.value))} className="w-full bg-transparent px-2 py-2 font-bold text-center focus:outline-none" /></td>
                          <td className="p-2 text-center">
                             <button title="حذف" aria-label="حذف" onClick={() => setScrapItems(scrapItems.filter(i => i.id !== item.id))} className="text-error/30 hover:text-error transition-all p-2 rounded-lg hover:bg-error/10"><Trash2 size={16}/></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* PV Tab */}
            {activeTab === 'pv' && (
              <div className="space-y-12">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <InputField label="رقم المحضر" value={pvData.num} onChange={v => setPvData({...pvData, num: v})} icon={<FileSignature size={18}/>} />
                    <InputField label="التاريخ" type="date" value={pvData.date} onChange={v => setPvData({...pvData, date: v})} icon={<Calendar size={18}/>} />
                    <InputField label="مكان المعاينة" value={pvData.location} onChange={v => setPvData({...pvData, location: v})} icon={<MapPin size={18}/>} />
                 </div>

                 <section className="space-y-6">
                    <div className="flex items-center justify-between">
                       <h3 className="text-xl font-black text-primary flex items-center gap-3"><Users size={22}/> أعضاء لجنة المعاينة</h3>
                       <button onClick={handleAddMember} className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20"><Plus size={18}/></button>
                    </div>
                    <div className="overflow-hidden rounded-[32px] border border-outline/5 bg-surface-container-low/20">
                       <table className="w-full text-right border-collapse">
                          <thead className="bg-primary/5 text-[9px] font-black pointer-events-none uppercase tracking-widest">
                             <tr><th className="p-4 w-12 text-center">#</th><th className="p-4">الاسم واللقب</th><th className="p-4">الصفة / الوظيفة</th><th className="p-4"></th></tr>
                          </thead>
                          <tbody>
                             {pvData.members.map((m, idx) => (
                               <tr key={m.id} className="border-t border-outline/5">
                                  <td className="p-4 text-center font-bold text-primary/40">{idx+1}</td>
                                  <td className="p-2">
                                     <input list="teachers-dl" value={m.name} onChange={e => setPvData({...pvData, members: pvData.members.map(mb => mb.id === m.id ? {...mb, name: e.target.value}: mb)})} className="w-full bg-transparent px-2 py-2 font-bold focus:outline-none" placeholder="الاسم..." />
                                     <datalist id="teachers-dl">{teachersList.map(t => <option key={t.id} value={t.name} />)}</datalist>
                                  </td>
                                  <td className="p-2"><input value={m.role} onChange={e => setPvData({...pvData, members: pvData.members.map(mb => mb.id === m.id ? {...mb, role: e.target.value}: mb)})} className="w-full bg-transparent px-2 py-2 font-bold focus:outline-none" placeholder="الوظيفة..." /></td>
                                  <td className="p-2 text-center"><button title="حذف" aria-label="حذف" onClick={() => setPvData({...pvData, members: pvData.members.filter(mb => mb.id !== m.id)})} className="text-error/30 hover:text-error p-2 rounded-lg hover:bg-error/10"><Trash2 size={16}/></button></td>
                               </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </section>

                 <section className="space-y-4">
                    <label className="text-sm font-black text-on-surface/40 uppercase tracking-widest mr-4">خلاصة وتوصيات اللجنة</label>
                    <textarea value={pvData.conclusion} onChange={e => setPvData({...pvData, conclusion: e.target.value})} className="w-full h-40 bg-surface-container-low rounded-[32px] p-8 font-bold border-2 border-transparent focus:border-primary transition-all shadow-inner" placeholder="اكتب التوصيات الفنية للجنة هنا..."></textarea>
                 </section>
              </div>
            )}

            {/* Proposal Tab */}
            {activeTab === 'proposal' && (
              <div className="space-y-12">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InputField label="رقم الاقتراح" value={proposalData.num} onChange={v => setProposalData({...proposalData, num: v})} icon={<FileAlt size={18}/>} />
                    <InputField label="تاريخ الاقتراح" type="date" value={proposalData.date} onChange={v => setProposalData({...proposalData, date: v})} icon={<Calendar size={18}/>} />
                    <InputField label="مقدم الاقتراح" value={proposalData.presenter} onChange={v => setProposalData({...proposalData, presenter: v})} icon={<User size={18}/>} />
                    <InputField label="موجّه إلى" value={proposalData.to} onChange={v => setProposalData({...proposalData, to: v})} icon={<MapPin size={18}/>} />
                 </div>

                 <section className="space-y-4">
                    <label className="text-sm font-black text-on-surface/40 uppercase tracking-widest mr-4">المبررات والإيضاحات الإضافية</label>
                    <textarea value={proposalData.justification} onChange={e => setProposalData({...proposalData, justification: e.target.value})} className="w-full h-48 bg-surface-container-low rounded-[32px] p-8 font-bold border-2 border-transparent focus:border-secondary transition-all shadow-inner" placeholder="تقديم الأسباب الإدارية والتقنية المقنعة لعملية الإسقاط..."></textarea>
                 </section>
              </div>
            )}

            {/* Attachments Tab */}
            {activeTab === 'attachments' && (
              <div className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {Object.entries(attachments).map(([key, doc]) => (
                    <div key={key} className={cn(
                      "p-8 rounded-[40px] border-2 transition-all flex flex-col gap-6",
                      doc.data ? "bg-primary/5 border-primary/20" : "bg-surface-container-low border-dashed border-outline/20 hover:border-primary/40"
                    )}>
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className={cn("p-4 rounded-2xl", doc.data ? "bg-primary text-on-primary" : "bg-outline/10 text-on-surface/40")}>
                               {doc.data ? <FileCheck size={24}/> : <Upload size={24}/>}
                            </div>
                            <div>
                               <h3 className="font-black text-primary">{doc.name}</h3>
                               <p className="text-[10px] font-bold text-on-surface/40 uppercase tracking-widest">
                                 {doc.data ? "مستند جاهز للعرض" : "بانتظار التحميل..."}
                               </p>
                            </div>
                         </div>
                      </div>

                      <div className="flex items-center gap-3">
                         {!doc.data ? (
                           <label className="flex-1 cursor-pointer">
                              <input type="file" className="hidden" accept="image/*,application/pdf" onChange={(e) => handleFileUpload(key, e)} />
                              <div className="w-full py-4 bg-surface border border-outline/10 rounded-2xl font-black text-primary text-center hover:bg-primary/5 transition-all">تحميل الملف</div>
                           </label>
                         ) : (
                           <>
                              <button onClick={() => setPreviewDoc(doc)} className="flex-1 py-4 bg-primary text-on-primary rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                                 <Eye size={18}/> عرض
                              </button>
                              <button title="مسح المرفق" aria-label="مسح المرفق" onClick={() => removeAttachment(key)} className="p-4 bg-error/10 text-error rounded-2xl hover:bg-error/20 transition-all">
                                 <Trash2 size={18}/>
                              </button>
                           </>
                         )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-8 bg-warning/5 border-2 border-warning/20 rounded-[40px] flex items-center gap-6">
                   <div className="p-4 bg-warning text-on-warning rounded-2xl">
                      <AlertTriangle size={24}/>
                   </div>
                   <p className="text-sm font-bold text-on-surface/60 leading-relaxed">
                     ملاحظة أمنية: يرجى التأكد من أن الملفات المرفقة واضحة ولا يتجاوز حجم الواحد منها 800 كيلوبايت. يفضل استخدام صيغ (JPG, PNG) للصور أو ملفات (PDF) المصغرة.
                   </p>
                </div>
              </div>
            )}

            {/* Final Signature Section */}
            <div className="pt-16 border-t-2 border-outline/5 flex flex-col md:flex-row justify-between items-end gap-12">
               <div className="space-y-4">
                  <div className="flex items-center gap-3 font-bold text-on-surface/60">
                    <span>حرر بـ عين كرشة في:</span>
                    <span className="border-b-2 border-outline/10 h-8 min-w-[150px] inline-block">{new Date().toLocaleDateString('ar-DZ')}</span>
                  </div>
                  <div className="h-40 w-72 border-2 border-dashed border-primary/10 rounded-[32px] flex items-center justify-center text-[10px] font-black text-primary/20 uppercase tracking-[0.3em]">توقيع مسؤول المخبر</div>
               </div>
               
               <div className="h-48 w-80 border-2 border-dashed border-primary/10 rounded-[48px] flex flex-col items-center justify-center gap-4 group">
                  <p className="text-[10px] font-black text-primary/20 uppercase tracking-[0.3em] group-hover:text-primary transition-colors">مصادقة مدير(ة) الثانوية</p>
                  <div className="w-24 h-24 border-4 border-double border-primary/5 rounded-full flex items-center justify-center opacity-10 group-hover:opacity-100 transition-all group-hover:rotate-12">
                     <History size={48} className="text-primary" />
                  </div>
               </div>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {previewDoc && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-on-surface/60 backdrop-blur-xl flex items-center justify-center p-8">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-surface w-full max-w-5xl h-[85vh] rounded-[48px] shadow-2xl flex flex-col relative overflow-hidden">
               <div className="p-8 border-b-2 border-primary/10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="p-4 bg-primary/10 text-primary rounded-2xl"><FileCheck size={24}/></div>
                     <h2 className="text-2xl font-black text-primary">{previewDoc.name}</h2>
                  </div>
                  <button title="إغلاق التلميح" aria-label="إغلاق التلميح" onClick={() => setPreviewDoc(null)} className="p-4 bg-surface-container-high rounded-full hover:bg-error/10 hover:text-error transition-all"><X size={24}/></button>
               </div>
               
               <div className="flex-grow p-4 bg-surface-container-low/30 overflow-auto flex items-center justify-center">
                  {previewDoc.type.includes('pdf') ? (
                    <iframe src={previewDoc.data!} className="w-full h-full rounded-2xl" title="document-preview" />
                  ) : (
                    <img src={previewDoc.data!} alt="document-preview" className="max-w-full max-h-full object-contain rounded-2xl shadow-xl" />
                  )}
               </div>
               
               <div className="p-8 border-t-2 border-primary/10 bg-surface-container-low/30 text-center">
                  <p className="text-sm font-black text-on-surface/40 uppercase tracking-widest leading-none">معاينة نظامية — الأرشيف الرقمي للمخبر</p>
               </div>
            </motion.div>
          </motion.div>
        )}

        {notification && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className={cn("fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-10 py-5 rounded-[32px] shadow-2xl flex items-center gap-4 font-black transition-all", notification.type === 'success' ? "bg-primary text-on-primary" : "bg-error text-white")}>
            {notification.type === 'success' ? <RefreshCw className="animate-spin" size={24} /> : <AlertTriangle size={24} />}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TabButton({ active, onClick, icon, label, color }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, color: 'primary' | 'error' | 'secondary' }) {
  const colorMap = {
    primary: "bg-primary text-on-primary",
    error: "bg-error text-white",
    secondary: "bg-secondary text-white"
  };

  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-6 py-4 rounded-3xl font-black transition-all active:scale-95",
        active ? colorMap[color] : "text-on-surface/40 hover:bg-surface hover:text-primary hover:shadow-lg"
      )}
    >
      {icon}
      <span className="text-sm whitespace-nowrap">{label}</span>
      {active && <motion.div layoutId="tab-pill" className="w-1.5 h-1.5 bg-surface rounded-full ml-1" />}
    </button>
  );
}

function InputField({ label, value, onChange, icon, type = 'text' }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase text-on-surface/40 mr-2 tracking-widest">{label}</label>
      <div className="relative group">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-primary transition-colors">{icon}</div>
        <input 
          type={type}
          value={value} 
          onChange={e => onChange(e.target.value)} 
          className="w-full bg-surface-container-low rounded-2xl px-6 py-4 pr-12 font-bold border-2 border-transparent focus:border-primary transition-all shadow-inner" 
        />
      </div>
    </div>
  );
}

function StatMini({ label, value, color }: { label: string, value: any, color: 'error' | 'warning' }) {
  const colors = { error: 'bg-error/10 text-error', warning: 'bg-warning/10 text-warning' };
  return (
    <div className={cn("px-5 py-2 rounded-2xl flex items-center gap-3", colors[color])}>
      <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{label}</span>
      <span className="text-lg font-black">{value}</span>
    </div>
  );
}
