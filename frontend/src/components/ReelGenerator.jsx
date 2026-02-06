import { useState } from 'react'
import './ReelGenerator.css'

const STYLE_OPTIONS = [
  { id: 'cinematic', label: 'Cinematic', icon: '🎬', description: 'Epic and dramatic' },
  { id: 'vibrant', label: 'Vibrant', icon: '🌈', description: 'Bold and colorful' },
  { id: 'minimal', label: 'Minimal', icon: '✨', description: 'Clean and simple' },
  { id: 'vintage', label: 'Vintage', icon: '📷', description: 'Classic retro look' },
  { id: 'modern', label: 'Modern', icon: '🎯', description: 'Contemporary style' },
  { id: 'dreamy', label: 'Dreamy', icon: '☁️', description: 'Soft and ethereal' }
]

const DURATION_OPTIONS = [
  { value: '15', label: '15 seconds' },
  { value: '30', label: '30 seconds' },
  { value: '60', label: '1 minute' }
]

function ReelGenerator({ userData, onGenerate, onBack }) {
  const [style, setStyle] = useState('cinematic')
  const [duration, setDuration] = useState('30')
  const [additionalNotes, setAdditionalNotes] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = () => {
    setIsGenerating(true)
    
    // Simulate generation delay
    setTimeout(() => {
      onGenerate({
        style,
        duration,
        additionalNotes
      })
      setIsGenerating(false)
    }, 2000)
  }

  return (
    <div className="reel-generator fade-in">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: '75%' }}></div>
      </div>
      
      <div className="selector-header">
        <h2 className="selector-title">Customize Your Reel</h2>
        <p className="selector-subtitle">
          Choose style and preferences for your content
        </p>
      </div>

      <div className="generator-content">
        <div className="user-summary card">
          <h3>Your Selections</h3>
          <div className="summary-item">
            <strong>Interests:</strong> {userData.interests.join(', ')}
          </div>
          {userData.location && (
            <div className="summary-item">
              <strong>Location:</strong> {userData.location.name || 'Custom Location'}
              <span className="coords">({userData.location.lat.toFixed(2)}, {userData.location.lng.toFixed(2)})</span>
            </div>
          )}
          {!userData.location && (
            <div className="summary-item">
              <strong>Location:</strong> Anywhere in India
            </div>
          )}
        </div>

        <div className="config-section">
          <label className="label">Select Style</label>
          <div className="style-grid">
            {STYLE_OPTIONS.map((option) => (
              <button
                key={option.id}
                className={`style-card ${style === option.id ? 'selected' : ''}`}
                onClick={() => setStyle(option.id)}
              >
                <div className="style-icon">{option.icon}</div>
                <div className="style-label">{option.label}</div>
                <div className="style-description">{option.description}</div>
                {style === option.id && <div className="style-check">✓</div>}
              </button>
            ))}
          </div>
        </div>

        <div className="config-section">
          <label className="label">Duration</label>
          <div className="duration-selector">
            {DURATION_OPTIONS.map((option) => (
              <button
                key={option.value}
                className={`duration-option ${duration === option.value ? 'selected' : ''}`}
                onClick={() => setDuration(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="config-section">
          <label className="label">Additional Notes (Optional)</label>
          <textarea
            className="input notes-input"
            rows="4"
            placeholder="Any specific requirements or ideas for your reel..."
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
          />
        </div>
      </div>

      <div className="selector-actions">
        <button 
          className="button button-secondary"
          onClick={onBack}
          disabled={isGenerating}
        >
          ← Back
        </button>
        <button 
          className="button button-success"
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <span className="spinner"></span>
              Generating...
            </>
          ) : (
            <>
              Generate Reel
              <span>✨</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default ReelGenerator
