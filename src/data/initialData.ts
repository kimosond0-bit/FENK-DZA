import { 
  User, 
  Post, 
  Story, 
  Moment, 
  Community, 
  MarketplaceItem, 
  Conversation, 
  ChatMessage, 
  NotificationItem, 
  ReportItem, 
  BusinessService, 
  LostAndFoundItem,
  Comment
} from '../types';

// Owner credentials and constants
export const OWNER_PHONE = '0777946398';
export const OWNER_PASS = 'kimo22011986';

export const OWNER_USER: User = {
  id: 'usr_owner_kimo',
  name: 'المالك العام للمنصة 👑',
  handle: 'kimo_owner',
  wilayaId: 16,
  wilayaName: 'الجزائر العاصمة',
  municipality: 'الجزائر الوسطى / المركز',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  coverImage: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop&q=80',
  coverPhoto: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop&q=80',
  bio: '👑 المالك والمؤسس العام لشبكة hakeDZ الجزائرية | الإدارة المركزية والتحكم بكافة الحسابات والـ 69 ولاية 🇩🇿',
  isVerified: true,
  isBusiness: false,
  followersCount: 69000,
  followingCount: 69,
  reputationPoints: 99999,
  badge: '👑 شارة حَاكْ العليا (Supreme Owner)',
  hasSupremeBadge: true,
  role: 'owner',
  tier: 'business',
  phone: '0777 94 63 98',
  whatsapp: '+213777946398',
  email: 'owner@hakedz.com',
  joinedDate: 'المؤسس الأول'
};

// Current standard user (Default: كريم من ولاية المغير / الجزائر)
export const CURRENT_USER: User = {
  id: 'usr_me',
  name: 'كريم بن علي',
  handle: 'karim_dza',
  wilayaId: 57,
  wilayaName: 'المغير',
  municipality: 'المغير المركز',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  coverImage: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop&q=80',
  bio: 'مطور برمجيات ومهتم بالتجارة الإلكترونية والتنمية المحلية في الجنوب الجزائري 🇩🇿 | شغوف بالابتكار وربط المجتمعات',
  isVerified: true,
  isBusiness: false,
  followersCount: 1420,
  followingCount: 380,
  reputationPoints: 2850,
  badge: 'مواطن نشط ⭐',
  hasSupremeBadge: false,
  role: 'user',
  tier: 'premium',
  phone: '0550 12 34 56',
  whatsapp: '+213550123456',
  email: 'karim@dzaconnect.dz',
  joinedDate: 'جانفي 2025'
};

export const MOCK_USERS: Record<string, User> = {
  funk_taxi: {
    id: 'usr_funk_taxi',
    name: 'FUNK TAXI الجزائر',
    handle: 'funk_taxi_dz',
    wilayaId: 16,
    wilayaName: 'الجزائر العاصمة',
    municipality: 'حيدرة / المطار',
    avatar: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&auto=format&fit=crop&q=80',
    bio: 'خدمة النقل وسيارات الأجرة السريعة والمريحة بين الولايات والمدن الكبرى 🚖 | رحلات المطار، خدمات VIP، وسائقون محترفون 24/7',
    isVerified: true,
    isBusiness: true,
    businessName: 'FUNK TAXI Express',
    businessType: 'خدمات النقل والمواصلات 🚖',
    businessRating: 4.9,
    followersCount: 18900,
    followingCount: 120,
    reputationPoints: 9400,
    badge: 'شريك معتمد 🚕',
    role: 'user',
    tier: 'business',
    phone: '0770 99 88 77',
    whatsapp: '+213770998877',
    email: 'contact@funktaxi.dz',
    joinedDate: 'نوفمبر 2024'
  },
  amina_oran: {
    id: 'usr_amina',
    name: 'أمينة بلقاسم',
    handle: 'amina_oran',
    wilayaId: 31,
    wilayaName: 'وهران',
    municipality: 'عين الترك',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    bio: 'مهندسة معمارية وصانعة محتوى سياحي عن جمال المدن الساحلية والتراث الوهراني 🌊✨',
    isVerified: true,
    isBusiness: false,
    followersCount: 8430,
    followingCount: 520,
    reputationPoints: 4120,
    badge: 'سفيرة وهران الباهية 🏛️',
    role: 'user',
    tier: 'premium',
    joinedDate: 'مارس 2024'
  },
  el_mghair_news: {
    id: 'usr_mghair_voice',
    name: 'صوت المغير والواحات',
    handle: 'el_mghair_voice',
    wilayaId: 57,
    wilayaName: 'المغير',
    municipality: 'المغير المركز',
    avatar: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=150&auto=format&fit=crop&q=80',
    bio: 'المنصة الإخبارية والمجتمعية المستقلة لمتابعة قضايا ومشاريع التنمية في ولاية المغير والجنوب 🌴',
    isVerified: true,
    isBusiness: false,
    followersCount: 12500,
    followingCount: 95,
    reputationPoints: 7800,
    badge: 'منصة مجتمعية موثقة 📰',
    role: 'moderator',
    tier: 'business',
    joinedDate: 'جانفي 2024'
  },
  tariq_dev: {
    id: 'usr_tariq',
    name: 'طارق قسنطيني',
    handle: 'tariq_codes',
    wilayaId: 25,
    wilayaName: 'قسنطينة',
    municipality: 'الخروب',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'مبرمج Full-Stack ومؤسس مجتمع مبرمجي الشرق الجزائري 💻☕ | الذكاء الاصطناعي وريادة الأعمال',
    isVerified: true,
    isBusiness: false,
    followersCount: 5600,
    followingCount: 410,
    reputationPoints: 3900,
    badge: 'خبير تقني 💻',
    role: 'user',
    tier: 'premium',
    joinedDate: 'أفريل 2024'
  },
  yassine_biskra: {
    id: 'usr_yassine',
    name: 'ياسين فلاح الواحة',
    handle: 'yassine_dates',
    wilayaId: 7,
    wilayaName: 'بسكرة',
    municipality: 'طولقة',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    bio: 'منتج ومصدر لأجود تمور دقلة نور بسكرة وطولقة 🌴 منتجات عضوية من قلب الصحراء إلى كل الولايات',
    isVerified: true,
    isBusiness: true,
    businessName: 'واحات دقلة بسكرة الذهبية',
    businessType: 'منتجات فلاحية وصناعات غذائية',
    businessRating: 4.95,
    followersCount: 9200,
    followingCount: 230,
    reputationPoints: 6300,
    badge: 'تاجر موثوق 🌴',
    role: 'user',
    tier: 'business',
    joinedDate: 'ماي 2024'
  }
};

