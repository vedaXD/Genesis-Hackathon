import './WelcomeScreen.css'

function WelcomeScreen({ onContinue }) {
  return (
    <div className="welcome-screen fade-in">
      <div className="welcome-content">
        <div className="welcome-icon">🇮🇳</div>
        <h1 className="welcome-title">India Reel Generator</h1>
        <p className="welcome-subtitle">
          Create stunning, AI-powered reels showcasing India's incredible diversity
        </p>
        
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>Personalized Content</h3>
            <p>Choose your interests and style preferences</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📍</div>
            <h3>Location-Based</h3>
            <p>Select specific locations or go anywhere</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Instant Generation</h3>
            <p>Create professional reels in seconds</p>
          </div>
        </div>
        
        <button 
          className="button button-primary welcome-button"
          onClick={onContinue}
        >
          Get Started
          <span>→</span>
        </button>
        
        <p className="welcome-footer">
          No account required • 100% free • Unlimited creations
        </p>
      </div>
    </div>
  );
}

export default WelcomeScreen
