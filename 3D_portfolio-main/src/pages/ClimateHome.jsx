import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect, useRef } from "react";
import { Loader } from "../components";
import { Bird, ClimateIsland, Plane, Sky } from "../models";

// AI Reel Generation Timeline
const reelMilestones = [
  {
    year: 2026,
    progress: 0,
    title: "TODAY'S STORY",
    description: "Generate reels of thriving ecosystems",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    color: "#10b981",
    icon: "🌱"
  },
  {
    year: 2028,
    progress: 0.33,
    title: "WARNING SIGNS",
    description: "AI reels showing early climate impacts",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    color: "#fbbf24",
    icon: "⚠️"
  },
  {
    year: 2031,
    progress: 0.66,
    title: "CRISIS POINT",
    description: "Generate awareness through local stories",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    color: "#f97316",
    icon: "🔥"
  },
  {
    year: 2035,
    progress: 1,
    title: "FINAL WARNING",
    description: "AI-powered climate action narratives",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    color: "#ef4444",
    icon: "🌊"
  }
];

const climateData = {
  location: "Earth",
  tempNow: 15,
  tempFuture: 18.5
};

const ClimateHome = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [pollution, setPollution] = useState(0);
  const [currentStage, setCurrentStage] = useState(1);
  const [isRotating, setIsRotating] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const scrollRef = useRef(0);
  const rotationRef = useRef(0);

  // SCROLL ROTATES ISLAND & INCREASES POLLUTION
  useEffect(() => {
    const handleScroll = (e) => {
      e.preventDefault();
      const delta = e.deltaY;
      
      // Update scroll progress (0 to 1)
      scrollRef.current = Math.max(0, Math.min(1, scrollRef.current + delta * 0.0003));
      setScrollProgress(scrollRef.current);
      
      // Rotation increases with scroll
      rotationRef.current += delta * 0.001;
      
      // Pollution increases exponentially with scroll
      const pollutionLevel = Math.pow(scrollRef.current, 1.5);
      setPollution(pollutionLevel);
    };

    window.addEventListener('wheel', handleScroll, { passive: false });
    return () => window.removeEventListener('wheel', handleScroll);
  }, []);

  const isMobile = window.innerWidth < 768;
  const biplaneScale = isMobile ? [1.5, 1.5, 1.5] : [3, 3, 3];
  const biplanePosition = isMobile ? [0, -1.5, 0] : [0, -4, -4];
  const islandScale = isMobile ? [0.9, 0.9, 0.9] : [1, 1, 1];
  const islandPosition = [0, -6.5, -43.4];
  
  const currentYear = Math.round(2026 + (scrollProgress * 9));
  const currentMilestone = reelMilestones.find((m, i) => 
    scrollProgress >= m.progress && 
    (i === reelMilestones.length - 1 || scrollProgress < reelMilestones[i + 1].progress)
  ) || reelMilestones[0];

  const handleReelGenerate = (milestone) => {
    setCurrentVideo(milestone);
    setShowVideo(true);
  };

  const jumpToMilestone = (targetProgress) => {
    scrollRef.current = targetProgress;
    setScrollProgress(targetProgress);
    const pollutionLevel = Math.pow(targetProgress, 1.5);
    setPollution(pollutionLevel);
  };

  const getSkyGradient = () => {
    if (progress < 0.33) {
      return 'linear-gradient(to bottom, #10b981, #34d399)';
    } else if (progress < 0.66) {
      return 'linear-gradient(to bottom, #fbbf24, #fcd34d)';
    } else {
      return 'linear-gradient(to bottom, #ef4444, #f87171)';
    }
  };

  const handleVideoClick = (videoUrl) => {
    setCurrentVideo(videoUrl);
    setShowVideo(true);
  };

  const jumpToTimeline = (targetProgress) => {
    progressRef.current = targetProgress;
    setProgress(targetProgress);
  };

  return (
    <section className='w-full h-screen relative overflow-hidden bg-gradient-to-b from-gray-900 to-black'>
      {/* AI Reel Generation Modal */}
      {showVideo && currentVideo && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md animate-fadeIn'>
          <div className='relative w-full max-w-5xl mx-4 animate-slideUp'>
            <button
              onClick={() => setShowVideo(false)}
              className='absolute -top-16 right-0 px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-black text-lg border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-200 rounded-lg'
            >
              ✕ CLOSE
            </button>
            <div className='bg-gradient-to-br from-gray-800 to-gray-900 border-4 border-white shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] rounded-2xl overflow-hidden'>
              <div className='bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 border-b-4 border-white'>
                <h2 className='text-2xl font-black text-white flex items-center gap-3'>
                  {currentVideo.icon} {currentVideo.title}
                </h2>
                <p className='text-white/90 text-sm mt-1'>{currentVideo.description}</p>
              </div>
              <div className='p-6'>
                <iframe
                  width='100%'
                  height='500'
                  src={currentVideo.videoUrl.replace('watch?v=', 'embed/')}
                  title='AI Climate Reel'
                  frameBorder='0'
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                  allowFullScreen
                  className='border-4 border-white rounded-lg shadow-2xl'
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scroll Hint */}
      <div className='absolute top-1/2 right-8 -translate-y-1/2 z-10 animate-bounce'>
        <div className='bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-full p-4 shadow-2xl'>
          <p className='text-white font-black text-sm rotate-90 whitespace-nowrap'>SCROLL ↓</p>
        </div>
      </div>

      {/* Header */}
      <div className='absolute top-6 left-6 z-10 animate-slideDown'>
        <div className='bg-gradient-to-r from-blue-600 to-purple-600 border-4 border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] px-6 py-3 rounded-xl backdrop-blur-sm'>
          <h1 className='text-3xl md:text-5xl font-black text-white tracking-tight flex items-center gap-2'>
            🌍 {climateData.location}
          </h1>
          <p className='text-xl font-black mt-1 text-white/90'>
            Year: {currentYear}
          </p>
        </div>
      </div>

      {/* Climate Stats */}
      <div className='absolute top-6 right-6 z-10 space-y-3 animate-slideDown'>
        <div className='bg-gradient-to-br from-yellow-400 to-orange-500 border-4 border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] px-5 py-3 rounded-xl backdrop-blur-sm'>
          <p className='text-xs font-black text-white/80'>TEMPERATURE</p>
          <p className='text-2xl font-black text-white'>
            +{(scrollProgress * 3.5).toFixed(1)}°C
          </p>
        </div>
        <div className='bg-gradient-to-br from-green-500 to-emerald-600 border-4 border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] px-5 py-3 rounded-xl backdrop-blur-sm'>
          <p className='text-xs font-black text-white/80'>POLLUTION</p>
          <div className='flex items-center gap-2 mt-1'>
            <div className='flex-1 h-2 bg-white/30 rounded-full overflow-hidden'>
              <div 
                className='h-full bg-gradient-to-r from-yellow-300 to-red-600 transition-all duration-300'
                style={{ width: `${pollution * 100}%` }}
              />
            </div>
            <p className='text-lg font-black text-white'>{Math.round(pollution * 100)}%</p>
          </div>
        </div>
        <div className='bg-gradient-to-br from-cyan-500 to-blue-600 border-4 border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] px-5 py-3 rounded-xl backdrop-blur-sm'>
          <p className='text-xs font-black text-white/80'>CURRENT</p>
          <p className='text-lg font-black text-white'>{currentMilestone.icon} {currentMilestone.title}</p>
        </div>
      </div>

      {/* AI Reel Generation Timeline */}
      <div className='absolute bottom-0 left-0 right-0 z-10 p-4 md:p-6'>
        <div className='bg-gradient-to-t from-black/90 via-black/70 to-transparent backdrop-blur-xl border-t-4 border-white/20 pt-6'>
          {/* Progress Indicator */}
          <div className='mb-6 max-w-6xl mx-auto'>
            <div className='flex items-center justify-between mb-2 px-2'>
              <p className='text-white font-black text-sm'>TIMELINE PROGRESS</p>
              <p className='text-white font-black text-sm'>{Math.round(scrollProgress * 100)}%</p>
            </div>
            <div className='relative h-3 bg-white/20 rounded-full overflow-hidden border-2 border-white/40'>
              <div 
                className='absolute h-full bg-gradient-to-r from-green-400 via-yellow-400 via-orange-500 to-red-600 transition-all duration-300 ease-out'
                style={{ width: `${scrollProgress * 100}%` }}
              />
              {reelMilestones.map((milestone, i) => (
                <button
                  key={i}
                  onClick={() => jumpToMilestone(milestone.progress)}
                  className='absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-black rounded-full shadow-lg hover:scale-125 transition-transform duration-200'
                  style={{ left: `${milestone.progress * 100}%`, transform: 'translate(-50%, -50%)' }}
                  title={milestone.year.toString()}
                />
              ))}
            </div>
          </div>

          {/* Reel Generation Cards */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-6xl mx-auto'>
            {reelMilestones.map((milestone, index) => {
              const isActive = currentMilestone.year === milestone.year;
              return (
                <div 
                  key={milestone.year} 
                  className={`group relative overflow-hidden rounded-2xl border-4 transition-all duration-300 ${
                    isActive 
                      ? 'border-white shadow-[0_0_30px_rgba(255,255,255,0.5)] scale-105' 
                      : 'border-white/30 hover:border-white/60 hover:scale-102'
                  }`}
                  style={{ 
                    background: `linear-gradient(135deg, ${milestone.color}DD, ${milestone.color}AA)`,
                    animation: isActive ? 'pulse 2s infinite' : 'none'
                  }}
                >
                  <div className='p-4'>
                    <div className='flex items-center justify-between mb-2'>
                      <span className='text-3xl'>{milestone.icon}</span>
                      <span className='text-white/80 font-black text-xs bg-black/30 px-2 py-1 rounded-full'>
                        {milestone.year}
                      </span>
                    </div>
                    <h3 className='text-white font-black text-sm md:text-base mb-1'>
                      {milestone.title}
                    </h3>
                    <p className='text-white/80 text-xs mb-3 line-clamp-2'>
                      {milestone.description}
                    </p>
                    <button
                      onClick={() => handleReelGenerate(milestone)}
                      className='w-full bg-white text-black font-black text-xs md:text-sm py-2 px-3 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2'
                    >
                      ▶ GENERATE REEL
                    </button>
                  </div>
                  {isActive && (
                    <div className='absolute inset-0 border-4 border-white/50 rounded-2xl pointer-events-none animate-ping' />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Canvas
        className='w-full h-screen'
        camera={{ near: 0.1, far: 1000, position: [0, 0, 5] }}
        style={{ 
          background: `linear-gradient(to bottom, 
            ${scrollProgress < 0.3 ? '#1e40af' : scrollProgress < 0.6 ? '#d97706' : '#991b1b'}, 
            ${scrollProgress < 0.3 ? '#0c4a6e' : scrollProgress < 0.6 ? '#92400e' : '#450a0a'})`
        }}
      >
        <Suspense fallback={<Loader />}>
          <directionalLight 
            position={[1, 1, 1]} 
            intensity={2 - (scrollProgress * 1.2)}
            color={scrollProgress > 0.5 ? '#ff8800' : '#ffffff'}
          />
          <ambientLight intensity={0.5 - (scrollProgress * 0.3)} />
          <pointLight 
            position={[10, 5, 10]} 
            intensity={2 - (scrollProgress * 1.5)}
            color={scrollProgress > 0.6 ? '#ff4400' : '#ffffff'}
          />
          <spotLight
            position={[0, 50, 10]}
            angle={0.15}
            penumbra={1}
            intensity={2 - (scrollProgress * 1.5)}
          />
          <hemisphereLight
            skyColor={scrollProgress < 0.5 ? '#87ceeb' : '#ff6347'}
            groundColor='#000000'
            intensity={1 - (scrollProgress * 0.6)}
          />

          {scrollProgress < 0.7 && <Bird />}
          <Sky isRotating={true} />
          
          <ClimateIsland 
            scrollProgress={scrollProgress}
            pollution={pollution}
            position={islandPosition}
            rotation={[0.1, 4.7077, 0]}
            scale={islandScale}
          />
          
          <Plane
            isRotating={true}
            position={biplanePosition}
            rotation={[0, 20.1, 0]}
            scale={biplaneScale}
          />
        </Suspense>
      </Canvas>
    </section>
  );
};

export default ClimateHome;
