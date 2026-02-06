import { TopNav } from "@/components/layout/top-nav";
import { useContent } from "@/hooks/use-content";
import { Card, CardContent } from "@/components/ui/card";
import { Compass, TrendingUp, MapPin } from "lucide-react";

export default function DiscoverPage() {
  const { data: contents } = useContent();
  const stories = contents?.filter(c => c.type === 'video') || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 pb-24 pt-20">
      <div className="container max-w-6xl mx-auto p-6">
        <div className="text-center pt-4 pb-6 animate-bounce-in">
          <div className="inline-block bg-white border-8 border-black px-10 py-6 shadow-brutal-xl mb-4 transform rotate-2">
            <h1 className="text-5xl font-display font-black uppercase flex items-center gap-4 font-comic">
              <Compass className="w-12 h-12" strokeWidth={3} />
              Discover Climate Stories
            </h1>
          </div>
          <p className="text-xl font-bold text-gray-700">🌍 Explore climate impacts around the world</p>
        </div>

        <div className="mb-8 animate-slide-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-4xl">🔥</div>
            <h2 className="text-3xl font-black uppercase font-comic">Trending Climate Stories</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {stories?.slice(0, 8).map((story, idx) => (
              <Card 
                key={story.id} 
                className="overflow-hidden cursor-pointer animate-slide-up transform hover:rotate-1 transition-transform"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={story.thumbnail}
                      alt={story.title}
                      className="w-full aspect-[9/16] object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-300 to-red-300 border-4 border-black px-3 py-2 shadow-brutal-sm">
                      <span className="font-black text-sm font-comic">🔥 HOT</span>
                    </div>
                  </div>
                  <div className="p-4 bg-white border-t-6 border-black">
                    <h3 className="font-black text-base line-clamp-2 uppercase font-comic">{story.title}</h3>
                    <p className="text-xs font-bold text-gray-600 mt-2">
                      {story.category || "climate-impact"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="text-4xl">🌍</div>
            <h2 className="text-3xl font-black uppercase font-comic">Climate Hotspots</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { name: "Coastal Cities", emoji: "🌊", desc: "Rising sea levels", color: "bg-blue-300" },
              { name: "Polar Regions", emoji: "🧊", desc: "Melting ice caps", color: "bg-cyan-300" },
              { name: "Tropical Forests", emoji: "🌳", desc: "Deforestation", color: "bg-green-300" },
              { name: "Desert Regions", emoji: "🏜️", desc: "Expanding deserts", color: "bg-yellow-300" },
              { name: "Agricultural Zones", emoji: "🌾", desc: "Crop failures", color: "bg-orange-300" },
              { name: "Urban Centers", emoji: "🏙️", desc: "Heat islands", color: "bg-red-300" }
            ].map((region, idx) => (
              <Card 
                key={region.name} 
                className="cursor-pointer animate-slide-up transform hover:-rotate-1 transition-transform"
                style={{ animationDelay: `${(idx + 8) * 0.05}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-20 h-20 ${region.color} border-6 border-black shadow-brutal-lg flex items-center justify-center text-4xl transform -rotate-6`}>
                      {region.emoji}
                    </div>
                    <div>
                      <h3 className="font-black text-xl uppercase font-comic">{region.name}</h3>
                      <p className="text-base font-bold text-gray-700 mt-1">{region.desc}</p>
                      <p className="text-sm font-bold text-gray-500 mt-1">842 stories 📖</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <TopNav />
    </div>
  );
}
