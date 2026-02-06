import { useState, useRef } from 'react';
import './ChallengeCard.css';

function ChallengeCard({ content, isActive }) {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File too large! Please upload an image smaller than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        
        // Add points to user profile
        const currentPoints = parseInt(localStorage.getItem('userPoints') || '0');
        const newPoints = currentPoints + content.points;
        localStorage.setItem('userPoints', newPoints.toString());
        
        alert(`Challenge Completed! You earned ${content.points} Points!`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShare = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`I completed the ${content.title} challenge and earned ${content.points} Points!`);
    
    const shareUrls = {
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
    };
    
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
      setShowShareMenu(false);
    }
  };

  return (
    <div className="challenge-card">
      <div className="challenge-decorations">
        <div className="challenge-emoji challenge-emoji-1">🌱</div>
        <div className="challenge-emoji challenge-emoji-2">🌍</div>
        <div className="challenge-emoji challenge-emoji-3">💚</div>
        <div className="challenge-emoji challenge-emoji-4">🎯</div>
      </div>

      <div className="challenge-content">
        <div className="challenge-icon-container">
          <div className="challenge-icon-box">
            <div className="challenge-icon">{content.icon}</div>
          </div>
        </div>

        <div className="challenge-title-box">
          <h2 className="challenge-title">📷 {content.title}</h2>
          <p className="challenge-desc">{content.desc}</p>
          <div className="challenge-points">
            🎯 {content.points} Points (₹{content.points} discount)
          </div>
        </div>

        {!uploadedImage ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="challenge-upload"
          >
            <div className="upload-icon">📤</div>
            <h3 className="upload-title">Upload Your Proof</h3>
            <p className="upload-text">Click to upload image (max 5MB)</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="upload-input"
            />
          </div>
        ) : (
          <div className="challenge-completed">
            <div className="uploaded-image-container">
              <img 
                src={uploadedImage} 
                alt="Challenge completed" 
                className="uploaded-image"
              />
              <div className="completion-badge">
                ✓ +{content.points} POINTS!
              </div>
            </div>

            <div className="share-section">
              <h3 className="share-title">Share Your Achievement!</h3>
              
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="share-button"
              >
                📱 Share on Social Media
              </button>

              {showShareMenu && (
                <div className="share-menu">
                  <button onClick={() => handleShare('whatsapp')} className="share-option">
                    WhatsApp
                  </button>
                  <button onClick={() => handleShare('facebook')} className="share-option">
                    Facebook
                  </button>
                  <button onClick={() => handleShare('twitter')} className="share-option">
                    Twitter
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setUploadedImage(null);
                setShowShareMenu(false);
              }}
              className="retake-button"
            >
              Retake Photo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChallengeCard;
