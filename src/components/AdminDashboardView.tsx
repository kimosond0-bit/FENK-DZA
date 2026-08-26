import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  MapPin, 
  ShoppingBag, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  DollarSign, 
  BarChart2, 
  TrendingUp,
  Activity,
  Vote,
  Sparkles,
  UserPlus,
  Trash2,
  Crown,
  Award,
  Phone,
  Search,
  Filter,
  Check,
  Ban,
  Building2,
  Lock,
  Plus,
  RefreshCw,
  Edit3
} from 'lucide-react';
import { ReportItem, User, Post, UserRole, AccountTier } from '../types';
import { ALGERIA_WILAYAS } from '../data/wilayas';
import { OWNER_PHONE } from '../data/initialData';
import { sounds } from '../utils/soundEffects';

interface AdminDashboardViewProps {
  currentUser: User;
  users: User[];
  posts: Post[];
  reports: ReportItem[];
  onAddUser: (newUser: User) => void;
  onDeleteUser: (userId: string) => void;
  onUpdateUserRole: (userId: string, newRole: UserRole) => void;
  onToggleSupremeBadge: (userId: string) => void;
  onToggleVerifyUser: (userId: string) => void;
  onToggleBanUser: (userId: string) => void;
  onUpdateUserPoints: (userId: string, points: number) => void;
  onResolveReport: (reportId: string, action: 'dismissed' | 'resolved') => void;
  onOpenAuthModal?: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  currentUser,
  users,
  posts,
  reports,
  onAddUser,
  onDeleteUser,
  onUpdateUserRole,
  onToggleSupremeBadge,
  onToggleVerifyUser,
  onToggleBanUser,
  onUpdateUserPoints,
  onResolveReport,
  onOpenAuthModal,
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'overview' | 'moderation' | 'wilayas' | 'monetization'>('users');
  
  // Search & Filters for Users Tab
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [badgeFilter, setBadgeFilter] = useState<string>('all');
  const [wilayaFilter, setWilayaFilter] = useState<number | 'all'>('all');

