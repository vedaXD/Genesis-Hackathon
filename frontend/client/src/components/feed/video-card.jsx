import { Heart, MessageCircle, Share2, MapPin, Bookmark } from "lucide-react";
import { useState } from "react";

export function VideoCard({ content, isActive }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-50 via-green-50 to-cyan-50 flex items-center justify-center overflow-hidden">
      {/* Decorative doodles */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-6xl">🌍</div>
        <div className="absolute bottom-20 right-20 text-5xl">🌱</div>
        <div className="absolute top-1/3 right-10 text-4xl">☀️</div>
        <div className="absolute bottom-1/4 left-20 text-5xl">💨</div>
      </div>

      {/* 16:9 Video Container - No Stretch */}
      <div className="relative w-full max-w-5xl mx-auto px-6">
        <div className="relative bg-white border-6 border-black shadow-brutal-xl" style={{ aspectRatio: '16/9' }}>
          <img
            src={content.thumbnail}
            alt={content.title}
            className="w-full h-full object-contain bg-gray-900"
          />
          
          {/* Cartoon overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 pointer-events-none" />

          {/* Top Location Badge */}
          <div className="absolute top-4 left-4 z-10">
            <div className="inline-flex items-center gap-2 bg-white border-4 border-black px-4 py-2 shadow-brutal font-comic">
              <MapPin className="w-5 h-5" strokeWidth={3} />
              <span className="font-black text-sm">{content.location.name}</span>
              <span className="text-xs font-bold text-gray-600">• {content.year}</span>
            </div>
          </div>

          {/* Bottom Content Area */}
          <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
            <div className="bg-white/95 backdrop-blur-sm border-4 border-black p-5 shadow-brutal mb-4">
              {/* Creator */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 border-3 border-black flex items-center justify-center font-black text-lg">
                  🌱
                </div>
                <span className="font-black text-base">@{content.creator}</span>
                <span className="px-3 py-1 bg-yellow-300 border-2 border-black text-xs font-black uppercase">
                  #{content.category}
                </span>
              </div>

              {/* Title & Description */}
              <h2 className="text-2xl font-black mb-2 leading-tight font-comic">{content.title}</h2>
              <p className="text-sm font-bold text-gray-700 mb-3">{content.description}</p>
              
              {/* Stats */}
              <div className="flex gap-3">
                <div className="bg-pink-200 border-3 border-black px-3 py-1 text-sm font-black">
                  ❤️ {liked ? content.likes + 1 : content.likes}
                </div>
                <div className="bg-blue-200 border-3 border-black px-3 py-1 text-sm font-black">
                  💬 {content.comments}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - Outside video, on right */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
          <button
            onClick={handleLike}
            className={`w-14 h-14 flex items-center justify-center border-4 border-black transition-all shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm ${
              liked ? 'bg-pink-400' : 'bg-white'
            }`}
          >
            <Heart
              className="w-7 h-7"
              fill={liked ? "black" : "none"}
              stroke="black"
              strokeWidth={3}
            />
          </button>

          <button className="w-14 h-14 bg-blue-300 border-4 border-black flex items-center justify-center transition-all shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm">
            <MessageCircle className="w-7 h-7" stroke="black" strokeWidth={3} />
          </button>

          <button 
            onClick={() => setSaved(!saved)}
            className={`w-14 h-14 flex items-center justify-center border-4 border-black transition-all shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm ${
              saved ? 'bg-yellow-300' : 'bg-white'
            }`}
          >
            <Bookmark
              className="w-6 h-6"
              fill={saved ? "black" : "none"}
              stroke="black"
              strokeWidth={3}
            />
          </button>

          <button className="w-14 h-14 bg-green-300 border-4 border-black flex items-center justify-center transition-all shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm">
            <Share2 className="w-6 h-6" stroke="black" strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
}