export const INITIAL_STORIES: Story[] = [
  {
    id: 'story_1',
    author: MOCK_USERS.el_mghair_news,
    mediaUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=600&auto=format&fit=crop&q=80',
    mediaType: 'image',
    caption: 'أجواء سوق التمور الأسبوعي في المغير اليوم صباحاً 🌴 ما شاء الله خيرات بلادنا',
    wilayaName: 'المغير',
    createdAt: 'منذ ساعتين',
    viewedBy: ['usr_me']
  },
  {
    id: 'story_2',
    author: MOCK_USERS.funk_taxi,
    mediaUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&auto=format&fit=crop&q=80',
    mediaType: 'image',
    caption: 'أسطول FUNK TAXI جاهز لنقلكم بين العاصمة ووهران وقسنطينة مع خدمة التكييف والراحة 🚖',
    wilayaName: 'الجزائر العاصمة',
    createdAt: 'منذ 3 ساعات',
    viewedBy: []
  },
  {
    id: 'story_3',
    author: MOCK_USERS.amina_oran,
    mediaUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80',
    mediaType: 'image',
    caption: 'غروب الشمس الساحر من قمة سانتا كروز بوهران الباهية 🌅🇩🇿',
    wilayaName: 'وهران',
    createdAt: 'منذ 5 ساعات',
    viewedBy: []
  },
  {
    id: 'story_4',
    author: MOCK_USERS.tariq_dev,
    mediaUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    mediaType: 'image',
    caption: 'لقاء مجتمع مبرمجي قسنطينة في حاضنة الأعمال بجامعة منتوري 💻🚀',
    wilayaName: 'قسنطينة',
    createdAt: 'منذ 7 ساعات',
    viewedBy: []
  },
  {
    id: 'story_5',
    author: MOCK_USERS.yassine_biskra,
    mediaUrl: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=600&auto=format&fit=crop&q=80',
    mediaType: 'image',
    caption: 'بدء موسم جني دقلة نور بطولقة، جودة فاخرة للتصدير والتوصيل 69 ولاية 📦',
    wilayaName: 'بسكرة',
    createdAt: 'منذ 8 ساعات',
    viewedBy: []
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post_1',
    author: MOCK_USERS.el_mghair_news,
    content: '🗳️ صوت المجتمع | استطلاع رأي لسكان ولاية المغير والبلديات المجاورة (جامعة، سيدي خليل، أم الطيور):\n\nمع التوسع العمراني وازدهار النشاط التجاري الفلاحي في الولاية، هل تؤيدون مقترح إنشاء سوق أسبوعي جهوي مخصص لمنتجات الواحات والصناعات التحويلية بجوار الطريق الوطني رقم 3؟\n\nشارك برأيك وصوتك يصنع الفارق!',
    mediaType: 'poll',
    mediaUrls: ['https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80'],
    wilayaId: 57,
    wilayaName: 'المغير',
    municipality: 'المغير المركز',
    pollData: {
      id: 'poll_mghair_market',
      question: 'هل تؤيد إنشاء سوق جهوي أسبوعي جديد لولاية المغير؟',
      isCommunityIssue: true,
      wilayaTarget: 'المغير',
      totalVotes: 342,
      userVotedOptionId: 'opt_yes',
      aiAnalysis: 'تحليل الذكاء الاصطناعي: غالبية سكان المغير (82%) يرحبون بالسوق الجهوي لتقليل تكاليف النقل وتوفير مناصب عمل للشباب، مع التأكيد على توفير مواقف سيارات وتنظيم النظافة.',
      options: [
        { id: 'opt_yes', text: 'نعم بشدة — سيعزز حركة التجارة والتوظيف', votes: 281, voters: ['usr_me', 'usr_tariq'] },
        { id: 'opt_no', text: 'لا — الأفضل تطوير السوق القديم وتنظيمه', votes: 43, voters: [] },
        { id: 'opt_suggest', text: 'أقترح نقله لمنطقة النشاطات الجديدة', votes: 18, voters: [] }
      ]
    },
    likes: ['usr_me', 'usr_amina', 'usr_tariq', 'usr_yassine'],
    commentsCount: 38,
    sharesCount: 14,
    savesCount: 22,
    category: 'صوت_المجتمع',
    createdAt: 'منذ ساعتين',
    viewsCount: 1450,
    tags: ['#المغير', '#صوت_المجتمع', '#تنمية_محلية', '#سوق_الواحات']
  },
  {
    id: 'post_2',
    author: MOCK_USERS.funk_taxi,
    content: '🚖 عرض خاص من FUNK TAXI لجميع مستخدمي تطبيق ديزاد كونكت 🇩🇿\n\nرحلات يومية منتظمة بسيارات حديثة ومكيفة بين:\n📍 الجزائر العاصمة ↔️ وهران\n📍 الجزائر العاصمة ↔️ قسنطينة / سطيف\n📍 الجزائر العاصمة ↔️ بسكرة / المغير / ورقلة\n\n✅ حجز فوري عبر التطبيق\n✅ سائقون محترفون وتتبع GPS للرحلة\n✅ خيارات رحلات فردية أو جماعية مع باقة أمتعة مريحة\n\nاحجز رحلتك القادمة الآن واستمتع بسفر آمن ومريح!',
    mediaType: 'image',
    mediaUrls: [
      'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&auto=format&fit=crop&q=80'
    ],
    wilayaId: 16,
    wilayaName: 'الجزائر العاصمة',
    municipality: 'حيدرة',
    likes: ['usr_me', 'usr_amina', 'usr_tariq'],
    commentsCount: 19,
    sharesCount: 26,
    savesCount: 45,
    category: 'سوق',
    isSponsored: true,
    priceDZD: 2500,
    createdAt: 'منذ 4 ساعات',
    viewsCount: 3200,
    tags: ['#FUNK_TAXI', '#نقل_بين_الولايات', '#سياحة_الجزائر', '#خدمات_نقل']
  },
  {
    id: 'post_3',
    author: MOCK_USERS.tariq_dev,
    content: '🎙️ تسجيل صوتي: نصيحة هامة للمبرمجين والطلبة في الولايات الداخلية حول العمل عن بعد (Freelance) وكيفية استلام المدفوعات والتعامل مع الشركات بدون الحاجة للانتقال للعاصمة.\n\nاستمع للرسالة الصوتية وأخبروني بتجاربكم في التعليقات 👇',
    mediaType: 'audio',
    mediaUrls: [],
    audioDuration: '02:14',
    audioWaveform: [35, 60, 45, 80, 95, 70, 50, 85, 100, 65, 40, 90, 75, 55, 30, 70, 85, 60, 40],
    wilayaId: 25,
    wilayaName: 'قسنطينة',
    municipality: 'الخروب',
    likes: ['usr_me', 'usr_amina'],
    commentsCount: 24,
    sharesCount: 18,
    savesCount: 56,
    category: 'تقنية',
    createdAt: 'منذ 6 ساعات',
    viewsCount: 2100,
    tags: ['#تقنية', '#مبرمجي_الجزائر', '#عمل_عن_بعد', '#تطوير_الويب']
  },
  {
    id: 'post_4',
    author: MOCK_USERS.amina_oran,
    content: 'من قال أن الجزائر لا تملك أجمل شواطئ البحر الأبيض المتوسط؟ 😍🌊\n\nجولة اليوم في خليج مداغ وشاطئ الصبيعات بين ولايتي وهران وعين تموشنت. مياه فيروزية وهدوء طبيعي لا يوصف.\n\nمن زار هذا المكان من قبل؟ وأي شاطئ تفضلونه في الغرب الجزائري؟ 🇩🇿⛵',
    mediaType: 'image',
    mediaUrls: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&auto=format&fit=crop&q=80'
    ],
    wilayaId: 31,
    wilayaName: 'وهران',
    municipality: 'عين الترك',
    likes: ['usr_me', 'usr_tariq', 'usr_yassine'],
    commentsCount: 42,
    sharesCount: 31,
    savesCount: 68,
    category: 'ثقافة_وتراث',
    createdAt: 'منذ 8 ساعات',
    viewsCount: 4100,
    tags: ['#وهران_الباهية', '#سياحة_الجزائر', '#شواطئ_بلادي', '#عين_تموشنت']
  },
  {
    id: 'post_5',
    author: MOCK_USERS.yassine_biskra,
    content: '🌴 إعلان فلاحي مباشر من بسكرة وطولقة:\nتم فتح باب الطلبات المسبقة لشحنات دقلة نور رطب وعرجون فرز أول لموسم 2025/2026.\n\n📦 نوفر تغليف كرتوني معقم 1 كغ، 2 كغ، و5 كغ.\n🚚 التوصيل مضمون ومبرد لجميع الولايات الـ 69 مع إمكانية الدفع عند الاستلام.\n💰 السعر: ابتداءً من 850 دج للعلبة الفاخرة.\n\nتواصلوا معنا عبر الواتساب أو الرسائل الخاصة للكميات والجملة.',
    mediaType: 'image',
    mediaUrls: [
      'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800&auto=format&fit=crop&q=80'
    ],
    wilayaId: 7,
    wilayaName: 'بسكرة',
    municipality: 'طولقة',
    likes: ['usr_me', 'usr_amina', 'usr_tariq'],
    commentsCount: 15,
    sharesCount: 12,
    savesCount: 33,
    category: 'سوق',
    priceDZD: 850,
    createdAt: 'منذ 12 ساعة',
    viewsCount: 1890,
    tags: ['#دقلة_نور', '#بسكرة', '#تمور_الجزائر', '#سوق_الفلاحة']
  }
];

