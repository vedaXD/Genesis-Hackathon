import { useState } from "react";
import { useCreateContent } from "@/hooks/use-content";
import { TopNav } from "@/components/layout/top-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Sparkles, Film } from "lucide-react";

const INTERESTS = [
  { id: "local", label: "My Neighborhood", icon: "🏘️", color: "bg-blue-200" },
  { id: "nature", label: "Nature & Wildlife", icon: "🦋", color: "bg-green-200" },
  { id: "food", label: "Food & Agriculture", icon: "🌾", color: "bg-yellow-200" },
  { id: "water", label: "Water & Oceans", icon: "💧", color: "bg-cyan-200" },
  { id: "weather", label: "Extreme Weather", icon: "⛈️", color: "bg-purple-200" },
  { id: "urban", label: "Cities & Heat", icon: "🏙️", color: "bg-orange-200" },
];

const STYLES = [
  { id: "personal", label: "Personal Story", icon: "👤", color: "bg-pink-200" },
  { id: "data", label: "Data-Driven", icon: "📊", color: "bg-blue-200" },
  { id: "future", label: "Future Vision", icon: "🔮", color: "bg-purple-200" },
  { id: "compare", label: "Before/After", icon: "↔️", color: "bg-green-200" },
];

export default function CreatePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createContent = useCreateContent();
  
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState("cinematic");
  const [duration, setDuration] = useState("30");

  const toggleInterest = (id) => {
    setSelectedInterests(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleCreate = () => {
    if (selectedInterests.length === 0) {
      toast({
        title: "SELECT TOPICS",
        description: "Please choose at least one climate topic",
        variant: "destructive",
      });
      return;
    }

    createContent.mutate({
      interests: selectedInterests,
      style: selectedStyle,
      duration,
    });

    toast({
      title: "STORY GENERATED! 🌍",
      description: "Your personalized climate story is ready",
    });

    setTimeout(() => setLocation("/"), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 pb-24 pt-20">
      <div className="container max-w-3xl mx-auto p-6 space-y-8">
        <div className="text-center pt-4 pb-2 animate-bounce-in">
          <div className="inline-block bg-white border-8 border-black px-10 py-6 shadow-brutal-xl mb-4 transform -rotate-2">
            <h1 className="text-5xl font-display font-black uppercase font-comic">Create Your Story</h1>
          </div>
          <p className="text-xl font-bold text-gray-700">Generate personalized climate stories</p>
        </div>

        <Card className="animate-slide-up transform rotate-1 hover:rotate-0 transition-transform">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 font-comic">
              <Sparkles className="w-7 h-7" strokeWidth={3} />
              What Matters To You?
            </CardTitle>
            <CardDescription>Choose topics for your personalized climate narrative</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {INTERESTS.map((interest, idx) => (
                <button
                  key={interest.id}
                  onClick={() => toggleInterest(interest.id)}
                  className={`p-6 border-6 border-black transition-all shadow-brutal hover:translate-x-2 hover:translate-y-2 hover:shadow-brutal-sm active:translate-x-3 active:translate-y-3 active:shadow-none ${
                    selectedInterests.includes(interest.id)
                      ? interest.color + " scale-105"
                      : "bg-white"
                  }`}
                  style={{ transform: `rotate(${idx % 2 === 0 ? "1deg" : "-1deg"})` }}
                >
                  <div className="text-5xl mb-3">{interest.icon}</div>
                  <div className="text-sm font-black uppercase font-comic">{interest.label}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="animate-slide-up transform -rotate-1 hover:rotate-0 transition-transform" style={{ animationDelay: "0.1s" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 font-comic">
              <Film className="w-7 h-7" strokeWidth={3} />
              Story Style
            </CardTitle>
            <CardDescription>How should we tell your climate story?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {STYLES.map((style, idx) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`p-6 border-6 border-black transition-all shadow-brutal hover:translate-x-2 hover:translate-y-2 hover:shadow-brutal-sm active:translate-x-3 active:translate-y-3 active:shadow-none ${
                    selectedStyle === style.id
                      ? style.color + " scale-105"
                      : "bg-white"
                  }`}
                  style={{ transform: `rotate(${idx % 2 === 0 ? "-1deg" : "1deg"})` }}
                >
                  <div className="text-5xl mb-3">{style.icon}</div>
                  <div className="text-sm font-black uppercase font-comic">{style.label}</div>
                </button>
              ))}
            </div>

            <div>
              <div className="text-sm font-black uppercase mb-3 font-comic">Story Length</div>
              <div className="flex gap-4">
                {["15", "30", "60"].map((dur) => (
                  <button
                    key={dur}
                    onClick={() => setDuration(dur)}
                    className={`flex-1 py-5 border-6 border-black transition-all shadow-brutal hover:translate-x-2 hover:translate-y-2 hover:shadow-brutal-sm active:translate-x-3 active:translate-y-3 active:shadow-none ${
                      duration === dur
                        ? "bg-yellow-300"
                        : "bg-white"
                    }`}
                  >
                    <span className="font-black text-xl font-comic">{dur}s</span>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={handleCreate}
          className="w-full h-20 text-2xl animate-slide-up font-comic"
          style={{ animationDelay: "0.2s" }}
          disabled={selectedInterests.length === 0 || createContent.isPending}
        >
          {createContent.isPending ? "Generating..." : "Generate My Story 🌍"}
        </Button>
      </div>

      <TopNav />
    </div>
  );
}
