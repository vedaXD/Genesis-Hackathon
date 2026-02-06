import { Heart, MessageCircle, Share2, MapPin, Bookmark } from "lucide-react";
import { useState } from "react";

export function VideoCard({ content, isActive }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleShare = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out: ${content.title} - ${content.description}`);
    
    const shareUrls = {
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      telegram: `https://t.me/share/url?url=${url}&text=${text}`
    };
    
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
      setShowShareMenu(false);
    }
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-50 via-green-50 to-cyan-50 flex items-center justify-center overflow-hidden pt-20">
      {/* Decorative doodles */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-6xl">🌍</div>
        <div className="absolute bottom-20 right-20 text-5xl">🌱</div>
        <div className="absolute top-1/3 right-10 text-4xl">☀️</div>
        <div className="absolute bottom-1/4 left-20 text-5xl">💨</div>
      </div>

      {/* 9:16 Mobile Video Container */}
      <div className="relative w-full max-w-md mx-auto px-4">
        <div className="relative bg-white border-6 border-black shadow-brutal-xl" style={{ aspectRatio: '9/16' }}>
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
        <div className="absolute -right-2 top-1/3 flex flex-col gap-3 z-20">
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

          <button className="w-14 h-14 bg-green-300 border-4 border-black flex items-center justify-center transition-all shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm relative">
            <Share2 
              className="w-6 h-6" 
              stroke="black" 
              strokeWidth={3}
              onClick={() => setShowShareMenu(!showShareMenu)}
            />
            {showShareMenu && (
              <div className="absolute right-16 top-0 bg-white border-4 border-black shadow-brutal-xl p-2 flex flex-col gap-2 min-w-[180px] z-30">
                <button 
                  onClick={() => handleShare('whatsapp')}
                  className="flex items-center gap-2 p-2 hover:bg-green-100 border-2 border-black font-bold text-sm"
                >
                  <img src="https://static.vecteezy.com/system/resources/previews/016/716/480/non_2x/whatsapp-icon-free-png.png" alt="WhatsApp" className="w-6 h-6" /> WhatsApp
                </button>
                <button 
                  onClick={() => handleShare('facebook')}
                  className="flex items-center gap-2 p-2 hover:bg-blue-100 border-2 border-black font-bold text-sm"
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Facebook_logo_%28square%29.png/500px-Facebook_logo_%28square%29.png" alt="Facebook" className="w-6 h-6" /> Facebook
                </button>
                <button 
                  onClick={() => handleShare('twitter')}
                  className="flex items-center gap-2 p-2 hover:bg-sky-100 border-2 border-black font-bold text-sm"
                >
                  <img src="https://static.vecteezy.com/system/resources/thumbnails/018/930/695/small/twitter-logo-twitter-icon-transparent-free-free-png.png" alt="Twitter" className="w-6 h-6" /> Twitter
                </button>
                <button 
                  onClick={() => handleShare('linkedin')}
                  className="flex items-center gap-2 p-2 hover:bg-blue-100 border-2 border-black font-bold text-sm"
                >
                  <img src="https://static.vecteezy.com/system/resources/previews/018/930/480/non_2x/linkedin-logo-linkedin-icon-transparent-free-png.png" alt="LinkedIn" className="w-6 h-6" /> LinkedIn
                </button>
                <button 
                  onClick={() => handleShare('telegram')}
                  className="flex items-center gap-2 p-2 hover:bg-cyan-100 border-2 border-black font-bold text-sm"
                >
                  <img src="https://static.vecteezy.com/system/resources/previews/023/986/562/non_2x/telegram-logo-telegram-logo-transparent-telegram-icon-transparent-free-free-png.png" alt="Telegram" className="w-6 h-6" /> Telegram
                </button>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
