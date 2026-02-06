import { useState } from "react";
import { useCreateReel } from "@/hooks/use-content";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { MapPin, Sparkles, Film } from "lucide-react";

const INTERESTS = [
  { id: "heritage", label: "Heritage & Culture", icon: "🏛️" },
  { id: "nature", label: "Nature & Wildlife", icon: "🌿" },
  { id: "food", label: "Food & Cuisine", icon: "🍛" },
  { id: "adventure", label: "Adventure", icon: "🏔️" },
  { id: "festivals", label: "Festivals", icon: "🎉" },
  { id: "architecture", label: "Architecture", icon: "🕌" },
];

const STYLES = [
  { id: "cinematic", label: "Cinematic", icon: "🎬" },
  { id: "vibrant", label: "Vibrant", icon: "🌈" },
  { id: "minimal", label: "Minimal", icon: "✨" },
  { id: "vintage", label: "Vintage", icon: "📷" },
];

export default function CreatePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createReel = useCreateReel();
  
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<string>("cinematic");
  const [duration, setDuration] = useState<string>("30");

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleCreate = () => {
    if (selectedInterests.length === 0) {
      toast({
        title: "Select interests",
        description: "Please select at least one interest",
        variant: "destructive",
      });
      return;
    }

    createReel.mutate({
      interests: selectedInterests,
      style: selectedStyle,
      duration,
    });

    toast({
      title: "Reel Created! 🎉",
      description: "Your reel has been generated successfully",
    });

    setTimeout(() => setLocation("/"), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 pb-20">
      <div className="container max-w-2xl mx-auto p-6 space-y-6">
        <div className="text-center pt-8 pb-4">
          <h1 className="text-4xl font-display font-bold mb-2">Create Reel</h1>
          <p className="text-muted-foreground">Design your perfect India story</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Select Interests
            </CardTitle>
            <CardDescription>Choose topics you want to showcase</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {INTERESTS.map((interest) => (
                <button
                  key={interest.id}
                  onClick={() => toggleInterest(interest.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedInterests.includes(interest.id)
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="text-3xl mb-2">{interest.icon}</div>
                  <div className="text-sm font-medium">{interest.label}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Film className="w-5 h-5" />
              Style & Duration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedStyle === style.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="text-3xl mb-2">{style.icon}</div>
                  <div className="text-sm font-medium">{style.label}</div>
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              {["15", "30", "60"].map((dur) => (
                <button
                  key={dur}
                  onClick={() => setDuration(dur)}
                  className={`flex-1 py-3 rounded-lg border-2 transition-all ${
                    duration === dur
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {dur}s
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={handleCreate}
          className="w-full h-14 text-lg"
          disabled={selectedInterests.length === 0 || createReel.isPending}
        >
          {createReel.isPending ? "Creating..." : "Generate Reel ✨"}
        </Button>
      </div>

      <BottomNav />
    </div>
  );
}
