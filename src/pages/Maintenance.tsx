import { useState, useEffect } from 'react';
import { 
  Wrench, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  History,
  ArrowRight,
  MoreVertical,
  Trash2,
  Edit2,
  Hammer
} from 'lucide-react';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp, 
  deleteDoc, 
  doc, 
  updateDoc,
  getDocs
} from 'firebase/firestore';
import { db, getUserCollection, handleFirestoreError, OperationType } from '../firebase';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface MaintenanceLog {
  id: string;
  equipmentId: string;
  equipmentName: string;
  issue: string;
  technician?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  cost?: number;
  startDate: string;
  completionDate?: string;
  notes?: string;
  createdAt: any;
}

interface Equipment {
  id: string;
  name: string;
}

export default function Maintenance() {
  const [logs, setLogs] = useState<MaintenanceLog[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [isAddingLog, setIsAddingLog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [newLog, setNewLog] = useState<Partial<MaintenanceLog>>({
    status: 'pending',
    priority: 'medium',
    startDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const q = query(getUserCollection('maintenance_logs'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MaintenanceLog));
      setLogs(data);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'maintenance_logs'));

    const fetchEquipment = async () => {
      const snap = await getDocs(getUserCollection('equipment'));
      setEquipment(snap.docs.map(doc => ({ id: doc.id, name: doc.data().name })));
    };
    fetchEquipment();

    return () => unsubscribe();
  }, []);

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLog.equipmentId || !newLog.issue) return;

    const selectedEquip = equipment.find(e => e.id === newLog.equipmentId);
    
    try {
      await addDoc(getUserCollection('maintenance_logs'), {
        ...newLog,
        equipmentName: selectedEquip?.name || 'غير معروف',
        createdAt: serverTimestamp()
      });
      setIsAddingLog(false);
      setNewLog({
        status: 'pending',
        priority: 'medium',
        startDate: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'maintenance_logs');
    }
  };

  const updateStatus = async (id: string, status: MaintenanceLog['status']) => {
    try {
      await updateDoc(doc(getUserCollection('maintenance_logs'), id), { 
        status,
        completionDate: status === 'completed' ? new Date().toISOString().split('T')[0] : null
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'maintenance_logs');
    }
  };

  const deleteLog = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا السجل؟')) return;
    try {
      await deleteDoc(doc(getUserCollection('maintenance_logs'), id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'maintenance_logs');
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.equipmentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         log.issue.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-primary/10 text-primary border-primary/20';
      case 'in-progress': return 'bg-warning/10 text-warning border-warning/20';
      default: return 'bg-error/10 text-error border-error/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      default: return 'text-primary';
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-6 pb-24 rtl font-sans" dir="rtl">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-primary text-xs font-bold">
            <Wrench size={14} />
            إدارة الصيانة التقنية
          </div>
          <h1 className="text-4xl font-black text-primary tracking-tight font-serif">الصيانة والإصلاح</h1>
          <p className="text-on-surface/60 font-medium">تتبع حالة الأجهزة المعطلة وجدولة عمليات الإصلاح</p>
        </div>

        <button 
          onClick={() => setIsAddingLog(true)}
          className="bg-primary text-on-primary px-8 py-4 rounded-2xl font-black flex items-center gap-3 shadow-lg shadow-primary/20 hover:scale-105 transition-all active:scale-95"
        >
          <Plus size={24} />
          إضافة سجل صيانة
        </button>
      </header>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-3xl shadow-sm border border-outline/5">
        <div className="relative flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary" size={20} />
          <input 
            type="text"
            placeholder="بحث عن جهاز أو مشكلة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-12 pl-4 py-3 bg-surface-container-low rounded-2xl border-none focus:ring-2 focus:ring-primary/20 font-medium"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
          {['all', 'pending', 'in-progress', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                "px-6 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap",
                statusFilter === status 
                  ? "bg-primary text-on-primary shadow-md" 
                  : "bg-surface-container-low text-secondary hover:bg-primary/5"
              )}
            >
              {status === 'all' ? 'الكل' : 
               status === 'pending' ? 'قيد الانتظار' : 
               status === 'in-progress' ? 'قيد الإصلاح' : 'مكتمل'}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredLogs.map((log) => (
            <motion.div
              key={log.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-6 rounded-[32px] border border-outline/5 shadow-sm hover:shadow-md transition-all group relative"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-primary font-serif">{log.equipmentName}</h3>
                  <div className="flex items-center gap-3 text-xs font-bold text-secondary">
                    <span className={cn("flex items-center gap-1", getPriorityColor(log.priority))}>
                      <AlertCircle size={12} />
                      أولوية {log.priority === 'high' ? 'عالية' : log.priority === 'medium' ? 'متوسطة' : 'عادية'}
                    </span>
                    <span className="w-1 h-1 bg-outline/20 rounded-full" />
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {log.startDate}
                    </span>
                  </div>
                </div>
                <div className={cn(
                  "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border",
                  getStatusColor(log.status)
                )}>
                  {log.status === 'pending' ? 'قيد الانتظار' : 
                   log.status === 'in-progress' ? 'قيد الإصلاح' : 'مكتمل'}
                </div>
              </div>

              <div className="bg-surface-container-low p-4 rounded-2xl mb-6">
                <p className="text-sm text-on-surface/80 font-medium leading-relaxed">
                  <span className="block text-[10px] text-secondary font-black uppercase mb-1">وصف المشكلة:</span>
                  {log.issue}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-outline/5">
                <div className="flex gap-2">
                  {log.status !== 'completed' && (
                    <button 
                      onClick={() => updateStatus(log.id, log.status === 'pending' ? 'in-progress' : 'completed')}
                      className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-xs font-black hover:bg-primary hover:text-on-primary transition-all"
                    >
                      {log.status === 'pending' ? <Hammer size={14} /> : <CheckCircle2 size={14} />}
                      {log.status === 'pending' ? 'بدء الإصلاح' : 'تحديد كمكتمل'}
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => deleteLog(log.id)}
                    className="p-2 text-secondary hover:text-error hover:bg-error/10 rounded-lg transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredLogs.length === 0 && (
        <div className="text-center py-24 bg-white rounded-[40px] border border-dashed border-outline/20">
          <div className="w-24 h-24 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-6">
            <History size={48} className="text-secondary/40" />
          </div>
          <h3 className="text-2xl font-black text-primary mb-2 font-serif">لا توجد سجلات صيانة</h3>
          <p className="text-on-surface/60 font-medium">ابدأ بإضافة أول سجل لمتابعة حالة أجهزتك</p>
        </div>
      )}

      {/* Add Log Modal */}
      <AnimatePresence>
        {isAddingLog && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingLog(false)}
              className="absolute inset-0 bg-surface-container-highest/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden border border-outline/5"
            >
              <div className="p-8 border-b border-outline/5 flex justify-between items-center bg-surface-container-low">
                <h2 className="text-2xl font-black text-primary font-serif">إضافة سجل صيانة جديد</h2>
                <button onClick={() => setIsAddingLog(false)} className="p-2 hover:bg-white rounded-full transition-colors">
                  <ArrowRight size={24} className="rotate-180" />
                </button>
              </div>

              <form onSubmit={handleAddLog} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-secondary uppercase tracking-wider pr-2">الجهاز المعني</label>
                  <select 
                    required
                    value={newLog.equipmentId || ''}
                    onChange={(e) => setNewLog({...newLog, equipmentId: e.target.value})}
                    className="w-full px-6 py-4 bg-surface-container-low rounded-2xl border-none focus:ring-2 focus:ring-primary/20 font-bold"
                  >
                    <option value="">اختر الجهاز...</option>
                    {equipment.map(e => (
                      <option key={e.id} value={e.id}>{e.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-secondary uppercase tracking-wider pr-2">وصف المشكلة</label>
                  <textarea 
                    required
                    value={newLog.issue || ''}
                    onChange={(e) => setNewLog({...newLog, issue: e.target.value})}
                    placeholder="اشرح العطل أو المشكلة بالتفصيل..."
                    className="w-full px-6 py-4 bg-surface-container-low rounded-2xl border-none focus:ring-2 focus:ring-primary/20 font-bold min-h-[120px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-secondary uppercase tracking-wider pr-2">الأولوية</label>
                    <select 
                      value={newLog.priority}
                      onChange={(e) => setNewLog({...newLog, priority: e.target.value as any})}
                      className="w-full px-6 py-4 bg-surface-container-low rounded-2xl border-none focus:ring-2 focus:ring-primary/20 font-bold"
                    >
                      <option value="low">عادية</option>
                      <option value="medium">متوسطة</option>
                      <option value="high">عالية</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-secondary uppercase tracking-wider pr-2">تاريخ البدء</label>
                    <input 
                      type="date"
                      value={newLog.startDate}
                      onChange={(e) => setNewLog({...newLog, startDate: e.target.value})}
                      className="w-full px-6 py-4 bg-surface-container-low rounded-2xl border-none focus:ring-2 focus:ring-primary/20 font-bold"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    className="w-full bg-primary text-on-primary py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all active:scale-95"
                  >
                    حفظ السجل
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
