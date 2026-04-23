import { Outlet, Link, useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { 
  LayoutDashboard, 
  FlaskConical, 
  Beaker, 
  ShieldAlert, 
  Settings, 
  LogOut, 
  Bell, 
  Search, 
  User,
  Menu,
  X,
  FileText,
  Archive,
  Users,
  Database,
  Trash2,
  Map,
  Monitor,
  Package,
  BookOpen,
  Sun,
  Moon,
  QrCode
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import ErrorBoundary from './ErrorBoundary';
import { doc, getDoc, onSnapshot, query, where } from 'firebase/firestore';
import { db, getUserCollection } from '../firebase';
import GlobalSearch from './GlobalSearch';
import Breadcrumbs from './Breadcrumbs';

const navItems = [
  { name: 'لوحة القيادة', path: '/', icon: LayoutDashboard },
  { name: 'إدارة المخزون', path: '/inventory', icon: Database },
  { name: 'المتابعة البيداغوجية', path: '/pedagogical', icon: BookOpen },
  { name: 'الإعدادات', path: '/settings', icon: Settings },
];

export default function Layout() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  const [userRole, setUserRole] = useState<string | null>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => signOut(auth);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (auth.currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role || 'مساعد مخبري');
          } else {
            setUserRole('مساعد مخبري');
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          if (errorMessage.includes('the client is offline')) {
            console.warn('Firestore is offline. Using default role.');
          } else {
            console.error('Error fetching role:', error);
          }
          setUserRole('مساعد مخبري');
        }
      }
    };
    fetchUserRole();
  }, []);

  useEffect(() => {
    if (!auth.currentUser) return;

    // Listen for low stock chemicals
    const chemQ = query(getUserCollection('chemicals'), where('quantity', '<=', 5));
    const unsubChem = onSnapshot(chemQ, (snap) => {
      const lowChems = snap.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'chemical' }));
      setNotifications(prev => {
        const filtered = prev.filter(n => n.type !== 'chemical');
        return [...filtered, ...lowChems];
      });
      setLowStockCount(prev => prev + snap.docs.length);
    });

    return () => {
      unsubChem();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-surface flex rtl text-right" dir="rtl">
      {/* SideNavBar */}
      <aside className={cn(
        "fixed right-0 top-0 h-full z-40 flex flex-col bg-surface-container-low transition-all duration-300 no-print",
        isSidebarOpen ? "w-72" : "w-20"
      )}>
        <div className="p-6 flex flex-col items-center gap-2">
          <img 
            className={cn("object-contain transition-all", isSidebarOpen ? "w-16 h-16" : "w-10 h-10")}
            src="/LAB/ministry-logo.png"
            alt="Logo" 
          />
          {isSidebarOpen && (
            <div className="text-center mt-2">
              <h1 className="text-lg font-bold text-[#2b3d22]">الأرضية الرقمية — فضاء موظفوا المخابر</h1>
              <p className="text-[10px] text-[#5c6146] font-medium leading-tight">وزارة التربية الوطنية</p>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-full transition-all duration-200",
                  isActive 
                    ? "bg-secondary-container text-primary font-bold shadow-sm" 
                    : "text-secondary hover:bg-secondary-container/30"
                )}
              >
                <Icon size={22} className={cn(isActive && "text-primary")} />
                {isSidebarOpen && <span className="text-sm">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 text-error py-3 px-4 hover:bg-error/10 transition-all rounded-full"
          >
            <LogOut size={22} />
            {isSidebarOpen && <span className="font-medium text-sm">تسجيل الخروج</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300 print:mr-0",
        isSidebarOpen ? "mr-72" : "mr-20"
      )}>
        {/* TopAppBar */}
        <header className="h-16 bg-surface/80 backdrop-blur-md sticky top-0 z-30 flex justify-between items-center px-8 no-print">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-secondary-container/50 rounded-full text-primary"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h2 className="text-lg font-bold text-primary">نظام تسيير المخابر</h2>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 hover:bg-secondary-container/50 rounded-full text-primary transition-all"
              title={isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={() => setIsQRScannerOpen(true)}
              className="p-2 hover:bg-secondary-container/50 rounded-full text-primary transition-all"
              title="مسح رمز QR"
            >
              <QrCode size={20} />
            </button>
            <div className="relative hidden md:block">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="bg-surface-container-high border-none rounded-full py-2 pr-10 pl-4 w-64 text-sm text-right text-outline/60 hover:bg-surface-container-highest transition-all flex items-center justify-between"
              >
                <span>بحث سريع...</span>
                <span className="text-[10px] bg-surface-container-low px-1.5 py-0.5 rounded border border-outline/10">⌘K</span>
              </button>
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary" size={18} />
            </div>
            <div className="flex items-center gap-3 relative" ref={profileMenuRef}>
              <button className="p-2 hover:bg-secondary-container/50 rounded-full transition-colors relative">
                <Bell size={20} className="text-primary" />
                {lowStockCount > 0 && (
                  <span className="absolute top-2 right-2 w-4 h-4 bg-error text-on-error text-[8px] rounded-full flex items-center justify-center font-black">
                    {lowStockCount}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/10 hover:border-primary/30 transition-all active:scale-95"
              >
                <img 
                  className="w-full h-full object-cover" 
                  src={auth.currentUser?.photoURL || "https://picsum.photos/seed/user/100/100"} 
                  alt="Profile" 
                  referrerPolicy="no-referrer"
                />
              </button>

              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute left-0 top-full mt-2 w-56 bg-surface-container-highest rounded-2xl shadow-xl border border-outline-variant p-2 z-50"
                  >
                    <div className="px-4 py-3 border-b border-outline-variant/50 mb-2">
                      <p className="text-sm font-bold text-primary truncate">{auth.currentUser?.displayName || 'مستخدم'}</p>
                      <p className="text-[10px] text-secondary truncate">{auth.currentUser?.email || auth.currentUser?.phoneNumber}</p>
                      {userRole && (
                        <span className="mt-1 inline-block bg-primary/10 text-primary text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                          {userRole}
                        </span>
                      )}
                    </div>
                    
                    <Link 
                      to="/settings" 
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-secondary hover:bg-primary/5 rounded-xl transition-colors"
                    >
                      <Settings size={18} />
                      <span>الإعدادات</span>
                    </Link>
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-error hover:bg-error/5 rounded-xl transition-colors mt-1"
                    >
                      <LogOut size={18} />
                      <span>تسجيل الخروج</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="p-8 print:p-0">
          <Breadcrumbs />
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>

      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      
      {/* QR Scanner Modal Placeholder */}
      <AnimatePresence>
        {isQRScannerOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsQRScannerOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-surface w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl border border-outline/10"
            >
              <div className="p-6 flex justify-between items-center border-b border-outline/5">
                <h3 className="text-xl font-black text-primary flex items-center gap-2">
                  <QrCode size={24} />
                  ماسح الرموز
                </h3>
                <button onClick={() => setIsQRScannerOpen(false)} className="p-2 hover:bg-surface-container-high rounded-full">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 flex flex-col items-center gap-6">
                <div className="w-64 h-64 bg-black rounded-3xl relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-4 border-2 border-primary/50 rounded-2xl animate-pulse"></div>
                  <div className="w-full h-0.5 bg-primary absolute top-1/2 -translate-y-1/2 animate-scan shadow-[0_0_15px_rgba(var(--color-primary),0.5)]"></div>
                  <p className="text-white/50 text-[10px] font-bold">جاري البحث عن رمز QR...</p>
                </div>
                <p className="text-center text-sm text-secondary font-medium">
                  وجه الكاميرا نحو رمز الاستجابة السريعة (QR Code) الملصق على الجهاز أو المادة الكيميائية
                </p>
                <button className="w-full bg-primary text-on-primary py-4 rounded-2xl font-bold hover:shadow-lg transition-all">
                  تشغيل الكاميرا
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
