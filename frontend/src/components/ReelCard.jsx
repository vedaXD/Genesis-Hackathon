import { useState, useRef, useEffect } from 'react';
import './ReelCard.css';

function ReelCard({ videoUrl, isActive }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive && isPlaying) {
      video.play().catch(console.error);
    } else {
      video.pause();
    }
  }, [isActive, isPlaying]);

  // Auto-pause when scrolled away
  useEffect(() => {
    if (!isActive && isPlaying) {
      setIsPlaying(false);
    }
  }, [isActive]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  const handleLike = () => {
    alert('❤️ Liked!');
  };

  const handleComment = () => {
    alert('💬 Comment feature coming soon!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this sustainability reel!',
        url: window.location.href
      }).catch(console.error);
    } else {
      alert('📱 Share feature coming soon!');
    }
  };

  return (
    <div className="reel-card">
      <video
        ref={videoRef}
        className="reel-video"
        src={videoUrl}
        loop
        playsInline
        onClick={() => setShowControls(!showControls)}
      />

      {/* Gradient Overlay */}
      <div className="reel-overlay"></div>

      {/* Play/Pause Button */}
      {showControls && (
        <button 
          className="play-pause-btn"
          onClick={togglePlayPause}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
      )}

      {/* Right Side Actions */}
      <div className="reel-actions">
        <button onClick={handleLike} className="action-btn">
          <span className="action-icon">❤️</span>
          <span className="action-text">Like</span>
        </button>
        
        <button onClick={handleComment} className="action-btn">
          <span className="action-icon">💬</span>
          <span className="action-text">Comment</span>
        </button>
        
        <button onClick={handleShare} className="action-btn">
          <span className="action-icon">📤</span>
          <span className="action-text">Share</span>
        </button>
      </div>

      {/* Bottom Info */}
      <div className="reel-info">
        <div className="reel-title">🌱 Sustainability Reel</div>
        <div className="reel-desc">Learn about making positive environmental impact</div>
      </div>
    </div>
  );
}

export default ReelCard;