  // Add User Modal State
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserHandle, setNewUserHandle] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserWilayaId, setNewUserWilayaId] = useState<number>(16); // Algiers default
  const [newUserMunicipality, setNewUserMunicipality] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('user');
  const [newUserHasSupreme, setNewUserHasSupreme] = useState(false);
  const [newUserIsBusiness, setNewUserIsBusiness] = useState(false);
  const [newUserBusinessName, setNewUserBusinessName] = useState('');
  const [newUserReputation, setNewUserReputation] = useState(250);
  const [newUserError, setNewUserError] = useState('');

  // Delete Confirmation State
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Points Edit Modal State
  const [pointsEditUser, setPointsEditUser] = useState<User | null>(null);
  const [customPoints, setCustomPoints] = useState<number>(0);

  const cleanCurrentPhone = currentUser.phone ? currentUser.phone.replace(/[^0-9]/g, '') : '';
  const isOwner = cleanCurrentPhone === OWNER_PHONE || cleanCurrentPhone === `213${OWNER_PHONE.slice(1)}` || currentUser.role === 'owner';

  const pendingReports = reports.filter(r => r.status === 'pending');

  // Filtered Users List
  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.phone && u.phone.includes(searchQuery)) ||
      u.wilayaName.includes(searchQuery);

    const matchesRole = roleFilter === 'all' ? true : u.role === roleFilter;
    const matchesWilaya = wilayaFilter === 'all' ? true : u.wilayaId === wilayaFilter;
    
    let matchesBadge = true;
    if (badgeFilter === 'supreme') matchesBadge = !!u.hasSupremeBadge;
    if (badgeFilter === 'verified') matchesBadge = u.isVerified;
    if (badgeFilter === 'business') matchesBadge = u.isBusiness;
    if (badgeFilter === 'banned') matchesBadge = !!u.isBanned;

    return matchesSearch && matchesRole && matchesWilaya && matchesBadge;
  });

  // Calculate Statistics
  const supremeCount = users.filter(u => u.hasSupremeBadge).length;
  const verifiedCount = users.filter(u => u.isVerified).length;
  const businessCount = users.filter(u => u.isBusiness).length;
  const bannedCount = users.filter(u => u.isBanned).length;

  // Handle Add User Submit
  const handleCreateUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNewUserError('');

    if (!newUserName.trim()) {
      setNewUserError('يرجى إدخال اسم ولقب المستخدم.');
      return;
    }

    const cleanPhone = newUserPhone.trim().replace(/[^0-9]/g, '');
    if (cleanPhone.length < 9) {
      setNewUserError('يرجى إدخال رقم هاتف جزائري صحيح مكون من 10 أرقام.');
      return;
    }

    const wilayaObj = ALGERIA_WILAYAS.find(w => w.id === newUserWilayaId) || ALGERIA_WILAYAS[15];
    const generatedHandle = newUserHandle.trim() 
      ? newUserHandle.trim().replace(/[^a-zA-Z0-9_]/g, '').toLowerCase()
      : newUserName.trim().toLowerCase().replace(/\s+/g, '_') + '_' + Math.floor(Math.random() * 899 + 100);

    const formattedPhone = `${cleanPhone.slice(0, 4)} ${cleanPhone.slice(4, 6)} ${cleanPhone.slice(6, 8)} ${cleanPhone.slice(8, 10)}`;

    const newUserObj: User = {
      id: `usr_${Date.now()}`,
      name: newUserName.trim(),
      handle: generatedHandle,
      wilayaId: wilayaObj.id,
      wilayaName: wilayaObj.nameAr,
      municipality: newUserMunicipality.trim() || wilayaObj.municipalities[0] || 'المركز',
      avatar: newUserIsBusiness
        ? 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      coverPhoto: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop&q=80',
      bio: newUserIsBusiness
        ? `${newUserBusinessName || newUserName} - نشاط تجاري في ولاية ${wilayaObj.nameAr} 🇩🇿 | هاتف: ${formattedPhone}`
        : `عضو مسجل في منصة fenkDZ من ولاية ${wilayaObj.nameAr} 🇩🇿`,
      isVerified: true,
      isBusiness: newUserIsBusiness,
      businessName: newUserIsBusiness ? (newUserBusinessName || newUserName) : undefined,
      businessType: newUserIsBusiness ? 'نشاط تجاري معتمد' : undefined,
      followersCount: 12,
      followingCount: 15,
      reputationPoints: Number(newUserReputation) || 300,
      badge: newUserHasSupreme ? '👑 شارة الفنك العليا' : (newUserIsBusiness ? 'متجر موثق 🏪' : 'مواطن نشط ⭐'),
      hasSupremeBadge: newUserHasSupreme,
      role: newUserRole,
      tier: newUserIsBusiness ? 'business' : 'premium',
      phone: formattedPhone,
      whatsapp: `+213${cleanPhone.replace(/^0/, '')}`,
      joinedDate: 'اليوم (بواسطة المالك)'
    };

    onAddUser(newUserObj);
    sounds.playNotification();
    setIsAddUserModalOpen(false);

    // Reset Form
    setNewUserName('');
    setNewUserHandle('');
    setNewUserPhone('');
    setNewUserMunicipality('');
    setNewUserRole('user');
    setNewUserHasSupreme(false);
    setNewUserIsBusiness(false);
    setNewUserBusinessName('');
    setNewUserReputation(250);
  };

  // Confirm and delete user
  const handleConfirmDelete = () => {
    if (!userToDelete) return;
    if (userToDelete.role === 'owner' || userToDelete.phone?.replace(/[^0-9]/g, '') === OWNER_PHONE) {
      alert('لا يمكن حذف حساب المالك الأساسي للمنصة!');
      setUserToDelete(null);
      return;
    }

    onDeleteUser(userToDelete.id);
    sounds.playUnlike();
    setUserToDelete(null);
  };

  // Save updated points
  const handleSavePoints = () => {
    if (!pointsEditUser) return;
    onUpdateUserPoints(pointsEditUser.id, customPoints);
    sounds.playVote();
    setPointsEditUser(null);
  };

  // Access Restriction Guard
  if (!isOwner) {
    return (
      <div className="p-6 sm:p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 dark:border-rose-900/60 shadow-xl space-y-4 max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto text-2xl">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white">
          منطقة محصورة لمالك المنصة فقط 👑
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          لوحة التحكم العليا لإدارة الحسابات والشارة العليا متاحة حصرياً للحساب المسجل برقم الهاتف المعتمد <span className="font-mono font-bold text-rose-600" dir="ltr">{OWNER_PHONE}</span> وكلمة المرور الخاصة.
        </p>

        {onOpenAuthModal && (
          <button
            type="button"
            onClick={onOpenAuthModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition"
          >
            <Crown className="w-4 h-4" />
            <span>تسجيل الدخول بحساب المالك (0777946398)</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      
      {/* Owner Top Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white rounded-3xl p-5 sm:p-6 border border-amber-500/30 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-xs bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full font-black border border-amber-500/40 flex items-center gap-1.5 shadow-xs">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>لوحة تحكم المالك العام (Super Admin Center)</span>
            </span>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full font-bold">
              الهاتف الموثق: {OWNER_PHONE} 🇩🇿
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>إدارة وتوجيه كافة حسابات منصة fenkDZ</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            التحكم الكامل للمالك: إضافة مستخدمين جدد، حذف الحسابات، ترقية الأدوار والمشرفين، ومنح وسحب <strong className="text-amber-300">شارة الفنك العليا 👑</strong> عبر الـ 69 ولاية.
          </p>
        </div>

        <div className="flex items-center gap-2.5 relative z-10 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setIsAddUserModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg transition active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ إضافة حساب جديد</span>
          </button>
        </div>
      </div>

      {/* Quick Statistics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        <div className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
          <span className="text-[11px] text-slate-500 font-bold block mb-0.5">إجمالي الحسابات</span>
          <p className="text-xl font-black text-slate-900 dark:text-white font-mono">{users.length}</p>
          <span className="text-[10px] text-cyan-600 font-bold">مستخدم نشط</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-amber-200 dark:border-amber-900/50 shadow-2xs">
          <span className="text-[11px] text-amber-700 dark:text-amber-400 font-bold block mb-0.5 flex items-center gap-1">
            <Crown className="w-3 h-3" />
            <span>الشارة العليا</span>
          </span>
          <p className="text-xl font-black text-amber-600 font-mono">{supremeCount}</p>
          <span className="text-[10px] text-amber-600 font-bold">شارة ممنوحة 👑</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 shadow-2xs">
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold block mb-0.5 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>الحسابات الموثقة</span>
          </span>
          <p className="text-xl font-black text-emerald-600 font-mono">{verifiedCount}</p>
          <span className="text-[10px] text-emerald-600 font-bold">بالهاتف والبطاقة ✓</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-teal-200 dark:border-teal-900/50 shadow-2xs">
          <span className="text-[11px] text-teal-700 dark:text-teal-400 font-bold block mb-0.5 flex items-center gap-1">
            <Building2 className="w-3 h-3" />
            <span>المتاجر والخدمات</span>
          </span>
          <p className="text-xl font-black text-teal-600 font-mono">{businessCount}</p>
          <span className="text-[10px] text-teal-600 font-bold">نشاط تجاري 🏪</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-rose-200 dark:border-rose-900/50 shadow-2xs col-span-2 sm:col-span-1">
          <span className="text-[11px] text-rose-700 dark:text-rose-400 font-bold block mb-0.5 flex items-center gap-1">
            <Ban className="w-3 h-3" />
            <span>المحظورين</span>
          </span>
          <p className="text-xl font-black text-rose-600 font-mono">{bannedCount}</p>
          <span className="text-[10px] text-rose-600 font-bold">حساب مجمد ⛔</span>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-1.5 border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center gap-1 overflow-x-auto">
        {[
          { id: 'users', label: `إدارة كافة الحسابات (${filteredUsers.length})`, icon: Users },
          { id: 'moderation', label: `طابور البلاغات (${pendingReports.length})`, icon: AlertTriangle },
          { id: 'overview', label: 'المؤشرات والنمو', icon: Activity },
          { id: 'wilayas', label: 'نشاط الـ 69 ولاية', icon: MapPin },
          { id: 'monetization', label: 'المعاملات المالية (DZD)', icon: DollarSign },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                isActive
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: USERS MANAGEMENT ================= */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          
          {/* Search & Filter Toolbar */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-700 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث بالاسم، @المعرف، الهاتف، أو الولاية..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
              {/* Role filter */}
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="all">كافة الأدوار</option>
                <option value="owner">المالك العام 👑</option>
                <option value="superadmin">نائب المالك (Super Admin)</option>
                <option value="admin">مسؤول (Admin)</option>
                <option value="moderator">مشرف (Moderator)</option>
                <option value="user">مستخدم عادي</option>
              </select>

              {/* Badge filter */}
              <select
                value={badgeFilter}
                onChange={(e) => setBadgeFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="all">كافة الشارات</option>
                <option value="supreme">الشارة العليا فقط 👑</option>
                <option value="verified">الموثقين فقط ✓</option>
                <option value="business">المتاجر والأنشطة 🏪</option>
                <option value="banned">المحظورين ⛔</option>
              </select>

              {/* Wilaya filter */}
              <select
                value={wilayaFilter}
                onChange={(e) => setWilayaFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="all">كل الـ 69 ولاية</option>
                {ALGERIA_WILAYAS.map(w => (
                  <option key={w.id} value={w.id}>{w.code} - {w.nameAr}</option>
                ))}
              </select>
            </div>
          </div>

          {/* User Cards / List */}
          <div className="space-y-3">
            {filteredUsers.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-400">
                <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="text-sm font-bold">لا يوجد مستخدمون يطابقون خيارات البحث الحالية.</p>
              </div>
            ) : (
              filteredUsers.map((user) => {
                const isUserOwner = user.role === 'owner' || user.phone?.replace(/[^0-9]/g, '') === OWNER_PHONE;
                
                return (
                  <div
                    key={user.id}
                    className={`p-4 rounded-3xl bg-white dark:bg-slate-800 border transition-all ${
                      user.isBanned 
                        ? 'border-rose-300 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/20' 
                        : user.hasSupremeBadge 
                          ? 'border-amber-400 dark:border-amber-500/60 bg-amber-50/20 dark:bg-amber-950/10 shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 shadow-2xs hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                      
                      {/* User Info Column */}
                      <div className="flex items-start gap-3.5 min-w-0">
                        <div className="relative shrink-0">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-13 h-13 rounded-2xl object-cover border-2 border-slate-200 dark:border-slate-700"
                          />
                          {user.hasSupremeBadge && (
                            <span className="absolute -top-2 -right-2 bg-gradient-to-tr from-amber-500 to-amber-300 text-white p-1 rounded-full shadow-md text-xs" title="حامل الشارة العليا">
                              👑
                            </span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                              {user.name}
                            </h4>
                            
                            {user.isVerified && (
                              <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" title="موثق بالهاتف" />
                            )}

                            {user.hasSupremeBadge && (
                              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] font-black border border-amber-500/30 flex items-center gap-1">
                                <Crown className="w-3 h-3 text-amber-500" />
                                <span>الشارة العليا</span>
                              </span>
                            )}

                            {/* Role Badge */}
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              user.role === 'owner' 
                                ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-300'
                                : user.role === 'superadmin'
                                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                                  : user.role === 'admin'
                                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                                    : user.role === 'moderator'
                                      ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                            }`}>
                              {user.role === 'owner' ? '👑 المالك العام' :
                               user.role === 'superadmin' ? 'نائب المالك' :
                               user.role === 'admin' ? 'مسؤول (Admin)' :
                               user.role === 'moderator' ? 'مشرف (Mod)' : 'مستخدم'}
                            </span>

                            {user.isBanned && (
                              <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-bold flex items-center gap-0.5">
                                <Ban className="w-3 h-3" />
                                <span>محظور</span>
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400 flex-wrap font-mono">
                            <span>@{user.handle}</span>
                            <span>•</span>
                            <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1 font-sans">
                              <MapPin className="w-3 h-3 text-emerald-500" />
                              ولاية {user.wilayaName} ({user.municipality || 'المركز'})
                            </span>
                            {user.phone && (
                              <>
                                <span>•</span>
                                <span className="text-cyan-700 dark:text-cyan-300 flex items-center gap-1 font-mono font-bold" dir="ltr">
                                  <Phone className="w-3 h-3 text-cyan-500" />
                                  {user.phone}
                                </span>
                              </>
                            )}
                          </div>

                          {/* Bio and metadata */}
                          {user.bio && (
                            <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 line-clamp-1 max-w-xl">
                              {user.bio}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Control Actions Row */}
                      <div className="flex items-center gap-1.5 flex-wrap w-full lg:w-auto justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100 dark:border-slate-700/60">
                        
                        {/* 1. Supreme Badge Toggle */}
                        <button
                          type="button"
                          onClick={() => onToggleSupremeBadge(user.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                            user.hasSupremeBadge
                              ? 'bg-amber-100 hover:bg-amber-200 dark:bg-amber-950 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-200 border border-amber-300'
                              : 'bg-slate-100 hover:bg-amber-50 dark:bg-slate-700 dark:hover:bg-amber-950/40 text-slate-700 dark:text-slate-300'
                          }`}
                          title={user.hasSupremeBadge ? 'سحب الشارة العليا' : 'منح شارة الفنك العليا'}
                        >
                          <Crown className={`w-3.5 h-3.5 ${user.hasSupremeBadge ? 'text-amber-600' : 'text-slate-400'}`} />
                          <span>{user.hasSupremeBadge ? 'سحب الشارة ❌' : 'منح الشارة العليا 👑'}</span>
                        </button>

                        {/* 2. Role Promotion Selector */}
                        <select
                          value={user.role}
                          disabled={isUserOwner}
                          onChange={(e) => onUpdateUserRole(user.id, e.target.value as UserRole)}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none disabled:opacity-60"
                        >
                          <option value="user">مستخدم عادي</option>
                          <option value="moderator">ترقية إلى مشرف 🛡️</option>
                          <option value="admin">ترقية إلى مسؤول (Admin) ⚡</option>
                          <option value="superadmin">ترقية إلى نائب المالك 🌟</option>
                          {isUserOwner && <option value="owner">المالك العام 👑</option>}
                        </select>

                        {/* 3. Verification Toggle */}
                        <button
                          type="button"
                          onClick={() => onToggleVerifyUser(user.id)}
                          className={`p-2 rounded-xl text-xs font-bold transition ${
                            user.isVerified
                              ? 'bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-200'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-cyan-600'
                          }`}
                          title={user.isVerified ? 'إلغاء التوثيق' : 'توثيق الحساب بالهاتف والبطاقة'}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>

                        {/* 4. Points Editor */}
                        <button
                          type="button"
                          onClick={() => {
                            setPointsEditUser(user);
                            setCustomPoints(user.reputationPoints || 0);
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-mono font-bold"
                          title="تعديل نقاط السمعة"
                        >
                          {user.reputationPoints} نقطة
                        </button>

                        {/* 5. Ban / Unban Account */}
                        {!isUserOwner && (
                          <button
                            type="button"
                            onClick={() => onToggleBanUser(user.id)}
                            className={`p-2 rounded-xl text-xs font-bold transition ${
                              user.isBanned
                                ? 'bg-rose-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-rose-50 hover:text-rose-600'
                            }`}
                            title={user.isBanned ? 'فك حظر الحساب' : 'حظر وتجميد الحساب'}
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        )}

                        {/* 6. Delete Account (Owner Privilege) */}
                        {!isUserOwner && (
                          <button
                            type="button"
                            onClick={() => setUserToDelete(user)}
                            className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-600 text-rose-600 hover:text-white transition"
                            title="حذف الحساب نهائياً من المنصة"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 2: MODERATION QUEUE ================= */}
      {activeTab === 'moderation' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs">
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              طابور البلاغات ومراجعة المحتوى ({pendingReports.length})
            </h3>

            {pendingReports.length === 0 ? (
              <div className="py-8 text-center text-slate-400">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-semibold">طابور المراجعة نظيف تماماً!</p>
                <p className="text-xs mt-0.5">لا توجد بلاغات معلقة حالياً في أي من الـ 69 ولاية 🇩🇿</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold">
                          سبب البلاغ: {report.reason}
                        </span>
                        <span className="text-[11px] text-slate-400">{report.createdAt}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 mt-2">
                        المحتوى المشكو منه: <span className="font-bold">"{report.targetContent || report.targetTitle || 'منشور إعلاني'}"</span>
                      </p>
                      {report.details && (
                        <p className="text-xs text-slate-500 mt-1">{report.details}</p>
                      )}
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => onResolveReport(report.id, 'resolved')}
                        className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow"
                      >
                        حذف المحتوى وإنذار
                      </button>
                      <button
                        type="button"
                        onClick={() => onResolveReport(report.id, 'dismissed')}
                        className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold"
                      >
                        تجاهل البلاغ
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 3: OVERVIEW & METRICS ================= */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
              <span className="text-xs text-slate-500 font-bold block mb-1">المستخدمين المسجلين</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white font-mono">148,920</p>
              <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-block">+18% هذا الأسبوع</span>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
              <span className="text-xs text-slate-500 font-bold block mb-1">تغطية التراب الوطني</span>
              <p className="text-2xl font-black text-emerald-600 font-mono">69 / 69</p>
              <span className="text-[11px] text-slate-400 mt-1 inline-block">100% الولايات نشطة (2026)</span>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
              <span className="text-xs text-slate-500 font-bold block mb-1">قضايا صوت المجتمع</span>
              <p className="text-2xl font-black text-amber-600 font-mono">2,340</p>
              <span className="text-[11px] text-amber-600 font-bold mt-1 inline-block">استطلاعات وتصويت</span>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
              <span className="text-xs text-slate-500 font-bold block mb-1">إجمالي السوق (DZD)</span>
              <p className="text-2xl font-black text-teal-600 font-mono">42.8M</p>
              <span className="text-[11px] text-teal-600 font-bold mt-1 inline-block">دينار جزائري صفقات</span>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: WILAYAS BREAKDOWN ================= */}
      {activeTab === 'wilayas' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            توزيع الأعضاء والتفاعل عبر 69 ولاية جزائرية
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 max-h-[500px] overflow-y-auto p-1">
            {ALGERIA_WILAYAS.map((w) => (
              <div
                key={w.id}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded">
                      {w.code}
                    </span>
                    <span className="font-bold text-xs text-slate-900 dark:text-white">{w.nameAr}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">{w.region}</p>
                </div>

                <div className="text-right font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {Math.floor(1000 + (w.id * 147))} نشط
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 5: MONETIZATION ================= */}
      {activeTab === 'monetization' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-teal-600" />
            نموذج العمل التجاري والإيرادات بالدينار (DZD)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-200">1. إعلانات السوق الممولة</h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1 leading-relaxed">
                تثبيت إعلانات السيارات والعقارات بالدينار الجزائري في أعلى نتائج بحث الولاية (500 دج / أسبوع).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800">
              <h4 className="font-bold text-sm text-teal-900 dark:text-teal-200">2. اشتراكات الشركات (FUNK TAXI & Shops)</h4>
              <p className="text-xs text-teal-700 dark:text-teal-300 mt-1 leading-relaxed">
                صفحات تجارية موثقة للشركات، سائقي سيارات الأجرة، والتجار مع تكامل مباشر مع WhatsApp وخرائط الولاية.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
              <h4 className="font-bold text-sm text-amber-900 dark:text-amber-200">3. اشتراك fenkDZ Premium</h4>
              <p className="text-xs text-amber-800 dark:text-amber-300 mt-1 leading-relaxed">
                شارة الهوية الذهبية، أدوات تحسين المحتوى بـ Gemini AI بلا حدود، ودعم فني ذو أولوية.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD NEW USER ================= */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-amber-500/30 overflow-hidden flex flex-col my-auto max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white flex items-center justify-between border-b border-amber-500/30">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">إضافة مستخدم جديد للمنصة (بصلاحيات المالك)</h3>
                  <p className="text-xs text-amber-200/80">تعيين البيانات والشارة والرتبة مباشرة</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddUserModalOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateUserSubmit} className="p-5 overflow-y-auto space-y-4 text-right">
              {newUserError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold">
                  {newUserError}
                </div>
              )}

              {/* 1. Name & Handle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    الاسم واللقب الكامل <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="مثال: يوسف العربي"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    اسم المستخدم (Handle)
                  </label>
                  <input
                    type="text"
                    value={newUserHandle}
                    onChange={(e) => setNewUserHandle(e.target.value)}
                    placeholder="مثال: youcef_dz"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* 2. Phone Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  رقم الهاتف الجزائري <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                    🇩🇿 +213
                  </div>
                  <input
                    type="tel"
                    required
                    value={newUserPhone}
                    onChange={(e) => setNewUserPhone(e.target.value)}
                    placeholder="05 / 06 / 07 XX XX XX"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* 3. Wilaya & Municipality */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    الولاية (من الـ 69)
                  </label>
                  <select
                    value={newUserWilayaId}
                    onChange={(e) => setNewUserWilayaId(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                  >
                    {ALGERIA_WILAYAS.map(w => (
                      <option key={w.id} value={w.id}>{w.code} - ولاية {w.nameAr}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    البلدية أو الحي
                  </label>
                  <input
                    type="text"
                    value={newUserMunicipality}
                    onChange={(e) => setNewUserMunicipality(e.target.value)}
                    placeholder="البلدية"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* 4. Role & Supreme Badge */}
              <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-amber-950 dark:text-amber-200 mb-1">
                    الرتبة والدور الإداري:
                  </label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="user">مستخدم عادي (Citizen)</option>
                    <option value="moderator">مشرف ولاية (Moderator) 🛡️</option>
                    <option value="admin">مسؤول نظام (Admin) ⚡</option>
                    <option value="superadmin">نائب المالك العام (Super Admin) 🌟</option>
                  </select>
                </div>

                {/* Supreme Badge Toggle */}
                <label className="flex items-center justify-between cursor-pointer pt-1">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-amber-500" />
                    <div>
                      <span className="font-bold text-xs text-slate-900 dark:text-white block">
                        منح شارة الفنك العليا 👑
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        تاج ذهبي موثق يظهر على المنشورات والملف الشخصي
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={newUserHasSupreme}
                    onChange={(e) => setNewUserHasSupreme(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                  />
                </label>
              </div>

              {/* 5. Business Account Option */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-teal-600" />
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      تعيين كحساب نشاط تجاري / متجر
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={newUserIsBusiness}
                    onChange={(e) => setNewUserIsBusiness(e.target.checked)}
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                  />
                </label>

                {newUserIsBusiness && (
                  <div className="mt-2.5 pt-2.5 border-t border-slate-200 dark:border-slate-700">
                    <input
                      type="text"
                      value={newUserBusinessName}
                      onChange={(e) => setNewUserBusinessName(e.target.value)}
                      placeholder="اسم المتجر أو المؤسسة التجارية"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                    />
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition"
                >
                  حفظ وإنشاء الحساب ✓
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ================= MODAL: CONFIRM DELETE USER ================= */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-rose-300 dark:border-rose-900 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center mx-auto text-xl">
              <Trash2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="font-black text-base text-slate-900 dark:text-white">
                تأكيد حذف الحساب نهائياً
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                هل أنت متأكد من رغبتك كمالك للمنصة في حذف حساب <strong className="text-slate-900 dark:text-white font-bold">{userToDelete.name}</strong> (@{userToDelete.handle})؟ لا يمكن التراجع عن هذا الإجراء.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md"
              >
                تأكيد الحذف النهائي
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT USER REPUTATION POINTS ================= */}
      {pointsEditUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-right">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                تعديل نقاط السمعة
              </h3>
              <button
                type="button"
                onClick={() => setPointsEditUser(null)}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              تحديد رصيد نقاط السمعة للمستخدم <span className="font-bold text-slate-800 dark:text-slate-200">{pointsEditUser.name}</span>:
            </p>

            <input
              type="number"
              value={customPoints}
              onChange={(e) => setCustomPoints(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-sm text-slate-900 dark:text-white text-center focus:outline-none"
            />

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPointsEditUser(null)}
                className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleSavePoints}
                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow"
              >
                حفظ النقاط
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
