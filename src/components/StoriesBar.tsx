import React, { useState } from 'react';
import { Plus, X, ChevronRight, ChevronLeft, MapPin, Eye } from 'lucide-react';
import { Story, User } from '../types';

interface StoriesBarProps {
  stories: Story[];
  currentUser: User;
  onAddStory: (newStory: Story) => void;
}

export const StoriesBar: React.FC<StoriesBarProps> = ({
  stories,
  currentUser,
  onAddStory,
}) => {
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStoryCaption, setNewStoryCaption] = useState('');
  const [newStoryImage, setNewStoryImage] = useState('');

  const handleCreateStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoryImage) return;

    const newStory: Story = {
      id: `story_${Date.now()}`,
      author: currentUser,
      mediaUrl: newStoryImage,
      mediaType: 'image',
      caption: newStoryCaption || 'قصة جديدة من ولايتي 🇩🇿',
      wilayaName: currentUser.wilayaName,
      createdAt: 'الآن',
      viewedBy: []
    };

    onAddStory(newStory);
    setIsAddModalOpen(false);
    setNewStoryCaption('');
    setNewStoryImage('');
  };

  const activeStory = selectedStoryIndex !== null ? stories[selectedStoryIndex] : null;

  return (
    <>
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-3 sm:p-4 border border-slate-200 dark:border-slate-700/80 shadow-sm mb-4 overflow-hidden">
        <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-thin">
          
          {/* Add Story Button */}
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
          >
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl p-0.5 border-2 border-dashed border-emerald-500 flex items-center justify-center bg-emerald-50 dark:bg-emerald-950/30 group-hover:bg-emerald-100 transition">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-full h-full rounded-xl object-cover opacity-85"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md">
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </div>
            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[64px]">
              قصتي
            </span>
          </button>

          {/* Stories List */}
          {stories.map((story, index) => (
            <button
              key={story.id}
              type="button"
              onClick={() => setSelectedStoryIndex(index)}
              className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl p-0.5 bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-400 group-hover:scale-105 transition">
                <img
                  src={story.mediaUrl}
                  alt={story.author.name}
                  className="w-full h-full rounded-xl object-cover border-2 border-white dark:border-slate-800"
                />
              </div>
              <div className="text-center">
                <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 truncate block max-w-[64px]">
                  {story.author.name.split(' ')[0]}
                </span>
                {story.wilayaName && (
                  <span className="text-[9px] text-emerald-600 dark:text-emerald-400 truncate block max-w-[64px]">
                    {story.wilayaName}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Story Fullscreen Viewer Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
          <div className="relative w-full max-w-sm sm:max-w-md h-[80vh] sm:h-[85vh] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between border border-slate-700">
            
            {/* Top Bar with author info & close */}
            <div className="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-10 flex items-center justify-between text-white">
              <div className="flex items-center gap-2.5">
                <img
                  src={activeStory.author.avatar}
                  alt={activeStory.author.name}
                  className="w-10 h-10 rounded-xl object-cover border border-emerald-400"
                />
                <div>
                  <h4 className="font-bold text-sm leading-tight">{activeStory.author.name}</h4>
                  <p className="text-[11px] text-emerald-300 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>ولاية {activeStory.wilayaName || activeStory.author.wilayaName} • {activeStory.createdAt}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedStoryIndex(null)}
                className="p-2 rounded-full bg-black/40 hover:bg-black/70 text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Story Image / Media */}
            <div className="flex-1 flex items-center justify-center bg-black">
              <img
                src={activeStory.mediaUrl}
                alt="Story media"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Bottom Caption */}
            {activeStory.caption && (
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white z-10 text-right">
                <p className="text-sm font-medium leading-relaxed drop-shadow-md">
                  {activeStory.caption}
                </p>
              </div>
            )}

            {/* Navigation Arrows */}
            {selectedStoryIndex > 0 && (
              <button
                type="button"
                onClick={() => setSelectedStoryIndex(selectedStoryIndex - 1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white z-20"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            {selectedStoryIndex < stories.length - 1 && (
              <button
                type="button"
                onClick={() => setSelectedStoryIndex(selectedStoryIndex + 1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white z-20"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Add Story Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">إضافة قصة جديدة (Story)</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStory} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  رابط الصورة أو اختر من النماذج:
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newStoryImage}
                  onChange={(e) => setNewStoryImage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:ring-2 focus:ring-emerald-500"
                  required
                />
                
                {/* Preset Image Options */}
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {[
                    'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=500&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&auto=format&fit=crop&q=80'
                  ].map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt="Sample"
                      onClick={() => setNewStoryImage(url)}
                      className="h-16 w-full rounded-xl object-cover cursor-pointer hover:opacity-80 border-2 border-transparent hover:border-emerald-500 transition"
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  تعليق القصة:
                </label>
                <textarea
                  rows={2}
                  placeholder="ماذا يحدث اليوم في ولايتك؟ 🇩🇿"
                  value={newStoryCaption}
                  onChange={(e) => setNewStoryCaption(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition"
                >
                  نشر القصة الآن
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-200 transition"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
