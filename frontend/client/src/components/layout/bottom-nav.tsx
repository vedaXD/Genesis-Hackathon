import { Home, PlusSquare, User, Compass } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { icon: Home, label: "Feed", href: "/" },
    { icon: Compass, label: "Discover", href: "/discover" },
    { icon: PlusSquare, label: "Create", href: "/create", primary: true },
    { icon: User, label: "Profile", href: "/profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t-2 border-gray-100 z-50 flex items-center justify-around px-4 backdrop-blur-lg bg-white/80">
      {navItems.map((item) => {
        const isActive = location === item.href;
        return (
          <Link key={item.href} href={item.href}>
            <a className={cn(
              "flex flex-col items-center justify-center cursor-pointer transition-all",
              isActive ? "text-primary" : "text-gray-500 hover:text-gray-900",
              item.primary && "bg-primary text-white rounded-xl p-2 h-12 w-12 hover:bg-primary/90"
            )}>
              <item.icon className={cn("w-6 h-6", item.primary ? "w-7 h-7" : "")} strokeWidth={isActive ? 2.5 : 2} />
              {!item.primary && <span className="text-xs mt-1">{item.label}</span>}
            </a>
          </Link>
        );
      })}
    </div>
  );
}
