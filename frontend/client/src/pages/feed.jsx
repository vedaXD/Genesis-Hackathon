import { useState, useEffect, useRef } from "react";
import { useContent } from "@/hooks/use-content";
import { VideoCard } from "@/components/feed/video-card";
import { QuizCard } from "@/components/feed/quiz-card";
import { ChallengeCard } from "@/components/feed/challenge-card";
import { TopNav } from "@/components/layout/top-nav";
import { LocationModal } from "@/components/modals/location-modal";
import { Loader2 } from "lucide-react";

function ContentItem({ item, isActive }) {
  if (item.type === 'video') {
    return <VideoCard content={item} isActive={isActive} />;
  } else if (item.type === 'quiz') {
    return <QuizCard content={item} isActive={isActive} />;
  } else if (item.type === 'challenge') {
    return <ChallengeCard content={item} isActive={isActive} />;
  }
  return null;
}

export default function FeedPage() {
  const { data: contents, isLoading } = useContent();
  const [activeIndex, setActiveIndex] = useState(0);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationSet, setLocationSet] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    // Show location modal on first visit
    const hasSeenLocationModal = localStorage.getItem('hasSeenLocationModal');
    if (!hasSeenLocationModal) {
      setTimeout(() => setShowLocationModal(true), 1000);
    }
  }, []);

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
  }, [contents]);

  const handleLocationSet = (location) => {
    setLocationSet(true);
    localStorage.setItem('hasSeenLocationModal', 'true');
    localStorage.setItem('userLocation', JSON.stringify(location));
  };

  const handleCloseLocationModal = () => {
    setShowLocationModal(false);
    localStorage.setItem('hasSeenLocationModal', 'true');
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
        {contents.map((item, index) => (
          <div 
            key={item.id} 
            data-index={index}
            className="h-screen w-full snap-start snap-always"
          >
            <ContentItem 
              item={item} 
              isActive={activeIndex === index} 
            />
          </div>
        ))}
      </div>
    </>
  );
}
