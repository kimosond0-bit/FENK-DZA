import React, { useState, useEffect } from 'react';
import { 
  INITIAL_POSTS, 
  INITIAL_STORIES, 
  INITIAL_MOMENTS, 
  INITIAL_COMMUNITIES, 
  INITIAL_MARKETPLACE, 
  INITIAL_CONVERSATIONS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_REPORTS, 
  INITIAL_BUSINESSES, 
  INITIAL_LOST_AND_FOUND, 
  CURRENT_USER, 
  OWNER_USER,
  OWNER_PHONE,
  USERS_DIRECTORY 
} from './data/initialData';
import { ALGERIA_WILAYAS } from './data/wilayas';
import { 
  Post, 
  Story, 
  Moment, 
  Community, 
  MarketplaceItem, 
  Conversation, 
  Notification, 
  ReportItem, 
  User, 
  UserRole,
  Comment 
} from './types';

// Components
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { StoriesBar } from './components/StoriesBar';
import { PostCard } from './components/PostCard';
import { CreatePostModal } from './components/CreatePostModal';
import { CommentsDrawer } from './components/CommentsDrawer';
import { MyRegionView } from './components/MyRegionView';
import { MomentsView } from './components/MomentsView';
import { MarketplaceView } from './components/MarketplaceView';
import { CommunitiesView } from './components/CommunitiesView';
import { MessagesView } from './components/MessagesView';
import { CommunityVoiceView } from './components/CommunityVoiceView';
import { ProfileView } from './components/ProfileView';
import { NotificationsView } from './components/NotificationsView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { AuthModal } from './components/AuthModal';
import { SplashScreen } from './components/SplashScreen';
import { sounds } from './utils/soundEffects';

