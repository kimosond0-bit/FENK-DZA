import React, { useState, useEffect } from 'react';
import { 
  X, 
  Phone, 
  User as UserIcon, 
  Lock, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Smartphone, 
  Building2, 
  ArrowRight, 
  ArrowLeft,
  KeyRound,
  Check,
  Sparkles,
  Eye,
  EyeOff,
  Camera,
  AtSign,
  Heart,
  UserCheck,
  HelpCircle,
  RefreshCw,
  Compass,
  Award,
  Crown
} from 'lucide-react';
import { User, UserRole, AccountTier } from '../types';
import { ALGERIA_WILAYAS } from '../data/wilayas';
import { OWNER_PHONE, OWNER_PASS, OWNER_USER } from '../data/initialData';
import { FenkLogo } from './FenkLogo';
import { sounds } from '../utils/soundEffects';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  availableUsers: User[];
  defaultMode?: 'login' | 'register';
}

// Preset Algerian Profile Avatars
const PRESET_AVATARS = [
  {
    id: 'fennec_1',
    label: 'فنك DZ البطل',
    url: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=150&auto=format&fit=crop&q=80',
    type: 'fennec'
  },
  {
    id: 'male_1',
    label: 'مواطن عصري',
    url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    type: 'personal'
  },
  {
    id: 'female_1',
    label: 'مواطنة نشطة',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    type: 'personal'
  },
  {
    id: 'male_2',
    label: 'شاب جزائري',
    url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    type: 'personal'
  },
  {
    id: 'business_1',
    label: 'متجر وتجارة',
    url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=150&auto=format&fit=crop&q=80',
    type: 'business'
  },
  {
    id: 'taxi_1',
    label: 'FUNK TAXI / نقل',
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    type: 'business'
  }
];

// Algerian Community Interests
const ALGERIAN_INTERESTS = [
  { id: 'wilayas_news', label: 'أخبار الـ 69 ولاية 📰', icon: '📍' },
  { id: 'sports_dz', label: 'الرياضة والمنتخب الوطني ⚽', icon: '🏆' },
  { id: 'market_cars', label: 'سوق السيارات والعقارات 🚗', icon: '🏷️' },
  { id: 'tech_ai', label: 'التكنولوجيا والذكاء الاصطناعي 💻', icon: '⚡' },
  { id: 'heritage_food', label: 'التراث والطبخ التقليدي 🍲', icon: '🏺' },
  { id: 'sahara_tourism', label: 'السياحة وسحر الصحراء 🏜️', icon: '🐪' },
  { id: 'jobs_dz', label: 'فرص العمل والتوظيف 💼', icon: '📈' },
  { id: 'community_voice', label: 'صوت المجتمع والاستطلاعات 🗳️', icon: '📢' },
];