export const INITIAL_COMMENTS: Record<string, Comment[]> = {
  post_1: [
    {
      id: 'c_101',
      postId: 'post_1',
      author: MOCK_USERS.tariq_dev,
      content: 'فكرة ممتازة جداً! ولاية المغير بحاجة ماسة لهذا السوق لتجميع المنتجين بدل التشتت في الأسواق المجاورة، وأقترح ربطه بمنصة رقمية لحجز الأماكن.',
      likes: 14,
      isLiked: false,
      createdAt: 'منذ ساعة'
    },
    {
      id: 'c_102',
      postId: 'post_1',
      author: CURRENT_USER,
      content: 'أؤيد بشدة، شريطة أن يتم توفير خطوط نقل ومواصلات مباشرة ومحطات تاكسي لتسهيل وصول المواطنين من البلديات كجامعة وسيدي خليل.',
      likes: 9,
      isLiked: true,
      createdAt: 'منذ 45 دقيقة'
    },
    {
      id: 'c_103',
      postId: 'post_1',
      author: MOCK_USERS.yassine_biskra,
      content: 'نحن كتجار وفلاحين في بسكرة وطولقة سنكون أول المشاركين! المسافة قريبة والتبادل التجاري سيكون مربحاً للجميع 🤝🌴',
      likes: 18,
      isLiked: false,
      createdAt: 'منذ 30 دقيقة'
    }
  ],
  post_2: [
    {
      id: 'c_201',
      postId: 'post_2',
      author: CURRENT_USER,
      content: 'هل تتوفر رحلات ليلية من مطار هواري بومدين إلى ولايات الجنوب كالمغير وبسكرة؟',
      likes: 4,
      isLiked: false,
      createdAt: 'منذ ساعتين'
    },
    {
      id: 'c_202',
      postId: 'post_2',
      author: MOCK_USERS.funk_taxi,
      content: 'أهلاً بك أخي كريم! نعم تتوفر رحلات VIP 24/7 مع حجز مسبق قبل الرحلة بـ 4 ساعات. يسعدنا خدمتك دائماً 🚖',
      likes: 7,
      isLiked: true,
      createdAt: 'منذ ساعة ونصف'
    }
  ]
};

