import { Home, Compass, PlusSquare, User, Menu, Gift, Star } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export function TopNav() {
  const [location] = useLocation();
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

  const navItems = [
    { icon: Home, label: "Stories", href: "/" },
    { icon: Compass, label: "Explore", href: "/discover" },
    { icon: PlusSquare, label: "Create", href: "/create" },
    { icon: Gift, label: "Rewards", href: "/rewards" },
    { icon: User, label: "Profile", href: "/profile" },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b-6 border-black z-50 flex items-center justify-between px-6 shadow-brutal">
      <div className="flex items-center gap-3">
        <div className="text-3xl">🌍</div>
        <div className="text-2xl font-black uppercase font-comic">
          Arogya Setu
        </div>
      </div>

      <div className="flex items-center gap-6">
        {navItems.map((item) => {
          const isActive = location === item.href;
          const isRewards = item.href === "/rewards";
          
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-2 transition-all relative cursor-pointer",
                  isActive ? "text-black" : "text-gray-400 hover:text-gray-700",
                )}
              >
                <item.icon className="w-6 h-6" strokeWidth={isActive ? 3 : 2} />
                {isRewards && userPoints > 0 && (
                  <div className="absolute -top-2 -right-2 bg-yellow-400 border-2 border-black px-2 py-0.5 text-xs font-black rounded-full">
                    {userPoints > 999 ? `${Math.floor(userPoints / 1000)}k` : userPoints}
                  </div>
                )}
                {isActive && (
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-primary animate-slide-up"></div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
