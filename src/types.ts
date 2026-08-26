export type WilayaRegion = 'الشمال' | 'الهضاب العليا' | 'الشرق' | 'الغرب' | 'الجنوب والصحراء';

export interface Wilaya {
  id: number;
  code: string;
  nameAr: string;
  nameFr: string;
  region: WilayaRegion;
  municipalities: string[];
  landmark?: string;
}

export type UserRole = 'user' | 'moderator' | 'admin' | 'superadmin' | 'owner';
export type AccountTier = 'free' | 'premium' | 'business';

export interface User {
  id: string;
  name: string;
  handle: string;
  wilayaId: number;
  wilayaName: string;
  municipality: string;
  avatar: string;
  coverImage?: string;
  coverPhoto?: string;
  bio: string;
  isVerified: boolean;
  isOnline?: boolean;
  isBusiness: boolean;
  businessName?: string;
  businessType?: string;
  businessRating?: number;
  followersCount: number;
  followingCount: number;
  reputationPoints: number;
  badge?: string;
  hasSupremeBadge?: boolean;
  isBanned?: boolean;
  role: UserRole;
  tier: AccountTier;
  phone?: string;
  whatsapp?: string;
  email?: string;
  interests?: string[];
  joinedDate: string;
}

export type PostCategory = 
  | 'عام' 
  | 'منطقتي' 
  | 'صوت_المجتمع' 
  | 'أخبار_محلية' 
  | 'سوق' 
  | 'وظائف' 
  | 'مفقودات' 
  | 'ثقافة_وتراث'
  | 'تقنية';

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  voters: string[];
}

export interface PollData {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  isCommunityIssue?: boolean;
  wilayaTarget?: string;
  userVotedOptionId?: string;
  aiAnalysis?: string;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  mediaType: 'text' | 'image' | 'video' | 'poll' | 'audio';
  mediaUrls: string[];
  wilayaId?: number;
  wilayaName?: string;
  municipality?: string;
  communityId?: string;
  communityName?: string;
  pollData?: PollData;
  audioDuration?: string;
  audioWaveform?: number[];
  likes: string[]; // user ids
  commentsCount: number;
  sharesCount: number;
  savesCount: number;
  category: PostCategory;
  createdAt: string;
  isSponsored?: boolean;
  priceDZD?: number;
  locationTag?: string;
  viewsCount?: number;
  tags?: string[];
}

export interface Comment {
  id: string;
  postId?: string;
  author: User;
  content: string;
  audioUrl?: string;
  audioDuration?: string;
  likes: number;
  isLiked?: boolean;
  createdAt: string;
  replies?: Comment[];
}

export interface Story {
  id: string;
  author: User;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption?: string;
  wilayaName?: string;
  createdAt: string;
  viewedBy: string[];
}

export interface Moment {
  id: string;
  author: User;
  videoUrl: string;
  thumbnailUrl: string;
  title: string;
  description: string;
  wilaya: string;
  category: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  soundTitle: string;
  isLiked?: boolean;
  isSaved?: boolean;
}

export interface Community {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  icon: string;
  category: string;
  wilayaId?: number;
  wilayaName?: string;
  membersCount: number;
  postsCount: number;
  isJoined?: boolean;
  rules: string[];
  createdBy: string;
  createdAt: string;
}

export type MarketCategory = 
  | 'سيارات ومركبات' 
  | 'عقارات وسكن' 
  | 'إلكترونيات وهواتف' 
  | 'ملابس وأزياء' 
  | 'خدمات وحرف' 
  | 'منتجات تقليدية وصناعة محلية' 
  | 'وظائف وفرص عمل' 
  | 'أثاث وديكور';

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  priceDZD: number;
  category: MarketCategory;
  wilayaId: number;
  wilayaName: string;
  municipality: string;
  images: string[];
  seller: User;
  condition: 'جديد' | 'مستعمل كأنه جديد' | 'مستعمل بحالة جيدة' | 'صناعة تقليدية يدوية' | 'خدمة معتمدة';
  status: 'available' | 'reserved' | 'sold';
  contactPhone: string;
  contactWhatsApp: string;
  createdAt: string;
  isFeatured?: boolean;
  viewsCount: number;
  tags: string[];
}

export interface ChatMessage {
  id: string;
  conversationId?: string;
  senderId: string;
  senderName?: string;
  senderAvatar?: string;
  text?: string;
  mediaType?: 'text' | 'image' | 'video' | 'audio';
  mediaUrl?: string;
  isVoice?: boolean;
  audioDuration?: string;
  createdAt?: string;
  timestamp?: string;
  status?: 'sent' | 'delivered' | 'read';
  isRead?: boolean;
}

export type Message = ChatMessage;

export interface Conversation {
  id: string;
  participants?: User[];
  participant?: User;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages?: ChatMessage[];
  isGroup?: boolean;
  groupName?: string;
  groupIcon?: string;
  wilayaTag?: string;
}

export type NotificationType = 
  | 'like' 
  | 'comment' 
  | 'follow' 
  | 'poll_vote' 
  | 'vote'
  | 'community_invite' 
  | 'market_inquiry' 
  | 'system_alert' 
  | 'system'
  | 'badge_earned'
  | 'voice_response';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  actor?: User;
  title?: string;
  body?: string;
  message?: string;
  targetId?: string;
  read?: boolean;
  isRead?: boolean;
  createdAt: string;
  linkTab?: string;
}

export type Notification = NotificationItem;

export interface ReportItem {
  id: string;
  targetType: 'post' | 'comment' | 'user' | 'market_item';
  targetId: string;
  targetTitle?: string;
  targetContent?: string;
  reportedBy?: User;
  reporter?: User;
  reason: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  createdAt: string;
  details?: string;
}

export interface BusinessService {
  id: string;
  name: string;
  category: string;
  wilayaName: string;
  municipality: string;
  description: string;
  phone: string;
  rating: number;
  reviewsCount: number;
  isVerified: boolean;
  icon: string;
  coverImage: string;
  tags: string[];
}

export interface LostAndFoundItem {
  id: string;
  type: 'lost' | 'found'; // مفقود / موجود
  title: string;
  description: string;
  wilayaName: string;
  municipality: string;
  contactPhone: string;
  date: string;
  imageUrl?: string;
  rewardDZD?: number;
  resolved: boolean;
}
