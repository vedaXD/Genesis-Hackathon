import { useState } from "react";
import { MapPin, X, Coffee, Footprints } from "lucide-react";
import { useRequestLocation } from "@/hooks/use-content";
import { Button } from "@/components/ui/button";

export function LocationModal({ onClose, onLocationSet }) {
  const [step, setStep] = useState('intro'); // intro, requesting, success, interests, generating
  const requestLocation = useRequestLocation();
  const [userInterests, setUserInterests] = useState({
    drink: '',
    walkingPlace: '',
    otherHabit: ''
  });

  const handleRequestLocation = () => {
    setStep('requesting');
    requestLocation.mutate(undefined, {
      onSuccess: (data) => {
        // Store location temporarily
        localStorage.setItem('userLatitude', data.latitude);
        localStorage.setItem('userLongitude', data.longitude);
        setStep('interests');
      },
      onError: (error) => {
        setStep('error');
      }
    });
  };

  const handleInterestsSubmit = () => {
    if (!userInterests.drink || !userInterests.walkingPlace) {
      alert('Please fill in all fields');
      return;
    }
    
    // Store interests
    localStorage.setItem('userInterests', JSON.stringify(userInterests));
    setStep('generating');
    
    // Get location data
    const lat = localStorage.getItem('userLatitude');
    const lng = localStorage.getItem('userLongitude');
    
    // Trigger personalized video generation
    onLocationSet({ 
      latitude: lat, 
      longitude: lng, 
      interests: userInterests 
    });
    
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="relative bg-white border-8 border-black shadow-brutal-xl max-w-lg w-full p-8 animate-bounce-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-gray-200 border-4 border-black flex items-center justify-center hover:bg-gray-300 transition-all"
        >
          <X className="w-6 h-6" strokeWidth={3} />
        </button>

        {step === 'intro' && (
          <div className="text-center space-y-6">
            <div className="text-8xl mb-4">🌍</div>
            <h2 className="text-4xl font-black uppercase font-comic mb-3">
              Your Climate Story
            </h2>
            <p className="text-lg font-bold text-gray-700 leading-relaxed">
              We'll show you how climate change affects <span className="bg-yellow-200 px-2 py-1 border-2 border-black">YOUR neighborhood</span> specifically.
            </p>
            <p className="text-base font-bold text-gray-600">
              Share your location to get personalized climate stories based on local data.
            </p>
            
            <div className="bg-green-100 border-4 border-black p-4 mt-4">
              <p className="text-sm font-black">
                🔒 Your privacy matters! Location is only used to personalize content.
              </p>
            </div>

            <Button
              onClick={handleRequestLocation}
              variant="default"
              size="lg"
              className="w-full text-xl"
            >
              <MapPin className="w-6 h-6 mr-2" strokeWidth={3} />
              Share My Location
            </Button>

            <button
              onClick={onClose}
              className="text-sm font-bold text-gray-600 hover:text-black hover:underline"
            >
              Skip for now
            </button>
          </div>
        )}

        {step === 'requesting' && (
          <div className="text-center space-y-6">
            <div className="text-8xl mb-4 animate-bounce">📍</div>
            <h2 className="text-3xl font-black uppercase font-comic">
              Getting Your Location...
            </h2>
            <p className="text-lg font-bold text-gray-600">
              This helps us personalize your climate stories
            </p>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center space-y-6">
            <div className="text-8xl mb-4">✅</div>
            <h2 className="text-3xl font-black uppercase font-comic text-green-600">
              Location Set!
            </h2>
            <p className="text-lg font-bold text-gray-700">
              Preparing your personalized climate stories...
            </p>
          </div>
        )}

        {step === 'interests' && (
          <div className="text-center space-y-6">
            <div className="text-8xl mb-4">🎯</div>
            <h2 className="text-3xl font-black uppercase font-comic mb-3">
              Tell Us About You
            </h2>
            <p className="text-base font-bold text-gray-600 mb-6">
              Help us create your personalized sustainability story
            </p>
            
            <div className="space-y-4 text-left">
              <div>
                <label className="flex items-center gap-2 text-lg font-black mb-2">
                  <Coffee className="w-5 h-5" strokeWidth={3} />
                  What do you usually drink?
                </label>
                <input
                  type="text"
                  value={userInterests.drink}
                  onChange={(e) => setUserInterests({...userInterests, drink: e.target.value})}
                  placeholder="e.g., Coffee, Tea, Water..."
                  className="w-full p-3 border-4 border-black font-bold focus:outline-none focus:ring-4 focus:ring-yellow-300"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-lg font-black mb-2">
                  <Footprints className="w-5 h-5" strokeWidth={3} />
                  Where do you go for walking?
                </label>
                <input
                  type="text"
                  value={userInterests.walkingPlace}
                  onChange={(e) => setUserInterests({...userInterests, walkingPlace: e.target.value})}
                  placeholder="e.g., Park, Beach, Streets..."
                  className="w-full p-3 border-4 border-black font-bold focus:outline-none focus:ring-4 focus:ring-yellow-300"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-lg font-black mb-2">
                  🌱 Any other daily habit?
                </label>
                <input
                  type="text"
                  value={userInterests.otherHabit}
                  onChange={(e) => setUserInterests({...userInterests, otherHabit: e.target.value})}
                  placeholder="e.g., Cycling, Gardening... (optional)"
                  className="w-full p-3 border-4 border-black font-bold focus:outline-none focus:ring-4 focus:ring-yellow-300"
                />
              </div>
            </div>

            <Button
              onClick={handleInterestsSubmit}
              variant="default"
              size="lg"
              className="w-full text-xl mt-6"
            >
              Generate My Story! 🎬
            </Button>
          </div>
        )}

        {step === 'generating' && (
          <div className="text-center space-y-6">
            <div className="text-8xl mb-4 animate-bounce">🎬</div>
            <h2 className="text-3xl font-black uppercase font-comic">
              Creating Your Story...
            </h2>
            <p className="text-lg font-bold text-gray-600">
              Our AI is crafting a personalized sustainability story just for you!
            </p>
            <div className="flex justify-center gap-2 mt-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
        )}

        {step === 'error' && (
          <div className="text-center space-y-6">
            <div className="text-8xl mb-4">⚠️</div>
            <h2 className="text-3xl font-black uppercase font-comic text-red-600">
              Location Access Denied
            </h2>
            <p className="text-lg font-bold text-gray-700">
              No worries! You can still explore climate stories.
            </p>
            <p className="text-sm font-bold text-gray-600">
              You can enable location in your browser settings later.
            </p>
            <Button
              onClick={onClose}
              variant="secondary"
              size="lg"
              className="w-full"
            >
              Continue Without Location
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
