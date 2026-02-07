import { useState, useEffect, useRef } from "react";
import { useContent, usePersonalizedVideo, useGeneratePersonalizedVideo } from "@/hooks/use-content";
import { VideoCard } from "@/components/feed/video-card";
import { QuizCard } from "@/components/feed/quiz-card";
import { ChallengeCard } from "@/components/feed/challenge-card";
import { LoadingCard } from "@/components/feed/loading-card";
import { TopNav } from "@/components/layout/top-nav";
import { LocationModal } from "@/components/modals/location-modal";
import { Loader2, Sparkles, X, Heart, Stars } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function ContentItem({ item, isActive }) {
  if (item.type === 'video') {
    return <VideoCard content={item} isActive={isActive} />;
  } else if (item.type === 'quiz') {
    return <QuizCard content={item} isActive={isActive} />;
  } else if (item.type === 'challenge') {
    return <ChallengeCard content={item} isActive={isActive} />;
  } else if (item.type === 'loading') {
    return <LoadingCard />;
  } else if (item.type === 'personalized-prompt') {
    return <PersonalizedPromptCard content={item} />;
  }
  return null;
}

function PersonalizedPromptCard({ content }) {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center overflow-hidden pt-20">
      {/* Decorative animated elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-10 left-10 text-6xl animate-bounce">✨</div>
        <div className="absolute bottom-20 right-20 text-5xl animate-pulse">🎬</div>
        <div className="absolute top-1/3 right-10 text-4xl animate-bounce" style={{ animationDelay: '0.3s' }}>🌟</div>
        <div className="absolute bottom-1/4 left-20 text-5xl animate-pulse" style={{ animationDelay: '0.6s' }}>💫</div>
      </div>

      {/* Main Card */}
      <div className="relative w-full max-w-md mx-auto px-4">
        <div
          className="relative bg-white border-6 border-black shadow-brutal-xl p-8"
          style={{ aspectRatio: "9/16" }}
        >
          <div className="flex flex-col items-center justify-center h-full text-center">
            {/* Icon */}
            <div className="mb-6 relative">
              <div className="text-8xl animate-bounce">🎥</div>
              <div className="absolute -top-2 -right-2 text-4xl animate-ping">✨</div>
            </div>

            {/* Title */}
            <h2 className="font-display text-3xl font-black uppercase mb-4 leading-tight">
              {content.title}
            </h2>

            {/* Description */}
            <p className="text-gray-600 font-bold text-lg mb-6 px-4">
              {content.description}
            </p>

            {/* CTA Box */}
            <div className="bg-gradient-to-r from-purple-400 to-pink-400 border-4 border-black p-6 shadow-brutal-sm w-full">
              <p className="text-white font-black text-xl mb-3">
                🎯 Get Started Now!
              </p>
              <p className="text-white/90 font-bold text-sm">
                Scroll to explore more reels, then refresh to set your location and create YOUR story!
              </p>
            </div>

            {/* Features */}
            <div className="mt-6 space-y-2 w-full">
              <div className="flex items-center gap-3 bg-yellow-100 border-3 border-black p-3">
                <span className="text-2xl">🌍</span>
                <span className="font-bold text-sm">Based on YOUR location</span>
              </div>
              <div className="flex items-center gap-3 bg-green-100 border-3 border-black p-3">
                <span className="text-2xl">☕</span>
                <span className="font-bold text-sm">Tailored to YOUR habits</span>
              </div>
              <div className="flex items-center gap-3 bg-blue-100 border-3 border-black p-3">
                <span className="text-2xl">🤖</span>
                <span className="font-bold text-sm">AI-generated just for YOU</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FeedPage() {
  const { data: contents, isLoading } = useContent();
  const { data: personalizedVideoData } = usePersonalizedVideo();
  const generateVideo = useGeneratePersonalizedVideo();
  const [activeIndex, setActiveIndex] = useState(0);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationSet, setLocationSet] = useState(false);
  const [showPersonalizedPopup, setShowPersonalizedPopup] = useState(false);
  const [hasShownPopup, setHasShownPopup] = useState(false);
  const containerRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    // Show location modal on every page load to allow generating new personalized videos
    setShowLocationModal(true);
    
    // Clear previous onboarding status and personalized video on page load
    localStorage.removeItem('hasCompletedOnboarding');
    localStorage.removeItem('personalizedVideo');
  }, []);

  // Show personalized popup when user reaches the personalized video
  useEffect(() => {
    if (activeIndex === 3 && !hasShownPopup && personalizedVideoData?.ready) {
      setShowPersonalizedPopup(true);
      setHasShownPopup(true);
      
      toast({
        title: "✨ THIS IS YOUR STORY ✨",
        description: "This reel was personalized just for you based on your habits!",
        duration: 5000,
      });
      
      setTimeout(() => setShowPersonalizedPopup(false), 4000);
    }
  }, [activeIndex, hasShownPopup, personalizedVideoData, toast]);

  // Use IntersectionObserver for better performance and accuracy
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setActiveIndex(index);
          }
        });
      },
      { 
        threshold: 0.5, // Trigger when 50% visible for better responsiveness
        root: container 
      }
    );

    const items = container.querySelectorAll('.snap-start');
    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [contents, personalizedVideoData]); // Re-run when content changes

  const handleLocationSet = (location) => {
    setLocationSet(true);
    localStorage.setItem('hasCompletedOnboarding', 'true');
    localStorage.setItem('userLocation', JSON.stringify(location));
    
    // Trigger personalized video generation with place name
    if (location.interests) {
      generateVideo.mutate({
        location: location, // Pass full location object with placeName
        interests: location.interests
      });
    }
  };

  const handleCloseLocationModal = () => {
    setShowLocationModal(false);
    localStorage.setItem('hasCompletedOnboarding', 'true');
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="border-8 border-white p-8 bg-accent shadow-brutal-xl">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
            <h2 className="font-display text-2xl font-black uppercase">Loading...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (!contents || contents.length === 0) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-accent">
        <TopNav />
        <div className="border-8 border-black p-12 bg-white shadow-brutal-xl text-center">
          <h2 className="font-display text-5xl font-black mb-4 uppercase">No Content Yet</h2>
          <p className="text-gray-600 mb-8 text-xl font-bold">
            Create your first post to get started!
          </p>
        </div>
      </div>
    );
  }

  // Insert personalized video or loading card at position 4 (index 3)
  const feedContents = [...contents];
  const PERSONALIZED_POSITION = 3;
  
  // Always insert something at position 4
  if (personalizedVideoData?.ready) {
    // Insert the actual personalized video
    feedContents.splice(PERSONALIZED_POSITION, 0, personalizedVideoData.video);
  } else if (personalizedVideoData?.generating) {
    // Show loading card while generating
    feedContents.splice(PERSONALIZED_POSITION, 0, {
      id: 'loading-personalized',
      type: 'loading'
    });
  } else {
    // Show placeholder prompt when no personalized video
    feedContents.splice(PERSONALIZED_POSITION, 0, {
      id: 'placeholder-personalized',
      type: 'personalized-prompt',
      title: '✨ Your Personalized Story Awaits',
      description: 'Complete your profile to generate a sustainability story made just for you!'
    });
  }

  return (
    <>
      <TopNav />
      {showLocationModal && (
        <LocationModal 
          onClose={handleCloseLocationModal}
          onLocationSet={handleLocationSet}
        />
      )}
      <div 
        ref={containerRef}
        className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        style={{ 
          scrollBehavior: 'smooth',
          overscrollBehaviorY: 'contain' // Prevent bounce on edges
        }}
      >
        {feedContents.map((item, index) => (
          <div 
            key={item.id} 
            data-index={index}
            className="h-screen w-full snap-start snap-always"
          >
            <ContentItem 
              item={item} 
              isActive={activeIndex === index} 
            />
            
            {/* Personalized popup overlay */}
            {index === PERSONALIZED_POSITION && showPersonalizedPopup && item.isPersonalized && (
              <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50 px-4">
                {/* Animated background sparkles */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/4 left-1/4 text-6xl animate-ping">✨</div>
                  <div className="absolute top-1/3 right-1/4 text-5xl animate-bounce" style={{ animationDelay: '0.2s' }}>⭐</div>
                  <div className="absolute bottom-1/3 left-1/3 text-5xl animate-pulse" style={{ animationDelay: '0.4s' }}>💫</div>
                  <div className="absolute bottom-1/4 right-1/3 text-6xl animate-ping" style={{ animationDelay: '0.6s' }}>🌟</div>
                  <div className="absolute top-1/2 left-1/2 text-4xl animate-bounce" style={{ animationDelay: '0.8s' }}>✨</div>
                </div>

                {/* Main popup card */}
                <div className="relative pointer-events-auto animate-scale-bounce">
                  {/* Outer glow layers */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 blur-xl opacity-60 animate-pulse"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 blur-2xl opacity-40 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  
                  {/* Main card */}
                  <div className="relative bg-white border-8 border-black overflow-hidden" style={{ boxShadow: '12px 12px 0px rgba(0,0,0,1), 24px 24px 0px rgba(124,58,237,0.5)' }}>
                    {/* Animated gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 animate-gradient-x"></div>
                    
                    {/* Close button */}
                    <button
                      onClick={() => setShowPersonalizedPopup(false)}
                      className="absolute top-4 right-4 z-10 bg-black text-white border-4 border-white w-10 h-10 flex items-center justify-center transition-all hover:scale-110 hover:rotate-90"
                    >
                      <X className="w-6 h-6" strokeWidth={4} />
                    </button>
                    
                    {/* Content */}
                    <div className="relative px-8 py-8 text-center">
                      {/* Top sparkles row */}
                      <div className="flex justify-center gap-4 mb-4 animate-bounce">
                        <Sparkles className="w-10 h-10 text-yellow-300" strokeWidth={3} fill="currentColor" />
                        <Stars className="w-12 h-12 text-yellow-200" strokeWidth={3} fill="currentColor" />
                        <Sparkles className="w-10 h-10 text-yellow-300" strokeWidth={3} fill="currentColor" />
                      </div>
                      
                      {/* Main title */}
                      <div className="mb-4">
                        <h3 className="text-5xl font-black uppercase text-white font-comic mb-2" style={{ textShadow: '4px 4px 0px rgba(0,0,0,0.8)' }}>
                          This is YOUR
                        </h3>
                        <h3 className="text-6xl font-black uppercase text-yellow-300 font-comic" style={{ textShadow: '5px 5px 0px rgba(0,0,0,0.8)' }}>
                          STORY!
                        </h3>
                      </div>
                      
                      {/* Subtitle */}
                      <div className="bg-black/30 backdrop-blur-sm border-4 border-white px-6 py-3 mb-4">
                        <p className="text-xl font-black text-white">
                          🎯 Personalized For You
                        </p>
                        <p className="text-sm font-bold text-white/90">
                          Based on your habits & location
                        </p>
                      </div>
                      
                      {/* Bottom decorative elements */}
                      <div className="flex justify-center gap-3 items-center">
                        <div className="text-3xl animate-pulse">🌍</div>
                        <Heart className="w-8 h-8 text-red-400 animate-pulse" fill="currentColor" strokeWidth={2} />
                        <div className="text-3xl animate-pulse">🌱</div>
                        <Heart className="w-8 h-8 text-red-400 animate-pulse" fill="currentColor" strokeWidth={2} style={{ animationDelay: '0.5s' }} />
                        <div className="text-3xl animate-pulse">♻️</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
