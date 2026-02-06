import { ReelContent } from "@/hooks/use-content";
import {
  Heart,
  MessageCircle,
  Share2,
  MapPin,
  Play,
  Pause,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface ReelCardProps {
  reel: ReelContent;
  isActive: boolean;
}

export function ReelCard({ reel, isActive }: ReelCardProps) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(Math.floor(Math.random() * 1000) + 100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  // Auto play/pause based on isActive
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      // Try to play when active
      const playPromise = video.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setShowPlayButton(false);
          })
          .catch((error: unknown) => {
            // Auto-play failed, show play button
            console.log("Auto-play prevented:", error);
            setShowPlayButton(true);
            setIsPlaying(false);
          });
      }
    } else {
      // Pause when not active (scrolled away)
      video.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  return (
    <div className="relative w-full h-full bg-black">
      {/* Background Video/Image */}
      <div className="absolute inset-0" onClick={togglePlayPause}>
        {reel.videoUrl && reel.videoUrl.includes(".mp4") ? (
          <video
            ref={videoRef}
            src={reel.videoUrl}
            className="w-full h-full object-cover"
            loop
            playsInline
            muted={false}
          />
        ) : (
          <img
            src={reel.thumbnail}
            alt={reel.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Play/Pause Button Overlay (Center) */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-20 h-20 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all animate-bounce-in">
              <Play className="w-10 h-10 text-white ml-1" fill="white" />
            </div>
          </div>
        )}
      </div>

      {/* Pause/Play Button (Top Right) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          togglePlayPause();
        }}
        className="absolute top-6 right-6 z-20 w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-black/60"
      >
        {isPlaying ? (
          <Pause className="w-6 h-6 text-white" />
        ) : (
          <Play className="w-6 h-6 text-white ml-0.5" />
        )}
      </button>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col justify-end p-6 pb-24">
        <div className="flex items-end gap-4">
          {/* Left Side - Info */}
          <div className="flex-1 text-white space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full" />
              <span className="font-semibold">@arogya_sathi</span>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-2">{reel.title}</h2>
              <p className="text-sm text-gray-200 mb-3">{reel.description}</p>

              {reel.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{reel.location.name}</span>
                </div>
              )}

              <div className="flex flex-wrap gap-2 mt-3">
                {reel.interests.map((interest) => (
                  <span
                    key={interest}
                    className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs"
                  >
                    #{interest}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Actions */}
          <div className="flex flex-col items-center gap-6 text-white">
            <button
              onClick={handleLike}
              className="flex flex-col items-center gap-1 transition-transform active:scale-90"
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  liked ? "bg-red-500" : "bg-white/20 backdrop-blur-sm"
                }`}
              >
                <Heart className="w-6 h-6" fill={liked ? "white" : "none"} />
              </div>
              <span className="text-xs font-semibold">{likes}</span>
            </button>

            <button className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold">24</span>
            </button>

            <button className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Share2 className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold">Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
