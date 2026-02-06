import { useState } from "react";
import "./QuizCard.css";

function QuizCard({ content, isActive }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleOptionSelect = (optionId) => {
    if (submitted) return;
    setSelectedOption(optionId);
  };

  const handleSubmit = () => {
    if (!selectedOption) {
      alert("Please select an option first!");
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="quiz-card">
      <div className="quiz-decorations">
        <div className="quiz-emoji quiz-emoji-1">✏️</div>
        <div className="quiz-emoji quiz-emoji-2">📊</div>
        <div className="quiz-emoji quiz-emoji-3">🌱</div>
        <div className="quiz-emoji quiz-emoji-4">💭</div>
      </div>

      <div className="quiz-content">
        <div className="quiz-icon-container">
          <div className="quiz-icon-box">
            <div className="quiz-icon">{content.icon}</div>
          </div>
        </div>

        <div className="quiz-question">
          <h2 className="quiz-title">✨ {content.title} ✨</h2>
          <p className="quiz-desc">{content.desc}</p>
          <div className="quiz-dots">
            <div className="quiz-dot dot-green"></div>
            <div className="quiz-dot dot-yellow"></div>
            <div className="quiz-dot dot-red"></div>
          </div>
        </div>

        <div className="quiz-options">
          {content.options &&
            content.options.map((option, index) => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option.id)}
                disabled={submitted}
                className={`quiz-option ${selectedOption === option.id ? "selected" : ""} ${submitted ? "disabled" : ""}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="option-emoji">{option.emoji}</div>
                <div className="option-text">{option.text}</div>
                {selectedOption === option.id && !submitted && (
                  <div className="option-checkmark">✓</div>
                )}
                {submitted && selectedOption === option.id && (
                  <div className="option-submitted">✓</div>
                )}
              </button>
            ))}
        </div>

        {!submitted && (
          <button
            onClick={handleSubmit}
            disabled={!selectedOption}
            className={`quiz-submit ${selectedOption ? "active" : ""}`}
          >
            Submit Answer 🚀
          </button>
        )}

        {submitted && (
          <div className="quiz-success">
            <div className="success-emoji">✅</div>
            <div className="success-title">Answer Saved!</div>
            <div className="success-text">Swipe up for your next story</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizCard;
