import { useState, useEffect, useRef } from "react";
import "./App.css";
import ReelCard from "./components/ReelCard";
import QuizCard from "./components/QuizCard";
import ChallengeCard from "./components/ChallengeCard";

function App() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [userLocation, setUserLocation] = useState("");
  const [userInterest, setUserInterest] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [userPoints, setUserPoints] = useState(0);
  const feedRef = useRef(null);

  // Load points from localStorage
  useEffect(() => {
    const savedPoints = localStorage.getItem("userPoints");
    if (savedPoints) {
      setUserPoints(parseInt(savedPoints));
    }
  }, []);

  // Update points when localStorage changes
  useEffect(() => {
    const interval = setInterval(() => {
      const currentPoints = localStorage.getItem("userPoints");
      if (currentPoints) {
        setUserPoints(parseInt(currentPoints));
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Check if onboarding was completed
  useEffect(() => {
    const completed = localStorage.getItem("onboardingCompleted");
    if (completed === "true") {
      setShowOnboarding(false);
      const savedLocation = localStorage.getItem("userLocation");
      const savedInterest = localStorage.getItem("userInterest");
      if (savedLocation) setUserLocation(savedLocation);
      if (savedInterest) setUserInterest(savedInterest);
    }
  }, []);

  const handleOnboardingComplete = () => {
    if (!userLocation || !userInterest) {
      alert("Please select both location and interest!");
      return;
    }
    localStorage.setItem("onboardingCompleted", "true");
    localStorage.setItem("userLocation", userLocation);
    localStorage.setItem("userInterest", userInterest);
    setShowOnboarding(false);
  };

  // Sample content data - mix of reels, quizzes, and challenges
  const feedContent = [
    { type: "reel", videoUrl: "/backend/data/videos/example1.mp4" },
    { type: "reel", videoUrl: "/backend/data/videos/example2.mp4" },
    {
      type: "quiz",
      question:
        "What is the most effective way to reduce your carbon footprint?",
      options: [
        "Walk or bike instead of drive",
        "Buy more things",
        "Use plastic bags",
        "Waste food",
      ],
      correctAnswer: 0,
      points: 10,
    },
    { type: "reel", videoUrl: "/backend/data/videos/example3.mp4" },
    {
      type: "challenge",
      icon: "🚆",
      title: "Public Transport Champion",
      desc: "Share a photo of your train/bus ticket or metro pass!",
      points: 50,
    },
    { type: "reel", videoUrl: "/backend/data/videos/example4.mp4" },
    {
      type: "quiz",
      question:
        "How many years does it take for a plastic bottle to decompose?",
      options: ["1 year", "10 years", "100 years", "450 years"],
      correctAnswer: 3,
      points: 15,
    },
    { type: "reel", videoUrl: "/backend/data/videos/example5.mp4" },
    {
      type: "challenge",
      icon: "♻️",
      title: "Recycling Hero",
      desc: "Share a photo of you recycling waste properly!",
      points: 40,
    },
    { type: "reel", videoUrl: "/backend/data/videos/example6.mp4" },
    {
      type: "quiz",
      question: "Which renewable energy source is most efficient?",
      options: ["Wind", "Solar", "Hydroelectric", "Biomass"],
      correctAnswer: 2,
      points: 10,
    },
    {
      type: "challenge",
      icon: "🌱",
      title: "Plant a Tree",
      desc: "Plant a tree or care for a plant. Show us!",
      points: 60,
    },
    { type: "reel", videoUrl: "/backend/data/videos/example7.mp4" },
    {
      type: "quiz",
      question: "What percentage of Earth's water is freshwater?",
      options: ["2.5%", "10%", "25%", "50%"],
      correctAnswer: 0,
      points: 10,
    },
    {
      type: "challenge",
      icon: "🚰",
      title: "Water Saver",
      desc: "Show us your water-saving technique!",
      points: 35,
    },
    { type: "reel", videoUrl: "/backend/data/videos/example8.mp4" },
    {
      type: "quiz",
      question: "What is the biggest contributor to ocean pollution?",
      options: [
        "Oil spills",
        "Plastic waste",
        "Chemical runoff",
        "Overfishing",
      ],
      correctAnswer: 1,
      points: 15,
    },
    {
      type: "challenge",
      icon: "🛍️",
      title: "Zero Waste Shopping",
      desc: "Share your reusable bags or containers!",
      points: 45,
    },
  ];

  // Intersection Observer for auto-pause
  useEffect(() => {
    if (showOnboarding) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setActiveIndex(index);
          }
        });
      },
      { threshold: 0.75 },
    );

    const items = feedRef.current?.querySelectorAll(".feed-item");
    items?.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [showOnboarding]);

  if (showOnboarding) {
    return (
      <div className="onboarding-overlay">
        <div className="onboarding-modal">
          <div className="onboarding-header">
            <h1 className="onboarding-title">🌍 Welcome to EcoReels!</h1>
            <p className="onboarding-subtitle">
              Let's personalize your experience
            </p>
          </div>

          <div className="onboarding-form">
            <div className="form-group">
              <label className="form-label">📍 Where do you exercise?</label>
              <select
                value={userLocation}
                onChange={(e) => setUserLocation(e.target.value)}
                className="form-select"
              >
                <option value="">Select location...</option>
                <option value="gym">🏋️ Gym</option>
                <option value="garden">🌳 Garden/Park</option>
                <option value="home">🏠 Home</option>
                <option value="outdoor">🏃 Outdoor Trails</option>
                <option value="studio">🧘 Yoga Studio</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">💚 Pick one interest</label>
              <select
                value={userInterest}
                onChange={(e) => setUserInterest(e.target.value)}
                className="form-select"
              >
                <option value="">Select interest...</option>
                <option value="climate">🌡️ Climate Change</option>
                <option value="recycling">♻️ Recycling</option>
                <option value="energy">⚡ Renewable Energy</option>
                <option value="wildlife">🦁 Wildlife Conservation</option>
                <option value="ocean">🌊 Ocean Protection</option>
                <option value="sustainable">🌱 Sustainable Living</option>
              </select>
            </div>

            <button
              onClick={handleOnboardingComplete}
              className="onboarding-button"
            >
              Start Watching! 🚀
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Points Display */}
      <div className="points-header">
        <div className="points-badge">
          🎯 {userPoints} Points (₹{userPoints} discount)
        </div>
      </div>

      {/* Vertical Scroll Feed */}
      <div className="feed-container" ref={feedRef}>
        {feedContent.map((content, index) => (
          <div key={index} className="feed-item" data-index={index}>
            {content.type === "reel" && (
              <ReelCard
                videoUrl={content.videoUrl}
                isActive={index === activeIndex}
              />
            )}
            {content.type === "quiz" && <QuizCard content={content} />}
            {content.type === "challenge" && (
              <ChallengeCard content={content} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
