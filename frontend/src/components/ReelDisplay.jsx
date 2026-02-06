import './ReelDisplay.css'

function ReelDisplay({ reel, onReset }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  const handleDownload = () => {
    alert('In production, this would download your generated reel!')
  }

  const handleShare = () => {
    alert('In production, this would open sharing options!')
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
          <div className="preview-thumbnail">
            <img src={reel.thumbnail} alt="Reel Preview" />
            <div className="play-overlay">
              <div className="play-button">▶</div>
            </div>
            <div className="duration-badge">{reel.duration}s</div>
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
        <button className="button button-success" onClick={handleShare}>
          <span>📤</span>
          Share
        </button>
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