export const INITIAL_MOMENTS: Moment[] = [
  {
    id: 'moment_1',
    author: MOCK_USERS.amina_oran,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-beach-5016-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=80',
    title: 'سحر شواطئ وهران وكورنيش عين الترك في الشتاء 🌊',
    description: 'الأجواء الشتوية على ساحل البحر الأبيض المتوسط في وهران الباهية.. هدوء ونسمات منعشة 🇩🇿',
    wilaya: 'وهران (31)',
    category: 'سياحة وطبيعة',
    likesCount: 3420,
    commentsCount: 182,
    sharesCount: 450,
    soundTitle: 'موسيقى راي وهرانية كلاسيكية 🎵'
  },
  {
    id: 'moment_2',
    author: MOCK_USERS.el_mghair_news,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-sand-dunes-in-a-desert-41581-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=500&auto=format&fit=crop&q=80',
    title: 'كثبان الرمال وواحات النخيل في المغير وشط ملغيغ 🌴',
    description: 'منظر بانورامي للصحراء وشط ملغيغ وقت المغيب.. جمال الجزائر القارة 🇩🇿✨',
    wilaya: 'المغير (57)',
    category: 'تراث وصحراء',
    likesCount: 5120,
    commentsCount: 294,
    sharesCount: 890,
    soundTitle: 'نغمات قصبة وبندير صحراوي أصيل 🪘'
  },
  {
    id: 'moment_3',
    author: MOCK_USERS.funk_taxi,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-highway-in-the-middle-of-a-mountain-valley-41550-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500&auto=format&fit=crop&q=80',
    title: 'على الطريق السيار شرق-غرب مع أسطول FUNK TAXI 🚖',
    description: 'رحلة ممتعة وآمنة عبر جبال المنصورة والبويرة باتجاه قسنطينة. سلامة ركابنا أولويتنا!',
    wilaya: 'الجزائر العاصمة (16)',
    category: 'خدمات وتجارب',
    likesCount: 2190,
    commentsCount: 89,
    sharesCount: 170,
    soundTitle: 'صوت الطريق والمحرك 🚕'
  },
  {
    id: 'moment_4',
    author: MOCK_USERS.tariq_dev,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-a-laptop-keyboard-41130-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop&q=80',
    title: 'كيف تطور تطبيقك الأول في الجزائر وتطلقه بنجاح 💻📱',
    description: '3 نصائح من واقع السوق الجزائري: فهم سلوك المستخدم، الدفع عند الاستلام، والتسويق عبر مجتمعات الولايات.',
    wilaya: 'قسنطينة (25)',
    category: 'تعليم وتقنية',
    likesCount: 4210,
    commentsCount: 310,
    sharesCount: 620,
    soundTitle: 'Lo-Fi Coding Beats 🎧'
  }
];

