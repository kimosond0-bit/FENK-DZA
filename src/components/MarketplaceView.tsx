import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  MapPin, 
  Phone, 
  Sparkles, 
  Filter, 
  Plus, 
  Check, 
  X, 
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Building2,
  Car,
  Home,
  Smartphone,
  Shirt,
  Wheat,
  Wrench,
  Loader2
} from 'lucide-react';
import { MarketplaceItem, User } from '../types';
import { ALGERIA_WILAYAS } from '../data/wilayas';

interface MarketplaceViewProps {
  items: MarketplaceItem[];
  currentUser: User;
  activeWilayaId: number;
  onSelectWilaya: (id: number) => void;
  onAddItem: (newItem: MarketplaceItem) => void;
  onOpenChatWithSeller: (seller: User) => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  items,
  currentUser,
  activeWilayaId,
  onSelectWilaya,
  onAddItem,
  onOpenChatWithSeller,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [wilayaFilter, setWilayaFilter] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
  
  // New Ad Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('سيارات ومركبات');
  const [newWilayaId, setNewWilayaId] = useState(activeWilayaId);
  const [newMunicipality, setNewMunicipality] = useState(currentUser.municipality || 'المركز');
  const [newPhone, setNewPhone] = useState(currentUser.phone || '0550000000');
  const [newImageUrl, setNewImageUrl] = useState('https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&auto=format&fit=crop&q=80');

  // AI Ad Generation State
  const [isAIGenerating, setIsAIGenerating] = useState(false);
  const [aiProductKeywords, setAiProductKeywords] = useState('');

  const categories = [
    { name: 'الكل', icon: ShoppingBag },
    { name: 'سيارات ومركبات', icon: Car },
    { name: 'عقارات وشقق', icon: Home },
    { name: 'هواتف وإلكترونيات', icon: Smartphone },
    { name: 'تمور ومنتجات فلاحية', icon: Wheat },
    { name: 'خدمات ونقل (FUNK TAXI)', icon: Wrench },
    { name: 'حرف وأزياء تقليدية', icon: Shirt },
  ];

  const filteredItems = items.filter((item) => {
    const matchesCat = selectedCategory === 'الكل' || item.category === selectedCategory;
    const matchesWilaya = wilayaFilter === 'all' || item.wilayaId === wilayaFilter;
    const matchesSearch = item.title.includes(searchQuery) || 
                          item.description.includes(searchQuery) || 
                          item.wilayaName.includes(searchQuery);
    return matchesCat && matchesWilaya && matchesSearch;
  });