// Lucide Icons
import { 
  MapPin, 
  Vote, 
  Sparkles, 
  TrendingUp, 
  Building2, 
  Phone, 
  Plus, 
  Check, 
  Search,
  Compass,
  ArrowRight,
  Sun,
  ShieldCheck,
  Crown
} from 'lucide-react';

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // App Initial Splash & Onboarding State
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('register');

  // App core state (Default to OWNER_USER: الحساب الوحيد صاحب لوحة التحكم الشاملة)
  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const cached = localStorage.getItem('hakedz_current_user') || localStorage.getItem('fenkdz_current_user');
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {
      // fallback
    }
    return OWNER_USER;
  });

  const [activeWilayaId, setActiveWilayaId] = useState<number>(16); // Default 16 (Algiers / Central Admin)
  const [activeTab, setActiveTab] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Drawers state
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeCommentsPost, setActiveCommentsPost] = useState<Post | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);

  // Splash Screen completion handler -> Opens registration modal immediately
  const handleSplashFinish = () => {
    setShowSplash(false);
    setAuthModalMode('register');
    setIsAuthModalOpen(true);
    sounds.playPop();
  };

  // Save currentUser in localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hakedz_current_user', JSON.stringify(currentUser));
    } catch (e) {
      // ignore
    }
  }, [currentUser]);

  // Data collections state
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);
  const [moments, setMoments] = useState<Moment[]>(INITIAL_MOMENTS);
  const [communities, setCommunities] = useState<Community[]>(INITIAL_COMMUNITIES);
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>(INITIAL_MARKETPLACE);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [reports, setReports] = useState<ReportItem[]>(INITIAL_REPORTS);
  const [users, setUsers] = useState<User[]>(USERS_DIRECTORY);

  // Sync Dark Mode class to document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const activeWilaya = ALGERIA_WILAYAS.find(w => w.id === activeWilayaId) || ALGERIA_WILAYAS[56];

  // Calculated unread counters
  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);
  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  // --- Handlers ---

  // Post Actions
  const handleLikePost = (postId: string) => {
    let wasLiked = false;
    setPosts(prev => prev.map(post => {
      if (post.id !== postId) return post;
      const alreadyLiked = post.likes.includes(currentUser.id);
      wasLiked = !alreadyLiked;
      const newLikes = alreadyLiked 
        ? post.likes.filter(id => id !== currentUser.id)
        : [...post.likes, currentUser.id];
      return { ...post, likes: newLikes };
    }));

    if (wasLiked) {
      sounds.playLike();
    } else {
      sounds.playUnlike();
    }
  };

  const handleBookmarkPost = (postId: string) => {
    // handled locally or stored
  };

  const handleVotePoll = (postId: string, optionId: string) => {
    sounds.playVote();
    setPosts(prev => prev.map(post => {
      if (post.id !== postId || !post.pollData) return post;
      const poll = post.pollData;
      if (poll.userVotedOptionId === optionId) return post; // already voted this option

      const updatedOptions = poll.options.map(opt => {
        let votes = opt.votes;
        let voters = [...opt.voters];

        if (poll.userVotedOptionId === opt.id) {
          votes = Math.max(0, votes - 1);
          voters = voters.filter(id => id !== currentUser.id);
        }
        if (opt.id === optionId) {
          votes += 1;
          voters.push(currentUser.id);
        }
        return { ...opt, votes, voters };
      });

      return {
        ...post,
        pollData: {
          ...poll,
          options: updatedOptions,
          userVotedOptionId: optionId,
          totalVotes: (poll.totalVotes || 0) + (poll.userVotedOptionId ? 0 : 1)
        }
      };
    }));
  };

  const handleReportPost = (post: Post) => {
    const newReport: ReportItem = {
      id: `rep_${Date.now()}`,
      reporter: currentUser,
      targetType: 'post',
      targetId: post.id,
      targetContent: post.content.slice(0, 80),
      reason: 'محتوى مخالف لسياسة المجتمع المحلي',
      status: 'pending',
      createdAt: 'الآن'
    };
    setReports(prev => [newReport, ...prev]);
    alert('شكراً لك. تم إرسال البلاغ إلى فريق الإشراف للمراجعة 🇩🇿');
  };

  const handleTipDZD = (post: Post, amount: number) => {
    sounds.playTip();
    alert(`تم إرسال إكرامية ودعم بقيمة ${amount} دج للكاتب ${post.author.name}! 🇩🇿 شكراً لتشجيع صناع المحتوى.`);
  };

  const handleAddPost = (newPost: Post) => {
    sounds.playVote();
    setPosts(prev => [newPost, ...prev]);
  };

  const handleAddStory = (newStory: Story) => {
    sounds.playVote();
    setStories(prev => [newStory, ...prev]);
  };

  const handleAddComment = (postId: string, text: string, isVoice?: boolean) => {
    sounds.playComment();
    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      author: currentUser,
      content: text,
      audioUrl: isVoice ? 'voice_sim' : undefined,
      audioDuration: isVoice ? '00:30' : undefined,
      likes: 0,
      createdAt: 'الآن'
    };

    setPosts(prev => prev.map(post => {
      if (post.id !== postId) return post;
      return {
        ...post,
        commentsCount: post.commentsCount + 1,
        commentsList: [newComment, ...(post.commentsList || [])]
      };
    }));

    if (activeCommentsPost && activeCommentsPost.id === postId) {
      setActiveCommentsPost(prev => prev ? {
        ...prev,
        commentsCount: prev.commentsCount + 1,
        commentsList: [newComment, ...(prev.commentsList || [])]
      } : null);
    }
  };

  const handleLikeComment = (commentId: string) => {
    sounds.playLike();
    if (!activeCommentsPost) return;
    const updated = (activeCommentsPost.commentsList || []).map(c => {
      if (c.id === commentId) {
        return { ...c, isLiked: !c.isLiked, likes: c.isLiked ? c.likes - 1 : c.likes + 1 };
      }
      return c;
    });
    setActiveCommentsPost({ ...activeCommentsPost, commentsList: updated });
  };

  // Moments Actions
  const handleLikeMoment = (momentId: string) => {
    sounds.playLike();
    setMoments(prev => prev.map(m => {
      if (m.id !== momentId) return m;
      return {
        ...m,
        isLiked: !m.isLiked,
        likesCount: m.isLiked ? m.likesCount - 1 : m.likesCount + 1
      };
    }));
  };

  const handleShareMoment = (moment: Moment) => {
    navigator.clipboard?.writeText(window.location.href);
    alert(`تم نسخ رابط لحظة "${moment.title}" للمشاركة! 🇩🇿`);
  };

  // Marketplace Actions
  const handleAddMarketItem = (newItem: MarketplaceItem) => {
    sounds.playVote();
    setMarketplaceItems(prev => [newItem, ...prev]);
  };

  const handleOpenChatWithSeller = (seller: User) => {
    let existing = conversations.find(c => c.participant.id === seller.id);
    if (!existing) {
      existing = {
        id: `conv_${Date.now()}`,
        participant: seller,
        lastMessage: 'مرحباً، أنا مهتم بالإعلان الخاص بك',
        lastMessageTime: 'الآن',
        unreadCount: 0,
        messages: []
      };
      setConversations([existing, ...conversations]);
    }
    setActiveTab('messages');
  };

  // Communities Actions
  const handleJoinCommunityToggle = (communityId: string) => {
    setCommunities(prev => prev.map(c => {
      if (c.id !== communityId) return c;
      const joined = !c.isJoined;
      return {
        ...c,
        isJoined: joined,
        membersCount: joined ? c.membersCount + 1 : c.membersCount - 1
      };
    }));
  };

  // Chat Actions
  const handleSendMessage = (conversationId: string, text: string, isAudio?: boolean) => {
    sounds.playMessageSent();
    const newMsg = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      text,
      mediaType: isAudio ? 'audio' as const : 'text' as const,
      audioDuration: isAudio ? '00:35' : undefined,
      timestamp: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' }),
      isRead: true
    };

    setConversations(prev => prev.map(c => {
      if (c.id !== conversationId) return c;
      return {
        ...c,
        lastMessage: isAudio ? '🎙️ رسالة صوتية' : text,
        lastMessageTime: 'الآن',
        messages: [...c.messages, newMsg]
      };
    }));

    // Simulate instant Algerian reply from the other participant with Distinct Message Alert Sound
    setTimeout(() => {
      sounds.playMessageReceived();
      const replyMsg = {
        id: `msg_rep_${Date.now()}`,
        senderId: 'partner',
        text: isAudio ? 'صحا خويا سمعت التسجيل، ربي يحفظك!' : 'يعطيك الصحة خويا، راني متواجد ونقدر نتفاهمو في التفاصيل مرحبا بك 🇩🇿',
        mediaType: 'text' as const,
        timestamp: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' }),
        isRead: true
      };
      setConversations(prev => prev.map(c => {
        if (c.id !== conversationId) return c;
        return {
          ...c,
          lastMessage: replyMsg.text,
          lastMessageTime: 'الآن',
          messages: [...c.messages, replyMsg]
        };
      }));
    }, 1200);
  };

  // Notifications Actions
  const handleMarkNotificationAsRead = (notifId: string) => {
    sounds.playNotification();
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, isRead: true } : n));
  };

  const handleMarkAllNotificationsAsRead = () => {
    sounds.playNotification();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Admin / Owner User Management Actions
  const handleResolveReport = (reportId: string, action: 'dismissed' | 'resolved') => {
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: action } : r));
  };

  const handleAddUser = (newUser: User) => {
    setUsers(prev => [newUser, ...prev]);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    setPosts(prev => prev.filter(p => p.author.id !== userId));
  };

  const handleUpdateUserRole = (userId: string, newRole: UserRole) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    if (currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, role: newRole }));
    }
  };

  const handleToggleSupremeBadge = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== userId) return u;
      const nextState = !u.hasSupremeBadge;
      return {
        ...u,
        hasSupremeBadge: nextState,
        badge: nextState ? '👑 شارة حَاكْ العليا' : (u.isBusiness ? 'متجر موثق 🏪' : 'مواطن نشط ⭐')
      };
    }));

    if (currentUser.id === userId) {
      setCurrentUser(prev => {
        const nextState = !prev.hasSupremeBadge;
        return {
          ...prev,
          hasSupremeBadge: nextState,
          badge: nextState ? '👑 شارة حَاكْ العليا' : (prev.isBusiness ? 'متجر موثق 🏪' : 'مواطن نشط ⭐')
        };
      });
    }

    setPosts(prev => prev.map(p => {
      if (p.author.id !== userId) return p;
      const nextState = !p.author.hasSupremeBadge;
      return {
        ...p,
        author: {
          ...p.author,
          hasSupremeBadge: nextState,
          badge: nextState ? '👑 شارة حَاكْ العليا' : (p.author.isBusiness ? 'متجر موثق 🏪' : 'مواطن نشط ⭐')
        }
      };
    }));
  };

  const handleToggleVerifyUser = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isVerified: !u.isVerified } : u));
    if (currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, isVerified: !prev.isVerified }));
    }
  };

  const handleToggleBanUser = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isBanned: !u.isBanned } : u));
  };

  const handleUpdateUserPoints = (userId: string, points: number) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, reputationPoints: points } : u));
    if (currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, reputationPoints: points }));
    }
  };

  // Auth & Account Creation Actions
  const handleLoginSuccess = (newUser: User) => {
    setCurrentUser(newUser);
    setUsers(prev => {
      const exists = prev.some(u => u.id === newUser.id);
      return exists ? prev : [newUser, ...prev];
    });
    if (newUser.wilayaId) {
      setActiveWilayaId(newUser.wilayaId);
    }
    setViewingUser(null);
  };

  // Filtered posts for search
  const displayedPosts = posts.filter(p => {
    if (!searchQuery.trim()) return true;
    return p.content.includes(searchQuery) || 
           p.author.name.includes(searchQuery) || 
           p.wilayaName?.includes(searchQuery) ||
           p.tags?.some(t => t.includes(searchQuery));
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      
      {/* Top Main Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        activeWilayaId={activeWilayaId}
        onSelectWilaya={setActiveWilayaId}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        unreadMessagesCount={unreadMessagesCount}
        unreadNotificationsCount={unreadNotificationsCount}
        onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
        onOpenCreatePost={() => setIsCreatePostOpen(true)}
        onOpenAuthModal={(mode) => {
          setAuthModalMode(mode === 'login' ? 'login' : 'register');
          setIsAuthModalOpen(true);
        }}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Layout Container */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 pt-4 flex-1 w-full flex gap-6">
        
        {/* Left Sidebar (Desktop Navigation) */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          currentUser={currentUser}
          activeWilayaId={activeWilayaId}
          unreadMessagesCount={unreadMessagesCount}
          unreadNotificationsCount={unreadNotificationsCount}
          onOpenCreatePost={() => setIsCreatePostOpen(true)}
          onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
          onOpenAuthModal={() => {
            setAuthModalMode('login');
            setIsAuthModalOpen(true);
          }}
        />

        {/* Center Main Dynamic Content Area */}
        <section className="flex-1 min-w-0 max-w-3xl min-h-[calc(100vh-6.5rem)] pb-20 lg:pb-8">
          
          {/* TAB 1: Home Feed */}
          {activeTab === 'home' && (
            <div className="space-y-4">
              {/* Stories Bar */}
              <StoriesBar
                stories={stories}
                currentUser={currentUser}
                onAddStory={handleAddStory}
              />

              {/* Quick Create Post Card Banner */}
              <div 
                onClick={() => setIsCreatePostOpen(true)}
                className="bg-white dark:bg-slate-800/90 rounded-3xl p-4 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:border-emerald-400 transition cursor-pointer flex items-center gap-3"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-11 h-11 rounded-2xl object-cover border border-emerald-500 shrink-0"
                />
                <div className="flex-1 bg-slate-100 dark:bg-slate-900/60 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-400 font-medium">
                  شارك فكرة، خبراً، استطلاعاً، أو اعرض سلعة في ولاية {activeWilaya.nameAr} 🇩🇿...
                </div>
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-sm hover:bg-emerald-700 transition shrink-0 hidden sm:block"
                >
                  نشر جديد
                </button>
              </div>

              {/* Posts Stream */}
              {displayedPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUser={currentUser}
                  onLike={handleLikePost}
                  onOpenComments={(p) => setActiveCommentsPost(p)}
                  onShare={(p) => alert(`تم نسخ رابط منشور "${p.content.slice(0, 30)}..."`)}
                  onBookmark={handleBookmarkPost}
                  onVotePoll={handleVotePoll}
                  onReport={handleReportPost}
                  onTipDZD={handleTipDZD}
                  onSelectUser={(u) => {
                    setViewingUser(u);
                    setActiveTab('profile');
                  }}
                />
              ))}
            </div>
          )}

          {/* TAB 2: My Region (69 Wilayas Hub) */}
          {activeTab === 'region' && (
            <MyRegionView
              activeWilayaId={activeWilayaId}
              onSelectWilaya={setActiveWilayaId}
              posts={posts}
              marketplaceItems={marketplaceItems}
              businesses={INITIAL_BUSINESSES}
              lostAndFound={INITIAL_LOST_AND_FOUND}
              currentUser={currentUser}
              onLikePost={handleLikePost}
              onOpenComments={(p) => setActiveCommentsPost(p)}
              onSharePost={(p) => alert('تمت المشاركة بنجاح!')}
              onBookmarkPost={handleBookmarkPost}
              onVotePoll={handleVotePoll}
              onReportPost={handleReportPost}
              onTipDZD={handleTipDZD}
              onOpenCreatePost={() => setIsCreatePostOpen(true)}
              onSelectMarketItem={(item) => handleOpenChatWithSeller(item.seller)}
            />
          )}

          {/* TAB 3: Community Voice (Democratic Polls & Debates) */}
          {activeTab === 'voice' && (
            <CommunityVoiceView
              posts={posts}
              currentUser={currentUser}
              activeWilayaId={activeWilayaId}
              onLikePost={handleLikePost}
              onOpenComments={(p) => setActiveCommentsPost(p)}
              onSharePost={(p) => alert('تمت المشاركة بنجاح!')}
              onBookmarkPost={handleBookmarkPost}
              onVotePoll={handleVotePoll}
              onReportPost={handleReportPost}
              onTipDZD={handleTipDZD}
              onOpenCreatePoll={() => setIsCreatePostOpen(true)}
            />
          )}

          {/* TAB 4: Moments (Reels / Short Video) */}
          {activeTab === 'moments' && (
            <MomentsView
              moments={moments}
              currentUser={currentUser}
              onLikeMoment={handleLikeMoment}
              onShareMoment={handleShareMoment}
            />
          )}

          {/* TAB 5: Communities & Groups */}
          {activeTab === 'communities' && (
            <CommunitiesView
              communities={communities}
              currentUser={currentUser}
              onJoinToggle={handleJoinCommunityToggle}
              posts={posts}
              onLikePost={handleLikePost}
              onOpenComments={(p) => setActiveCommentsPost(p)}
              onSharePost={(p) => alert('تمت المشاركة!')}
              onBookmarkPost={handleBookmarkPost}
              onVotePoll={handleVotePoll}
              onReportPost={handleReportPost}
              onTipDZD={handleTipDZD}
              onOpenCreatePost={() => setIsCreatePostOpen(true)}
            />
          )}

          {/* TAB 6: Marketplace in DZD */}
          {activeTab === 'marketplace' && (
            <MarketplaceView
              items={marketplaceItems}
              currentUser={currentUser}
              activeWilayaId={activeWilayaId}
              onSelectWilaya={setActiveWilayaId}
              onAddItem={handleAddMarketItem}
              onOpenChatWithSeller={handleOpenChatWithSeller}
            />
          )}

          {/* TAB 7: Messages */}
          {activeTab === 'messages' && (
            <MessagesView
              conversations={conversations}
              currentUser={currentUser}
              onSendMessage={handleSendMessage}
            />
          )}

          {/* TAB 8: Notifications */}
          {activeTab === 'notifications' && (
            <NotificationsView
              notifications={notifications}
              onMarkAsRead={handleMarkNotificationAsRead}
              onMarkAllAsRead={handleMarkAllNotificationsAsRead}
            />
          )}

          {/* TAB 9: Profile */}
          {activeTab === 'profile' && (
            <ProfileView
              user={viewingUser || currentUser}
              currentUser={currentUser}
              userPosts={posts.filter(p => p.author.id === (viewingUser?.id || currentUser.id))}
              userMarketItems={marketplaceItems.filter(m => m.seller.id === (viewingUser?.id || currentUser.id))}
              savedPosts={posts.slice(0, 2)}
              onLikePost={handleLikePost}
              onOpenComments={(p) => setActiveCommentsPost(p)}
              onSharePost={(p) => alert('تمت المشاركة')}
              onBookmarkPost={handleBookmarkPost}
              onVotePoll={handleVotePoll}
              onReportPost={handleReportPost}
              onTipDZD={handleTipDZD}
              onUpdateBio={(b) => setCurrentUser(prev => ({ ...prev, bio: b }))}
              onOpenAuthModal={() => setIsAuthModalOpen(true)}
            />
          )}

          {/* TAB 10: Admin Dashboard */}
          {activeTab === 'admin' && (
            <AdminDashboardView
              currentUser={currentUser}
              users={users}
              posts={posts}
              reports={reports}
              onAddUser={handleAddUser}
              onDeleteUser={handleDeleteUser}
              onUpdateUserRole={handleUpdateUserRole}
              onToggleSupremeBadge={handleToggleSupremeBadge}
              onToggleVerifyUser={handleToggleVerifyUser}
              onToggleBanUser={handleToggleBanUser}
              onUpdateUserPoints={handleUpdateUserPoints}
              onResolveReport={handleResolveReport}
              onOpenAuthModal={() => setIsAuthModalOpen(true)}
            />
          )}
        </section>

        {/* Right Sticky Sidebar Widgets (Desktop Only) */}
        <aside className="hidden xl:flex flex-col w-80 shrink-0 sticky top-20 h-[calc(100vh-5.5rem)] pb-4 space-y-4 overflow-y-auto">
          
          {/* Widget 1: Active Wilaya Spotlight */}
          <div className="bg-gradient-to-tr from-emerald-800 to-teal-900 rounded-3xl p-4 text-white shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
                ولاية اليوم 🇩🇿
              </span>
              <span className="text-xs font-mono font-bold text-amber-300">
                ولاية {activeWilaya.code}
              </span>
            </div>

            <h4 className="font-bold text-base">ولاية {activeWilaya.nameAr}</h4>
            <p className="text-xs text-emerald-100 mt-1 line-clamp-2">
              {activeWilaya.landmark || 'أصالة، تاريخ عريق، وفرص تنموية وتجارية واعدة'}
            </p>

            <button
              type="button"
              onClick={() => setActiveTab('region')}
              className="mt-3 w-full py-2 rounded-xl bg-white text-emerald-950 font-bold text-xs hover:bg-emerald-50 transition shadow"
            >
              استكشف خدمات وسوق الولاية ←
            </button>
          </div>

          {/* Widget 2: Trending Poll / Community Voice */}
          <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-4 border border-slate-200 dark:border-slate-700/80 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                <Vote className="w-4 h-4 text-amber-500" />
                <span>استطلاع رأي متصدر:</span>
              </h4>
              <span className="text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full font-bold">
                صوت المجتمع
              </span>
            </div>

            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-3">
              هل تؤيد توسيع شبكة النقل الحضري FUNK TAXI لتشمل كامل بلديات الولاية؟
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => alert('تم تسجيل صوتك في الاستطلاع المجتمعي! 🇩🇿')}
                className="w-full text-right p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between group transition"
              >
                <span>نعم، بشدة 🚕</span>
                <span className="text-[11px] font-mono text-emerald-600">89%</span>
              </button>

              <button
                type="button"
                onClick={() => alert('تم تسجيل صوتك!')}
                className="w-full text-right p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-400 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between transition"
              >
                <span>أفضل خيارات أخرى</span>
                <span className="text-[11px] font-mono text-slate-400">11%</span>
              </button>
            </div>
          </div>

          {/* Widget 3: Local Services Spotlight (e.g., FUNK TAXI) */}
          <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-4 border border-slate-200 dark:border-slate-700/80 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>خدمات مميزة بالولاية:</span>
              </h4>
              <span className="text-[10px] text-emerald-600 font-bold">معتمد ✓</span>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-lg shrink-0">
                🚕
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="font-bold text-xs text-slate-900 dark:text-white">FUNK TAXI الجزائر</h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">نقل وسيارات أجرة بين الولايات والبلديات</p>
                <a
                  href="tel:0550000001"
                  className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 hover:underline"
                >
                  <Phone className="w-3 h-3" />
                  <span>اتصال أو حجز رحلة</span>
                </a>
              </div>
            </div>
          </div>

          {/* Widget 4: Trending Algerian Hashtags */}
          <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-4 border border-slate-200 dark:border-slate-700/80 shadow-sm">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>الأكثر تداولاً في الجزائر:</span>
            </h4>

            <div className="space-y-1.5 text-xs">
              {[
                { tag: '#ولاية_المغير', count: '14.2K منشور' },
                { tag: '#سوق_السيارات_DZD', count: '38.5K منشور' },
                { tag: '#صوت_المجتمع', count: '9.8K استطلاع' },
                { tag: '#تمور_دقلة_نور', count: '12.1K إعلان' },
                { tag: '#ديزاد_كونكت', count: '55.0K تفاعل' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setSearchQuery(item.tag)}
                  className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center justify-between cursor-pointer transition"
                >
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{item.tag}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>

      {/* Mobile Sticky Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        unreadMessagesCount={unreadMessagesCount}
        onOpenCreatePost={() => setIsCreatePostOpen(true)}
        activeWilayaId={activeWilayaId}
        currentUser={currentUser}
      />

      {/* Create Post / Poll Modal with Gemini AI Refinement */}
      <CreatePostModal
        currentUser={currentUser}
        activeWilayaId={activeWilayaId}
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onSubmitPost={handleAddPost}
      />

      {/* Comments Drawer with Voice Note Support */}
      <CommentsDrawer
        post={activeCommentsPost}
        currentUser={currentUser}
        comments={activeCommentsPost?.commentsList || [
          {
            id: 'c1',
            author: USERS_DIRECTORY[1],
            content: 'ما شاء الله مبادرة ممتازة وتخدم سكان الولاية كامل! 🇩🇿',
            likes: 14,
            createdAt: 'منذ ساعتين'
          },
          {
            id: 'c2',
            author: USERS_DIRECTORY[2],
            content: 'تسجيل صوتي من تاجر محلي في سوق المغير',
            audioUrl: 'voice',
            audioDuration: '00:45',
            likes: 8,
            createdAt: 'منذ ساعة'
          }
        ]}
        isOpen={!!activeCommentsPost}
        onClose={() => setActiveCommentsPost(null)}
        onAddComment={handleAddComment}
        onLikeComment={handleLikeComment}
      />

      {/* Gemini AI Assistant Drawer */}
      <AIAssistantDrawer
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        activeWilayaId={activeWilayaId}
      />

      {/* Authentication & Registration Modal (Mandatory Algerian Phone Verification) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        availableUsers={users}
        defaultMode={authModalMode}
      />

      {/* Initial Animated Brand Splash Screen */}
      {showSplash && (
        <SplashScreen onFinish={handleSplashFinish} />
      )}
    </div>
  );
}