export const INITIAL_COMMUNITIES: Community[] = [
  {
    id: 'comm_tech_dz',
    name: 'مجتمع مبرمجي ورواد أعمال الجزائر',
    slug: 'dz-developers-startups',
    description: 'فضاء لتبادل الخبرات البرمجية، الوظائف التقنية، أدوات الذكاء الاصطناعي، ومشاريع الشركات الناشئة في 69 ولاية.',
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    icon: '💻',
    category: 'تقنية ومبرمجين',
    membersCount: 14200,
    postsCount: 3120,
    isJoined: true,
    rules: [
      'احترام الأعضاء والنقاش البناء',
      'ممنوع الإعلانات المزعجة خارج قسم الوظائف',
      'مشاركة الأكواد والمشاريع المصدرية تشجع التعلم'
    ],
    createdBy: 'tariq_codes',
    createdAt: 'جانفي 2024'
  },
  {
    id: 'comm_mghair_hub',
    name: 'مجتمع ولاية المغير والواحات',
    slug: 'el-mghair-community',
    description: 'المجتمع الرسمي لسكان ولاية المغير لمناقشة التنمية المحلية، الفلاحة، فرص العمل، الفعاليات وأخبار الولاية رقم 57.',
    coverImage: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop&q=80',
    icon: '🌴',
    category: 'ولايات ومناطق',
    wilayaId: 57,
    wilayaName: 'المغير',
    membersCount: 8900,
    postsCount: 1420,
    isJoined: true,
    rules: [
      'المحتوى يخص ولاية المغير والبلديات التابعة لها',
      'طرح القضايا المجتمعية بروح المسؤولية والاحترام',
      'تشجيع المبادرات الخيرية والتطوعية'
    ],
    createdBy: 'el_mghair_voice',
    createdAt: 'فيفري 2024'
  },
  {
    id: 'comm_merchants_dz',
    name: 'تجار ورواد التجارة الإلكترونية بالجزائر',
    slug: 'dz-ecommerce-merchants',
    description: 'شبكة تجمع التجار، الحرفيين، شركات التوصيل، والموردين لتبادل المنتجات والصفقات بالجملة وبالتجزئة بالدينار DZD.',
    coverImage: 'https://images.unsplash.com/photo-1556742049-0a67e5572293?w=800&auto=format&fit=crop&q=80',
    icon: '🛍️',
    category: 'تجارة ومشاريع',
    membersCount: 22400,
    postsCount: 6890,
    isJoined: false,
    rules: [
      'ذكر الأسعار بالدينار الجزائري بوضوح',
      'توضيح شروط التوصيل والضمان',
      'الاحتيال يؤدي للحظر النهائي والإبلاغ القانوني'
    ],
    createdBy: 'yassine_dates',
    createdAt: 'ديسمبر 2023'
  },
  {
    id: 'comm_cars_dz',
    name: 'عشاق وسوق السيارات في الجزائر',
    slug: 'dz-cars-auto',
    description: 'نقاشات حول ميكانيك السيارات، أسعار المركبات الجديدة والمستعملة، الصيانة، وخدمات النقل بين الولايات.',
    coverImage: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&auto=format&fit=crop&q=80',
    icon: '🚗',
    category: 'سيارات وميكانيك',
    membersCount: 31000,
    postsCount: 11400,
    isJoined: true,
    rules: [
      'المصداقية في عرض حالة السيارة والعداد',
      'ممنوع التعليقات الاستفزازية حول الأسعار'
    ],
    createdBy: 'funk_taxi_dz',
    createdAt: 'أكتوبر 2023'
  },
  {
    id: 'comm_students_dz',
    name: 'فضاء الطلبة والجامعات الجزائرية',
    slug: 'dz-students-campus',
    description: 'ملتقى طلبة الجامعات والمعاهد: تبادل الدروس، المذكرات، منح الدراسة، والتوجيه الجامعي.',
    coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
    icon: '🎓',
    category: 'طلبة وجامعات',
    membersCount: 19800,
    postsCount: 4200,
    isJoined: false,
    rules: [
      'التعاون الأكاديمي المجاني',
      'احترام التنوع الجامعي في مختلف الولايات'
    ],
    createdBy: 'amina_oran',
    createdAt: 'سبتمبر 2023'
  }
];

