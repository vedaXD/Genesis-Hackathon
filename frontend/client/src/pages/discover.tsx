import { BottomNav } from "@/components/layout/bottom-nav";
import { useReels } from "@/hooks/use-content";
import { Card, CardContent } from "@/components/ui/card";
import { Compass, TrendingUp, MapPin } from "lucide-react";

export default function DiscoverPage() {
  const { data: reels } = useReels();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 pb-20">
      <div className="container max-w-6xl mx-auto p-6">
        <div className="text-center pt-8 pb-6">
          <h1 className="text-4xl font-display font-bold mb-2 flex items-center justify-center gap-3">
            <Compass className="w-8 h-8" />
            Discover
          </h1>
          <p className="text-muted-foreground">Explore trending reels and locations</p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Trending Now
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {reels?.slice(0, 8).map((reel) => (
              <Card key={reel.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-0">
                  <img
                    src={reel.thumbnail}
                    alt={reel.title}
                    className="w-full aspect-[9/16] object-cover"
                  />
                  <div className="p-3">
                    <h3 className="font-semibold text-sm line-clamp-2">{reel.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {reel.interests.join(" • ")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <MapPin className="w-6 h-6" />
            Popular Locations
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {["Taj Mahal, Agra", "Goa Beaches", "Jaipur Forts", "Kerala Backwaters"].map((location) => (
              <Card key={location} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{location}</h3>
                      <p className="text-sm text-muted-foreground">1.2K reels</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
