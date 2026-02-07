import { useState, useEffect } from "react";
import { TopNav } from "@/components/layout/top-nav";
import { Gift, Star, Trophy, Zap, Lock, CheckCircle2 } from "lucide-react";

export default function RewardsPage() {
  const [userPoints, setUserPoints] = useState(0);

  useEffect(() => {
    // Load points from localStorage
    const points = parseInt(localStorage.getItem('userPoints') || '0');
    setUserPoints(points);

    // Update points when they change
    const interval = setInterval(() => {
      const currentPoints = parseInt(localStorage.getItem('userPoints') || '0');
      setUserPoints(currentPoints);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const rewards = [
    {
      id: 1,
      title: "10% Off Headphones",
      description: "Premium noise-cancelling headphones from top brands",
      points: 5000,
      discount: "10%",
      icon: "🎧",
      category: "Electronics",
      brand: "Sony, Bose, JBL"
    },
    {
      id: 2,
      title: "15% Off Eco Water Bottle",
      description: "Sustainable stainless steel water bottles",
      points: 2000,
      discount: "15%",
      icon: "💧",
      category: "Eco-Friendly",
      brand: "HydroFlask, S'well"
    },
    {
      id: 3,
      title: "20% Off Plant Seeds Kit",
      description: "Organic vegetable and herb garden starter kit",
      points: 1500,
      discount: "20%",
      icon: "🌱",
      category: "Gardening",
      brand: "EcoGarden"
    },
    {
      id: 4,
      title: "₹500 Off Bicycle",
      description: "Eco-friendly bicycles for sustainable commuting",
      points: 10000,
      discount: "₹500",
      icon: "🚴",
      category: "Transportation",
      brand: "Hero, Firefox, Btwin"
    },
    {
      id: 5,
      title: "25% Off Solar Charger",
      description: "Portable solar power bank for devices",
      points: 3000,
      discount: "25%",
      icon: "☀️",
      category: "Solar",
      brand: "Anker, RAVPower"
    },
    {
      id: 6,
      title: "₹200 Off Organic Food",
      description: "Fresh organic produce delivery subscription",
      points: 4000,
      discount: "₹200",
      icon: "🥬",
      category: "Food",
      brand: "BigBasket Organic, FreshToHome"
    },
    {
      id: 7,
      title: "30% Off Reusable Bags",
      description: "Eco-friendly shopping bags set of 5",
      points: 1000,
      discount: "30%",
      icon: "🛍️",
      category: "Eco-Friendly",
      brand: "EcoRight, BagrrBags"
    },
    {
      id: 8,
      title: "₹1000 Off Electric Scooter",
      description: "Share on electric scooter rental services",
      points: 15000,
      discount: "₹1000",
      icon: "🛴",
      category: "Transportation",
      brand: "Bounce, Yulu, Ola"
    },
    {
      id: 9,
      title: "20% Off Bamboo Products",
      description: "Sustainable bamboo toothbrush, cutlery set",
      points: 1200,
      discount: "20%",
      icon: "🎋",
      category: "Eco-Friendly",
      brand: "Bamboo India"
    },
    {
      id: 10,
      title: "₹300 Off Yoga Classes",
      description: "1-month subscription to online yoga platform",
      points: 3500,
      discount: "₹300",
      icon: "🧘",
      category: "Wellness",
      brand: "Cure.fit, Yoga.com"
    }
  ];

  const canRedeem = (requiredPoints) => userPoints >= requiredPoints;

  const handleRedeem = (reward) => {
    if (canRedeem(reward.points)) {
      // Deduct points
      const newPoints = userPoints - reward.points;
      localStorage.setItem('userPoints', newPoints.toString());
      setUserPoints(newPoints);
      
      alert(`🎉 Congratulations! You've redeemed ${reward.discount} off ${reward.title}! Check your email for the coupon code.`);
    } else {
      alert(`You need ${reward.points - userPoints} more points to redeem this reward!`);
    }
  };

  return (
    <>
      <TopNav />
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 pt-20 pb-24 px-4">
        {/* Header */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="bg-gradient-to-r from-purple-400 to-pink-400 border-6 border-black p-8 shadow-brutal-xl text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Trophy className="w-12 h-12 text-white" strokeWidth={3} />
              <h1 className="text-5xl font-black uppercase text-white font-comic">
                Your Rewards
              </h1>
              <Trophy className="w-12 h-12 text-white" strokeWidth={3} />
            </div>
            
            <div className="bg-white border-4 border-black p-6 inline-block shadow-brutal mt-4">
              <div className="flex items-center gap-3">
                <Star className="w-8 h-8 text-yellow-500" strokeWidth={3} fill="currentColor" />
                <div className="text-left">
                  <p className="text-sm font-bold text-gray-600">Your Points</p>
                  <p className="text-4xl font-black">{userPoints.toLocaleString()}</p>
                </div>
              </div>
              <p className="text-sm font-bold text-gray-600 mt-2">
                = ₹{userPoints} discount value
              </p>
            </div>
          </div>
        </div>

        {/* Rewards Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.map((reward, index) => {
              const isUnlocked = canRedeem(reward.points);
              
              return (
                <div
                  key={reward.id}
                  className="bg-white border-6 border-black shadow-brutal-xl hover:translate-x-2 hover:translate-y-2 hover:shadow-brutal transition-all animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Reward Header */}
                  <div className={`p-6 border-b-6 border-black ${
                    isUnlocked 
                      ? 'bg-gradient-to-br from-green-200 to-emerald-200' 
                      : 'bg-gray-100'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-6xl">{reward.icon}</div>
                      {isUnlocked ? (
                        <div className="bg-green-400 border-3 border-black px-3 py-1">
                          <CheckCircle2 className="w-5 h-5" strokeWidth={3} />
                        </div>
                      ) : (
                        <div className="bg-gray-300 border-3 border-black px-3 py-1">
                          <Lock className="w-5 h-5" strokeWidth={3} />
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-yellow-300 border-3 border-black px-3 py-2 inline-block">
                      <p className="text-2xl font-black">{reward.discount} OFF</p>
                    </div>
                  </div>

                  {/* Reward Body */}
                  <div className="p-6">
                    <h3 className="text-xl font-black uppercase mb-2 font-comic">
                      {reward.title}
                    </h3>
                    <p className="text-sm font-bold text-gray-700 mb-3">
                      {reward.description}
                    </p>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <div className="bg-purple-200 border-3 border-black px-3 py-1">
                        <p className="text-xs font-black">{reward.category}</p>
                      </div>
                    </div>

                    <p className="text-xs font-bold text-gray-600 mb-4">
                      Brands: {reward.brand}
                    </p>

                    {/* Points Required */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-600" strokeWidth={3} fill="currentColor" />
                        <span className="font-black">{reward.points.toLocaleString()} pts</span>
                      </div>
                      {!isUnlocked && (
                        <span className="text-xs font-bold text-red-600">
                          Need {(reward.points - userPoints).toLocaleString()} more
                        </span>
                      )}
                    </div>

                    {/* Redeem Button */}
                    <button
                      onClick={() => handleRedeem(reward)}
                      disabled={!isUnlocked}
                      className={`w-full py-3 font-black uppercase border-4 border-black transition-all ${
                        isUnlocked
                          ? 'bg-green-400 hover:bg-green-500 cursor-pointer hover:translate-x-1 hover:translate-y-1'
                          : 'bg-gray-300 cursor-not-allowed opacity-60'
                      }`}
                    >
                      {isUnlocked ? (
                        <span className="flex items-center justify-center gap-2">
                          <Gift className="w-5 h-5" strokeWidth={3} />
                          Redeem Now
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <Lock className="w-5 h-5" strokeWidth={3} />
                          Locked
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* How to Earn Points */}
        <div className="max-w-6xl mx-auto mt-12">
          <div className="bg-white border-6 border-black p-8 shadow-brutal-xl">
            <h2 className="text-3xl font-black uppercase mb-6 font-comic text-center">
              ⚡ How to Earn Points
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-5xl mb-3">🎯</div>
                <h3 className="font-black text-lg mb-2">Complete Challenges</h3>
                <p className="font-bold text-sm text-gray-600">
                  Upload photos of sustainable actions
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-3">📚</div>
                <h3 className="font-black text-lg mb-2">Answer Quizzes</h3>
                <p className="font-bold text-sm text-gray-600">
                  Test your sustainability knowledge
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-3">📱</div>
                <h3 className="font-black text-lg mb-2">Daily Engagement</h3>
                <p className="font-bold text-sm text-gray-600">
                  Watch reels and stay active
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