export const INITIAL_MARKETPLACE: MarketplaceItem[] = [
  {
    id: 'mkt_1',
    title: 'خدمة اشتراك وتوصيل FUNK TAXI بين الولايات VIP',
    description: 'باقة تنقل احترافية للشركات والأفراد بسيارات فاخرة مجهزة بإنترنت WiFi وتكييف. حجز رحلات سريعة بين الجزائر العاصمة ووهران وقسنطينة والجنوب مع إمكانية الفوترة للشركات.',
    priceDZD: 4500,
    category: 'خدمات وحرف',
    wilayaId: 16,
    wilayaName: 'الجزائر العاصمة',
    municipality: 'حيدرة',
    images: [
      'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&auto=format&fit=crop&q=80'
    ],
    seller: MOCK_USERS.funk_taxi,
    condition: 'خدمة معتمدة',
    status: 'available',
    contactPhone: '0770 99 88 77',
    contactWhatsApp: '+213770998877',
    createdAt: 'منذ 3 ساعات',
    isFeatured: true,
    viewsCount: 1420,
    tags: ['#نقل_فاخر', '#FUNK_TAXI', '#رحلات_بين_الولايات']
  },
  {
    id: 'mkt_2',
    title: 'كرتون تمور دقلة نور بسكرة فاخرة فرز أول 5 كغ',
    description: 'تمور ملكية طبيعية 100% من مزارع طولقة وبسكرة. حبات ذهبية وشفافة، طرية وحلاوة طبيعية معتدلة. مثالية للبيوت والمناسبات أو التخزين لشهر رمضان المبارك.',
    priceDZD: 4200,
    category: 'منتجات تقليدية وصناعة محلية',
    wilayaId: 7,
    wilayaName: 'بسكرة',
    municipality: 'طولقة',
    images: [
      'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800&auto=format&fit=crop&q=80'
    ],
    seller: MOCK_USERS.yassine_biskra,
    condition: 'جديد',
    status: 'available',
    contactPhone: '0661 22 33 44',
    contactWhatsApp: '+213661223344',
    createdAt: 'منذ 5 ساعات',
    isFeatured: true,
    viewsCount: 980,
    tags: ['#دقلة_نور', '#تمور_بسكرة', '#توصيل_69_ولاية']
  },
  {
    id: 'mkt_3',
    title: 'شقة F4 مطلة على البحر بحي الصنوبر وهران',
    description: 'شقة واسعة ومجهزة بالكامل بمساحة 125م² في عمارة حديثة مع مصعد وحراسة وموقف سيارات تحت الأرض. وثائق عقد ملكية + دفتر عقاري. قريبة من الشاطئ وجميع المرافق.',
    priceDZD: 18500000,
    category: 'عقارات وسكن',
    wilayaId: 31,
    wilayaName: 'وهران',
    municipality: 'عين الترك',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80'
    ],
    seller: MOCK_USERS.amina_oran,
    condition: 'مستعمل كأنه جديد',
    status: 'available',
    contactPhone: '0555 77 88 99',
    contactWhatsApp: '+213555778899',
    createdAt: 'منذ يوم',
    isFeatured: true,
    viewsCount: 3100,
    tags: ['#عقارات_وهران', '#شقة_للبيع', '#دفتر_عقاري']
  },
  {
    id: 'mkt_4',
    title: 'حاسوب محمول للبرمجة والتصميم MacBook Pro M2 16GB 512GB',
    description: 'حالة ممتازة كالجديد تماماً (بطارية 96%، دورات شحن 45). استعمال خفيف جداً في البرمجة. يأتي مع الشاحن الأصلي والعلبة.',
    priceDZD: 215000,
    category: 'إلكترونيات وهواتف',
    wilayaId: 25,
    wilayaName: 'قسنطينة',
    municipality: 'الخروب',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80'
    ],
    seller: MOCK_USERS.tariq_dev,
    condition: 'مستعمل كأنه جديد',
    status: 'available',
    contactPhone: '0799 44 55 66',
    contactWhatsApp: '+213799445566',
    createdAt: 'منذ يومين',
    isFeatured: false,
    viewsCount: 1650,
    tags: ['#MacBook', '#حواسيب_للبيع', '#قسنطينة']
  }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_1',
    participant: MOCK_USERS.funk_taxi,
    participants: [MOCK_USERS.funk_taxi],
    lastMessage: 'تم تأكيد حجز رحلتكم مع FUNK TAXI من المطار إلى الفندق، السائق سيكون بالانتظار.',
    lastMessageTime: '10:45 ص',
    unreadCount: 1,
    wilayaTag: 'الجزائر العاصمة',
    messages: [
      {
        id: 'msg_1',
        conversationId: 'conv_1',
        senderId: 'usr_me',
        senderName: 'كريم بن علي',
        senderAvatar: CURRENT_USER.avatar,
        text: 'السلام عليكم، أريد حجز سيارة تاكسي VIP من مطار هواري بومدين غداً عند الساعة 3 مساءً.',
        createdAt: '10:30 ص',
        timestamp: '10:30 ص',
        status: 'read'
      },
      {
        id: 'msg_2',
        conversationId: 'conv_1',
        senderId: 'usr_funk_taxi',
        senderName: 'FUNK TAXI الجزائر',
        senderAvatar: MOCK_USERS.funk_taxi.avatar,
        text: 'وعليكم السلام ورحمة الله أخي كريم! مرحباً بك. يرجى تزويدنا برقم الرحلة والوجهة وسيكون السائق بانتظارك في الموعد 🚖',
        createdAt: '10:35 ص',
        timestamp: '10:35 ص',
        status: 'read'
      },
      {
        id: 'msg_3',
        conversationId: 'conv_1',
        senderId: 'usr_me',
        senderName: 'كريم بن علي',
        senderAvatar: CURRENT_USER.avatar,
        text: 'الرحلة AH1002، الوجهة نحو فندق الشيراطون بنادي الصنوبر.',
        createdAt: '10:40 ص',
        timestamp: '10:40 ص',
        status: 'read'
      },
      {
        id: 'msg_4',
        conversationId: 'conv_1',
        senderId: 'usr_funk_taxi',
        senderName: 'FUNK TAXI الجزائر',
        senderAvatar: MOCK_USERS.funk_taxi.avatar,
        text: 'تم تأكيد حجز رحلتكم مع FUNK TAXI من المطار إلى الفندق، السائق سيكون بالانتظار وسيتصل بك فور الهبوط.',
        createdAt: '10:45 ص',
        timestamp: '10:45 ص',
        status: 'delivered'
      }
    ]
  },
  {
    id: 'conv_2',
    participant: MOCK_USERS.el_mghair_news,
    participants: [MOCK_USERS.el_mghair_news],
    lastMessage: 'أهلاً بك كريم، يسعدنا نشر مقترحك حول مشروع حاضنة الأعمال الفلاحية في المغير.',
    lastMessageTime: 'أمس',
    unreadCount: 0,
    wilayaTag: 'المغير',
    messages: [
      {
        id: 'msg_2_1',
        conversationId: 'conv_2',
        senderId: 'usr_mghair_news',
        senderName: 'شبكة أخبار ولاية المغير',
        senderAvatar: MOCK_USERS.el_mghair_news.avatar,
        text: 'أهلاً بك كريم، يسعدنا نشر مقترحك حول مشروع حاضنة الأعمال الفلاحية في المغير.',
        createdAt: 'أمس',
        timestamp: 'أمس',
        status: 'read'
      }
    ]
  },
  {
    id: 'conv_3',
    participant: MOCK_USERS.tariq_dev,
    participants: [MOCK_USERS.tariq_dev],
    lastMessage: 'سأرسل لك نموذج الربط البرمجي لواجهة التطبيق هذا المساء إن شاء الله.',
    lastMessageTime: '23 أوت',
    unreadCount: 0,
    wilayaTag: 'قسنطينة',
    messages: [
      {
        id: 'msg_3_1',
        conversationId: 'conv_3',
        senderId: 'usr_tariq',
        senderName: 'طارق قسنطيني',
        senderAvatar: MOCK_USERS.tariq_dev.avatar,
        text: 'سأرسل لك نموذج الربط البرمجي لواجهة التطبيق هذا المساء إن شاء الله.',
        createdAt: '23 أوت',
        timestamp: '23 أوت',
        status: 'read'
      }
    ]
  }
];

