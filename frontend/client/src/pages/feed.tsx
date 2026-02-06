import { useState, useEffect, useRef } from "react";
import { useReels, useGenerateFirstReel } from "@/hooks/use-content";
import { ReelCard } from "@/components/feed/reel-card";
import { QuizCard } from "@/components/feed/quiz-card";
import { ChallengeCard } from "@/components/feed/challenge-card";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Loader2, MapPin, Dumbbell, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

function OnboardingModal({
  onComplete,
}: {
  onComplete: (location: string, interest: string) => void;
}) {
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState("");
  const [interest, setInterest] = useState("");

  const interests = [
    { id: "gym", label: "🏋️ Gym", emoji: "🏋️" },
    { id: "garden", label: "🌳 Garden/Park", emoji: "🌳" },
    { id: "home", label: "🏠 Home Workout", emoji: "🏠" },
    { id: "yoga", label: "🧘 Yoga Studio", emoji: "🧘" },
    { id: "cycling", label: "🚴 Cycling Track", emoji: "🚴" },
    { id: "swimming", label: "🏊 Swimming Pool", emoji: "🏊" },
  ];

  const handleContinue = () => {
    if (step === 1 && location) {
      setStep(2);
    } else if (step === 2 && interest) {
      onComplete(location, interest);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 space-y-6 animate-slide-up">
        {step === 1 ? (
          <>
            <div className="text-center">
              <MapPin className="w-16 h-16 mx-auto mb-4 text-green-600" />
              <h2 className="text-3xl font-black uppercase mb-2">Welcome!</h2>
              <p className="text-gray-600">Where are you located?</p>
            </div>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your city/location"
              className="w-full px-4 py-3 border-4 border-black rounded-lg text-lg font-bold focus:outline-none focus:ring-4 focus:ring-green-300"
              autoFocus
            />
            <Button
              onClick={handleContinue}
              disabled={!location}
              className="w-full py-6 text-lg font-black"
            >
              Continue →
            </Button>
          </>
        ) : (
          <>
            <div className="text-center">
              <Dumbbell className="w-16 h-16 mx-auto mb-4 text-green-600" />
              <h2 className="text-3xl font-black uppercase mb-2">
                Where do you exercise?
              </h2>
              <p className="text-gray-600">Choose your fitness spot</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {interests.map((int) => (
                <button
                  key={int.id}
                  onClick={() => setInterest(int.id)}
                  className={`p-6 border-4 border-black rounded-lg text-center transition-all hover:scale-105 ${
                    interest === int.id
                      ? "bg-green-300 shadow-lg"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="text-4xl mb-2">{int.emoji}</div>
                  <div className="text-sm font-bold">
                    {int.label.split(" ")[1]}
                  </div>
                </button>
              ))}
            </div>
            <Button
              onClick={handleContinue}
              disabled={!interest}
              className="w-full py-6 text-lg font-black"
            >
              Start Watching →
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

function ContentItem({ item, isActive }: { item: any; isActive: boolean }) {
  if (item.type === "quiz") {
    return (
      <div className="h-screen w-full snap-start snap-always relative">
        <QuizCard content={item} isActive={isActive} />
      </div>
    );
  }

  if (item.type === "challenge") {
    return (
      <div className="h-screen w-full snap-start snap-always relative">
        <ChallengeCard content={item} isActive={isActive} />
      </div>
    );
  }

  return (
    <div className="h-screen w-full snap-start snap-always relative">
      <ReelCard reel={item} isActive={isActive} />
    </div>
  );
}

export default function FeedPage() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [userLocation, setUserLocation] = useState("");
  const [userInterest, setUserInterest] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [contents, setContents] = useState<any[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const { data: mockReels } = useReels();
  const { mutate: generateReel, isPending: isGenerating } =
    useGenerateFirstReel();

  useEffect(() => {
    // Check if user has already completed onboarding
    const hasOnboarded = localStorage.getItem("hasOnboarding");
    const savedPoints = parseInt(localStorage.getItem("userPoints") || "0");
    setUserPoints(savedPoints);
    
    if (hasOnboarded) {
      setShowOnboarding(false);
      const savedLocation = localStorage.getItem("userLocation") || "India";
      const savedInterest = localStorage.getItem("userInterest") || "gym";
      setUserLocation(savedLocation);
      setUserInterest(savedInterest);
      
      // Load mock content immediately if user has already onboarded
      if (mockReels && mockReels.length > 0) {
        const mixedContent = createMixedContent([], mockReels);
        setContents(mixedContent);
      }
    }
  }, [mockReels]);

  // Update points when localStorage changes
  useEffect(() => {
    const interval = setInterval(() => {
      const points = parseInt(localStorage.getItem("userPoints") || "0");
      setUserPoints(points);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleOnboardingComplete = (location: string, interest: string) => {
    setUserLocation(location);
    setUserInterest(interest);
    localStorage.setItem("hasOnboarded", "true");
    localStorage.setItem("userLocation", location);
    localStorage.setItem("userInterest", interest);
    setShowOnboarding(false);

    // Generate first reel based on location and interest
    generateReel(
      { location, interest },
      {
        onSuccess: (data) => {
          // First reel generated, now mix with mock content
          const mixedContent = createMixedContent([data], mockReels || []);
          setContents(mixedContent);
        },
        onError: () => {
          // If generation fails, use mock reels
          const mixedContent = createMixedContent([], mockReels || []);
          setContents(mixedContent);
        },
      },
    );
  };

  // Setup intersection observer for auto-play/pause
  useEffect(() => {
    if (!containerRef.current || contents.length === 0) return;

    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(
            entry.target.getAttribute("data-index") || "0",
          );
          
          // Set active when reel is more than 50% visible
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            setActiveIndex(index);
          }
        });
      },
      { 
        threshold: [0, 0.5, 1],
        root: null, // Use viewport as root
        rootMargin: "0px"
      },
    );

    const items = containerRef.current.querySelectorAll("[data-index]");
    items.forEach((item) => observerRef.current?.observe(item));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [contents]);

  if (showOnboarding) {
    return <OnboardingModal onComplete={handleOnboardingComplete} />;
  }

  if (isGenerating) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-500">
        <div className="text-center text-white space-y-6 p-8">
          <div className="relative">
            <Loader2 className="w-20 h-20 animate-spin mx-auto" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-white/20 rounded-full animate-ping" />
            </div>
          </div>
          <h2 className="font-display text-3xl font-bold uppercase">
            Creating Your Reel
          </h2>
          <p className="text-xl opacity-90">
            Based on {userLocation} and {userInterest}...
          </p>
          <div className="flex justify-center space-x-2">
            <div
              className="w-3 h-3 bg-white rounded-full animate-bounce"
              style={{ animationDelay: "0s" }}
            />
            <div
              className="w-3 h-3 bg-white rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            />
            <div
              className="w-3 h-3 bg-white rounded-full animate-bounce"
              style={{ animationDelay: "0.4s" }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (contents.length === 0) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white p-8">
        <h2 className="font-display text-4xl font-black mb-4 uppercase">
          Loading Content...
        </h2>
        <Loader2 className="w-12 h-12 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      {/* Points Display - Top Right */}
      {userPoints > 0 && (
        <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-yellow-400 to-orange-400 border-4 border-black px-4 py-2 shadow-brutal flex items-center gap-2 animate-bounce-in">
          <Award className="w-5 h-5" strokeWidth={3} />
          <span className="font-black text-lg">{userPoints} Points</span>
        </div>
      )}
      
      <div
        ref={containerRef}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar"
      >
        {contents.map((item, index) => (
          <div key={`${item.type}-${item.id}`} data-index={index}>
            <ContentItem item={item} isActive={activeIndex === index} />
          </div>
        ))}
        <div className="h-16 w-full snap-start" />
      </div>
      <BottomNav />
    </div>
  );
}

// Helper function to mix reels with quizzes and challenges
function createMixedContent(generatedReels: any[], mockReels: any[]) {
  const mixedContent: any[] = [];

  // Add generated reel first if available
  if (generatedReels.length > 0) {
    mixedContent.push({ ...generatedReels[0], type: "reel" });
  }

  // Mix mock reels with quizzes and challenges
  const quizzes = [
    {
      id: "quiz-1",
      type: "quiz",
      icon: "🚆",
      title: "Travel Smart",
      desc: "What's the most eco-friendly way to commute?",
      options: [
        { id: 1, emoji: "🚶", text: "Walking/Cycling" },
        { id: 2, emoji: "🚆", text: "Train/Metro" },
        { id: 3, emoji: "🚌", text: "Bus" },
        { id: 4, emoji: "🚗", text: "Personal Car" },
      ],
    },
    {
      id: "quiz-2",
      type: "quiz",
      icon: "💧",
      title: "Water Wisdom",
      desc: "How much water does a 10-min shower use?",
      options: [
        { id: 1, emoji: "💧", text: "20-30 liters" },
        { id: 2, emoji: "🚿", text: "50-80 liters" },
        { id: 3, emoji: "💦", text: "100-150 liters" },
        { id: 4, emoji: "🌊", text: "200+ liters" },
      ],
    },
    {
      id: "quiz-3",
      type: "quiz",
      icon: "🍽️",
      title: "Carbon Footprint",
      desc: "Which diet has the lowest carbon footprint?",
      options: [
        { id: 1, emoji: "🌱", text: "Vegan" },
        { id: 2, emoji: "🥗", text: "Vegetarian" },
        { id: 3, emoji: "🐟", text: "Pescatarian" },
        { id: 4, emoji: "🥩", text: "Meat-Heavy" },
      ],
    },
    {
      id: "quiz-4",
      type: "quiz",
      icon: "♻️",
      title: "Recycling Facts",
      desc: "How long does plastic take to decompose?",
      options: [
        { id: 1, emoji: "📅", text: "10-50 years" },
        { id: 2, emoji: "⏰", text: "100-200 years" },
        { id: 3, emoji: "⏳", text: "400-500 years" },
        { id: 4, emoji: "♾️", text: "1000+ years" },
      ],
    },
    {
      id: "quiz-5",
      type: "quiz",
      icon: "🌍",
      title: "Climate Action",
      desc: "What saves the most CO2 per year?",
      options: [
        { id: 1, emoji: "💡", text: "LED bulbs" },
        { id: 2, emoji: "🚗", text: "Car-free days" },
        { id: 3, emoji: "🥩", text: "Eat less meat" },
        { id: 4, emoji: "✈️", text: "Skip one flight" },
      ],
    },
  ];

  const challenges = [
    {
      id: "challenge-1",
      type: "challenge",
      icon: "🚆",
      title: "Train Ticket Challenge",
      desc: "Upload your train/metro ticket photo and earn points!",
      points: 25,
    },
    {
      id: "challenge-2",
      type: "challenge",
      icon: "🌱",
      title: "Plant a Tree",
      desc: "Plant a tree or sapling and share a photo!",
      points: 50,
    },
    {
      id: "challenge-3",
      type: "challenge",
      icon: "♻️",
      title: "Recycle Challenge",
      desc: "Share a photo of you recycling waste properly",
      points: 30,
    },
    {
      id: "challenge-4",
      type: "challenge",
      icon: "🚴",
      title: "Cycle to Work",
      desc: "Upload a selfie cycling to work or gym!",
      points: 40,
    },
    {
      id: "challenge-5",
      type: "challenge",
      icon: "💧",
      title: "Water Saver",
      desc: "Show your water-saving practices at home",
      points: 35,
    },
    {
      id: "challenge-6",
      type: "challenge",
      icon: "🛍️",
      title: "Reusable Bag",
      desc: "Upload photo shopping with reusable bags!",
      points: 20,
    },
    {
      id: "challenge-7",
      type: "challenge",
      icon: "🌍",
      title: "Beach Cleanup",
      desc: "Join or organize a beach/park cleanup",
      points: 70,
    },
  ];

  let reelIndex = 0;
  let quizIndex = 0;
  let challengeIndex = 0;

  // Pattern: 1-2 reels, then quiz or challenge (alternate between them)
  let contentCounter = 0;
  const maxIterations = mockReels.length + quizzes.length + challenges.length;
  
  while (contentCounter < maxIterations) {
    // Add 1-2 reels
    const reelsToAdd = Math.floor(Math.random() * 2) + 1; // 1 or 2
    for (let i = 0; i < reelsToAdd && reelIndex < mockReels.length; i++) {
      mixedContent.push({ ...mockReels[reelIndex], type: "reel" });
      reelIndex++;
      contentCounter++;
    }

    // Alternate between quiz and challenge
    if (contentCounter % 2 === 0) {
      // Add quiz
      if (quizIndex < quizzes.length) {
        mixedContent.push(quizzes[quizIndex]);
        quizIndex++;
        contentCounter++;
      }
    } else {
      // Add challenge
      if (challengeIndex < challenges.length) {
        mixedContent.push(challenges[challengeIndex]);
        challengeIndex++;
        contentCounter++;
      }
    }

    // If we've run out of reels but still have quizzes/challenges, add them
    if (reelIndex >= mockReels.length) {
      while (quizIndex < quizzes.length) {
        mixedContent.push(quizzes[quizIndex]);
        quizIndex++;
        contentCounter++;
      }
      while (challengeIndex < challenges.length) {
        mixedContent.push(challenges[challengeIndex]);
        challengeIndex++;
        contentCounter++;
      }
      break;
    }
  }

  return mixedContent;
}
