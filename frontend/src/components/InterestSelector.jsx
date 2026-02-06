import { useState } from 'react'
import './InterestSelector.css'

const INTEREST_OPTIONS = [
  { id: 'heritage', label: 'Heritage & Culture', icon: '🏛️', color: '#f59e0b' },
  { id: 'nature', label: 'Nature & Wildlife', icon: '🌿', color: '#10b981' },
  { id: 'food', label: 'Food & Cuisine', icon: '🍛', color: '#ef4444' },
  { id: 'adventure', label: 'Adventure Sports', icon: '🏔️', color: '#8b5cf6' },
  { id: 'festivals', label: 'Festivals & Events', icon: '🎉', color: '#ec4899' },
  { id: 'architecture', label: 'Architecture', icon: '🕌', color: '#06b6d4' },
  { id: 'beaches', label: 'Beaches & Coasts', icon: '🏖️', color: '#3b82f6' },
  { id: 'mountains', label: 'Mountains & Hills', icon: '⛰️', color: '#64748b' },
  { id: 'cities', label: 'Urban Life', icon: '🏙️', color: '#f97316' },
  { id: 'spirituality', label: 'Spirituality', icon: '🕉️', color: '#a855f7' },
  { id: 'art', label: 'Art & Crafts', icon: '🎨', color: '#14b8a6' },
  { id: 'villages', label: 'Rural India', icon: '🌾', color: '#84cc16' },
  { id: 'yoga', label: 'Yoga & Wellness', icon: '🧘', color: '#f472b6' },
  { id: 'music', label: 'Music & Dance', icon: '🎵', color: '#fb923c' },
  { id: 'textiles', label: 'Textiles & Fashion', icon: '👗', color: '#c026d3' },
  { id: 'wildlife', label: 'Wildlife Safari', icon: '🐘', color: '#059669' },
  { id: 'tea', label: 'Tea Gardens', icon: '🍵', color: '#65a30d' },
  { id: 'temples', label: 'Temples & Shrines', icon: '⛩️', color: '#d946ef' },
  { id: 'markets', label: 'Local Markets', icon: '🛍️', color: '#ea580c' },
  { id: 'waterfall', label: 'Waterfalls & Lakes', icon: '💦', color: '#0ea5e9' },
  { id: 'desert', label: 'Deserts & Dunes', icon: '🏜️', color: '#facc15' },
  { id: 'railways', label: 'Heritage Railways', icon: '🚂', color: '#71717a' }
];

function InterestSelector({ onComplete, initialInterests = [] }) {
  const [selectedInterests, setSelectedInterests] = useState(initialInterests);

  const toggleInterest = (interestId) => {
    if (selectedInterests.includes(interestId)) {
      setSelectedInterests(selectedInterests.filter(id => id !== interestId));
    } else {
      setSelectedInterests([...selectedInterests, interestId]);
    }
  };

  const handleContinue = () => {
    if (selectedInterests.length > 0) {
      onComplete(selectedInterests);
    }
  };

  return (
    <div className="interest-selector fade-in">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: '25%' }}></div>
      </div>
      
      <div className="selector-header">
        <h2 className="selector-title">What interests you?</h2>
        <p className="selector-subtitle">
          Select one or more topics you'd like to explore
          {selectedInterests.length > 0 && (
            <span className="selected-count"> • {selectedInterests.length} selected</span>
          )}
        </p>
      </div>

      <div className="interests-grid">
        {INTEREST_OPTIONS.map((interest) => (
          <button
            key={interest.id}
            className={`interest-card ${selectedInterests.includes(interest.id) ? 'selected' : ''}`}
            onClick={() => toggleInterest(interest.id)}
            style={{
              '--interest-color': interest.color
            }}
          >
            <div className="interest-icon">{interest.icon}</div>
            <div className="interest-label">{interest.label}</div>
            {selectedInterests.includes(interest.id) && (
              <div className="interest-check">✓</div>
            )}
          </button>
        ))}
      </div>

      <div className="selector-actions">
        <button 
          className="button button-primary"
          onClick={handleContinue}
          disabled={selectedInterests.length === 0}
        >
          Continue
          <span>→</span>
        </button>
      </div>
    </div>
  );
}

export default InterestSelector