export const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  conv_1: [
    {
      id: 'msg_1',
      conversationId: 'conv_1',
      senderId: 'usr_me',
      senderName: 'كريم بن علي',
      senderAvatar: CURRENT_USER.avatar,
      text: 'السلام عليكم، أريد حجز سيارة تاكسي VIP من مطار هواري بومدين غداً عند الساعة 3 مساءً.',
      createdAt: '10:30 ص',
      status: 'read'
    },
    {
      id: 'msg_2',
      conversationId: 'conv_1',
      senderId: 'usr_funk_taxi',
      senderName: 'FUNK TAXI الجزائر',
      senderAvatar: MOCK_USERS.funk_taxi.avatar,
      text: 'وعليكم السلام ورحمة الله أخي كريم! مرحباً بك. يرجى تزويدنا برقم الرحلة والوجهة وسيكون السائق بانتظارك في الموعد 🚖',
      createdAt: '10:35 ص',
      status: 'read'
    },
    {
      id: 'msg_3',
      conversationId: 'conv_1',
      senderId: 'usr_me',
      senderName: 'كريم بن علي',
      senderAvatar: CURRENT_USER.avatar,
      text: 'الرحلة AH1002، الوجهة نحو فندق الشيراطون بنادي الصنوبر.',
      createdAt: '10:40 ص',
      status: 'read'
    },
    {
      id: 'msg_4',
      conversationId: 'conv_1',
      senderId: 'usr_funk_taxi',
      senderName: 'FUNK TAXI الجزائر',
      senderAvatar: MOCK_USERS.funk_taxi.avatar,
      text: 'تم تأكيد حجز رحلتكم مع FUNK TAXI من المطار إلى الفندق، السائق سيكون بالانتظار وسيتصل بك فور الهبوط.',
      createdAt: '10:45 ص',
      status: 'delivered'
    }
  ]
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    type: 'like',
    actor: MOCK_USERS.amina_oran,
    title: 'تفاعل جديد على منشورك',
    body: 'أعجبت أمينة بمنشورك حول تطوير التجارة المحلية في الجنوب الجزائري ❤️',
    message: 'أعجبت بمنشورك حول تطوير التجارة المحلية في الجنوب الجزائري ❤️',
    targetId: 'post_1',
    read: false,
    isRead: false,
    createdAt: 'منذ 15 دقيقة',
    linkTab: 'home'
  },
  {
    id: 'notif_2',
    type: 'poll_vote',
    actor: MOCK_USERS.el_mghair_news,
    title: 'تصويت جديد في استطلاع ولايتك',
    body: 'شارك 50 مواطناً جديداً في استطلاع صوت المجتمع حول سوق المغير الأسبوعي 🗳️',
    message: 'شارك 50 مواطناً جديداً في استطلاع صوت المجتمع حول سوق المغير الأسبوعي 🗳️',
    targetId: 'post_1',
    read: false,
    isRead: false,
    createdAt: 'منذ ساعة',
    linkTab: 'voice'
  },
  {
    id: 'notif_3',
    type: 'market_inquiry',
    actor: MOCK_USERS.funk_taxi,
    title: 'رسالة جديدة من FUNK TAXI',
    body: 'أرسل لك رسالة جديدة بخصوص حجز خدمة النقل 🚖',
    message: 'أرسل لك رسالة جديدة بخصوص حجز خدمة النقل 🚖',
    targetId: 'conv_1',
    read: false,
    isRead: false,
    createdAt: 'منذ ساعتين',
    linkTab: 'messages'
  },
  {
    id: 'notif_4',
    type: 'badge_earned',
    actor: CURRENT_USER,
    title: 'وسام مواطن نشط ⭐',
    body: 'تهانينا! حصلت على وسام "مواطن نشط ⭐" لمشاركاتك القيمة في مجتمع ولايتك.',
    message: 'تهانينا! حصلت على وسام "مواطن نشط ⭐" لمشاركاتك القيمة في مجتمع ولايتك.',
    read: true,
    isRead: true,
    createdAt: 'منذ يوم',
    linkTab: 'profile'
  }
];

