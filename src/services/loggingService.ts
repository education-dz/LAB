import { addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, getUserCollection } from '../firebase';

export enum LogAction {
  CREATE = 'إنشاء',
  UPDATE = 'تعديل',
  DELETE = 'حذف',
  IMPORT = 'استيراد',
  EXPORT = 'تصدير',
  LOGIN = 'تسجيل دخول',
  LOGOUT = 'تسجيل خروج'
}

export enum LogModule {
  EQUIPMENT = 'الأجهزة',
  CHEMICALS = 'المواد الكيميائية',
  CONSUMABLES = 'المواد الاستهلاكية',
  REPORTS = 'التقارير',
  TEACHERS = 'الأساتذة',
  SAFETY = 'الأمن والسلامة',
  BACKUP = 'النسخ الاحتياطي'
}

export async function logActivity(
  action: LogAction,
  module: LogModule,
  details: string,
  targetId?: string
) {
  if (!auth.currentUser) return;

  try {
    await addDoc(getUserCollection('audit_logs'), {
      userId: auth.currentUser.uid,
      userName: auth.currentUser.displayName || 'مستخدم',
      userEmail: auth.currentUser.email,
      action,
      module,
      details,
      targetId,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
}
