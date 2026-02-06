import './ReelDisplay.css'
import { useState } from 'react'

function ReelDisplay({ reel, onReset }) {
  const [showShareMenu, setShowShareMenu] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  // Map interests to relevant sustainability resources
  const getReelLink = (interests) => {
    const linkMap = {
      'heritage': 'https://whc.unesco.org/en/list/',
      'nature': 'https://www.worldwildlife.org/',
      'food': 'https://www.fao.org/sustainability/en/',
      'adventure': 'https://sustainabletravel.org/',
      'festivals': 'https://www.greenpeace.org/international/',
      'architecture': 'https://www.usgbc.org/leed',
      'beaches': 'https://www.oceanconservancy.org/',
      'mountains': 'https://www.mountainpartnership.org/',
      'cities': 'https://www.c40.org/',
      'spirituality': 'https://www.greenfaith.org/',
      'art': 'https://www.coalitionforartandsustainability.org/',
      'villages': 'https://www.ruraldevelopment.org/',
      'yoga': 'https://www.yogajournal.com/lifestyle/wellness/',
      'music': 'https://www.earthday.org/',
      'textiles': 'https://apparelcoalition.org/',
      'wildlife': 'https://www.cites.org/',
      'tea': 'https://www.rainforest-alliance.org/',
      'temples': 'https://www.sacredland.org/',
      'markets': 'https://sustainablemarkets.org/',
      'waterfall': 'https://www.waterkeeper.org/',
      'desert': 'https://www.unccd.int/',
      'railways': 'https://www.railway-technology.com/features/sustainable-rail/'
    };
    
    // Return link based on first interest or default
    return linkMap[interests[0]] || 'https://www.un.org/sustainabledevelopment/';
  };

  const handleDownload = () => {
    alert('In production, this would download your generated reel!')
  }

  const handleShare = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out my AI-generated reel about ${reel.interests.join(', ')}!`);
    
    const shareUrls = {
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      telegram: `https://t.me/share/url?url=${url}&text=${text}`,
      instagram: 'https://www.instagram.com/' // Opens Instagram (can't directly share)
    };
    
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
      setShowShareMenu(false);
    }
  }

  const handleVideoClick = () => {
    const link = getReelLink(reel.interests);
    window.open(link, '_blank');
  }

  return (
    <div className="reel-display fade-in">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: '100%' }}></div>
      </div>
      
      <div className="success-header">
        <div className="success-icon">🎉</div>
        <h2 className="selector-title">Your Reel is Ready!</h2>
        <p className="selector-subtitle">
          Check out your AI-generated content below
        </p>
      </div>

      <div className="reel-content">
        <div className="reel-preview card">
          <div className="preview-thumbnail" onClick={handleVideoClick} style={{ cursor: 'pointer' }}>
            <img src={reel.thumbnail} alt="Reel Preview" />
            <div className="play-overlay">
              <div className="play-button">▶</div>
            </div>
            <div className="duration-badge">{reel.duration}s</div>
            <div className="click-hint" style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              background: 'rgba(0,0,0,0.7)',
              color: 'white',
              padding: '5px 10px',
              borderRadius: '5px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              🔗 Click to learn more
            </div>
          </div>
        </div>

        <div className="reel-details card">
          <h3>Reel Details</h3>
          
          <div className="detail-row">
            <span className="detail-label">Interests:</span>
            <div className="detail-value">
              {reel.interests.map((interest) => (
                <span key={interest} className="interest-tag">{interest}</span>
              ))}
            </div>
          </div>

          {reel.location && (
            <div className="detail-row">
              <span className="detail-label">Location:</span>
              <span className="detail-value">
                {reel.location.name}
                <span className="coords-small">
                  ({reel.location.lat.toFixed(2)}, {reel.location.lng.toFixed(2)})
                </span>
              </span>
            </div>
          )}

          <div className="detail-row">
            <span className="detail-label">Style:</span>
            <span className="detail-value">{reel.style}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Duration:</span>
            <span className="detail-value">{reel.duration} seconds</span>
          </div>

          {reel.additionalNotes && (
            <div className="detail-row">
              <span className="detail-label">Notes:</span>
              <span className="detail-value">{reel.additionalNotes}</span>
            </div>
          )}

          <div className="detail-row">
            <span className="detail-label">Created:</span>
            <span className="detail-value">{formatDate(reel.createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="action-grid">
        <button className="button button-primary" onClick={handleDownload}>
          <span>⬇️</span>
          Download Reel
        </button>
        <div style={{ position: 'relative' }}>
          <button className="button button-success" onClick={() => setShowShareMenu(!showShareMenu)}>
            <span>📤</span>
            Share
          </button>
          {showShareMenu && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: '0',
              marginTop: '10px',
              background: 'white',
              border: '3px solid black',
              boxShadow: '5px 5px 0 black',
              padding: '10px',
              zIndex: 1000,
              minWidth: '200px'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '10px', borderBottom: '2px solid black', paddingBottom: '5px' }}>Share on:</div>
              <button onClick={() => handleShare('whatsapp')} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '8px',
                border: '2px solid black',
                background: '#25D366',
                color: 'white',
                fontWeight: 'bold',
                marginBottom: '5px',
                cursor: 'pointer'
              }}>
                <img src="https://static.vecteezy.com/system/resources/previews/016/716/480/non_2x/whatsapp-icon-free-png.png" alt="WhatsApp" style={{ width: '24px', height: '24px' }} /> WhatsApp
              </button>
              <button onClick={() => handleShare('facebook')} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '8px',
                border: '2px solid black',
                background: '#1877F2',
                color: 'white',
                fontWeight: 'bold',
                marginBottom: '5px',
                cursor: 'pointer'
              }}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Facebook_logo_%28square%29.png/500px-Facebook_logo_%28square%29.png" alt="Facebook" style={{ width: '24px', height: '24px' }} /> Facebook
              </button>
              <button onClick={() => handleShare('twitter')} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '8px',
                border: '2px solid black',
                background: '#1DA1F2',
                color: 'white',
                fontWeight: 'bold',
                marginBottom: '5px',
                cursor: 'pointer'
              }}>
                <img src="https://static.vecteezy.com/system/resources/thumbnails/018/930/695/small/twitter-logo-twitter-icon-transparent-free-free-png.png" alt="Twitter" style={{ width: '24px', height: '24px' }} /> Twitter
              </button>
              <button onClick={() => handleShare('linkedin')} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '8px',
                border: '2px solid black',
                background: '#0A66C2',
                color: 'white',
                fontWeight: 'bold',
                marginBottom: '5px',
                cursor: 'pointer'
              }}>
                <img src="https://static.vecteezy.com/system/resources/previews/018/930/480/non_2x/linkedin-logo-linkedin-icon-transparent-free-png.png" alt="LinkedIn" style={{ width: '24px', height: '24px' }} /> LinkedIn
              </button>
              <button onClick={() => handleShare('telegram')} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '8px',
                border: '2px solid black',
                background: '#0088cc',
                color: 'white',
                fontWeight: 'bold',
                marginBottom: '5px',
                cursor: 'pointer'
              }}>
                <img src="https://static.vecteezy.com/system/resources/previews/023/986/562/non_2x/telegram-logo-telegram-logo-transparent-telegram-icon-transparent-free-free-png.png" alt="Telegram" style={{ width: '24px', height: '24px' }} /> Telegram
              </button>
              <button onClick={() => handleShare('instagram')} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '8px',
                border: '2px solid black',
                background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}>
                <span>📸</span> Instagram
              </button>
            </div>
          )}
        </div>
        <button className="button button-secondary" onClick={onReset}>
          <span>✨</span>
          Create Another
        </button>
      </div>

      <div className="pro-tip card">
        <strong>💡 Pro Tip:</strong> Download your reel and share it on Instagram, YouTube Shorts, or TikTok to reach millions!
      </div>
    </div>
  )
}

export default ReelDisplay
