import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, Home } from 'lucide-react';
import { cn } from '../lib/utils';

const routeMap: Record<string, string> = {
  '': 'لوحة القيادة',
  'inventory': 'إدارة المخزون',
  'pedagogical': 'المتابعة البيداغوجية',
  'maintenance': 'الصيانة',
  'chemicals': 'المواد الكيميائية',
  'equipment': 'العتاد والمعدات',
  'tech-inventory': 'الجرد التقني',
  'glassware-breakage': 'كسر الزجاجيات',
  'smart-forms': 'النماذج الذكية',
  'chemical-waste': 'النفايات الكيميائية',
  'educational-map': 'الخريطة التربوية',
  'consumables-sds': 'بطاقات الأمان',
  'backup': 'مركز النسخ الاحتياطي',
  'database-management': 'تسيير قاعدة البيانات',
  'timetable': 'جدول التوقيت',
  'lab-schedule': 'جدول حجز المخابر',
  'pedagogical-tracking': 'المتابعة البيداغوجية المستمرة',
  'follow-up-registry': 'سجل المتابعة',
  'sync': 'مزامنة البيانات',
  'activity-request:': 'طلب نشاط',
  'safety': 'الأمن والسلامة',
  'reports': 'التقارير والاستخراج',
  'archive': 'الأرشيف الرقمي',
  'teachers': 'قائمة الأساتذة',
  'daily-report': 'التقرير اليومي',
  'chemical-storage': 'مصفوفة التوافق',
  'school-legislation': 'التشريع المدرسي',
  'qr-print-center': 'مركز الطباعة',
  'student-groups': 'تسيير الأفواج',
  'safety-guide': 'دليل السلامة',
  'calculators': 'الحاسبة المخبرية',
  'settings': 'الإعدادات'
};

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav className="flex mb-6 no-print" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 space-x-reverse">
        <li>
          <Link 
            to="/" 
            className="text-secondary hover:text-primary transition-colors flex items-center gap-1.5 text-xs font-bold"
          >
            <Home size={14} />
            <span>الرئيسية</span>
          </Link>
        </li>
        
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const displayName = routeMap[name] || name;

          return (
            <li key={name} className="flex items-center">
              <ChevronLeft size={14} className="text-outline/30 mx-2" />
              {isLast ? (
                <span className="text-primary font-black text-xs">
                  {displayName}
                </span>
              ) : (
                <Link
                  to={routeTo}
                  className="text-secondary hover:text-primary transition-colors text-xs font-bold"
                >
                  {displayName}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
