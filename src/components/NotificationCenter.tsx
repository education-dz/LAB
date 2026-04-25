import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, ShieldAlert, Package, Wrench, X, Check, Activity, FileText } from 'lucide-react';
import { cn } from '../lib/utils';
import { onSnapshot, query, where, collection } from 'firebase/firestore';
import { db, getUserCollection, auth } from '../firebase';
import { Link } from 'react-router-dom';

interface Notification {
  id: string;
  title: string;
  description: string;
  type: 'alert' | 'warning' | 'info' | 'success';
  date: string;
  read: boolean;
  link?: string;
  icon?: any;
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!auth.currentUser) return;

    // Listen to low-stock chemicals
    const chemQ = query(getUserCollection('chemicals'), where('quantity', '<=', 5));
    const unsubChem = onSnapshot(chemQ, (snap) => {
      const chemNotifs = snap.docs.map(doc => ({
        id: `chem_${doc.id}`,
        title: 'نقص في المخزون',
        description: `المادة ${doc.data().nameAr} وصلت للحد الأدنى (${doc.data().quantity} متبقي)`,
        type: 'warning' as const,
        date: new Date().toISOString(),
        read: false,
        link: '/chemicals',
        icon: Package
      }));
      
      updateNotifications(chemNotifs, 'chem_');
    });

    // Listen to broken equipment
    const equipQ = query(getUserCollection('equipment'), where('status', 'in', ['broken', 'maintenance']));
    const unsubEquip = onSnapshot(equipQ, (snap) => {
      const equipNotifs = snap.docs.map(doc => ({
        id: `equip_${doc.id}`,
        title: 'تنبيه صيانة',
        description: `العتاد ${doc.data().name} بحاجة إلى صيانة (${doc.data().status === 'broken' ? 'عاطل' : 'في الصيانة'})`,
        type: 'alert' as const,
        date: new Date().toISOString(),
        read: false,
        link: '/inventory/equipment',
        icon: Wrench
      }));
      
      updateNotifications(equipNotifs, 'equip_');
    });

    // Listen to expiring chemicals (within 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    const dateStr = thirtyDaysFromNow.toISOString().split('T')[0];

    const expiryQ = query(
      getUserCollection('chemicals'), 
      where('expiryDate', '<=', dateStr),
      where('expiryDate', '!=', '')
    );
    
    const unsubExpiry = onSnapshot(expiryQ, (snap) => {
      const expiryNotifs = snap.docs.map(doc => {
        const data = doc.data();
        const expiry = new Date(data.expiryDate);
        const today = new Date();
        const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        return {
          id: `expiry_${doc.id}`,
          title: diffDays <= 0 ? 'مادة منتهية الصلاحية' : 'قرب انتهاء الصلاحية',
          description: diffDays <= 0 
            ? `انتهت صلاحية المادة ${data.nameAr || data.name} بتاريخ ${data.expiryDate}`
            : `ستنتهي صلاحية المادة ${data.nameAr || data.name} بعد ${diffDays} يوم`,
          type: diffDays <= 0 ? 'alert' as const : 'warning' as const,
          date: new Date().toISOString(),
          read: false,
          link: '/inventory/chemicals',
          icon: ShieldAlert
        };
      });
      
      updateNotifications(expiryNotifs, 'expiry_');
    });

    return () => {
      unsubChem();
      unsubEquip();
      unsubExpiry();
    };
  }, []);

  const updateNotifications = (newNotifs: Notification[], prefix: string) => {
    setNotifications(prev => {
      // Remove old notifs of this prefix, add new ones
      const filtered = prev.filter(n => !n.id.startsWith(prefix));
      const combined = [...filtered, ...newNotifs]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setUnreadCount(combined.filter(n => !n.read).length);
      return combined;
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
      setUnreadCount(updated.filter(n => !n.read).length);
      return updated;
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-secondary-container/50 rounded-full transition-colors group"
      >
        <Bell size={20} className={cn(
          "transition-colors",
          unreadCount > 0 ? "text-error" : "text-primary"
        )} />
        {unreadCount > 0 && (
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1 right-1 w-4 h-4 bg-error text-white text-[8px] rounded-full flex items-center justify-center font-black border-2 border-surface group-hover:scale-110 transition-transform"
          >
            {unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-0 lg:-left-4 top-full mt-4 w-96 max-h-[80vh] flex flex-col bg-surface-container-highest rounded-3xl shadow-2xl border border-outline-variant/30 z-[100] text-right overflow-hidden"
          >
            <div className="p-5 border-b border-outline-variant/30 bg-surface flex justify-between items-center z-10 shrink-0 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                  <Bell size={20} />
                </div>
                <div>
                  <h3 className="font-black text-primary text-base">مركز الإشعارات</h3>
                  <p className="text-[10px] font-bold text-secondary">{unreadCount} غير مقروءة</p>
                </div>
              </div>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-[10px] font-black bg-primary/5 text-primary hover:bg-primary hover:text-white px-3 py-1.5 rounded-full transition-all active:scale-95"
                >
                  تحديد الكل كمقروء
                </button>
              )}
            </div>

            <div className="overflow-y-auto flex-1 p-2 space-y-1 custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="py-16 flex flex-col items-center justify-center text-secondary/50 text-center px-8">
                  <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4">
                    <Check size={24} className="text-secondary/40" />
                  </div>
                  <p className="text-sm font-black text-primary/60">أنت على دراية بكل شيء!</p>
                  <p className="text-[10px] font-bold mt-1">لا توجد إشعارات أو تنبيهات حرجة في النظام حالياً.</p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {notifications.map((notif) => {
                    const Icon = notif.icon || Bell;
                    return (
                      <motion.div
                        key={notif.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={cn(
                          "relative p-4 rounded-2xl transition-all group border border-transparent",
                          !notif.read ? "bg-white shadow-sm" : "hover:bg-white/50",
                          notif.type === 'alert' && !notif.read ? "border-error/20" : "",
                          notif.type === 'warning' && !notif.read ? "border-tertiary/20" : ""
                        )}
                      >
                        {!notif.read && (
                          <div className={cn(
                            "absolute top-1/2 -translate-y-1/2 right-2 w-1.5 h-8 rounded-full",
                            notif.type === 'alert' ? "bg-error" : 
                            notif.type === 'warning' ? "bg-tertiary" : "bg-primary"
                          )} />
                        )}
                        
                        <div className="flex gap-4 pr-3">
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-inner",
                            notif.type === 'alert' ? "bg-error/10 text-error" : 
                            notif.type === 'warning' ? "bg-tertiary/10 text-tertiary" : 
                            "bg-primary/10 text-primary"
                          )}>
                            <Icon size={18} />
                          </div>
                          
                          <div className="flex-1 space-y-1 cursor-pointer" onClick={() => markAsRead(notif.id)}>
                            <div className="flex justify-between items-start">
                              <h4 className={cn(
                                "font-black text-sm transition-colors",
                                !notif.read ? "text-primary" : "text-secondary"
                              )}>
                                {notif.title}
                              </h4>
                              <span className="text-[9px] font-bold text-secondary/60 break-keep mr-2">
                                {new Date(notif.date).toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-[11px] font-medium text-secondary/80 leading-relaxed">
                              {notif.description}
                            </p>
                            
                            {notif.link && (
                              <Link 
                                to={notif.link}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                  "inline-block mt-2 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full transition-colors",
                                  notif.type === 'alert' ? "bg-error/10 text-error hover:bg-error hover:text-white" : 
                                  notif.type === 'warning' ? "bg-tertiary/10 text-tertiary hover:bg-tertiary hover:text-white" : 
                                  "bg-primary/10 text-primary hover:bg-primary hover:text-white"
                                )}
                              >
                                عرض التفاصيل
                              </Link>
                            )}
                          </div>

                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notif.id);
                            }}
                            className={cn(
                              "w-6 h-6 rounded-full flex items-center justify-center transition-all absolute top-2 left-2 opacity-0 group-hover:opacity-100",
                              notif.read ? "bg-primary/10 text-primary" : "bg-outline/10 text-outline hover:bg-primary hover:text-white"
                            )}
                            title={notif.read ? "مقروء" : "تحديد كمقروء"}
                          >
                            <Check size={12} />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>
            
            <div className="p-3 bg-surface border-t border-outline-variant/30 text-center shrink-0">
               <span className="text-[9px] font-black text-secondary/40 uppercase tracking-widest">نظام التنبيهات الذكي • يتم التحديث تلقائياً</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
