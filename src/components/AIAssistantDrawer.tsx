import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  Bot, 
  User as UserIcon, 
  Loader2, 
  MapPin, 
  Compass, 
  ShoppingBag, 
  FileText,
  RotateCcw
} from 'lucide-react';
import { ALGERIA_WILAYAS } from '../data/wilayas';
import { HakeLogo } from './HakeLogo';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeWilayaId: number;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  activeWilayaId,
}) => {
  const currentWilaya = ALGERIA_WILAYAS.find(w => w.id === activeWilayaId) || ALGERIA_WILAYAS[56];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `مرحباً بك خوية/أختي! 🇩🇿 أنا مساعد "hakeDZ" الذكي (مساعد حَاكْ ديزاد المدعوم بالذكاء الاصطناعي). كيفاش نقدر نعاونك اليوم بخصوص ولاية ${currentWilaya.nameAr}، صياغة إعلانات السوق المحلي، تسهيل الإجراءات الإدارية، أو استطلاعات الرأي؟`,
      timestamp: 'الآن'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    `ما هي الوثائق المطلوبة لاستخراج بطاقة التعريف البيومترية؟`,
    `ساعدني في كتابة إعلان بيع سيارة بالدينار الجزائري لولاية ${currentWilaya.nameAr}`,
    `أبرز المعالم السياحية والفرص الاستثمارية في ولاية ${currentWilaya.nameAr}`,
    `ترجم نصاً من الدارجة إلى العربية الفصحى الرصينة`,
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const message = textToSend || inputText;
    if (!message.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: message,
      timestamp: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: message,
          wilaya: currentWilaya.nameAr,
          history: messages.slice(-4).map(m => ({
            role: m.sender === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }]
          }))
        })
      });

      const data = await res.json();
      const aiReply: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: data.reply || 'عفواً، لم أتمكن من معالجة الطلب في الوقت الحالي. يرجى المحاولة مرة أخرى.',
        timestamp: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      console.error('Error with AI assistant:', err);
      const errorMsg: ChatMessage = {
        id: `ai_err_${Date.now()}`,
        sender: 'ai',
        text: 'حدث خطأ في الاتصال بخدمة الذكاء الاصطناعي. الرجاء التحقق من الاتصال وإعادة المحاولة.',
        timestamp: 'الآن'
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-start animate-in fade-in">
      <div 
        className="w-full max-w-md sm:max-w-lg bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-950 text-white">
          <div className="flex items-center gap-3">
            <HakeLogo size="sm" showText={false} />
            <div>
              <h3 className="font-bold text-sm sm:text-base flex items-center gap-1.5">
                <span>مساعد hakeDZ الذكي</span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full font-mono">Gemini 3.7</span>
              </h3>
              <p className="text-[11px] text-slate-300 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-400" />
                <span>مخصص لولاية {currentWilaya.nameAr} والـ 69 ولاية</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Prompts Carousel */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 overflow-x-auto">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1.5">
            اقتراحات سريعة:
          </span>
          <div className="flex items-center gap-1.5">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                className="text-[11px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-xl whitespace-nowrap hover:border-emerald-500 hover:text-emerald-600 transition shadow-sm"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isUser ? 'bg-emerald-600 text-white' : 'bg-amber-400 text-slate-950 font-bold'
                }`}>
                  {isUser ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`max-w-[82%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                  isUser
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-tl-none whitespace-pre-line'
                }`}>
                  {msg.text}
                  <div className={`text-[10px] mt-1.5 text-left font-mono ${
                    isUser ? 'text-emerald-200' : 'text-slate-400'
                  }`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 p-2">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
              <span>مساعد ديزاد يحلل ويكتب الرد...</span>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="اطرح أي سؤال حول الإجراءات، السوق، أو صياغة المحتوى..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white shadow-md transition"
            >
              <Send className="w-5 h-5 -rotate-90" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
