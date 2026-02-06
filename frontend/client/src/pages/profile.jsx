import { useState, useEffect } from "react";
import { TopNav } from "@/components/layout/top-nav";
import { Card, CardContent } from "@/components/ui/card";
import { User, MapPin, Film, Heart } from "lucide-react";

export default function ProfilePage() {
  const [points, setPoints] = useState(0);

  useEffect(() => {
    // Load points from localStorage
    const storedPoints = parseInt(localStorage.getItem('userPoints') || '0');
    setPoints(storedPoints);

    // Listen for storage changes
    const handleStorageChange = () => {
      const updatedPoints = parseInt(localStorage.getItem('userPoints') || '0');
      setPoints(updatedPoints);
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically for updates
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 pb-24 pt-20">
      <div className="container max-w-2xl mx-auto p-6">
        <div className="text-center pt-4 pb-6 animate-bounce-in">
          <div className="w-28 h-28 bg-gradient-to-br from-green-300 to-cyan-300 border-8 border-black mx-auto mb-4 flex items-center justify-center shadow-brutal-xl transform -rotate-3">
            <User className="w-14 h-14" strokeWidth={3} />
          </div>
          <div className="inline-block bg-white border-6 border-black px-8 py-4 shadow-brutal-xl mb-2 transform rotate-2">
            <h1 className="text-4xl font-display font-black uppercase font-comic">Climate Storyteller</h1>
          </div>
          <div className="bg-white border-4 border-black px-6 py-2 inline-block mt-3 transform -rotate-1">
            <p className="font-black text-base font-comic">🌍 @climate_voice</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8 animate-slide-up">
          <Card className="transform rotate-1">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-300 border-4 border-black mx-auto mb-2 flex items-center justify-center">
                <Film className="w-6 h-6" strokeWidth={3} />
              </div>
              <div className="text-3xl font-black font-comic">24</div>
              <div className="text-xs font-bold uppercase mt-1">Stories</div>
            </CardContent>
          </Card>
          <Card className="transform -rotate-1">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-300 border-4 border-black mx-auto mb-2 flex items-center justify-center">
                <Heart className="w-6 h-6" strokeWidth={3} />
              </div>
              <div className="text-3xl font-black font-comic">1.2K</div>
              <div className="text-xs font-bold uppercase mt-1">Impacts</div>
            </CardContent>
          </Card>
          <Card className="transform rotate-1">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-yellow-300 border-4 border-black mx-auto mb-2 flex items-center justify-center">
                <MapPin className="w-6 h-6" strokeWidth={3} />
              </div>
              <div className="text-3xl font-black font-comic">12</div>
              <div className="text-xs font-bold uppercase mt-1">Regions</div>
            </CardContent>
          </Card>
        </div>

        {/* Points and Rewards Section */}
        <Card className="mb-6 animate-slide-up transform rotate-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl">🎯</div>
                <h2 className="font-black text-2xl uppercase font-comic">Your Points</h2>
              </div>
              <div className="bg-gradient-to-r from-yellow-300 to-orange-300 border-4 border-black px-6 py-3 shadow-brutal">
                <div className="text-3xl font-black font-comic">{points}</div>
                <div className="text-xs font-bold uppercase">Points</div>
              </div>
            </div>
            <div className="bg-green-100 border-4 border-black p-4 mb-4">
              <p className="font-bold text-sm">💸 <span className="font-black">Discount Value:</span> ₹{points}</p>
              <p className="text-xs font-bold text-gray-600 mt-1">Use your points for real discounts! 10 Points = ₹10 off</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-black text-sm uppercase mb-2">Redeem at Partner Stores:</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white border-3 border-black p-2 text-center">
                  <div className="text-2xl mb-1">🛍️</div>
                  <div className="text-xs font-bold">Eco Stores</div>
                </div>
                <div className="bg-white border-3 border-black p-2 text-center">
                  <div className="text-2xl mb-1">🌿</div>
                  <div className="text-xs font-bold">Green Products</div>
                </div>
                <div className="bg-white border-3 border-black p-2 text-center">
                  <div className="text-2xl mb-1">🚲</div>
                  <div className="text-xs font-bold">Bike Rentals</div>
                </div>
                <div className="bg-white border-3 border-black p-2 text-center">
                  <div className="text-2xl mb-1">🌱</div>
                  <div className="text-xs font-bold">Plant Nurseries</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 animate-slide-up transform -rotate-1" style={{ animationDelay: "0.1s" }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl">🌱</div>
              <h2 className="font-black text-2xl uppercase font-comic">About</h2>
            </div>
            <p className="font-bold text-gray-700 leading-relaxed text-base">
              Turning climate data into personal stories. Connecting people to the planet through 
              narratives that make global warming feel local, urgent, and real. Every story matters. 🌍
            </p>
          </CardContent>
        </Card>

        <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="text-3xl">📖</div>
            <h2 className="font-black text-2xl uppercase font-comic">My Climate Stories</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 6 }, (_, i) => (
              <div 
                key={i} 
                className="aspect-[9/16] bg-white border-6 border-black overflow-hidden shadow-brutal hover:translate-x-2 hover:translate-y-2 hover:shadow-brutal-sm transition-all cursor-pointer transform hover:rotate-1"
              >
                <img
                  src={`https://picsum.photos/seed/${i + 100}/300/500`}
                  alt={`Climate Story ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <TopNav />
    </div>
  );
}
