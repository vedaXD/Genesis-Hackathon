import { useState } from "react";
import { MapPin, X } from "lucide-react";
import { useRequestLocation } from "@/hooks/use-content";
import { Button } from "@/components/ui/button";

export function LocationModal({ onClose, onLocationSet }) {
  const [step, setStep] = useState('intro'); // intro, requesting, success, error
  const requestLocation = useRequestLocation();

  const handleRequestLocation = () => {
    setStep('requesting');
    requestLocation.mutate(undefined, {
      onSuccess: (data) => {
        setStep('success');
        setTimeout(() => {
          onLocationSet(data);
          onClose();
        }, 1500);
      },
      onError: (error) => {
        setStep('error');
      }
    });
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
