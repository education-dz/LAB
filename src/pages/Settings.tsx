import { useState, useEffect, useRef } from 'react';
import { 
  Settings, 
  User, 
  Shield, 
  Database, 
  CloudUpload, 
  FileUp,
  History,
  Bell,
  Globe,
  LogOut,
  CheckCircle2,
  Map as MapIcon,
  Users,
  School,
  MapPin,
  Plus,
  Trash2,
  ChevronDown,
  Lock,
  Pencil,
  Loader2,
  Mail,
  Smartphone,
  Facebook,
  Chrome,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db, storage, handleFirestoreError, OperationType, getUserCollection } from '../firebase';
import { 
  updateProfile, 
  signOut, 
  updatePassword, 
  linkWithPopup, 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  RecaptchaVerifier, 
  linkWithPhoneNumber, 
  sendPasswordResetEmail, 
  unlink,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  ConfirmationResult
} from 'firebase/auth';
import { doc, getDoc, setDoc, writeBatch, serverTimestamp, getDocFromServer } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as XLSX from 'xlsx';
import { SCHOOL_DB } from '../data/schools';
import { cn } from '../lib/utils';
import LocationCard, { InstitutionSuggestion } from '../components/LocationCard';

export default function SettingsPage() {
  const [displayName, setDisplayName] = useState(auth.currentUser?.displayName || '');
  const [email] = useState(auth.currentUser?.email || '');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Professional Info State
  const [jobTitle, setJobTitle] = useState('ملحق بالمخابر');
  const [grade, setGrade] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [employeeId, setEmployeeId] = useState('1010101010101010');
  const [isEditingEmployeeId, setIsEditingEmployeeId] = useState(false);

  // Institution State
  const [selectedDirectorate, setSelectedDirectorate] = useState('');
  const [selectedCommune, setSelectedCommune] = useState('');
  const [selectedCycle, setSelectedCycle] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [schoolAddress, setSchoolAddress] = useState('');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !auth.currentUser) return;

    try {
      setIsUploading(true);
      const storageRef = ref(storage, `profiles/${auth.currentUser.uid}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      await updateProfile(auth.currentUser, {
        photoURL: downloadURL
      });
      
      // Force a re-render to show the new image
      window.location.reload();
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImportXLS = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws) as any[];

        const batch = writeBatch(db);
        data.forEach((item) => {
          // Determine collection based on headers or a specific field
          let collectionName: 'chemicals' | 'teachers' | 'equipment' = 'chemicals';
          if (item['المادة'] || item['Subject']) collectionName = 'teachers';
          else if (item['النوع'] || item['Type']) collectionName = 'equipment';

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
              expiryDate: item['تاريخ الانتهاء'] || item['Expiry'] || '',
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
              email: item['البريد'] || item['Email'] || '',
              levels: item['الأطوار'] || item['Levels'] ? String(item['الأطوار'] || item['Levels']).split(';').map(s => s.trim()) : [],
              createdAt: serverTimestamp()
            });
          } else if (collectionName === 'equipment') {
            const type = (item['النوع'] || item['Type'] || 'other').toLowerCase();
            const status = (item['الحالة'] || item['Status'] || 'functional').toLowerCase();
            const name = item['الاسم'] || item['Name'] || 'جهاز غير مسمى';
            batch.set(docRef, {
              name: String(name).trim() || 'جهاز غير مسمى',
              type: type === 'زجاجيات' || type === 'glassware' ? 'glassware' : type === 'أجهزة' || type === 'tech' ? 'tech' : 'other',
              serialNumber: item['الرقم التسلسلي'] || item['Serial'] || '',
              status: status === 'سليم' || status === 'functional' ? 'functional' : status === 'صيانة' || status === 'maintenance' ? 'maintenance' : 'broken',
              totalQuantity: Number(item['الكمية الإجمالية'] || item['Total'] || 0),
              availableQuantity: Number(item['الكمية المتوفرة'] || item['Available'] || 0),
              brokenQuantity: Number(item['الكمية التالفة'] || item['Broken'] || 0),
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

  const handleInstitutionSelect = (suggestion: InstitutionSuggestion) => {
    const normalizedSuggestion = suggestion.name.toLowerCase().trim();
    
    let bestMatch = null;
    let maxScore = 0;

    // Iterate through SCHOOL_DB to find the best match
    for (const [dirId, dir] of Object.entries(SCHOOL_DB)) {
      const dirName = dir.name.toLowerCase();
      const dirHint = suggestion.directorate?.toLowerCase() || '';
      const dirMatch = dirHint && (dirName.includes(dirHint) || dirHint.includes(dirName));
      
      for (const [comId, com] of Object.entries(dir.communes)) {
        const comName = com.name.toLowerCase();
        const comHint = suggestion.commune?.toLowerCase() || '';
        const comMatch = comHint && (comName.includes(comHint) || comHint.includes(comName));

        for (const [cycle, schools] of Object.entries(com.cycles)) {
          const cycleHint = suggestion.cycle?.toLowerCase() || '';
          const cycleMatch = cycleHint && (cycle.toLowerCase().includes(cycleHint) || cycleHint.includes(cycle.toLowerCase()));

          for (const school of schools) {
            const normalizedSchool = school.name.toLowerCase().trim();
            let score = 0;
            
            if (normalizedSchool === normalizedSuggestion) score += 100;
            else if (normalizedSchool.includes(normalizedSuggestion) || normalizedSuggestion.includes(normalizedSchool)) score += 50;
            
            if (dirMatch) score += 20;
            if (comMatch) score += 20;
            if (cycleMatch) score += 10;

            if (score > maxScore) {
              maxScore = score;
              bestMatch = { dirId, comId, cycle, schoolCode: school.code };
            }
          }
        }
      }
    }

    if (bestMatch && maxScore > 40) {
      setSelectedDirectorate(bestMatch.dirId);
      setSelectedCommune(bestMatch.comId);
      setSelectedCycle(bestMatch.cycle);
      setSelectedSchool(bestMatch.schoolCode);
      
      // Also update address if we have it
      if (suggestion.commune && suggestion.directorate) {
        setSchoolAddress(`${suggestion.name}، ${suggestion.commune}، ${suggestion.directorate}`);
      }
    }
  };

  // Educational Map State
  const [levels, setLevels] = useState([
    { 
      id: '1', 
      name: 'السنة الأولى ثانوي', 
      groups: [
        'أولى ثانوي جذع مشترك علوم وتكنولوجيا',
        'أولى ثانوي جذع مشترك آداب'
      ] 
    },
    { 
      id: '2', 
      name: 'السنة الثانية ثانوي', 
      groups: [
        'ثانية ثانوي رياضيات',
        'ثانية ثانوي علوم تجريبية',
        'ثانية ثانوي تقني رياضي',
        'ثانية ثانوي تقني رياضي هندسة ميكانيكية',
        'ثانية ثانوي تقني رياضي هندسة كهربائية',
        'ثانية ثانوي تقني رياضي هندسة مدنية',
        'ثانية ثانوي تقني رياضي هندسة الطرائق',
        'ثانية ثانوي آداب وفلسفة',
        'ثانية ثانوي لغات أجنبية',
        'ثانية ثانوي لغات أجنبية إسبانية',
        'ثانية ثانوي لغات أجنبية ألمانية',
        'ثانية ثانوي لغات أجنبية إيطالية'
      ] 
    },
    { 
      id: '3', 
      name: 'السنة الثالثة ثانوي', 
      groups: [
        'ثالثة ثانوي رياضيات',
        'ثالثة ثانوي علوم تجريبية',
        'ثالثة ثانوي تقني رياضي',
        'ثالثة ثانوي تقني رياضي هندسة ميكانيكية',
        'ثالثة ثانوي تقني رياضي هندسة كهربائية',
        'ثالثة ثانوي تقني رياضي هندسة مدنية',
        'ثالثة ثانوي تقني رياضي هندسة الطرائق',
        'ثالثة ثانوي تسيير واقتصاد',
        'ثالثة ثانوي آداب وفلسفة',
        'ثالثة ثانوي لغات أجنبية',
        'ثالثة ثانوي لغات أجنبية إسبانية',
        'ثالثة ثانوي لغات أجنبية ألمانية',
        'ثالثة ثانوي لغات أجنبية إيطالية'
      ] 
    },
  ]);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  // Account Linking State
  const [linkingError, setLinkingError] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);
  const [showPhoneInput, setShowPhoneInput] = useState(false);

  const CYCLE_TEMPLATES: Record<string, any[]> = {
    'متوسط': [
      { id: 'm1', name: 'السنة الأولى متوسط', groups: ['أولى متوسط 1', 'أولى متوسط 2', 'أولى متوسط 3'] },
      { id: 'm2', name: 'السنة الثانية متوسط', groups: ['ثانية متوسط 1', 'ثانية متوسط 2', 'ثانية متوسط 3'] },
      { id: 'm3', name: 'السنة الثالثة متوسط', groups: ['ثالثة متوسط 1', 'ثالثة متوسط 2', 'ثالثة متوسط 3'] },
      { id: 'm4', name: 'السنة الرابعة متوسط', groups: ['رابعة متوسط 1', 'رابعة متوسط 2', 'رابعة متوسط 3'] },
    ],
    'ثانوي': [
      { 
        id: 's1', 
        name: 'السنة الأولى ثانوي', 
        groups: [
          'أولى ثانوي جذع مشترك علوم وتكنولوجيا',
          'أولى ثانوي جذع مشترك آداب'
        ] 
      },
      { 
        id: 's2', 
        name: 'السنة الثانية ثانوي', 
        groups: [
          'ثانية ثانوي رياضيات',
          'ثانية ثانوي علوم تجريبية',
          'ثانية ثانوي تقني رياضي',
          'ثانية ثانوي تقني رياضي هندسة ميكانيكية',
          'ثانية ثانوي تقني رياضي هندسة كهربائية',
          'ثانية ثانوي تقني رياضي هندسة مدنية',
          'ثانية ثانوي تقني رياضي هندسة الطرائق',
          'ثانية ثانوي آداب وفلسفة',
          'ثانية ثانوي لغات أجنبية',
          'ثانية ثانوي لغات أجنبية إسبانية',
          'ثانية ثانوي لغات أجنبية ألمانية',
          'ثانية ثانوي لغات أجنبية إيطالية'
        ] 
      },
      { 
        id: 's3', 
        name: 'السنة الثالثة ثانوي', 
        groups: [
          'ثالثة ثانوي رياضيات',
          'ثالثة ثانوي علوم تجريبية',
          'ثالثة ثانوي تقني رياضي',
          'ثالثة ثانوي تقني رياضي هندسة ميكانيكية',
          'ثالثة ثانوي تقني رياضي هندسة كهربائية',
          'ثالثة ثانوي تقني رياضي هندسة مدنية',
          'ثالثة ثانوي تقني رياضي هندسة الطرائق',
          'ثالثة ثانوي تسيير واقتصاد',
          'ثالثة ثانوي آداب وفلسفة',
          'ثالثة ثانوي لغات أجنبية',
          'ثالثة ثانوي لغات أجنبية إسبانية',
          'ثالثة ثانوي لغات أجنبية ألمانية',
          'ثالثة ثانوي لغات أجنبية إيطالية'
        ] 
      },
    ]
  };

  const resetToCycleTemplate = () => {
    const template = CYCLE_TEMPLATES[selectedCycle];
    if (template) {
      setLevels(template);
    }
  };

  useEffect(() => {
    const fetchSettings = async () => {
      if (!auth.currentUser) return;
      const docRef = doc(db, 'settings', auth.currentUser.uid);
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setJobTitle(data.jobTitle || 'ملحق بالمخابر');
          setGrade(data.grade || '');
          setSpecialty(data.specialty || '');
          setSelectedDirectorate(data.directorate || '');
          setSelectedCommune(data.commune || '');
          setSelectedCycle(data.cycle || '');
          setSelectedSchool(data.school || '');
          setSchoolAddress(data.address || '');
          setEmployeeId(data.employeeId || '1010101010101010');
          if (data.levels) setLevels(data.levels);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `settings/${auth.currentUser.uid}`);
      }
    };
    fetchSettings();
  }, []);

  const [isCheckingConnection, setIsCheckingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const checkConnection = async () => {
    setIsCheckingConnection(true);
    setConnectionStatus('idle');
    try {
      // Use getDocFromServer for a real network test
      await getDocFromServer(doc(db, '_connection_test_', 'ping'));
      setConnectionStatus('success');
      setTimeout(() => setConnectionStatus('idle'), 5000);
    } catch (error: any) {
      console.error('Connection test failed:', error);
      setConnectionStatus('error');
    } finally {
      setIsCheckingConnection(false);
    }
  };

  const handleSave = async () => {
    if (!auth.currentUser) return;
    setIsSaving(true);
    try {
      await updateProfile(auth.currentUser, { displayName });
      
      await setDoc(doc(db, 'settings', auth.currentUser.uid), {
        jobTitle,
        grade,
        specialty,
        directorate: selectedDirectorate,
        commune: selectedCommune,
        cycle: selectedCycle,
        school: selectedSchool,
        address: schoolAddress,
        employeeId,
        levels,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      if (newPassword) {
        if (newPassword !== confirmPassword) {
          throw new Error('كلمات المرور غير متطابقة');
        }
        await updatePassword(auth.currentUser, newPassword);
        setNewPassword('');
        setConfirmPassword('');
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        alert('يجب عليك تسجيل الخروج ثم الدخول مرة أخرى لتغيير كلمة المرور لأسباب أمنية.');
      } else {
        handleFirestoreError(error, OperationType.WRITE, `settings/${auth.currentUser.uid}`);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetPassword = async () => {
    if (!auth.currentUser?.email) return;
    setIsResettingPassword(true);
    try {
      await sendPasswordResetEmail(auth, auth.currentUser.email);
      alert('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.');
    } catch (error: any) {
      console.error('Error sending reset email:', error);
      alert('حدث خطأ أثناء إرسال البريد الإلكتروني.');
    } finally {
      setIsResettingPassword(false);
    }
  };

  const linkAccount = async (providerName: 'google' | 'facebook') => {
    if (!auth.currentUser) return;
    setLinkingError(null);
    try {
      let provider;
      if (providerName === 'google') provider = new GoogleAuthProvider();
      else provider = new FacebookAuthProvider();
      
      await linkWithPopup(auth.currentUser, provider);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error: any) {
      console.error(`Error linking ${providerName}:`, error);
      if (error.code === 'auth/credential-already-in-use') {
        setLinkingError('هذا الحساب مرتبط بالفعل بمستخدم آخر.');
      } else if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        setLinkingError('تم إغلاق نافذة تسجيل الدخول قبل إتمام العملية.');
      } else if (error.code === 'auth/operation-not-allowed') {
        setLinkingError('تسجيل الدخول عبر فيسبوك غير مفعل في إعدادات Firebase.');
      } else {
        setLinkingError('حدث خطأ أثناء ربط الحساب. يرجى المحاولة مرة أخرى.');
      }
    }
  };

  const unlinkAccount = async (providerId: string) => {
    if (!auth.currentUser) return;
    if (auth.currentUser.providerData.length <= 1) {
      alert('يجب أن يظل هناك وسيلة واحدة على الأقل لتسجيل الدخول.');
      return;
    }
    try {
      await unlink(auth.currentUser, providerId);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error unlinking account:', error);
      alert('حدث خطأ أثناء إلغاء ربط الحساب.');
    }
  };

  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {}
      });
    }
  };

  const handlePhoneLink = async () => {
    if (!auth.currentUser || !phoneNumber) return;
    
    // Basic validation for international format
    if (!phoneNumber.startsWith('+') || phoneNumber.length < 10) {
      setLinkingError('يرجى إدخال رقم الهاتف بالصيغة الدولية الصحيحة (مثال: +213xxxxxxxxx)');
      return;
    }

    setIsVerifyingPhone(true);
    setLinkingError(null);
    try {
      setupRecaptcha();
      const appVerifier = (window as any).recaptchaVerifier;
      const result = await linkWithPhoneNumber(auth.currentUser, phoneNumber, appVerifier);
      setConfirmationResult(result);
    } catch (error: any) {
      console.error('Error linking phone:', error);
      if (error.code === 'auth/invalid-phone-number') {
        setLinkingError('رقم الهاتف غير صحيح. يرجى التأكد من الصيغة الدولية.');
      } else if (error.code === 'auth/too-many-requests') {
        setLinkingError('تم إرسال الكثير من الطلبات. يرجى المحاولة لاحقاً.');
      } else {
        setLinkingError('حدث خطأ أثناء إرسال رمز التحقق.');
      }
    } finally {
      setIsVerifyingPhone(false);
    }
  };

  const verifyPhoneCode = async () => {
    if (!confirmationResult || !verificationCode) return;
    setIsVerifyingPhone(true);
    try {
      await confirmationResult.confirm(verificationCode);
      setShowPhoneInput(false);
      setConfirmationResult(null);
      setVerificationCode('');
      setPhoneNumber('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error: any) {
      console.error('Error verifying code:', error);
      setLinkingError('رمز التحقق غير صحيح.');
    } finally {
      setIsVerifyingPhone(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const addGroup = (levelId: string) => {
    setLevels(levels.map(l => {
      if (l.id === levelId) {
        let newName = `فوج جديد ${l.groups.length + 1}`;
        if (l.name.includes('متوسط')) {
          const year = l.name.match(/\d/)?.[0] || '';
          newName = `${year} متوسط ${l.groups.length + 1}`;
        } else if (l.name.includes('ثانوي')) {
          const year = l.name.match(/\d/)?.[0] || '';
          newName = `${year} ثانوي ${l.groups.length + 1}`;
        }
        return { ...l, groups: [...l.groups, newName] };
      }
      return l;
    }));
  };

  const removeGroup = (levelId: string, groupIndex: number) => {
    setLevels(levels.map(l => {
      if (l.id === levelId) {
        const newGroups = [...l.groups];
        newGroups.splice(groupIndex, 1);
        return { ...l, groups: newGroups };
      }
      return l;
    }));
  };

  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: 'الملف الشخصي', icon: User },
    { id: 'institution', name: 'المؤسسة والتعليم', icon: School },
    { id: 'system', name: 'النظام والأمان', icon: Shield },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 pb-24" dir="rtl">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-[#2b3d22] tracking-tight mb-2">الإعدادات المركزية</h2>
          <p className="text-[#5c6146] text-lg opacity-80">تحكم كامل في بيئة العمل، الهوية المهنية، والتنظيم التربوي للمؤسسة.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-all border border-red-100"
          >
            <LogOut size={18} />
            تسجيل الخروج
          </button>
        </div>
      </header>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-[#2b3d22] text-white px-8 py-4 rounded-2xl flex items-center gap-3 shadow-2xl border border-white/10"
          >
            <CheckCircle2 size={24} className="text-[#d3e9c3]" />
            <span className="font-bold text-lg">تم تحديث كافة الإعدادات بنجاح</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="lg:w-72 flex-shrink-0">
          <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all whitespace-nowrap text-right w-full",
                  activeTab === tab.id 
                    ? "bg-[#2b3d22] text-white shadow-lg shadow-[#2b3d22]/20 translate-x-1" 
                    : "text-[#5c6146] hover:bg-[#e1e6c3]/30 hover:text-[#2b3d22]"
                )}
              >
                <tab.icon size={20} />
                {tab.name}
              </button>
            ))}
          </nav>

          <div className="mt-12 space-y-6 hidden lg:block">
            <div className="asymmetric-card bg-surface-container p-8 flex flex-col items-center text-center shadow-[0_12px_32px_rgba(65,84,55,0.08)]">
              <div className="relative mb-4">
                <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-white shadow-lg relative">
                  <img 
                    className={cn("w-full h-full object-cover", isUploading && "opacity-50")} 
                    alt="Profile headshot of lab technician" 
                    src={auth.currentUser?.photoURL || "https://lh3.googleusercontent.com/aida-public/AB6AXuB_8_hmo1Qe7WCzKBvJ5CtDQ_pkrInSdwMobEaVisCKQWlr21wbCMzr35-Ya7iavFxKwYViL93OwUcxmq0dtrP1y7mXj42TcimaO9egBxmYkiqYAYG3tL6IOFjUmlyJi230Ox75wLXmG65fCOwX-Up1ZmfY_WYNzHdNm0FdV_Fsn_AXIkpS7CCinUWyvQsMWdRkFo7zlIofDSRKAZVeME1gPXgAEggyqnjPgnkM8KvZbSxY53LmEgbI4LVFgk8vfsps8RPz7-ZmVpc"}
                    referrerPolicy="no-referrer"
                  />
                  {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="animate-spin text-primary" size={24} />
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="absolute bottom-1 right-1 bg-primary text-on-primary p-2 rounded-full shadow-md scale-95 active:scale-90 transition-transform disabled:opacity-50"
                >
                  <Pencil size={14} />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  className="hidden" 
                  accept="image/*"
                />
              </div>
              <h3 className="text-xl font-bold text-primary">{displayName || 'أحمد بن محمد'}</h3>
              <p className="text-sm text-tertiary font-semibold px-3 py-1 bg-tertiary/10 rounded-full mt-2">{jobTitle || 'ملحق مخبري رئيسي'}</p>
              
              <div className="mt-6 flex flex-col gap-2 w-full">
                <div className="flex justify-between items-center text-xs text-on-surface-variant bg-white/50 p-3 rounded-lg group">
                  <span>الرمز الوظيفي للموظف:</span>
                  <div className="flex items-center gap-2">
                    {isEditingEmployeeId ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={employeeId}
                          onChange={(e) => setEmployeeId(e.target.value)}
                          className="w-40 bg-white border border-primary/20 rounded px-1 py-0.5 text-[10px] focus:outline-none focus:ring-1 focus:ring-primary"
                          autoFocus
                          onBlur={() => setIsEditingEmployeeId(false)}
                          onKeyDown={(e) => e.key === 'Enter' && setIsEditingEmployeeId(false)}
                        />
                        <button 
                          onClick={() => setIsEditingEmployeeId(false)}
                          className="text-primary hover:text-primary/80"
                        >
                          <CheckCircle2 size={12} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="font-bold">{employeeId}</span>
                        <button 
                          onClick={() => setIsEditingEmployeeId(true)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:text-primary/80"
                        >
                          <Pencil size={12} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs text-on-surface-variant bg-white/50 p-3 rounded-lg">
                  <span>تاريخ الانضمام:</span>
                  <span className="font-bold">
                    {auth.currentUser?.metadata.creationTime 
                      ? new Date(auth.currentUser.metadata.creationTime).toLocaleDateString('en-GB').split('/').reverse().join('/')
                      : '2023/10/12'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-grow">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-[40px] p-8 lg:p-12 shadow-xl shadow-[#2b3d22]/5 border border-[#c4c8bd]/10 min-h-[600px]"
          >
            {activeTab === 'profile' && (
              <div className="space-y-12">
                <section>
                  <h3 className="text-2xl font-black text-[#2b3d22] mb-8 flex items-center gap-3">
                    <User className="text-[#5c6146]" />
                    المعلومات الأساسية
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-sm font-black text-[#5c6146] mr-2">الاسم الكامل</label>
                      <input 
                        className="w-full bg-[#fcf9f3] border-2 border-transparent rounded-[20px] px-6 py-4 focus:ring-0 focus:border-[#2b3d22] transition-all text-[#1c1c18] font-bold" 
                        type="text" 
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="أدخل اسمك الكامل"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-black text-[#5c6146] mr-2">البريد الإلكتروني</label>
                      <input 
                        className="w-full bg-[#fcf9f3] border-2 border-transparent rounded-[20px] px-6 py-4 opacity-50 cursor-not-allowed text-[#1c1c18] font-bold" 
                        type="email" 
                        value={email}
                        disabled
                      />
                    </div>
                  </div>
                </section>

                <section className="pt-12 border-t border-[#c4c8bd]/20">
                  <h3 className="text-2xl font-black text-[#2b3d22] mb-8 flex items-center gap-3">
                    <Shield className="text-[#5c6146]" />
                    الصفة المهنية
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-sm font-black text-[#5c6146] mr-2">الرتبة الحالية</label>
                      <select 
                        className="w-full bg-[#fcf9f3] border-2 border-transparent rounded-[20px] px-6 py-4 focus:ring-0 focus:border-[#2b3d22] transition-all text-[#1c1c18] font-bold appearance-none"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                      >
                        <optgroup label="سلك الأعوان التقنيين للمخابر">
                          <option value="عون تقني للمخابر">عون تقني للمخابر</option>
                        </optgroup>
                        <optgroup label="سلك المعاونين التقنيين للمخابر">
                          <option value="معاون تقني للمخابر">معاون تقني للمخابر</option>
                        </optgroup>
                        <optgroup label="سلك الملحقين بالمخابر">
                          <option value="ملحق بالمخابر">ملحق بالمخابر</option>
                          <option value="ملحق رئيسي بالمخابر">ملحق رئيسي بالمخابر</option>
                          <option value="ملحق رئيس بالمخابر">ملحق رئيس بالمخابر</option>
                          <option value="ملحق مشرف بالمخابر">ملحق مشرف بالمخابر</option>
                        </optgroup>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-black text-[#5c6146] mr-2">التخصص الأكاديمي</label>
                      <textarea 
                        className="w-full bg-[#fcf9f3] border-2 border-transparent rounded-[20px] px-6 py-4 focus:ring-0 focus:border-[#2b3d22] transition-all text-[#1c1c18] font-bold min-h-[60px] resize-none" 
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        placeholder="مثال: فيزياء، كيمياء، علوم طبيعية"
                      />
                    </div>
                  </div>
                </section>

                <section className="pt-12 border-t border-[#c4c8bd]/20">
                  <h3 className="text-2xl font-black text-[#2b3d22] mb-8 flex items-center gap-3">
                    <Users className="text-[#5c6146]" />
                    ربط الحسابات الاجتماعية
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    <button 
                      onClick={() => linkAccount('google')}
                      disabled={auth.currentUser?.providerData.some(p => p.providerId === 'google.com')}
                      className={cn(
                        "flex items-center gap-3 px-6 py-3 rounded-2xl font-bold transition-all border-2",
                        auth.currentUser?.providerData.some(p => p.providerId === 'google.com')
                          ? "bg-green-50 border-green-100 text-green-700 cursor-default"
                          : "bg-white border-[#c4c8bd]/30 text-[#2b3d22] hover:border-[#2b3d22]/30"
                      )}
                    >
                      <Chrome size={18} className={auth.currentUser?.providerData.some(p => p.providerId === 'google.com') ? "text-green-600" : "text-[#4285F4]"} />
                      {auth.currentUser?.providerData.some(p => p.providerId === 'google.com') ? 'تم ربط Google' : 'ربط Google'}
                    </button>

                    <button 
                      onClick={() => linkAccount('facebook')}
                      disabled={auth.currentUser?.providerData.some(p => p.providerId === 'facebook.com')}
                      className={cn(
                        "flex items-center gap-3 px-6 py-3 rounded-2xl font-bold transition-all border-2",
                        auth.currentUser?.providerData.some(p => p.providerId === 'facebook.com')
                          ? "bg-blue-50 border-blue-100 text-blue-700 cursor-default"
                          : "bg-white border-[#c4c8bd]/30 text-[#2b3d22] hover:border-[#2b3d22]/30"
                      )}
                    >
                      <Facebook size={18} className={auth.currentUser?.providerData.some(p => p.providerId === 'facebook.com') ? "text-blue-600" : "text-[#1877F2]"} />
                      {auth.currentUser?.providerData.some(p => p.providerId === 'facebook.com') ? 'تم ربط Facebook' : 'ربط Facebook'}
                    </button>

                    <button 
                      onClick={() => setShowPhoneInput(true)}
                      disabled={auth.currentUser?.providerData.some(p => p.providerId === 'phone')}
                      className={cn(
                        "flex items-center gap-3 px-6 py-3 rounded-2xl font-bold transition-all border-2",
                        auth.currentUser?.providerData.some(p => p.providerId === 'phone')
                          ? "bg-gray-50 border-gray-100 text-gray-700 cursor-default"
                          : "bg-white border-[#c4c8bd]/30 text-[#2b3d22] hover:border-[#2b3d22]/30"
                      )}
                    >
                      <Smartphone size={18} className={auth.currentUser?.providerData.some(p => p.providerId === 'phone') ? "text-gray-600" : "text-[#2b3d22]"} />
                      {auth.currentUser?.providerData.some(p => p.providerId === 'phone') ? auth.currentUser.phoneNumber : 'ربط الهاتف'}
                    </button>
                  </div>
                  {linkingError && (
                    <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold">
                      <AlertCircle size={18} />
                      {linkingError}
                    </div>
                  )}
                </section>
              </div>
            )}

            {activeTab === 'institution' && (
              <div className="space-y-16">
                <section>
                  <h3 className="text-2xl font-black text-[#2b3d22] mb-8 flex items-center gap-3">
                    <School className="text-[#5c6146]" />
                    بيانات المؤسسة التعليمية
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-sm font-black text-[#5c6146] mr-2">مديرية التربية</label>
                      <select 
                        className="w-full bg-[#fcf9f3] border-2 border-transparent rounded-[20px] px-6 py-4 focus:ring-0 focus:border-[#2b3d22] transition-all font-bold appearance-none"
                        value={selectedDirectorate}
                        onChange={(e) => {
                          setSelectedDirectorate(e.target.value);
                          setSelectedCommune('');
                          setSelectedSchool('');
                        }}
                      >
                        <option value="">اختر المديرية...</option>
                        {Object.entries(SCHOOL_DB).map(([id, dir]: [string, any]) => (
                          <option key={id} value={id}>{dir.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-black text-[#5c6146] mr-2">البلدية</label>
                      <select 
                        className="w-full bg-[#fcf9f3] border-2 border-transparent rounded-[20px] px-6 py-4 focus:ring-0 focus:border-[#2b3d22] transition-all font-bold appearance-none disabled:opacity-30"
                        disabled={!selectedDirectorate}
                        value={selectedCommune}
                        onChange={(e) => {
                          setSelectedCommune(e.target.value);
                          setSelectedCycle('');
                          setSelectedSchool('');
                        }}
                      >
                        <option value="">اختر البلدية...</option>
                        {selectedDirectorate && Object.entries(SCHOOL_DB[selectedDirectorate].communes).map(([id, com]: [string, any]) => (
                          <option key={id} value={id}>{com.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-black text-[#5c6146] mr-2">الطور التعليمي</label>
                      <select 
                        className="w-full bg-[#fcf9f3] border-2 border-transparent rounded-[20px] px-6 py-4 focus:ring-0 focus:border-[#2b3d22] transition-all font-bold appearance-none disabled:opacity-30"
                        disabled={!selectedCommune}
                        value={selectedCycle}
                        onChange={(e) => {
                          setSelectedCycle(e.target.value);
                          setSelectedSchool('');
                        }}
                      >
                        <option value="">اختر الطور...</option>
                        {selectedDirectorate && selectedCommune && 
                          Object.keys(SCHOOL_DB[selectedDirectorate].communes[selectedCommune].cycles).map((cycle) => (
                            <option key={cycle} value={cycle}>{cycle}</option>
                          ))
                        }
                      </select>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-black text-[#5c6146] mr-2">المؤسسة التعليمية</label>
                      <select 
                        className="w-full bg-[#fcf9f3] border-2 border-transparent rounded-[20px] px-6 py-4 focus:ring-0 focus:border-[#2b3d22] transition-all font-bold appearance-none disabled:opacity-30"
                        disabled={!selectedCycle}
                        value={selectedSchool}
                        onChange={(e) => setSelectedSchool(e.target.value)}
                      >
                        <option value="">اختر المؤسسة...</option>
                        {selectedDirectorate && selectedCommune && selectedCycle && 
                          SCHOOL_DB[selectedDirectorate].communes[selectedCommune].cycles[selectedCycle].map((sch: any) => (
                            <option key={sch.code} value={sch.code}>{sch.name}</option>
                          ))
                        }
                      </select>
                    </div>
                  </div>

                  <div className="mt-8 space-y-3">
                    <label className="text-sm font-black text-[#5c6146] mr-2 flex items-center gap-2">
                      <MapPin size={16} />
                      العنوان الجغرافي الدقيق
                    </label>
                    <textarea 
                      className="w-full bg-[#fcf9f3] border-2 border-transparent rounded-[24px] px-6 py-4 focus:ring-0 focus:border-[#2b3d22] transition-all font-bold min-h-[100px] resize-none"
                      placeholder="أدخل عنوان المؤسسة بالتفصيل..."
                      value={schoolAddress}
                      onChange={(e) => setSchoolAddress(e.target.value)}
                    />
                  </div>

                  <div className="mt-12">
                    <LocationCard 
                      onSelect={handleInstitutionSelect} 
                      communeName={selectedDirectorate && selectedCommune ? (SCHOOL_DB as any)[selectedDirectorate]?.communes[selectedCommune]?.name : undefined}
                    />
                  </div>
                </section>

                <section className="pt-12 border-t border-[#c4c8bd]/20">
                  <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                      <h3 className="text-2xl font-black text-[#2b3d22] flex items-center gap-3">
                        <MapIcon className="text-[#5c6146]" />
                        الخريطة التربوية
                      </h3>
                      <p className="text-[#5c6146] text-sm font-bold mt-1">تنظيم المستويات والأفواج التربوية للموسم الدراسي الحالي.</p>
                    </div>
                    {selectedCycle && (
                      <button
                        onClick={resetToCycleTemplate}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#e1e6c3] text-[#2b3d22] font-black text-xs hover:bg-[#2b3d22] hover:text-white transition-all shadow-sm"
                      >
                        <History size={14} />
                        تحيين حسب الطور ({selectedCycle})
                      </button>
                    )}
                  </header>

                  <div className="grid grid-cols-1 gap-6">
                    {levels.map((level) => (
                      <motion.div 
                        layout
                        key={level.id} 
                        className="bg-[#fcf9f3] rounded-[32px] p-8 border border-[#c4c8bd]/30"
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                          <h4 className="text-lg font-black text-[#2b3d22]">{level.name}</h4>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-[#c4c8bd]/50 shadow-sm">
                              <span className="text-[10px] font-black text-[#5c6146] uppercase tracking-wider">الأفواج</span>
                              <input 
                                type="number"
                                min="0"
                                max="20"
                                value={level.groups.length}
                                onChange={(e) => {
                                  const count = parseInt(e.target.value) || 0;
                                  const currentCount = level.groups.length;
                                  if (count > currentCount) {
                                    for (let i = 0; i < count - currentCount; i++) addGroup(level.id);
                                  } else if (count < currentCount) {
                                    setLevels(levels.map(l => l.id === level.id ? { ...l, groups: l.groups.slice(0, count) } : l));
                                  }
                                }}
                                className="w-10 text-center font-black text-[#2b3d22] bg-transparent border-none focus:ring-0 p-0"
                              />
                            </div>
                            <button 
                              onClick={() => addGroup(level.id)}
                              className="p-2 bg-[#2b3d22] text-white rounded-xl hover:scale-110 active:scale-90 transition-all shadow-md"
                            >
                              <Plus size={20} />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                          {level.groups.map((group, idx) => (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              key={idx} 
                              className="bg-white border border-[#c4c8bd]/40 p-1 pr-4 rounded-2xl flex items-center justify-between group shadow-sm hover:border-[#2b3d22]/30 transition-all"
                            >
                              <input 
                                type="text"
                                value={group}
                                onChange={(e) => {
                                  setLevels(levels.map(l => {
                                    if (l.id === level.id) {
                                      const newGroups = [...l.groups];
                                      newGroups[idx] = e.target.value;
                                      return { ...l, groups: newGroups };
                                    }
                                    return l;
                                  }));
                                }}
                                className="text-[#2b3d22] bg-transparent border-none focus:ring-0 p-0 w-full font-bold text-sm"
                              />
                              <button 
                                onClick={() => removeGroup(level.id, idx)}
                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 size={16} />
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'system' && (
              <div className="space-y-12">
                <section>
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-black text-[#2b3d22] flex items-center gap-3">
                      <Lock className="text-[#5c6146]" />
                      أمان الحساب
                    </h3>
                    <button 
                      onClick={handleResetPassword}
                      disabled={isResettingPassword}
                      className="text-sm font-bold text-primary hover:underline flex items-center gap-2"
                    >
                      {isResettingPassword ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
                      إرسال رابط إعادة تعيين كلمة المرور
                    </button>
                  </div>
                  <div className="bg-[#fcf9f3] p-8 rounded-[32px] border border-[#c4c8bd]/30">
                    <p className="text-sm font-bold text-[#5c6146] mb-6">تغيير كلمة المرور الخاصة بك بانتظام يعزز أمان بياناتك.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-sm font-black text-[#5c6146] mr-2">كلمة المرور الجديدة</label>
                        <input 
                          className="w-full bg-white border-2 border-transparent rounded-[20px] px-6 py-4 focus:ring-0 focus:border-[#2b3d22] transition-all font-bold" 
                          type="password" 
                          placeholder="••••••••"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-sm font-black text-[#5c6146] mr-2">تأكيد كلمة المرور</label>
                        <input 
                          className="w-full bg-white border-2 border-transparent rounded-[20px] px-6 py-4 focus:ring-0 focus:border-[#2b3d22] transition-all font-bold" 
                          type="password" 
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </section>

                <section className="pt-12 border-t border-[#c4c8bd]/20">
                  <h3 className="text-2xl font-black text-[#2b3d22] mb-8 flex items-center gap-3">
                    <Users className="text-[#5c6146]" />
                    ربط الحسابات
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Google */}
                    <div className="bg-[#fcf9f3] p-6 rounded-3xl border border-[#c4c8bd]/30 flex flex-col items-center text-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                        <Chrome className="text-[#4285F4]" size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#2b3d22]">Google</h4>
                        <p className="text-xs text-[#5c6146] mt-1">
                          {auth.currentUser?.providerData.some(p => p.providerId === 'google.com') 
                            ? 'مرتبط بنجاح' 
                            : 'غير مرتبط'}
                        </p>
                      </div>
                      {auth.currentUser?.providerData.some(p => p.providerId === 'google.com') ? (
                        <button 
                          onClick={() => unlinkAccount('google.com')}
                          className="w-full py-2 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-all"
                        >
                          إلغاء الربط
                        </button>
                      ) : (
                        <button 
                          onClick={() => linkAccount('google')}
                          className="w-full py-2 bg-[#4285F4] text-white rounded-xl text-sm font-bold hover:bg-[#3367d6] transition-all"
                        >
                          ربط الحساب
                        </button>
                      )}
                    </div>

                    {/* Facebook */}
                    <div className="bg-[#fcf9f3] p-6 rounded-3xl border border-[#c4c8bd]/30 flex flex-col items-center text-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                        <Facebook className="text-[#1877F2]" size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#2b3d22]">Facebook</h4>
                        <p className="text-xs text-[#5c6146] mt-1">
                          {auth.currentUser?.providerData.some(p => p.providerId === 'facebook.com') 
                            ? 'مرتبط بنجاح' 
                            : 'غير مرتبط'}
                        </p>
                      </div>
                      {auth.currentUser?.providerData.some(p => p.providerId === 'facebook.com') ? (
                        <button 
                          onClick={() => unlinkAccount('facebook.com')}
                          className="w-full py-2 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-all"
                        >
                          إلغاء الربط
                        </button>
                      ) : (
                        <button 
                          onClick={() => linkAccount('facebook')}
                          className="w-full py-2 bg-[#1877F2] text-white rounded-xl text-sm font-bold hover:bg-[#166fe5] transition-all"
                        >
                          ربط الحساب
                        </button>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="bg-[#fcf9f3] p-6 rounded-3xl border border-[#c4c8bd]/30 flex flex-col items-center text-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                        <Smartphone className="text-[#2b3d22]" size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#2b3d22]">رقم الهاتف</h4>
                        <p className="text-xs text-[#5c6146] mt-1">
                          {auth.currentUser?.providerData.some(p => p.providerId === 'phone') 
                            ? auth.currentUser.phoneNumber 
                            : 'غير مرتبط'}
                        </p>
                      </div>
                      {auth.currentUser?.providerData.some(p => p.providerId === 'phone') ? (
                        <button 
                          onClick={() => unlinkAccount('phone')}
                          className="w-full py-2 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-all"
                        >
                          إلغاء الربط
                        </button>
                      ) : (
                        <button 
                          onClick={() => setShowPhoneInput(true)}
                          className="w-full py-2 bg-[#2b3d22] text-white rounded-xl text-sm font-bold hover:bg-[#1c2816] transition-all"
                        >
                          ربط الهاتف
                        </button>
                      )}
                    </div>
                  </div>
                </section>

                <section className="pt-12 border-t border-[#c4c8bd]/20">
                  <h3 className="text-2xl font-black text-[#2b3d22] mb-8 flex items-center gap-3">
                    <Database className="text-[#5c6146]" />
                    قاعدة البيانات والنسخ الاحتياطي
                  </h3>
                  <div className="bg-[#2b3d22] text-white p-10 rounded-[40px] relative overflow-hidden group shadow-2xl">
                    <div className="relative z-10">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                              <History size={24} className="text-[#d3e9c3]" />
                            </div>
                            <div>
                              <p className="text-xs font-black opacity-60 uppercase tracking-widest">آخر مزامنة</p>
                              <p className="text-lg font-bold">منذ 12 دقيقة (تلقائياً)</p>
                            </div>
                          </div>
                          <p className="text-sm opacity-70 max-w-md leading-relaxed">يتم حفظ كافة التغييرات التي تجريها في السحابة بشكل فوري. يمكنك أيضاً إنشاء نسخة يدوية للتحميل.</p>
                        </div>
                        <div className="flex flex-col md:flex-row gap-4">
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
                            className="bg-white/10 text-white px-8 py-5 rounded-[24px] font-black flex items-center gap-3 hover:bg-white/20 transition-all shadow-xl hover:-translate-y-1 active:translate-y-0 disabled:opacity-50"
                          >
                            {isImporting ? (
                              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <FileUp size={24} />
                            )}
                            استيراد من XLS
                          </button>
                          <button className="bg-[#d3e9c3] text-[#2b3d22] px-8 py-5 rounded-[24px] font-black flex items-center gap-3 hover:bg-white transition-all shadow-xl hover:-translate-y-1 active:translate-y-0">
                            <CloudUpload size={24} />
                            تصدير نسخة احتياطية (.json)
                          </button>
                        </div>
                      </div>
                    </div>
                    <Database className="absolute -bottom-12 -left-12 text-white/5 w-64 h-64 rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
                  </div>
                </section>

                <section className="pt-12 border-t border-[#c4c8bd]/20">
                  <h3 className="text-2xl font-black text-[#2b3d22] mb-8 flex items-center gap-3">
                    <Database className="text-[#5c6146]" />
                    حالة الاتصال بقاعدة البيانات
                  </h3>
                  <div className="bg-[#fcf9f3] p-8 rounded-[32px] border-2 border-dashed border-[#c4c8bd]/30">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="text-right">
                        <h4 className="text-lg font-black text-[#2b3d22] mb-1">اختبار الاتصال بـ Firestore</h4>
                        <p className="text-sm text-[#5c6146] opacity-80">تأكد من أن قاعدة البيانات مفعلة وتعمل بشكل صحيح في Firebase Console.</p>
                      </div>
                      <button
                        onClick={checkConnection}
                        disabled={isCheckingConnection}
                        className={cn(
                          "px-8 py-4 rounded-2xl font-black transition-all flex items-center gap-3 shadow-lg active:scale-95",
                          connectionStatus === 'success' ? "bg-green-600 text-white" :
                          connectionStatus === 'error' ? "bg-red-600 text-white" :
                          "bg-[#2b3d22] text-white hover:opacity-90"
                        )}
                      >
                        {isCheckingConnection ? (
                          <>
                            <Loader2 size={20} className="animate-spin" />
                            جاري الاختبار...
                          </>
                        ) : connectionStatus === 'success' ? (
                          <>
                            <CheckCircle2 size={20} />
                            متصل بنجاح
                          </>
                        ) : connectionStatus === 'error' ? (
                          <>
                            <AlertCircle size={20} />
                            فشل الاتصال
                          </>
                        ) : (
                          <>
                            <Globe size={20} />
                            اختبار الآن
                          </>
                        )}
                      </button>
                    </div>
                    {connectionStatus === 'error' && (
                      <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 text-sm font-bold">
                        <p className="mb-2">يبدو أن قاعدة البيانات غير مفعلة. يرجى اتباع الخطوات التالية:</p>
                        <ol className="list-decimal list-inside space-y-1">
                          <li>افتح <a href={`https://console.firebase.google.com/project/${auth.app.options.projectId}/firestore`} target="_blank" rel="noopener noreferrer" className="underline">Firebase Console</a></li>
                          <li>اضغط على "Create database"</li>
                          <li>اختر "Production mode"</li>
                          <li>قم بنشر القواعد (Rules) الموجودة في ملف firestore.rules</li>
                        </ol>
                      </div>
                    )}
                  </div>
                </section>

                <section className="pt-12 border-t border-[#c4c8bd]/20">
                  <h3 className="text-2xl font-black text-[#2b3d22] mb-8 flex items-center gap-3">
                    <Globe className="text-[#5c6146]" />
                    تفضيلات النظام
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-sm font-black text-[#5c6146] mr-2">لغة الواجهة</label>
                      <select className="w-full bg-[#fcf9f3] border-2 border-transparent rounded-[20px] px-6 py-4 focus:ring-0 focus:border-[#2b3d22] transition-all font-bold appearance-none">
                        <option>العربية (الافتراضية)</option>
                        <option>Français (قريباً)</option>
                        <option>English (قريباً)</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-black text-[#5c6146] mr-2">الوضع الليلي</label>
                      <div className="flex items-center gap-4 bg-[#fcf9f3] p-4 rounded-[20px] border-2 border-transparent">
                        <div className="w-12 h-6 bg-[#c4c8bd] rounded-full relative cursor-not-allowed opacity-50">
                          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                        </div>
                        <span className="text-sm font-bold text-[#5c6146] opacity-50">غير متاح حالياً</span>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </motion.div>

          <AnimatePresence>
            {showPhoneInput && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-8 p-8 bg-white border-2 border-[#2b3d22]/10 rounded-[32px] space-y-6 shadow-xl"
              >
                {!confirmationResult ? (
                  <div className="space-y-4">
                    <h4 className="font-black text-[#2b3d22]">أدخل رقم الهاتف لربط الحساب</h4>
                    <p className="text-sm text-[#5c6146]">يرجى إدخال رقم الهاتف مع رمز الدولة (مثال: +213xxxxxxxxx)</p>
                    <div className="flex gap-3">
                      <input 
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+213"
                        dir="ltr"
                        className="flex-grow bg-[#fcf9f3] border-2 border-transparent rounded-2xl px-6 py-4 focus:ring-0 focus:border-[#2b3d22] transition-all font-bold"
                      />
                      <button 
                        onClick={handlePhoneLink}
                        disabled={isVerifyingPhone || !phoneNumber}
                        className="px-8 bg-[#2b3d22] text-white rounded-2xl font-bold disabled:opacity-50 min-w-[120px]"
                      >
                        {isVerifyingPhone ? <Loader2 className="animate-spin mx-auto" /> : 'إرسال الرمز'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h4 className="font-black text-[#2b3d22]">أدخل رمز التحقق</h4>
                    <p className="text-sm text-[#5c6146]">تم إرسال رمز التحقق إلى {phoneNumber}</p>
                    <div className="flex gap-3">
                      <input 
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="000000"
                        className="flex-grow bg-[#fcf9f3] border-2 border-transparent rounded-2xl px-6 py-4 focus:ring-0 focus:border-[#2b3d22] transition-all font-bold text-center tracking-[1em]"
                      />
                      <button 
                        onClick={verifyPhoneCode}
                        disabled={isVerifyingPhone || !verificationCode}
                        className="px-8 bg-[#2b3d22] text-white rounded-2xl font-bold disabled:opacity-50 min-w-[120px]"
                      >
                        {isVerifyingPhone ? <Loader2 className="animate-spin mx-auto" /> : 'تأكيد الرمز'}
                      </button>
                    </div>
                  </div>
                )}
                <div id="recaptcha-container"></div>
                <button 
                  onClick={() => {
                    setShowPhoneInput(false);
                    setConfirmationResult(null);
                    setLinkingError(null);
                  }}
                  className="text-sm font-bold text-red-500 hover:underline"
                >
                  إلغاء العملية
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Floating Save Bar */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="w-full bg-[#2b3d22] text-white py-5 rounded-[28px] font-black shadow-[0_20px_50px_rgba(43,61,34,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-4 border border-white/10"
        >
          {isSaving ? (
            <>
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              <span className="text-lg">جاري المزامنة...</span>
            </>
          ) : (
            <>
              <CheckCircle2 size={24} />
              <span className="text-lg">تثبيت كافة التغييرات</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