  // AI Generate Ad using Gemini API
  const handleAIGenerateAd = async () => {
    if (!aiProductKeywords.trim()) return;
    setIsAIGenerating(true);
    try {
      const selectedW = ALGERIA_WILAYAS.find(w => w.id === newWilayaId) || ALGERIA_WILAYAS[15];
      const res = await fetch('/api/gemini/generate-ad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: aiProductKeywords,
          category: newCategory,
          priceDZD: Number(newPrice) || 50000,
          wilaya: selectedW.nameAr,
        }),
      });
      const data = await res.json();
      if (data.adTitle) setNewTitle(data.adTitle);
      if (data.adDescription) setNewDesc(data.adDescription);
    } catch (err) {
      console.error('Error generating AI ad:', err);
    } finally {
      setIsAIGenerating(false);
    }
  };

  const handleCreateAd = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedW = ALGERIA_WILAYAS.find(w => w.id === newWilayaId) || ALGERIA_WILAYAS[15];

    const newItem: MarketplaceItem = {
      id: `item_${Date.now()}`,
      seller: currentUser,
      title: newTitle || 'إعلان تجاري جديد',
      description: newDesc,
      priceDZD: Number(newPrice) || 0,
      wilayaId: newWilayaId,
      wilayaName: selectedW.nameAr,
      municipality: newMunicipality,
      category: newCategory,
      images: [newImageUrl],
      status: 'available',
      condition: 'جديد',
      contactPhone: newPhone,
      contactWhatsApp: newPhone,
      tags: [newCategory],
      viewsCount: 1,
      createdAt: 'الآن'
    };

    onAddItem(newItem);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewDesc('');
    setNewPrice('');
  };

  return (
    <div className="space-y-4">
      
      {/* Marketplace Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full font-bold border border-amber-400/30">
            السوق المحلي بالدينار الجزائري 🇩🇿 (DZD)
          </span>
          <h2 className="text-xl sm:text-2xl font-black mt-2">
            سوق ديزاد كونكت لـ 69 ولاية
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl">
            بيع واشترِ، اطلب خدمات النقل وسيارات الأجرة، واكتشف منتجات التمور والحرف التقليدية بأسعار واضحة وتواصل مباشر.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-400/20 active:scale-95 transition shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>أضف إعلانك مجاناً</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-3 sm:p-4 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
        
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Text search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ابحث عن سيارة، هاتف، عقار، خدمة نقل، تمور..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Wilaya Filter Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={wilayaFilter}
              onChange={(e) => setWilayaFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="all">كل ولايات الجزائر (69 ولاية)</option>
              {ALGERIA_WILAYAS.map(w => (
                <option key={w.id} value={w.id}>
                  {w.code} - ولاية {w.nameAr}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Chips Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
          >
            <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-900">
              <img
                src={item.images[0]}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute top-3 right-3 bg-emerald-600 text-white font-black text-xs px-3 py-1 rounded-xl shadow-lg">
                {item.priceDZD.toLocaleString()} دج
              </div>
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] px-2.5 py-1 rounded-lg font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>{item.wilayaName}</span>
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  {item.category}
                </span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 mt-0.5">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={item.seller.avatar}
                    alt={item.seller.name}
                    className="w-6 h-6 rounded-lg object-cover"
                  />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[100px]">
                    {item.seller.name}
                  </span>
                </div>

                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-[-3px] transition">
                  تفاصيل ←
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
          <div 
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-60 bg-black">
              <img
                src={selectedItem.images[0]}
                alt={selectedItem.title}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="absolute top-3 left-3 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-3 right-3 bg-emerald-600 text-white font-black text-sm px-4 py-1.5 rounded-2xl shadow-xl">
                {selectedItem.priceDZD.toLocaleString()} دج (DZD)
              </div>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              <div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {selectedItem.category} • ولاية {selectedItem.wilayaName} ({selectedItem.municipality})
                </span>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mt-1">
                  {selectedItem.title}
                </h3>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300 mb-1">تفاصيل العرض:</h4>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                  {selectedItem.description}
                </p>
              </div>

              {/* Seller info card */}
              <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedItem.seller.avatar}
                    alt={selectedItem.seller.name}
                    className="w-11 h-11 rounded-xl object-cover border-2 border-emerald-500"
                  />
                  <div>
                    <h5 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1">
                      {selectedItem.seller.name}
                      {selectedItem.seller.isVerified && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                    </h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      بائع معتمد في {selectedItem.wilayaName} • {selectedItem.seller.reputationPoints} نقطة
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onOpenChatWithSeller(selectedItem.seller);
                    setSelectedItem(null);
                  }}
                  className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 hover:bg-emerald-100"
                  title="مراسلة البائع"
                >
                  <MessageSquare className="w-5 h-5" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <a
                  href={`tel:${selectedItem.phone}`}
                  className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                >
                  <Phone className="w-4 h-4" />
                  <span>اتصال: {selectedItem.phone}</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    onOpenChatWithSeller(selectedItem.seller);
                    setSelectedItem(null);
                  }}
                  className="px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm hover:bg-slate-200"
                >
                  محادثة خاصة
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Ad Modal with Gemini AI */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div 
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col my-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-600" />
                نشر إعلان جديد بالسوق المحلي 🇩🇿
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAd} className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
              
              {/* AI Auto-Writer Box */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-emerald-500/15 to-teal-500/15 border border-emerald-300/40 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-200">
                  <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                  <span>توليد نص الإعلان الذكي (Gemini AI):</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="مثال: سيارة رونو كليو 4 ديزل نقية 2018، أو تمور دقلة نور بسكرة..."
                    value={aiProductKeywords}
                    onChange={(e) => setAiProductKeywords(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-emerald-300/40 text-xs focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAIGenerateAd}
                    disabled={isAIGenerating || !aiProductKeywords.trim()}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 shadow disabled:opacity-50"
                  >
                    {isAIGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'توليد الإعلان'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  عنوان الإعلان:
                </label>
                <input
                  type="text"
                  placeholder="مثلاً: بيع سيارة هيونداي أكسنت 2021 أو تمر دقلة نور درجة أولى"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    السعر بالدينار الجزائري (DZD):
                  </label>
                  <input
                    type="number"
                    placeholder="مثال: 850000"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    القسم:
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  >
                    {categories.filter(c => c.name !== 'الكل').map(c => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    الولاية:
                  </label>
                  <select
                    value={newWilayaId}
                    onChange={(e) => setNewWilayaId(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  >
                    {ALGERIA_WILAYAS.map(w => (
                      <option key={w.id} value={w.id}>{w.code} - {w.nameAr}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    رقم الهاتف للتواصل:
                  </label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  تفاصيل ووصف الإعلان:
                </label>
                <textarea
                  rows={3}
                  placeholder="اكتب مواصفات السلعة، الحالة، والضمان..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  رابط صورة الإعلان:
                </label>
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md"
                >
                  نشر الإعلان بالسوق
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-700 text-xs font-bold"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
