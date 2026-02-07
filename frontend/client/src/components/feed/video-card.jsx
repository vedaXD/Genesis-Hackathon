import { Heart, MessageCircle, Share2, MapPin, Bookmark, Subtitles } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function VideoCard({ content, isActive, modalOpen = false }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
  const [currentCaption, setCurrentCaption] = useState('');
  const [captions, setCaptions] = useState([]);
  const videoRef = useRef(null);

  // Load and parse subtitle file from backend
  useEffect(() => {
    if (content.subtitleUrl) {
      console.log('🎬 Loading subtitles from:', content.subtitleUrl);
      fetch(content.subtitleUrl)
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
          }
          return res.text();
        })
        .then(vttText => {
          console.log('📄 VTT text received, length:', vttText.length);
          const parsed = parseVTT(vttText);
          setCaptions(parsed);
          console.log('✅ Loaded captions:', parsed.length, 'cues');
          if (parsed.length > 0) {
            console.log('First cue:', parsed[0]);
          }
        })
        .catch(err => {
          console.error('❌ Could not load subtitles:', err);
          setCaptions([]);
        });
    } else {
      // Subtitle URL missing - backend should auto-generate on next fetch
      console.log('ℹ️ Subtitle URL not available yet, will be auto-generated');
      setCaptions([]);
    }
  }, [content.subtitleUrl]);

  // Parse WebVTT format
  const parseVTT = (vttText) => {
    const lines = vttText.split('\n');
    const cues = [];
    let i = 0;
    
    while (i < lines.length) {
      const line = lines[i].trim();
      
      // Look for timestamp line (contains "-->")
      if (line.includes('-->')) {
        const [startStr, endStr] = line.split('-->');
        const startTime = parseVTTTimestamp(startStr.trim());
        const endTime = parseVTTTimestamp(endStr.trim());
        
        // Next line(s) are the caption text
        i++;
        let text = '';
        while (i < lines.length && lines[i].trim() !== '') {
          text += lines[i].trim() + ' ';
          i++;
        }
        
        if (text.trim()) {
          cues.push({ startTime, endTime, text: text.trim() });
        }
      }
      i++;
    }
    
    return cues;
  };

  // Parse VTT timestamp to seconds
  const parseVTTTimestamp = (timestamp) => {
    const parts = timestamp.split(':');
    const hours = parseInt(parts[0]) || 0;
    const minutes = parseInt(parts[1]) || 0;
    const seconds = parseFloat(parts[2]) || 0;
    return hours * 3600 + minutes * 60 + seconds;
  };

  // Update current caption based on video time
  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      setCurrentCaption('');
      return;
    }

    if (!subtitlesEnabled) {
      setCurrentCaption('');
      return;
    }

    if (captions.length === 0) {
      setCurrentCaption('');
      return;
    }

    const updateCaption = () => {
      const currentTime = video.currentTime;
      const activeCue = captions.find(
        cue => currentTime >= cue.startTime && currentTime <= cue.endTime
      );
      
      const newCaption = activeCue ? activeCue.text : '';
      if (newCaption !== currentCaption) {
        setCurrentCaption(newCaption);
        if (newCaption) {
          console.log('📝 Caption:', newCaption, 'at', currentTime.toFixed(1) + 's');
        }
      }
    };

    video.addEventListener('timeupdate', updateCaption);
    
    // Initial update
    updateCaption();
    
    return () => video.removeEventListener('timeupdate', updateCaption);
  }, [captions, subtitlesEnabled, currentCaption]);

  // Auto-play video when active with improved behavior
  useEffect(() => {
    if (videoRef.current) {
      if (isActive && !modalOpen) {
        // Reset to beginning and auto-play when scrolled into view and modal is closed
        videoRef.current.currentTime = 0;
        videoRef.current
          .play()
          .catch((err) => console.log("Autoplay prevented:", err));
      } else {
        // Pause and reset when scrolled away or modal is open
        videoRef.current.pause();
        if (!isActive) {
          videoRef.current.currentTime = 0;
        }
      }
    }
  }, [isActive, modalOpen]);

  // Toggle subtitles on/off
  const toggleSubtitles = () => {
    setSubtitlesEnabled(!subtitlesEnabled);
  };

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleShare = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(
      `Check out: ${content.title} - ${content.description}`,
    );

    const shareUrls = {
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      telegram: `https://t.me/share/url?url=${url}&text=${text}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "width=600,height=400");
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
        <div
          className="relative bg-white border-6 border-black shadow-brutal-xl"
          style={{ aspectRatio: "9/16" }}
        >
          {content.videoUrl ? (
            <video
              ref={videoRef}
              src={content.videoUrl}
              className="w-full h-full object-cover bg-gray-900"
              loop
              playsInline
              muted={false}
              crossOrigin="anonymous"
              onClick={(e) => {
                if (e.target.paused) {
                  e.target.play();
                } else {
                  e.target.pause();
                }
              }}
            />
          ) : (
            <img
              src={content.thumbnail}
              alt={content.title}
              className="w-full h-full object-contain bg-gray-900"
            />
          )}

          {/* Custom Caption Overlay - From Subtitle Files */}
          {subtitlesEnabled && currentCaption && (
            <div className="absolute bottom-20 left-0 right-0 flex justify-center px-4 pointer-events-none z-50">
              <div className="bg-black border-4 border-white px-6 py-3 max-w-[85%] shadow-brutal-xl animate-fade-in">
                <p className="text-white text-center font-black text-base leading-tight">
                  {currentCaption}
                </p>
              </div>
            </div>
          )}

          {/* Debug Caption Status */}
          {subtitlesEnabled && (
            <div className="absolute top-16 left-4 z-50 bg-green-500 border-2 border-white px-2 py-1 text-xs font-bold text-white">
              CC ON ({captions.length} cues)
            </div>
          )}

          {/* Cartoon overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none" />

          {/* Personalized Badge - Top Right */}
          {content.isPersonalized && (
            <div className="absolute top-4 right-4 z-10 animate-bounce-in">
              <div className="bg-gradient-to-r from-purple-400 to-pink-400 border-4 border-black px-4 py-2 shadow-brutal-sm">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✨</span>
                  <span className="font-black text-white text-sm uppercase">For You</span>
                </div>
              </div>
            </div>
          )}

          {/* Top Location Badge */}
          <div className="absolute top-4 left-4 z-10">
            <div className="inline-flex items-center gap-2 bg-white border-4 border-black px-4 py-2 shadow-brutal font-comic">
              <MapPin className="w-5 h-5" strokeWidth={3} />
              <span className="font-black text-sm">
                {content.location.name}
              </span>
              <span className="text-xs font-bold text-gray-600">
                • {content.year}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons - Outside video, on right */}
        <div className="absolute -right-2 top-1/3 flex flex-col gap-3 z-20">
          <button
            onClick={handleLike}
            className={`w-14 h-14 flex items-center justify-center border-4 border-black transition-all shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm ${
              liked ? "bg-pink-400" : "bg-white"
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
              saved ? "bg-yellow-300" : "bg-white"
            }`}
          >
            <Bookmark
              className="w-6 h-6"
              fill={saved ? "black" : "none"}
              stroke="black"
              strokeWidth={3}
            />
          </button>

          {/* Subtitles Toggle - Shows Pre-generated Captions */}
          <button
            onClick={toggleSubtitles}
            className={`w-14 h-14 flex items-center justify-center border-4 border-black transition-all shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm ${
              subtitlesEnabled ? "bg-purple-300" : "bg-white"
            }`}
            title={subtitlesEnabled ? `Hide Captions (CC ON) ${captions.length ? `- ${captions.length} cues loaded` : ''}` : "Show Captions (CC OFF)"}
          >
            <Subtitles
              className="w-7 h-7"
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
                  onClick={() => handleShare("whatsapp")}
                  className="flex items-center gap-2 p-2 hover:bg-green-100 border-2 border-black font-bold text-sm"
                >
                  <img
                    src="https://static.vecteezy.com/system/resources/previews/016/716/480/non_2x/whatsapp-icon-free-png.png"
                    alt="WhatsApp"
                    className="w-6 h-6"
                  />{" "}
                  WhatsApp
                </button>
                <button
                  onClick={() => handleShare("facebook")}
                  className="flex items-center gap-2 p-2 hover:bg-blue-100 border-2 border-black font-bold text-sm"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Facebook_logo_%28square%29.png/500px-Facebook_logo_%28square%29.png"
                    alt="Facebook"
                    className="w-6 h-6"
                  />{" "}
                  Facebook
                </button>
                <button
                  onClick={() => handleShare("twitter")}
                  className="flex items-center gap-2 p-2 hover:bg-sky-100 border-2 border-black font-bold text-sm"
                >
                  <img
                    src="https://static.vecteezy.com/system/resources/thumbnails/018/930/695/small/twitter-logo-twitter-icon-transparent-free-free-png.png"
                    alt="Twitter"
                    className="w-6 h-6"
                  />{" "}
                  Twitter
                </button>
                <button
                  onClick={() => handleShare("linkedin")}
                  className="flex items-center gap-2 p-2 hover:bg-blue-100 border-2 border-black font-bold text-sm"
                >
                  <img
                    src="https://static.vecteezy.com/system/resources/previews/018/930/480/non_2x/linkedin-logo-linkedin-icon-transparent-free-png.png"
                    alt="LinkedIn"
                    className="w-6 h-6"
                  />{" "}
                  LinkedIn
                </button>
                <button
                  onClick={() => handleShare("telegram")}
                  className="flex items-center gap-2 p-2 hover:bg-cyan-100 border-2 border-black font-bold text-sm"
                >
                  <img
                    src="https://static.vecteezy.com/system/resources/previews/023/986/562/non_2x/telegram-logo-telegram-logo-transparent-telegram-icon-transparent-free-free-png.png"
                    alt="Telegram"
                    className="w-6 h-6"
                  />{" "}
                  Telegram
                </button>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
