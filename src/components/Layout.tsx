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
  BookOpen
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import ErrorBoundary from './ErrorBoundary';

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
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => signOut(auth);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
            src="https://upload.wikimedia.org/wikipedia/commons/d/d8/%D9%88%D8%B2%D8%A7%D8%B1%D8%A9_%D8%A7%D9%84%D8%AA%D8%B1%D8%A8%D9%8A%D8%A9_%D8%A7%D9%84%D9%88%D8%B7%D9%86%D9%8A%D8%A9.svg" 
            alt="Logo" 
            referrerPolicy="no-referrer"
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
            <div className="relative hidden md:block">
              <input 
                className="bg-surface-container-high border-none rounded-full py-2 pr-10 pl-4 w-64 text-sm focus:ring-2 focus:ring-primary/20"
                placeholder="بحث سريع..." 
                type="text"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary" size={18} />
            </div>
            <div className="flex items-center gap-3 relative" ref={profileMenuRef}>
              <button className="p-2 hover:bg-secondary-container/50 rounded-full transition-colors relative">
                <Bell size={20} className="text-primary" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
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
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
