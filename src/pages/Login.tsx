import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  sendPasswordResetEmail,
  GoogleAuthProvider, 
  FacebookAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Beaker, Lock as LockIcon, User, Eye, ArrowLeft, ShieldCheck, Globe, UserPlus, Facebook, Phone, MessageSquare } from 'lucide-react';
import { cn } from '../lib/utils';

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | undefined;
  }
}

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [error, setError] = useState<React.ReactNode>('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);

  useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }
    };
  }, []);

  const setupRecaptcha = async () => {
    try {
      // If it's already initialized, don't do it again
      if (window.recaptchaVerifier) {
        return;
      }
      
      const container = document.getElementById('recaptcha-container');
      if (!container) return;
      
      // Clear the container just in case there's leftover HTML
      container.innerHTML = '';

      const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {
          // reCAPTCHA solved
        },
        'expired-callback': () => {
          if (window.recaptchaVerifier) {
            window.recaptchaVerifier.clear();
            window.recaptchaVerifier = undefined;
          }
        }
      });

      // Explicitly render the reCAPTCHA to catch errors early
      await verifier.render();
      window.recaptchaVerifier = verifier;
      
    } catch (err: any) {
      console.error('Recaptcha setup error:', err);
      // If it fails, ensure we reset the state
      if (window.recaptchaVerifier) {
        try { window.recaptchaVerifier.clear(); } catch(e) {}
        window.recaptchaVerifier = undefined;
      }
      
      if (err.message?.includes('-39') || err.code?.includes('-39')) {
        setError('خطأ في تحميل نظام التحقق (reCAPTCHA). يرجى التأكد من عدم وجود إضافات تمنع الإعلانات (Ad-blockers) وتحديث الصفحة.');
      }
    }
  };

  const handlePhoneAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Robust phone number formatting
    let formattedPhone = phoneNumber.trim().replace(/\s+/g, ''); // Remove spaces
    
    // If it starts with 00, replace with +
    if (formattedPhone.startsWith('00')) {
      formattedPhone = '+' + formattedPhone.substring(2);
    } 
    // If it starts with 0 and not 00, and doesn't have a +, assume Algerian local number
    else if (formattedPhone.startsWith('0') && !formattedPhone.startsWith('+')) {
      formattedPhone = '+213' + formattedPhone.substring(1);
    }
    // If it doesn't start with + at all, add it
    else if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+' + formattedPhone;
    }

    // Basic E.164 validation regex: + followed by 7 to 15 digits
    const phoneRegex = /^\+[1-9]\d{6,14}$/;
    if (!phoneRegex.test(formattedPhone)) {
      setError('صيغة رقم الهاتف غير صالحة. يرجى إدخال الرقم بصيغة دولية صحيحة (مثلاً: +213661234567).');
      setLoading(false);
      return;
    }

    setPhoneNumber(formattedPhone);

    try {
      if (!confirmationResult) {
        await setupRecaptcha();
        if (!window.recaptchaVerifier) {
          throw new Error('فشل تهيئة نظام التحقق (reCAPTCHA).');
        }
        const appVerifier = window.recaptchaVerifier;
        const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
        setConfirmationResult(result);
        setResendTimer(60); // 60 seconds countdown
        setCanResend(false);
      } else {
        const result = await confirmationResult.confirm(verificationCode);
        const user = result.user;
        
        // Check if user document exists, if not create it
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
          await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            phoneNumber: user.phoneNumber,
            role: 'user',
            displayName: user.phoneNumber || 'مستخدم هاتف',
            createdAt: new Date().toISOString()
          });
        }
      }
    } catch (err: any) {
      console.error('Phone auth error:', err);
      if (err.code === 'auth/invalid-phone-number') {
        setError('رقم الهاتف غير صحيح. يرجى إدخال الرقم بصيغة دولية صحيحة (مثلاً: +213661234567).');
      } else if (err.code === 'auth/code-expired') {
        setError('انتهت صلاحية رمز التحقق. يرجى المحاولة مرة أخرى.');
      } else if (err.code === 'auth/invalid-verification-code') {
        setError('رمز التحقق غير صحيح.');
      } else if (err.code === 'auth/captcha-check-failed' || err.message?.includes('Hostname match not found')) {
        setError(`خطأ في التحقق: يجب إضافة النطاق (${window.location.hostname}) إلى قائمة "Authorized domains" في إعدادات Firebase Authentication.`);
      } else if (err.code === 'auth/too-many-requests') {
        setError('تم إرسال الكثير من الطلبات. يرجى المحاولة لاحقاً.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError(
          <span>
            إرسال الرسائل النصية غير مفعل لهذه المنطقة. يرجى تفعيل "SMS Region Policy" من{' '}
            <a 
              href={`https://console.firebase.google.com/project/${auth.app.options.projectId}/authentication/settings`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline font-black"
            >
              إعدادات Firebase
            </a>
            .
          </span>
        );
      } else if (err.code === 'auth/billing-not-enabled') {
        setError(
          <span>
            مشكلة في الدفع: يرجى ترقية مشروع Firebase إلى خطة "Blaze" (Pay-as-you-go) لاستخدام ميزة التحقق عبر الهاتف في هذه المنطقة. 
            <a 
              href={`https://console.firebase.google.com/project/${auth.app.options.projectId}/billing/plan`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline block mt-1 font-black"
            >
              ترقية الخطة الآن
            </a>
          </span>
        );
      } else if (err.message?.includes('-39') || err.code?.includes('-39')) {
        setError('خطأ داخلي في نظام التحقق (reCAPTCHA). يرجى تحديث الصفحة والمحاولة مرة أخرى، أو التأكد من أنك لا تستخدم متصفحاً في وضع التخفي (Incognito).');
      } else {
        setError('حدث خطأ أثناء التحقق من رقم الهاتف. يرجى التأكد من الصيغة الدولية.');
      }
      
      // Reset reCAPTCHA on fatal errors or session expiry
      // Don't reset on invalid-verification-code to allow retries without re-solving reCAPTCHA
      if (err.code === 'auth/too-many-requests' || err.code === 'auth/code-expired' || err.message?.includes('-39') || !confirmationResult) {
        if (window.recaptchaVerifier) {
          try { window.recaptchaVerifier.clear(); } catch(e) {}
          window.recaptchaVerifier = undefined;
        }
        if (err.code === 'auth/code-expired') {
          setConfirmationResult(null);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;
    setConfirmationResult(null);
    setVerificationCode('');
    // Trigger the same logic by calling handlePhoneAuth with a dummy event
    const dummyEvent = { preventDefault: () => {} } as React.FormEvent;
    handlePhoneAuth(dummyEvent);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('يرجى إدخال البريد الإلكتروني أولاً.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setError('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. يرجى التحقق من صندوق الوارد.');
      setIsResetting(false);
    } catch (err: any) {
      console.error('Reset password error:', err);
      if (err.code === 'auth/user-not-found') {
        setError('هذا البريد الإلكتروني غير مسجل لدينا.');
      } else {
        setError('حدث خطأ أثناء محاولة إرسال رابط إعادة التعيين.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (!isLogin && password !== confirmPassword) {
      setError('كلمات المرور غير متطابقة.');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Create user document in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          role: 'user',
          displayName: user.email?.split('@')[0] || 'مستخدم جديد',
          createdAt: new Date().toISOString()
        });
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      if (isLogin) {
        if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
          setError('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
        } else if (err.code === 'auth/operation-not-allowed') {
          setError('تسجيل الدخول بالبريد الإلكتروني غير مفعل في إعدادات Firebase.');
        } else {
          setError('خطأ في تسجيل الدخول. يرجى التحقق من البيانات.');
        }
      } else {
        if (err.code === 'auth/email-already-in-use') {
          setError('هذا البريد الإلكتروني مستخدم بالفعل. يرجى تسجيل الدخول بدلاً من ذلك.');
        } else if (err.code === 'auth/weak-password') {
          setError('كلمة المرور ضعيفة جداً. يجب أن تتكون من 6 أحرف على الأقل.');
        } else if (err.code === 'auth/operation-not-allowed') {
          setError('إنشاء الحساب بالبريد الإلكتروني غير مفعل في إعدادات Firebase.');
        } else {
          setError('فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user document exists, if not create it
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          role: 'user',
          displayName: user.displayName || user.email?.split('@')[0] || 'مستخدم جديد',
          createdAt: new Date().toISOString()
        });
      }
    } catch (err: any) {
      setError('فشل تسجيل الدخول عبر جوجل.');
    }
  };

  const handleFacebookLogin = async () => {
    const provider = new FacebookAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user document exists, if not create it
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          role: 'user',
          displayName: user.displayName || user.email?.split('@')[0] || 'مستخدم جديد',
          createdAt: new Date().toISOString()
        });
      }
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        setError(
          <span className="flex items-center gap-1 justify-center">
            تسجيل الدخول عبر فيسبوك غير مفعل. يرجى تفعيله من{' '}
            <a 
              href={`https://console.firebase.google.com/project/${auth.app.options.projectId}/authentication/providers`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline font-black"
            >
              Firebase Console
            </a>
          </span>
        );
      } else {
        setError('فشل تسجيل الدخول عبر فيسبوك.');
      }
    }
  };

  return (
    <div className="bg-surface-container-low text-on-surface min-h-screen flex overflow-hidden rtl font-sans" dir="rtl">
      {/* Left Panel: Photo Mosaic (60%) */}
      <section className="hidden md:flex md:w-[60%] relative bg-primary-dim p-8 flex-col justify-between overflow-hidden">
        {/* Background Mosaic Overlay */}
        <div className="absolute inset-0 opacity-40 z-0 p-4">
          <div className="mosaic-container">
            <div className="rounded-xl overflow-hidden shadow-lg bg-surface-variant col-span-2 row-span-1">
              <img className="w-full h-full object-cover" data-alt="Science laboratory with microscopes and glass tubes" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3v04XZdR-wrr-yl9jm1TwqSzZh1tB2Q_b2seHi78Pot77MsMKUR_IfLse_SOAchzoJnl9_QyxHYtsxc5wu26u4ADOAzYFgqR8gRymImjjvvT-bDPHvCmLBkeobQG0AcqNGd6vHpntlBztJ221uKcrlHe0ThJ4WLglF7F8BkpxNeqIax36ScCmlka5P905m6gshhHSbmcp0nBeSVUvuNGqULHF4tyOFKqEbn_cMXOMT09UhVajKnS6za7T-T9mTkBJ2In2H4Gg4-4" referrerPolicy="no-referrer" />
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg bg-surface-variant">
              <img className="w-full h-full object-cover" data-alt="Close up of chemical reaction in test tube" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAK-3rZyvrCfdVxOKdAv8bR1wO3FG3vheJUtH9H5Ex6zmXLnSMqqvrqhqLhZXr-6EEUg-clmsiUqfrTsT1ayjC0cfDHAklAFpmlB_La9uV4hegLKAEzWA_Scf12WX5ykbgzB2227HIREHQucl3l3EeUV2SL95ZqqHw9nCMheHY__u9TTVVC9hBrFiiw9R880kRD_glE_Pjt0M0CNkxq6dYlHNg7u1HGqhuSpviq15SPp7kowsWvvkdEoHYO8CnbbPB1gy4UJ5uS9-A" referrerPolicy="no-referrer" />
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg bg-surface-variant">
              <img className="w-full h-full object-cover" data-alt="Modern high school laboratory environment" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtQbiu329wvWJUIPV7-dHHkB8scwVlkjW0CxzAb_jkwQ6-Jqn63-dlCNl0PIsaUnxNqzFMH9zmVdgX-RtWbyQKYuFzHRViVJn_UlEhK6C2r6147LwlOE-LDSfsF6-3rO1m8ZGQmjw3w5iq5CzTZaOLjBIom_GHbBVKM-FZDGeaL6tVwLDqp7x72FMHHSedgxS_qQRRgpORxw5gS5pl43CsOClujg6hvVlI6CaFojkEIwLaHIA2svKzfvfdOhanjdfvx6qXY3yBcjs" referrerPolicy="no-referrer" />
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg bg-surface-variant">
              <img className="w-full h-full object-cover" data-alt="Scientist working with laboratory equipment" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPFGMsi61n29fUlKz-g9O3v3RDqIUPJA-Hd-3Eu1vZT6fsKe2dpWiZ7MV1j0aH8pGMUtKYujyGg7yo14gbULLD8FmKF7ag0U5RHVEmXsc0-SeQNOp9JnqjZbQQBPm2DpU7SYOV219H8rSwcmew0izuW-mE8sbqaY5a5URddDsyPQSPBpaQ6Jo9iOTwSDEdGfgCNZQHKxaiBQCz14goom5XhB_lg9h57mvcwYPBjAvGFjRkoFxUUx7K_wexj5aaQKzt7e0fzITXWS8" referrerPolicy="no-referrer" />
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg bg-surface-variant">
              <img className="w-full h-full object-cover" data-alt="Algerian school science lab workspace" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuu21W2NVmM2_12ChkPiiiSFralvib0a8U_lpsxVaAOqbHci_xBeb_JzUYm5XLunM43cDfllelPvxX21ruhld2KlTUw8FSodp75yDnZJzIIlbv6blmsbjAaJu19MR8mfi4mkJ-073-m-tswkhO1H2z5du4QRJq_lTCwpirBx8j-3zaZds9KBDsILc4gumE1CcSVNFpmJ0c6dju6Es6rRVo4hqT49j8sgYAEeY1qdkH9a0CkPRigO2YkJrX33Zkvautpubi87g-m7Y" referrerPolicy="no-referrer" />
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg bg-surface-variant col-span-3">
              <img className="w-full h-full object-cover" data-alt="Wide shot of a sterile chemistry lab" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKE46oqP3asuAvBjP-Hbs9AphtR1hQhiUXym8bmOEbovjI2BcbP075NU0xdSxp50PTKaBRjjHn2tO1ozFJVbbq5GpO8GPcAERHD_1KFsRVd_M2IynoapJLG6EskcDp2411e4OfDTd5C4-A9CHkE2f0MV-JA5U3kV0hKrkoknyJ-T-Qo9aKT1jeY8PQ5v3iQ2C0U7auDz0zTqzkG3Zyh8sjQNlmVa1n_XLRzz7DzE34FdleIFAZmGjCr1H89O7ZD8hZfTfvygnhaZU" referrerPolicy="no-referrer" />
            </div>
          </div>
        </div>
        {/* Gradient Layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#415437]/90 via-[#415437]/70 to-transparent z-10"></div>
        {/* Branding Content */}
        <div className="relative z-20 h-full flex flex-col justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>science</span>
            </div>
            <div>
              <h1 className="text-white text-3xl font-black tracking-tight leading-none">الأرضية الرقمية</h1>
              <p className="text-secondary-fixed opacity-90 text-sm mt-1">فضاء موظفوا المخابر</p>
            </div>
          </div>
          <div className="mt-auto">
            <h2 className="text-white text-6xl font-black mb-4 leading-tight">التميز العلمي في <br />قلب المنظومة التربوية</h2>
            <p className="text-surface-container-low text-xl max-w-lg leading-relaxed opacity-80">
              نظام رقمي متطور مصمم خصيصاً لتلبية احتياجات المخابر العلمية في المؤسسات التربوية الجزائرية، لضمان جرد دقيق ومتابعة بيداغوجية فعالة.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-10 gap-y-4 text-on-primary/40 text-xs font-black uppercase tracking-widest">
            <span className="flex items-center gap-2">
              <Globe size={14} aria-hidden="true" /> وزارة التربية الوطنية
            </span>
            <Link className="hover:text-on-primary transition-colors" to="/privacy-policy">سياسة الخصوصية</Link>
            <Link className="hover:text-on-primary transition-colors" to="/terms-of-service">شروط الخدمة</Link>
            <Link className="hover:text-on-primary transition-colors" to="/data-deletion">حذف البيانات</Link>
          </div>
        </div>
      </section>

      {/* Right Panel: Auth Form (40%) */}
      <main className="w-full lg:w-2/5 bg-surface-container-low relative flex flex-col items-center justify-center p-8 lg:p-24 overflow-y-auto">
        {/* Decorative Blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] -ml-40 -mb-40"></div>
        
        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block p-2 bg-white rounded-[40px] mb-8 shadow-xl border border-outline/10">
              <img 
                className="w-28 h-28 rounded-[32px] object-contain p-2" 
                src="https://upload.wikimedia.org/wikipedia/commons/d/d8/%D9%88%D8%B2%D8%A7%D8%B1%D8%A9_%D8%A7%D9%84%D8%AA%D8%B1%D8%A8%D9%8A%D8%A9_%D8%A7%D9%84%D9%88%D8%B7%D9%86%D9%8A%D8%A9.svg" 
                alt="Logo" 
                referrerPolicy="no-referrer" 
              />
            </div>
            <h3 className="text-3xl font-black text-primary mb-2 font-serif tracking-tight">وزارة التربية الوطنية</h3>
            <p className="text-on-surface/60 font-bold text-lg">نظام تسيير المخابر العلمية</p>
            <div className="mt-6 inline-flex items-center px-5 py-2 bg-primary/10 rounded-full text-primary text-xs font-black uppercase tracking-widest">
              {isLogin ? <LockIcon size={14} className="ml-2" /> : <UserPlus size={14} className="ml-2" />}
              {isLogin ? 'دخول الموظفين فقط' : 'إنشاء حساب جديد'}
            </div>
          </div>

          <div className="flex bg-white/50 backdrop-blur-sm p-1 rounded-2xl mb-8 border border-outline/10">
            <button
              onClick={() => { setAuthMethod('email'); setConfirmationResult(null); setError(''); }}
              className={cn(
                "flex-1 py-3 px-4 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2",
                authMethod === 'email' ? "bg-primary text-on-primary shadow-lg" : "text-on-surface/60 hover:bg-primary/5"
              )}
            >
              <User size={18} />
              البريد الإلكتروني
            </button>
            <button
              onClick={() => { setAuthMethod('phone'); setError(''); }}
              className={cn(
                "flex-1 py-3 px-4 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2",
                authMethod === 'phone' ? "bg-primary text-on-primary shadow-lg" : "text-on-surface/60 hover:bg-primary/5"
              )}
            >
              <Phone size={18} />
              رقم الهاتف
            </button>
          </div>

          {isResetting ? (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="text-center mb-6">
                <h4 className="text-xl font-black text-primary">إعادة تعيين كلمة المرور</h4>
                <p className="text-on-surface/60 text-sm">أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة التعيين.</p>
                <p className="text-[10px] text-error font-bold mt-2 italic">ملاحظة: إذا لم تجد الرسالة، يرجى التحقق من مجلد الرسائل غير المرغوب فيها (Spam).</p>
              </div>
              <div className="space-y-3">
                <label className="block text-xs font-black text-on-surface/40 uppercase tracking-widest mr-2" htmlFor="reset-email">البريد الإلكتروني</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none text-on-surface/30 group-focus-within:text-primary transition-colors">
                    <User size={22} />
                  </div>
                  <input 
                    className="w-full bg-white border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-[24px] py-5 pr-14 pl-6 text-on-surface font-bold placeholder-on-surface/20 shadow-sm focus:shadow-xl transition-all outline-none"
                    id="reset-email" 
                    type="email" 
                    placeholder="name@institution.dz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {error && (
                <div className={cn(
                  "text-xs font-black p-4 rounded-2xl text-center border animate-shake",
                  typeof error === 'string' && error.includes('تم إرسال') ? "bg-primary/10 text-primary border-primary/20" : "bg-error/10 text-error border-error/20"
                )}>
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-4">
                <button 
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary-container text-on-primary font-black py-5 rounded-full shadow-2xl shadow-primary/20 transform active:scale-95 transition-all flex items-center justify-center gap-3 group text-lg disabled:opacity-50" 
                  type="submit"
                >
                  <span>{loading ? 'جاري الإرسال...' : 'إرسال رابط التعيين'}</span>
                </button>
                <button 
                  type="button"
                  onClick={() => { setIsResetting(false); setError(''); }}
                  className="text-sm font-bold text-on-surface/60 hover:text-primary transition-colors"
                >
                  العودة لتسجيل الدخول
                </button>
              </div>
            </form>
          ) : authMethod === 'email' ? (
            <form onSubmit={handleAuth} className="space-y-6">
              <div className="space-y-3">
                <label className="block text-xs font-black text-on-surface/40 uppercase tracking-widest mr-2" htmlFor="email">البريد الإلكتروني</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none text-on-surface/30 group-focus-within:text-primary transition-colors">
                    <User size={22} />
                  </div>
                  <input 
                    className="w-full bg-white border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-[24px] py-5 pr-14 pl-6 text-on-surface font-bold placeholder-on-surface/20 shadow-sm focus:shadow-xl transition-all outline-none"
                    id="email" 
                    type="email" 
                    placeholder="name@institution.dz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center mr-2">
                  <label className="block text-xs font-black text-on-surface/40 uppercase tracking-widest" htmlFor="password">كلمة المرور</label>
                  {isLogin && (
                    <button 
                      type="button"
                      onClick={() => setIsResetting(true)}
                      className="text-xs text-primary font-black hover:underline"
                    >
                      نسيت كلمة المرور؟
                    </button>
                  )}
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none text-on-surface/30 group-focus-within:text-primary transition-colors">
                    <LockIcon size={22} />
                  </div>
                  <input 
                    className="w-full bg-white border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-[24px] py-5 pr-14 pl-14 text-on-surface font-bold placeholder-on-surface/20 shadow-sm focus:shadow-xl transition-all outline-none"
                    id="password" 
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-5 cursor-pointer text-on-surface/30 hover:text-primary transition-colors">
                    <Eye size={22} />
                  </div>
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-3">
                  <label className="block text-xs font-black text-on-surface/40 uppercase tracking-widest mr-2" htmlFor="confirmPassword">تأكيد كلمة المرور</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none text-on-surface/30 group-focus-within:text-primary transition-colors">
                      <ShieldCheck size={22} />
                    </div>
                    <input 
                      className="w-full bg-white border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-[24px] py-5 pr-14 pl-14 text-on-surface font-bold placeholder-on-surface/20 shadow-sm focus:shadow-xl transition-all outline-none"
                      id="confirmPassword" 
                      type="password" 
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-error/10 text-error text-xs font-black p-4 rounded-2xl text-center border border-error/20 animate-shake">
                  {error}
                </div>
              )}

              <button 
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-container text-on-primary font-black py-5 rounded-full shadow-2xl shadow-primary/20 transform active:scale-95 transition-all flex items-center justify-center gap-3 group text-lg disabled:opacity-50 disabled:active:scale-100" 
                type="submit"
              >
                <span>{loading ? 'جاري التحميل...' : (isLogin ? 'دخول إلى النظام' : 'إنشاء الحساب')}</span>
                <ArrowLeft className="group-hover:-translate-x-2 transition-transform" size={24} />
              </button>
            </form>
          ) : (
            <form onSubmit={handlePhoneAuth} className="space-y-6">
              <div id="recaptcha-container"></div>
              
              {!confirmationResult ? (
                <div className="space-y-3">
                  <label className="block text-xs font-black text-on-surface/40 uppercase tracking-widest mr-2" htmlFor="phone">رقم الهاتف</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none text-on-surface/30 group-focus-within:text-primary transition-colors">
                      <Phone size={22} />
                    </div>
                    <input 
                      className="w-full bg-white border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-[24px] py-5 pr-14 pl-6 text-on-surface font-bold placeholder-on-surface/20 shadow-sm focus:shadow-xl transition-all outline-none"
                      id="phone" 
                      type="tel" 
                      placeholder="0661234567"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                  </div>
                  <p className="text-[10px] text-on-surface/40 mr-2 font-bold italic">يمكنك إدخال الرقم بصيغة 0661234567 أو الصيغة الدولية +213661234567</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="block text-xs font-black text-on-surface/40 uppercase tracking-widest mr-2" htmlFor="code">رمز التحقق</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none text-on-surface/30 group-focus-within:text-primary transition-colors">
                      <MessageSquare size={22} />
                    </div>
                    <input 
                      className="w-full bg-white border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-[24px] py-5 pr-14 pl-6 text-on-surface font-bold placeholder-on-surface/20 shadow-sm focus:shadow-xl transition-all outline-none"
                      id="code" 
                      type="text" 
                      placeholder="123456"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2 px-2">
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] text-on-surface/40 font-bold">تم إرسال الرمز إلى {phoneNumber}</p>
                      <button 
                        type="button" 
                        onClick={() => { setConfirmationResult(null); setResendTimer(0); setCanResend(true); }}
                        className="text-[10px] text-primary font-black hover:underline"
                      >
                        تغيير الرقم؟
                      </button>
                    </div>
                    <div className="flex justify-center mt-2">
                      <button
                        type="button"
                        disabled={!canResend || loading}
                        onClick={handleResendCode}
                        className={cn(
                          "text-xs font-black transition-all",
                          canResend ? "text-primary hover:underline" : "text-on-surface/30 cursor-not-allowed"
                        )}
                      >
                        {resendTimer > 0 ? `إعادة إرسال الرمز خلال ${resendTimer} ثانية` : "لم يصلك الرمز؟ إعادة الإرسال"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-error/10 text-error text-xs font-black p-4 rounded-2xl text-center border border-error/20 animate-shake">
                  {error}
                </div>
              )}

              <button 
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-container text-on-primary font-black py-5 rounded-full shadow-2xl shadow-primary/20 transform active:scale-95 transition-all flex items-center justify-center gap-3 group text-lg disabled:opacity-50 disabled:active:scale-100" 
                type="submit"
              >
                <span>{loading ? 'جاري التحميل...' : (!confirmationResult ? 'إرسال رمز التحقق' : 'تأكيد الرمز والدخول')}</span>
                <ArrowLeft className="group-hover:-translate-x-2 transition-transform" size={24} />
              </button>
            </form>
          )}

          <div className="text-center mt-4">
            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-bold text-on-surface/60 hover:text-primary transition-colors"
            >
              {isLogin ? 'ليس لديك حساب؟ إنشاء حساب جديد' : 'لديك حساب بالفعل؟ تسجيل الدخول'}
            </button>
          </div>

          <div className="relative flex items-center justify-center py-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-outline/10"></div></div>
            <span className="relative px-4 bg-surface-container-low text-[10px] font-black text-on-surface/30 uppercase tracking-[0.3em]">أو</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              type="button"
              onClick={handleGoogleLogin}
              className="w-full bg-white border-2 border-outline/10 hover:border-primary/30 text-on-surface font-black py-4 rounded-full transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md active:scale-95"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5 ml-2" alt="Google" />
              {isLogin ? 'جوجل' : 'جوجل'}
            </button>

            <button 
              type="button"
              onClick={handleFacebookLogin}
              className="w-full bg-[#1877F2] hover:bg-[#166fe5] text-white font-black py-4 rounded-full transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md active:scale-95"
            >
              <Facebook size={20} className="ml-2" />
              {isLogin ? 'فيسبوك' : 'فيسبوك'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

