import React, { useState } from 'react';
import { 
  Search, 
  Send, 
  Mic, 
  Image, 
  Phone, 
  MapPin, 
  Check, 
  CheckCheck, 
  MoreVertical,
  Circle,
  Sparkles,
  DollarSign,
  Volume2
} from 'lucide-react';
import { Conversation, Message, User } from '../types';
import { AudioPlayer } from './AudioPlayer';
import { sounds } from '../utils/soundEffects';

interface MessagesViewProps {
  conversations: Conversation[];
  currentUser: User;
  onSendMessage: (conversationId: string, text: string, isAudio?: boolean) => void;
  selectedConversationId?: string;
}

export const MessagesView: React.FC<MessagesViewProps> = ({
  conversations,
  currentUser,
  onSendMessage,
  selectedConversationId,
}) => {
  const [activeConvId, setActiveConvId] = useState<string>(selectedConversationId || conversations[0]?.id || '');
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const fallbackUser: User = {
    id: 'unknown',
    name: 'مستخدم ديزاد',
    handle: 'user',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    wilayaId: 16,
    wilayaName: 'الجزائر',
    municipality: 'سيدي امحمد',
    reputationPoints: 100,
    bio: '',
    joinedDate: '2024',
    coverPhoto: '',
    isVerified: false,
    isBusiness: false,
    followersCount: 0,
    followingCount: 0,
    role: 'user',
    tier: 'free'
  };

  const getParticipant = (conv?: Conversation): User => {
    if (!conv) {
      return fallbackUser;
    }
    if (conv.participant) return conv.participant;
    if (conv.participants && conv.participants.length > 0) return conv.participants[0];
    return fallbackUser;
  };

  const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0];
  const activeParticipant = getParticipant(activeConv);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv) return;
    onSendMessage(activeConv.id, inputText.trim());
    setInputText('');
  };

  const handleSendVoice = () => {
    if (!activeConv) return;
    onSendMessage(activeConv.id, 'تسجيل صوتي (00:42)', true);
    setIsRecording(false);
  };

  const filteredConversations = conversations.filter(c => {
    const p = getParticipant(c);
    const nameMatch = (p.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const wilayaMatch = (p.wilayaName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const msgMatch = (c.lastMessage || '').toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || wilayaMatch || msgMatch;
  });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden h-[calc(100vh-8.5rem)] flex flex-col md:flex-row">
      
      {/* Left List of Conversations */}
      <div className={`w-full md:w-80 border-l border-slate-200 dark:border-slate-700 flex flex-col ${
        activeConvId ? 'hidden md:flex' : 'flex'
      }`}>
        {/* Search */}
        <div className="p-3.5 border-b border-slate-100 dark:border-slate-700">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ابحث في الرسائل والمحادثات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-9 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border-none text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50">
          {filteredConversations.map((conv) => {
            const isSelected = conv.id === activeConvId;
            const participant = getParticipant(conv);
            return (
              <button
                key={conv.id}
                type="button"
                onClick={() => setActiveConvId(conv.id)}
                className={`w-full text-right p-3.5 flex items-start gap-3 transition ${
                  isSelected
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-r-4 border-emerald-600'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-700/40'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={participant.avatar}
                    alt={participant.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-emerald-500"
                  />
                  {participant.isOnline && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-800" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate flex items-center gap-1">
                      {participant.name}
                      {participant.isVerified && <Check className="w-3 h-3 text-emerald-500" />}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono">{conv.lastMessageTime}</span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {conv.lastMessage}
                  </p>

                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                      ولاية {participant.wilayaName}
                    </span>
                    {conv.unreadCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Chat Area */}
      {activeConv ? (
        <div className="flex-1 flex flex-col bg-slate-50/50 dark:bg-slate-900/50">
          
          {/* Chat Header */}
          <div className="p-3.5 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveConvId('')}
                className="md:hidden p-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 text-xs font-bold"
              >
                ← رجوع
              </button>

              <img
                src={activeParticipant.avatar}
                alt={activeParticipant.name}
                className="w-10 h-10 rounded-2xl object-cover border-2 border-emerald-500"
              />

              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  {activeParticipant.name}
                  {activeParticipant.isVerified && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                </h4>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>ولاية {activeParticipant.wilayaName} • {activeParticipant.isOnline ? 'متصل الآن' : 'غير متصل'}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => sounds.playMessageReceived()}
                className="p-2 rounded-xl text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-slate-700 transition"
                title="تجربة صوت نغمة الرسالة الجديدة 🔔"
              >
                <Volume2 className="w-4 h-4" />
              </button>

              {activeParticipant.phone && (
                <a
                  href={`tel:${activeParticipant.phone}`}
                  className="p-2 rounded-xl text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-700 transition"
                  title="اتصال هاتفي"
                >
                  <Phone className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {(activeConv.messages || []).map((msg) => {
              const isMine = msg.senderId === currentUser.id;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[78%] sm:max-w-md p-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                      isMine
                        ? 'bg-emerald-600 text-white rounded-br-none'
                        : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-none'
                    }`}
                  >
                    {msg.mediaType === 'audio' ? (
                      <AudioPlayer
                        duration={msg.audioDuration || '00:42'}
                        authorName={isMine ? 'أنت' : activeParticipant.name}
                      />
                    ) : (
                      <p>{msg.text}</p>
                    )}

                    <div className={`mt-1 flex items-center gap-1 text-[10px] justify-end ${
                      isMine ? 'text-emerald-100' : 'text-slate-400'
                    }`}>
                      <span>{msg.timestamp || msg.createdAt}</span>
                      {isMine && <CheckCheck className="w-3 h-3" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
            {isRecording ? (
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  تسجيل رسالة صوتية (00:35)...
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSendVoice}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow"
                  >
                    إرسال
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRecording(false)}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSend} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsRecording(true)}
                  className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 hover:bg-emerald-100 transition"
                  title="تسجيل صوتي"
                >
                  <Mic className="w-5 h-5" />
                </button>

                <input
                  type="text"
                  placeholder="اكتب رسالتك بالدارجة أو الفصحى..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border-none text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white shadow-md transition"
                >
                  <Send className="w-5 h-5 -rotate-90" />
                </button>
              </form>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400">
          <p className="text-sm font-semibold">اختر محادثة لبدء التواصل</p>
        </div>
      )}
    </div>
  );
};
