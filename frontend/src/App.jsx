import { useState } from 'react'
import './App.css'
import WelcomeScreen from './components/WelcomeScreen'
import InterestSelector from './components/InterestSelector'
import LocationSelector from './components/LocationSelector'
import ReelGenerator from './components/ReelGenerator'
import ReelDisplay from './components/ReelDisplay'

function App() {
  const [step, setStep] = useState('welcome'); // welcome, interests, location, generator, display
  const [userData, setUserData] = useState({
    interests: [],
    location: null,
    style: null,
    duration: '30'
  });
  const [generatedReel, setGeneratedReel] = useState(null);

  const handleWelcomeComplete = () => {
    setStep('interests');
  };

  const handleInterestsComplete = (interests) => {
    setUserData(prev => ({ ...prev, interests }));
    setStep('location');
  };

  const handleLocationComplete = (location) => {
    setUserData(prev => ({ ...prev, location }));
    setStep('generator');
  };

  const handleSkipLocation = () => {
    setUserData(prev => ({ ...prev, location: null }));
    setStep('generator');
  };

  const handleGenerateReel = (additionalData) => {
    const finalData = { ...userData, ...additionalData };
    setUserData(finalData);
    
    // Simulate reel generation
    const mockReel = {
      id: Date.now(),
      ...finalData,
      thumbnail: 'https://picsum.photos/seed/' + Date.now() + '/400/600',
      createdAt: new Date().toISOString()
    };
    
    setGeneratedReel(mockReel);
    setStep('display');
  };

  const handleReset = () => {
    setStep('welcome');
    setUserData({
      interests: [],
      location: null,
      style: null,
      duration: '30'
    });
    setGeneratedReel(null);
  };

  return (
    <div className="app">
      {step === 'welcome' && (
        <WelcomeScreen onContinue={handleWelcomeComplete} />
      )}
      
      {step === 'interests' && (
        <InterestSelector 
          onComplete={handleInterestsComplete}
          initialInterests={userData.interests}
        />
      )}
      
      {step === 'location' && (
        <LocationSelector 
          onComplete={handleLocationComplete}
          onSkip={handleSkipLocation}
        />
      )}
      
      {step === 'generator' && (
        <ReelGenerator 
          userData={userData}
          onGenerate={handleGenerateReel}
          onBack={() => setStep('location')}
        />
      )}
      
      {step === 'display' && generatedReel && (
        <ReelDisplay 
          reel={generatedReel}
          onReset={handleReset}
        />
      )}
    </div>
  );
}

export default App