// Bio Templates
const BIO_TEMPLATES = [
  '🇩🇿 فخور ببلادي ومتابع لأحدث أخبار ولايتي في مجتمع fenkDZ.',
  '💡 مهتم بالتقنية، العمل الحر ومشاريع الشباب في الجزائر.',
  '🚗 مهتم بجديد سوق السيارات وسوق دلالة بالدينار الجزائري.',
  '🌟 مواطن جزائري إيجابي، أشارك لخدمة ولايتي والمجتمع.'
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  availableUsers,
  defaultMode = 'register'
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(defaultMode);
  
  // Registration Wizard Step (1: Basic, 2: Profile/Bio, 3: Type, 4: SMS OTP, 5: Suggested Follows)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Step 1: Basic Info
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [handleAvailable, setHandleAvailable] = useState<boolean | null>(null);

  // Step 2: Algerian Location & Profile Customization
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0].url);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [isCustomAvatarInput, setIsCustomAvatarInput] = useState(false);
  const [wilayaId, setWilayaId] = useState<number>(16); // Default 16 Algiers
  const [municipality, setMunicipality] = useState('');
  const [bio, setBio] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['wilayas_news', 'market_cars']);

  // Step 3: Account Classification
  const [accountType, setAccountType] = useState<'personal' | 'business'>('personal');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('تجارة وخدمات عامة');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Step 4: Phone SMS Verification (OTP)
  const [otpCode, setOtpCode] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(60);
  const [isOtpTimerActive, setIsOtpTimerActive] = useState(false);
  const [isSimulatedSmsBannerVisible, setIsSimulatedSmsBannerVisible] = useState(false);

  // Step 5: Suggested Follows Selection
  const [selectedFollows, setSelectedFollows] = useState<string[]>([]);
  const [createdUser, setCreatedUser] = useState<User | null>(null);

  // Login Form
  const [loginPhoneOrHandle, setLoginPhoneOrHandle] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Forgot Password Form
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotStep, setForgotStep] = useState<'phone' | 'sent'>('phone');

  // Error & Loading states
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Countdown timer effect for OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOtpTimerActive && otpCountdown > 0) {
      timer = setInterval(() => {
        setOtpCountdown(prev => prev - 1);
      }, 1000);
    } else if (otpCountdown === 0) {
      setIsOtpTimerActive(false);
    }
    return () => clearInterval(timer);
  }, [isOtpTimerActive, otpCountdown]);

  if (!isOpen) return null;

  // Phone operator detector for Algeria
  const getPhoneOperator = (cleanPhone: string) => {
    const raw = cleanPhone.replace(/\s+/g, '').replace('+213', '0');
    if (raw.startsWith('06') || raw.startsWith('6')) {
      return { 
        name: 'موبيليس (Mobilis)', 
        color: 'text-emerald-700 bg-emerald-50 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300',
        badge: 'موبيليس 4G 💚'
      };
    }
    if (raw.startsWith('07') || raw.startsWith('7')) {
      return { 
        name: 'جازي (Djezzy)', 
        color: 'text-rose-700 bg-rose-50 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300',
        badge: 'جازي 4G 🔴'
      };
    }
    if (raw.startsWith('05') || raw.startsWith('5')) {
      return { 
        name: 'أوريدو (Ooredoo)', 
        color: 'text-red-700 bg-red-50 border-red-300 dark:bg-red-950/60 dark:text-red-300',
        badge: 'أوريدو 4G 🛑'
      };
    }
    if (raw.startsWith('02') || raw.startsWith('03') || raw.startsWith('04')) {
      return { 
        name: 'هاتف ثابت جزائري (Fixe Algérie Télécom)', 
        color: 'text-blue-700 bg-blue-50 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300',
        badge: 'اتصالات الجزائر 🔵'
      };
    }
    return null;
  };

  const selectedWilayaObj = ALGERIA_WILAYAS.find(w => w.id === wilayaId) || ALGERIA_WILAYAS[15];
  const detectedOperator = getPhoneOperator(phone);

  // Validate Algerian Phone Number
  const validatePhone = (num: string): { valid: boolean; formatted: string; error?: string } => {
    const clean = num.replace(/[^0-9+]/g, '');
    if (!clean || clean.trim().length === 0) {
      return { valid: false, formatted: '', error: 'رقم الهاتف إلزامي ومطلوب لإنشاء الحساب (Obligatoire)' };
    }

    let standard = clean;
    if (standard.startsWith('+213')) {
      standard = '0' + standard.slice(4);
    }

    if (!standard.match(/^(0)(5|6|7|2|3|4)[0-9]{8}$/)) {
      return { 
        valid: false, 
        formatted: standard, 
        error: 'يرجى إدخال رقم هاتف جزائري صحيح مكون من 10 أرقام (مثال: 0661234567 أو 0550123456 أو 0770123456)' 
      };
    }

    const formatted = `${standard.slice(0, 4)} ${standard.slice(4, 6)} ${standard.slice(6, 8)} ${standard.slice(8, 10)}`;
    return { valid: true, formatted };
  };

  // Password strength calculator
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'فارغة', color: 'bg-slate-200' };
    if (pass.length < 6) return { score: 1, label: 'ضعيفة (أقل من 6 أحرف)', color: 'bg-rose-500 text-rose-500' };
    if (pass.length < 8) return { score: 2, label: 'متوسطة مقبولة', color: 'bg-amber-500 text-amber-500' };
    return { score: 3, label: 'قوية ومحمية ممتاز ✓', color: 'bg-emerald-500 text-emerald-500' };
  };

  const passwordStrength = getPasswordStrength(password);

  // Auto-generate username from name
  const handleNameChange = (val: string) => {
    setName(val);
    if (!handle || handle.startsWith('user_')) {
      const generated = val.trim().toLowerCase()
        .replace(/[^a-zA-Z0-9\u0621-\u064A]/g, '_')
        .replace(/[\u0621-\u064A]/g, '')
        .replace(/__+/g, '_')
        .replace(/^_+|_+$/g, '');
      
      const fallback = generated.length >= 3 
        ? generated 
        : `dz_${Math.floor(1000 + Math.random() * 9000)}`;
      setHandle(fallback);
      setHandleAvailable(true);
    }
  };

  // Check username availability
  const handleHandleChange = (val: string) => {
    const sanitized = val.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();
    setHandle(sanitized);
    if (sanitized.length >= 3) {
      const exists = availableUsers.some(u => u.handle.toLowerCase() === sanitized);
      setHandleAvailable(!exists);
    } else {
      setHandleAvailable(null);
    }
  };

  // Step 1 -> Step 2 Validation
  const handleNextFromStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('يرجى إدخال الاسم واللقب الكامل.');
      sounds.playUnlike();
      return;
    }

    if (!handle.trim() || handle.length < 3) {
      setErrorMsg('اسم المعرف (@المعرف) يجب أن يتكون من 3 أحرف على الأقل باللغة الإنجليزية أو الأرقام.');
      sounds.playUnlike();
      return;
    }

    const phoneCheck = validatePhone(phone);
    if (!phoneCheck.valid) {
      setErrorMsg(phoneCheck.error || 'رقم الهاتف إلزامي لإتمام التسجيل في المنصة.');
      sounds.playUnlike();
      return;
    }

    if (password.length < 6) {
      setErrorMsg('كلمة المرور يجب أن تكون 6 خانات على الأقل لضمان أمان حسابك.');
      sounds.playUnlike();
      return;
    }

    sounds.playVote();
    setCurrentStep(2);
  };

  // Step 2 -> Step 3 Validation
  const handleNextFromStep2 = () => {
    sounds.playVote();
    setCurrentStep(3);
  };

  // Step 3 -> Step 4 (Send SMS OTP)
  const handleNextFromStep3 = () => {
    if (!agreeTerms) {
      setErrorMsg('يرجى الموافقة على شروط الاستخدام لمجتمع fenkDZ الجزائري.');
      sounds.playUnlike();
      return;
    }

    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep(4);
      setOtpCountdown(60);
      setIsOtpTimerActive(true);
      setIsSimulatedSmsBannerVisible(true);
      sounds.playNotification();
    }, 600);
  };

  // Step 4 -> Finalize User Object -> Step 5 (Suggested Accounts)
  const handleVerifyOtp = () => {
    if (otpCode.trim() !== '2130' && otpCode.trim() !== '1234' && otpCode.trim().length < 4) {
      setErrorMsg('رمز التحقق غير صحيح. يمكنك إدخال الرمز التجريبي السريع "2130" للمتابعة.');
      sounds.playUnlike();
      return;
    }

    setIsLoading(true);

    const phoneCheck = validatePhone(phone);
    const finalAvatar = isCustomAvatarInput && customAvatarUrl.trim() 
      ? customAvatarUrl.trim() 
      : selectedAvatar;

    const isBusinessAccount = accountType === 'business';

    const newUserObj: User = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      handle: handle.trim(),
      wilayaId: selectedWilayaObj.id,
      wilayaName: selectedWilayaObj.nameAr,
      municipality: municipality.trim() || selectedWilayaObj.municipalities[0] || 'المركز',
      avatar: finalAvatar,
      coverPhoto: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop&q=80',
      bio: bio.trim() || (isBusinessAccount 
        ? `${businessName || name} - ${businessType} في ولاية ${selectedWilayaObj.nameAr} 🇩🇿 | هاتف: ${phoneCheck.formatted}`
        : `عضو جديد في مجتمع fenkDZ من ولاية ${selectedWilayaObj.nameAr} 🇩🇿`),
      isVerified: true, // Phone-verified
      isBusiness: isBusinessAccount,
      businessName: isBusinessAccount ? (businessName || name) : undefined,
      businessType: isBusinessAccount ? businessType : undefined,
      followersCount: 1,
      followingCount: 4,
      reputationPoints: 150, // Starting bonus for phone verification
      badge: isBusinessAccount ? 'متجر موثق بالهاتف 🏪' : 'مواطن موثق بالهاتف 🇩🇿',
      role: 'user' as UserRole,
      tier: (isBusinessAccount ? 'business' : 'free') as AccountTier,
      phone: phoneCheck.formatted,
      whatsapp: `+213${phoneCheck.formatted.replace(/\s+/g, '').replace(/^0/, '')}`,
      interests: selectedInterests,
      joinedDate: 'اليوم (حساب جديد)'
    };

    setCreatedUser(newUserObj);

    // Pre-select popular accounts to follow
    setSelectedFollows(availableUsers.slice(0, 3).map(u => u.id));

    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep(5);
      sounds.playNotification();
    }, 500);
  };

  // Step 5: Complete onboarding and enter app
  const handleCompleteRegistration = () => {
    if (!createdUser) return;
    const finalUser = {
      ...createdUser,
      followingCount: selectedFollows.length
    };
    sounds.playNotification();
    onLoginSuccess(finalUser);
    onClose();
  };

  // Toggle Interest Tag
  const toggleInterest = (id: string) => {
    setSelectedInterests(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Toggle Follow
  const toggleFollow = (userId: string) => {
    setSelectedFollows(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  // Handle Login Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const rawInput = loginPhoneOrHandle.trim();
    const cleanDigits = rawInput.replace(/[^0-9]/g, '');
    const cleanInput = rawInput.replace(/\s+/g, '').toLowerCase();

    if (!rawInput) {
      setErrorMsg('يرجى إدخال رقم الهاتف أو اسم المستخدم.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      // Check if this is the Master Owner Account (رقم المالك: 0777946398)
      const isOwnerAttempt = 
        cleanDigits === OWNER_PHONE || 
        cleanDigits === `213${OWNER_PHONE.slice(1)}` || 
        cleanInput === 'kimo_owner' ||
        cleanInput === 'owner' ||
        cleanInput === 'kimo';

      if (isOwnerAttempt) {
        if (loginPassword.trim() !== OWNER_PASS) {
          setErrorMsg('كلمة المرور غير صحيحة لحساب المالك العام (0777946398).');
          sounds.playUnlike();
          return;
        }

        sounds.playNotification();
        onLoginSuccess(OWNER_USER);
        onClose();
        return;
      }

      // Standard user lookup
      const foundUser = availableUsers.find(u => 
        (u.phone && u.phone.replace(/[^0-9]/g, '') === cleanDigits) ||
        u.handle.toLowerCase() === cleanInput ||
        u.name.toLowerCase().includes(cleanInput)
      ) || availableUsers[0];

      sounds.playNotification();
      onLoginSuccess(foundUser);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col my-auto max-h-[94vh]">
        
        {/* Simulated Incoming SMS Toast Banner */}
        {isSimulatedSmsBannerVisible && currentStep === 4 && (
          <div className="bg-gradient-to-r from-cyan-600 to-emerald-600 text-white px-4 py-2.5 flex items-center justify-between text-xs animate-in slide-in-from-top-4 shadow-md">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-white/20 text-xs">💬 SMS</span>
              <span><strong>رسالة نصية جديدة من fenkDZ:</strong> رمز تأكيد حسابك هو <strong className="font-mono bg-white text-slate-900 px-1.5 py-0.5 rounded font-black text-sm">2130</strong></span>
            </div>
            <button
              type="button"
              onClick={() => {
                setOtpCode('2130');
                sounds.playVote();
              }}
              className="px-2.5 py-1 rounded-lg bg-white text-slate-900 font-bold hover:bg-white/90 text-[11px] shadow"
            >
              تعبئة الرمز ⚡
            </button>
          </div>
        )}

        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 text-white flex items-center justify-between border-b border-slate-800 relative">
          <div className="flex items-center gap-3">
            <FenkLogo size="sm" showSubtitle={false} />
            <div>
              <h3 className="font-black text-base sm:text-lg flex items-center gap-2">
                <span>{mode === 'register' ? 'إنشاء حساب جديد (Sign Up)' : mode === 'login' ? 'تسجيل الدخول (Log In)' : 'استعادة الحساب'}</span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded-full font-sans">
                  🇩🇿 شبكة الـ 69 ولاية
                </span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                {mode === 'register' 
                  ? 'انضم لمنصة التواصل والتجارة الجزائرية الموثقة برقم الهاتف' 
                  : 'أهلاً بك مجدداً في مجتمع fenkDZ'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition active:scale-95"
            title="إغلاق النافذة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Mode Tabs Switcher */}
        <div className="p-1.5 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex gap-1">
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg('');
            }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition ${
              mode === 'register'
                ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-sm border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-500" />
            <span>إنشاء حساب جديد (تسجيل)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition ${
              mode === 'login'
                ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-sm border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <KeyRound className="w-4 h-4 text-amber-500" />
            <span>تسجيل الدخول / الحسابات</span>
          </button>
        </div>

        {/* ================= REGISTER WIZARD STEPPER ================= */}
        {mode === 'register' && (
          <div className="px-5 pt-3 pb-2 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1.5">
              <span>الخطوة {currentStep} من 5</span>
              <span className="text-cyan-600 dark:text-cyan-400">
                {currentStep === 1 && '1. البيانات الأساسية والهاتف'}
                {currentStep === 2 && '2. تخصيص الملف والولاية'}
                {currentStep === 3 && '3. نوع الحساب (شخصي / تجاري)'}
                {currentStep === 4 && '4. تأكيد رمز SMS'}
                {currentStep === 5 && '5. المتابعة ومبروك الانضمام!'}
              </span>
            </div>
            {/* Visual Step Progress Bar */}
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 text-right">
          
          {/* Error Message Box */}
          {errorMsg && (
            <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-2.5 animate-shake">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ================= MODE: REGISTER MULTI-STEP WIZARD ================= */}
          {mode === 'register' && (
            <div>
              
              {/* STEP 1: Basic Credentials */}
              {currentStep === 1 && (
                <form onSubmit={handleNextFromStep1} className="space-y-4">
                  
                  {/* Phone Notice Banner */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-50 to-emerald-50 dark:from-cyan-950/40 dark:to-emerald-950/30 border border-cyan-200 dark:border-cyan-800/60 text-slate-800 dark:text-slate-200 text-xs flex items-start gap-2.5">
                    <ShieldCheck className="w-5 h-5 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold text-cyan-950 dark:text-cyan-200 block">
                        توثيق الحساب بالهاتف الجزائري إلزامي 🇩🇿
                      </strong>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                        مثل كبرى شبكات التواصل، رقم الهاتف مطلوب لضمان أمان حسابك ومنع الحسابات الوهمية وتفعيل الاتصال وخدمات الـ WhatsApp المباشرة.
                      </p>
                    </div>
                  </div>

                  {/* 1. Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      الاسم واللقب الكامل <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        placeholder="مثال: يوسف بن سالم أو متجر الهضاب"
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:border-cyan-500 text-slate-900 dark:text-white"
                      />
                      <UserIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  {/* 2. Username Handle */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        اسم المعرف الفريد (@username) <span className="text-rose-500">*</span>
                      </label>
                      {handleAvailable !== null && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          handleAvailable 
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' 
                            : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                        }`}>
                          {handleAvailable ? 'المعرف متاح للاستخدام ✓' : 'المعرف مستخدم من قبل'}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={handle}
                        onChange={(e) => handleHandleChange(e.target.value)}
                        placeholder="youcef_dz"
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                        dir="ltr"
                      />
                      <AtSign className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      سيكون رابط ملفك الشخصي: fenkdz.com/@{handle || 'username'}
                    </p>
                  </div>

                  {/* 3. Mandatory Algerian Mobile Phone */}
                  <div className="p-3.5 rounded-2xl bg-cyan-50/60 dark:bg-cyan-950/30 border-2 border-cyan-300 dark:border-cyan-700/80 shadow-2xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-black text-cyan-950 dark:text-cyan-200 flex items-center gap-1.5">
                        <Phone className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                        <span>رقم الهاتف الجزائري (إلزامي ومطلوب)</span>
                        <span className="text-rose-500 font-black text-sm">*</span>
                      </label>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-200 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200">
                        التحقق الفوري 🇩🇿
                      </span>
                    </div>

                    <div className="flex items-center gap-2" dir="ltr">
                      <div className="px-3 py-3 rounded-xl bg-white dark:bg-slate-900 border border-cyan-300 dark:border-cyan-700 font-mono font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 flex items-center gap-1.5 shrink-0 select-none">
                        <span>🇩🇿</span>
                        <span>+213</span>
                      </div>

                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          setErrorMsg('');
                        }}
                        placeholder="05 / 06 / 07 XX XX XX"
                        className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-cyan-300 dark:border-cyan-700 font-mono font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900 dark:text-white"
                      />
                    </div>

                    {detectedOperator && (
                      <div className="mt-2.5 flex items-center justify-between text-[11px] font-bold">
                        <span className={`px-2.5 py-1 rounded-lg border text-[10px] ${detectedOperator.color}`}>
                          المتعامل: {detectedOperator.badge}
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>رقم هاتف جزائري صحيح</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 4. Password with Strength Indicator */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        كلمة المرور <span className="text-rose-500">*</span>
                      </label>
                      {password && (
                        <span className={`text-[10px] font-bold ${passwordStrength.color}`}>
                          قوة كلمة السر: {passwordStrength.label}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="أدخل 6 أحرف أو أرقام على الأقل"
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-bold text-sm shadow-lg shadow-cyan-600/20 transition flex items-center justify-center gap-2"
                  >
                    <span>المتابعة إلى تخصيص الملف والولاية</span>
                    <ArrowRight className="w-4 h-4 rotate-180" />
                  </button>
                </form>
              )}

              {/* STEP 2: Algerian Location & Profile Customization */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Camera className="w-4 h-4 text-cyan-500" />
                    <span>اختر صورتك الرمزية وموقعك في الجزائر</span>
                  </h4>

                  {/* Avatar Picker Gallery */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                      اختر صورتك الشخصية الرمزية:
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {PRESET_AVATARS.map((av) => {
                        const isSelected = !isCustomAvatarInput && selectedAvatar === av.url;
                        return (
                          <button
                            key={av.id}
                            type="button"
                            onClick={() => {
                              setSelectedAvatar(av.url);
                              setIsCustomAvatarInput(false);
                              sounds.playVote();
                            }}
                            className={`p-1.5 rounded-2xl border-2 transition flex flex-col items-center gap-1 ${
                              isSelected
                                ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/60 scale-105 shadow-sm'
                                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                            }`}
                          >
                            <img
                              src={av.url}
                              alt={av.label}
                              className="w-11 h-11 rounded-xl object-cover"
                            />
                            <span className="text-[9px] font-bold text-slate-600 dark:text-slate-300 truncate w-full text-center">
                              {av.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Custom Avatar URL Toggle */}
                    <div className="mt-2.5">
                      <button
                        type="button"
                        onClick={() => setIsCustomAvatarInput(!isCustomAvatarInput)}
                        className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
                      >
                        {isCustomAvatarInput ? '✕ العودة لاختيار الصور الجاهزة' : '+ استخدام رابط صورة خارجية مخصصة'}
                      </button>

                      {isCustomAvatarInput && (
                        <input
                          type="url"
                          value={customAvatarUrl}
                          onChange={(e) => setCustomAvatarUrl(e.target.value)}
                          placeholder="https://example.com/photo.jpg"
                          className="w-full mt-1.5 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono"
                        />
                      )}
                    </div>
                  </div>

                  {/* Wilaya and Municipality */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        الولاية (من الـ 69 ولاية) <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={wilayaId}
                        onChange={(e) => setWilayaId(Number(e.target.value))}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                      >
                        {ALGERIA_WILAYAS.map((w) => (
                          <option key={w.id} value={w.id}>
                            {w.code} - ولاية {w.nameAr} ({w.region})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        البلدية أو الدائرة
                      </label>
                      <input
                        type="text"
                        value={municipality}
                        onChange={(e) => setMunicipality(e.target.value)}
                        placeholder={`مثال: ${selectedWilayaObj.municipalities[0] || 'المركز'}`}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  {/* Bio & One-Click Templates */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        النبذة التعريفية (Bio):
                      </label>
                      <span className="text-[10px] text-slate-400">تظهر في ملفك الشخصي</span>
                    </div>
                    <textarea
                      rows={2}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="اكتب نبذة قصيرة عنك أو اهتماماتك بالولاية..."
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                    />

                    {/* Pre-made bio suggestions */}
                    <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                      {BIO_TEMPLATES.map((tmpl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setBio(tmpl)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 text-[10px] text-slate-600 dark:text-slate-300 whitespace-nowrap border border-slate-200 dark:border-slate-700"
                        >
                          + {tmpl.slice(0, 30)}...
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Algerian Interests Tags */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                      اختر اهتماماتك المفضلة (تخصيص خلاصتك):
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {ALGERIAN_INTERESTS.map((interest) => {
                        const isSelected = selectedInterests.includes(interest.id);
                        return (
                          <button
                            key={interest.id}
                            type="button"
                            onClick={() => toggleInterest(interest.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                              isSelected
                                ? 'bg-cyan-600 text-white shadow-xs'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                            }`}
                          >
                            <span>{interest.label}</span>
                            {isSelected && <Check className="w-3 h-3" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Stepper Buttons */}
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200"
                    >
                      <ArrowLeft className="w-4 h-4 inline ml-1 rotate-180" />
                      <span>السابق</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleNextFromStep2}
                      className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2"
                    >
                      <span>المتابعة إلى نوع الحساب</span>
                      <ArrowRight className="w-4 h-4 rotate-180" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Account Classification */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-amber-500" />
                    <span>حدد نوع الحساب الذي ترغب في إنشائه</span>
                  </h4>

                  {/* Two Main Cards: Personal vs Business */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    {/* 1. Personal Citizen Account */}
                    <div
                      onClick={() => {
                        setAccountType('personal');
                        sounds.playVote();
                      }}
                      className={`p-4 rounded-3xl border-2 cursor-pointer transition relative ${
                        accountType === 'personal'
                          ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/40 shadow-md'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center mb-2 font-bold text-lg">
                        👤
                      </div>
                      <h5 className="font-black text-sm text-slate-900 dark:text-white mb-1">
                        حساب مواطن / شخصي
                      </h5>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        للتفاعل اليومي، نشر اللحظات والقصص، التصويت في استطلاعات صوت المجتمع، والدردشة مع أبناء الولايات.
                      </p>
                      {accountType === 'personal' && (
                        <div className="absolute top-3 left-3 bg-cyan-600 text-white p-1 rounded-full text-xs">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    {/* 2. Business Account */}
                    <div
                      onClick={() => {
                        setAccountType('business');
                        sounds.playVote();
                      }}
                      className={`p-4 rounded-3xl border-2 cursor-pointer transition relative ${
                        accountType === 'business'
                          ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/40 shadow-md'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-2 font-bold text-lg">
                        🏪
                      </div>
                      <h5 className="font-black text-sm text-slate-900 dark:text-white mb-1">
                        حساب نشاط تجاري / متجر
                      </h5>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        للمتاجر، سائقي FUNK TAXI، الحرفيين، والمؤسسات. عرض المنتجات في السوق بالدينار مع زر WhatsApp المباشر.
                      </p>
                      {accountType === 'business' && (
                        <div className="absolute top-3 left-3 bg-amber-600 text-white p-1 rounded-full text-xs">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Business Extra Fields */}
                  {accountType === 'business' && (
                    <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 space-y-3 animate-in fade-in">
                      <div>
                        <label className="block text-xs font-bold text-amber-950 dark:text-amber-200 mb-1">
                          اسم المتجر أو المؤسسة التجارية:
                        </label>
                        <input
                          type="text"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder="مثال: تمور الصحراء دقلة نور أو ورشة النجارة العصرية"
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-amber-950 dark:text-amber-200 mb-1">
                          طبيعة النشاط أو الخدمة:
                        </label>
                        <input
                          type="text"
                          value={businessType}
                          onChange={(e) => setBusinessType(e.target.value)}
                          placeholder="مثال: بيع قطع الغيار، كراء سيارات، مطعم ومأكولات، نقل..."
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 text-xs"
                        />
                      </div>
                    </div>
                  )}

                  {/* Terms & Code of Conduct */}
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-400 select-none pt-2">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500"
                    />
                    <span>أوافق على ميثاق الاستخدام الأخلاقي والتجاري لمجتمع fenkDZ الجزائري 🇩🇿</span>
                  </label>

                  {/* Stepper Buttons */}
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200"
                    >
                      <ArrowLeft className="w-4 h-4 inline ml-1 rotate-180" />
                      <span>السابق</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleNextFromStep3}
                      disabled={isLoading}
                      className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <span>جارٍ إرسال رمز SMS...</span>
                      ) : (
                        <>
                          <span>إرسال رمز التحقق (SMS) إلى الهاتف</span>
                          <ArrowRight className="w-4 h-4 rotate-180" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: SMS OTP Verification */}
              {currentStep === 4 && (
                <div className="space-y-4 text-center">
                  <div className="w-16 h-16 rounded-3xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-300 flex items-center justify-center mx-auto shadow-inner">
                    <Smartphone className="w-8 h-8 animate-bounce" />
                  </div>

                  <div>
                    <h4 className="font-black text-lg text-slate-900 dark:text-white">
                      تأكيد رقم الهاتف الجزائري عبر SMS
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      تم إرسال رمز التحقق إلى رقمك: <strong className="text-cyan-600 font-mono" dir="ltr">{phone}</strong>
                    </p>
                  </div>

                  {/* Quick Fill helper */}
                  <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <span>💡 رمز التحقق السريع للتجربة:</span>
                    <button
                      type="button"
                      onClick={() => setOtpCode('2130')}
                      className="px-3 py-1 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-mono font-bold text-xs shadow-xs"
                    >
                      2130 (تعبئة فورية) ⚡
                    </button>
                  </div>

                  {/* 4-Box / Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                      أدخل رمز التحقق (4 أرقام):
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="2130"
                      className="w-48 text-center px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-cyan-400 text-2xl font-mono font-black tracking-widest text-slate-900 dark:text-white mx-auto focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  {/* Timer & Resend */}
                  <div className="text-xs text-slate-500">
                    {otpCountdown > 0 ? (
                      <span>إعادة إرسال الرمز بعد: <strong className="font-mono text-cyan-600">{otpCountdown} ثانية</strong></span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setOtpCountdown(60);
                          setIsOtpTimerActive(true);
                          sounds.playNotification();
                        }}
                        className="font-bold text-cyan-600 hover:underline flex items-center gap-1 mx-auto"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>إعادة إرسال رمز الـ SMS مجدداً</span>
                      </button>
                    )}
                  </div>

                  {/* Stepper Buttons */}
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200"
                    >
                      تعديل الرقم
                    </button>
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={isLoading}
                      className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span>تأكيد الرمز وإنشاء الحساب</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: Social Onboarding (Follow Suggestions & Welcome) */}
              {currentStep === 5 && (
                <div className="space-y-4 text-center animate-in zoom-in-95">
                  
                  {/* Confetti & Trophy icon */}
                  <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center mx-auto shadow-lg text-2xl font-black">
                    🎉
                  </div>

                  <div>
                    <h4 className="font-black text-xl text-slate-900 dark:text-white">
                      مبارك! تم إنشاء وتوثيق حسابك بنجاح 🇩🇿
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      أهلاً بك يا <strong className="text-slate-900 dark:text-white">{name}</strong> (@{handle}) في ولاية {selectedWilayaObj.nameAr}!
                    </p>
                  </div>

                  {/* Reputation Bonus Badge */}
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-300 dark:border-emerald-700 text-xs font-bold text-emerald-800 dark:text-emerald-200 flex items-center justify-center gap-2">
                    <Award className="w-5 h-5 text-emerald-600" />
                    <span>تمت إضافة <strong>+150 نقطة سمعة وترحيب</strong> لحسابك الموثق بالهاتف!</span>
                  </div>

                  {/* Follow Suggestions */}
                  <div className="text-right pt-1">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                        حسابات مقترحة لبدء التفاعل معها:
                      </h5>
                      <button
                        type="button"
                        onClick={() => {
                          if (selectedFollows.length === availableUsers.length) {
                            setSelectedFollows([]);
                          } else {
                            setSelectedFollows(availableUsers.map(u => u.id));
                          }
                        }}
                        className="text-[11px] font-bold text-cyan-600 hover:underline"
                      >
                        {selectedFollows.length === availableUsers.length ? 'إلغاء تحديد الكل' : 'متابعة الكل ✓'}
                      </button>
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto p-1">
                      {availableUsers.slice(0, 4).map((suggested) => {
                        const isFollowing = selectedFollows.includes(suggested.id);
                        return (
                          <div
                            key={suggested.id}
                            className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img
                                src={suggested.avatar}
                                alt={suggested.name}
                                className="w-9 h-9 rounded-xl object-cover"
                              />
                              <div className="min-w-0">
                                <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                  {suggested.name}
                                </p>
                                <p className="text-[10px] text-slate-500 truncate">
                                  @{suggested.handle} • ولاية {suggested.wilayaName}
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => toggleFollow(suggested.id)}
                              className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                                isFollowing
                                  ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                                  : 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-xs'
                              }`}
                            >
                              {isFollowing ? 'متابع ✓' : '+ متابعة'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Final Button */}
                  <button
                    type="button"
                    onClick={handleCompleteRegistration}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:opacity-95 text-white font-black text-sm shadow-xl transition active:scale-95"
                  >
                    <span>الدخول إلى fenkDZ واستكشاف المنشورات 🚀</span>
                  </button>
                </div>
              )}

            </div>
          )}

          {/* ================= MODE: LOGIN FLOW ================= */}
          {mode === 'login' && (
            <div className="space-y-4">
              
              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    رقم الهاتف الجزائري أو اسم المستخدم (@handle)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={loginPhoneOrHandle}
                      onChange={(e) => setLoginPhoneOrHandle(e.target.value)}
                      placeholder="0777 94 63 98 أو @username"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                    />
                    <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      كلمة المرور
                    </label>
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[11px] text-cyan-600 dark:text-cyan-400 hover:underline"
                    >
                      نسيت كلمة المرور؟
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute left-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{isLoading ? 'جارٍ تسجيل الدخول...' : 'تسجيل الدخول إلى حسابي'}</span>
                </button>
              </form>

              {/* Quick Account Switcher */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-500 mb-2">أو التبديل السريع بين الحسابات المسجلة:</p>
                <div className="space-y-2 max-h-36 overflow-y-auto">
                  {availableUsers.slice(0, 4).map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        sounds.playVote();
                        onLoginSuccess(u);
                        onClose();
                      }}
                      className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-right transition"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-lg object-cover" />
                        <div className="min-w-0">
                          <span className="font-bold text-xs text-slate-900 dark:text-white block truncate">{u.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono">@{u.handle}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-cyan-600 bg-cyan-50 dark:bg-cyan-950/60 px-2 py-0.5 rounded">
                        دخول ⚡
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ================= MODE: FORGOT PASSWORD ================= */}
          {mode === 'forgot' && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 mx-auto flex items-center justify-center mb-2">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  استعادة كلمة المرور عبر SMS
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  أدخل رقم هاتفك الجزائري المسجل وسنرسل لك رمز إعادة تعيين كلمة المرور فوراً.
                </p>
              </div>

              {forgotStep === 'phone' ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      رقم الهاتف الجزائري:
                    </label>
                    <input
                      type="tel"
                      value={forgotPhone}
                      onChange={(e) => setForgotPhone(e.target.value)}
                      placeholder="05 / 06 / 07 XX XX XX"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!forgotPhone.trim()) {
                        setErrorMsg('يرجى إدخال رقم هاتفك.');
                        return;
                      }
                      setForgotStep('sent');
                      sounds.playNotification();
                    }}
                    className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow transition"
                  >
                    إرسال رمز الاستعادة (SMS)
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="text-xs font-bold text-emerald-800 dark:text-emerald-200">
                    تم إرسال رمز الاستعادة المؤقت عبر رسالة نصية قصيرة SMS.
                  </p>
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                  >
                    العودة لتسجيل الدخول
                  </button>
                </div>
              )}

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-bold"
                >
                  ✕ إلغاء والعودة لتسجيل الدخول
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Bottom */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-center text-[11px] text-slate-500 flex items-center justify-between px-5">
          <span>fenkDZ الجزائر 🇩🇿 • شبكة اجتماعية محلية</span>
          <span className="font-mono font-bold text-cyan-600">69 Wilayas Network</span>
        </div>

      </div>
    </div>
  );
};