export const INITIAL_BUSINESS_SERVICES: BusinessService[] = [

  {
    id: 'biz_funk_taxi',
    name: 'FUNK TAXI الجزائر للنقل والمشاوير',
    category: 'نقل ومواصلات 🚖',
    wilayaName: 'الجزائر العاصمة',
    municipality: 'حيدرة / 69 ولاية',
    description: 'الخدمة الرائدة لنقل الأفراد والطرود بين الولايات والمدن بأسطول حديث ومريح 24/7.',
    phone: '0770 99 88 77',
    rating: 4.9,
    reviewsCount: 380,
    isVerified: true,
    icon: '🚖',
    coverImage: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&auto=format&fit=crop&q=80',
    tags: ['نقل بين الولايات', 'تاكسي مطار', 'VIP', 'خدمات الشركات']
  },
  {
    id: 'biz_oasis_dates',
    name: 'مؤسسة واحات التمور دقلة نور',
    category: 'منتجات فلاحية وصناعات غذائية 🌴',
    wilayaName: 'المغير / بسكرة',
    municipality: 'المغير وجامعة',
    description: 'توزيع وتصدير أجود التمور الجزائرية ومشتقاتها الطبيعية كرب التمر وعسل النخيل.',
    phone: '0661 22 33 44',
    rating: 4.95,
    reviewsCount: 210,
    isVerified: true,
    icon: '🌴',
    coverImage: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=600&auto=format&fit=crop&q=80',
    tags: ['دقلة نور', 'تصدير', 'تمور عضوية', 'جملة وتجزئة']
  },
  {
    id: 'biz_oran_crafts',
    name: 'ورشة الفخار والخزف الوهراني التقليدي',
    category: 'حرف وصناعات تقليدية 🏺',
    wilayaName: 'وهران',
    municipality: 'السانية',
    description: 'صناعة أواني الخزف والفخار الجزائري بنقوش مغاربية وأمازيغية أصيلة.',
    phone: '0555 33 44 11',
    rating: 4.8,
    reviewsCount: 145,
    isVerified: true,
    icon: '🏺',
    coverImage: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&auto=format&fit=crop&q=80',
    tags: ['فخار تقليدي', 'صناعة يدوية', 'ديكور جزائري', 'هدايا']
  }
];

export const INITIAL_LOST_AND_FOUND: LostAndFoundItem[] = [
  {
    id: 'laf_1',
    type: 'lost',
    title: 'فقدان محفظة وثائق ورخصة سياقة باسم بن سالم أحمد',
    description: 'فُقدت بالقرب من محطة الحافلات المركزية في المغير، تحتوي على بطاقة التعريف الوطنية ورخصة السياقة وبطاقة بنكية.',
    wilayaName: 'المغير',
    municipality: 'المغير المركز',
    contactPhone: '0662 88 99 00',
    date: 'منذ يومين',
    rewardDZD: 5000,
    resolved: false
  },
  {
    id: 'laf_2',
    type: 'found',
    title: 'العثور على مفاتيح سيارة رونو مع ميدالية جلدية',
    description: 'تم العثور عليها قرب حديقة النصر ببلدية الخروب، صاحبها يمكنه الاتصال وتقديم مواصفات المفتاح لاستلامه.',
    wilayaName: 'قسنطينة',
    municipality: 'الخروب',
    contactPhone: '0771 44 55 66',
    date: 'منذ 3 أيام',
    resolved: false
  }
];

export const INITIAL_REPORTS: ReportItem[] = [
  {
    id: 'rep_1',
    targetType: 'post',
    targetId: 'post_fake_promo',
    targetTitle: 'إعلان بيع هواتف بسعر غير معقول ودون فاتورة',
    reportedBy: MOCK_USERS.tariq_dev,
    reason: 'اشتباه احتيال وعدم مطابقة السعر للواقع',
    status: 'pending',
    createdAt: 'منذ 4 ساعات',
    details: 'الحساب جديد ويعرض أجهزة آيفون بـ 20 ألف دج فقط ويطلب دفعاً مسبقاً.'
  },
  {
    id: 'rep_2',
    targetType: 'comment',
    targetId: 'com_hate_speech',
    targetTitle: 'تعليق غير لائق في نقاش كروي',
    reportedBy: MOCK_USERS.amina_oran,
    reason: 'محتوى مسيء وخرق لقواعد الاحترام المجتمعي',
    status: 'reviewed',
    createdAt: 'منذ يوم',
    details: 'تم توجيه إنذار للمستخدم وحذف التعليق المخالف.'
  }
];

export const INITIAL_BUSINESSES = INITIAL_BUSINESS_SERVICES;
export const USERS_DIRECTORY: User[] = [OWNER_USER, CURRENT_USER, ...Object.values(MOCK_USERS)];

